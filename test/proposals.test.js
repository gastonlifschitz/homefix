const mongoose = require('mongoose');
const { Proposal } = require('../server/models/proposal');
const { server } = require('../server/server');
const {
  api,
  clearDatabase,
  insertAll,
  loginUsers,
  neighboursIds,
  employeeIds,
  proposals
} = require('./helper');

const tokens = [];

const mockedProposal = {
  price: 100,
  _receiver: neighboursIds[1].toString(),
  _provider: employeeIds[1].toString(),
  title: 'Mock proposal',
  description: 'Mock proposal',
  serviceType: 'CARPINTER',
  state: 'WAIT'
};

beforeAll(async () => {
  await loginUsers(tokens);
});

describe('Proposals', () => {
  beforeEach(async () => {
    await clearDatabase();

    await insertAll();
  });

  test('Get a proposal', async () => {
    const response = await api
      .get(
        `/api/proposals/${proposals[0]._receiver.toString()}/${proposals[0]._provider.toString()}`
      )
      .set('pf-token', `${tokens[3]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', proposals[0]._id.toString());
    expect(response.body).toHaveProperty(
      '_receiver',
      proposals[0]._receiver.toString()
    );
    expect(response.body._provider).toHaveProperty(
      '_id',
      proposals[0]._provider.toString()
    );
    expect(response.body).toHaveProperty('state', proposals[0].state);
    expect(response.body).toHaveProperty('price', proposals[0].price);
    expect(response.body).toHaveProperty('title', proposals[0].title);
    expect(response.body).toHaveProperty(
      'description',
      proposals[0].description
    );
    expect(response.body).toHaveProperty(
      'serviceType',
      proposals[0].serviceType
    );
  });

  test('Create a proposal', async () => {
    const response = await api
      .post(`/api/proposals`)
      .set('pf-token', `${tokens[1]}`)
      .send(mockedProposal);

    expect(response.status).toBe(200);
    const allProposals = await Proposal.find({});
    expect(allProposals.length).toBe(proposals.length + 1);
  });

  test('Accept a proposal', async () => {
    // Create a waiting proposal since I don't have one
    const waitProposal = await api
      .post(`/api/proposals`)
      .set('pf-token', `${tokens[1]}`)
      .send(mockedProposal);

    const response = await api
      .patch(`/api/proposals/${waitProposal.body._id}/accept`)
      .set('pf-token', `${tokens[4]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('state', 'ACCEPT');
  });

  test('Finalize a proposal', async () => {
    const response = await api
      .patch(`/api/proposals/${proposals[1]._id.toString()}/finalize`)
      .set('pf-token', `${tokens[4]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('state', 'FINALIZED');
  });

  test('Cancel a proposal', async () => {
    const waitProposal = await api
      .post(`/api/proposals`)
      .set('pf-token', `${tokens[1]}`)
      .send(mockedProposal);

    const response = await api
      .delete(`/api/proposals/${waitProposal.body._id.toString()}`)
      .set('pf-token', `${tokens[4]}`);

    expect(response.status).toBe(200);
  });
});

afterAll(() => {
  mongoose.disconnect();
  mongoose.connection.close();
  server.close();
});
