const mongoose = require('mongoose');
const { Message } = require('../server/models/messages');
const { Neighborhood } = require('../server/models/neighborhood');
const { server } = require('../server/server');
const {
  api,
  clearDatabase,
  insertAll,
  loginUsers,
  messages,
  neighborhoods,
  users,
  neighbours
} = require('./helper');

const tokens = [];

const mockedMessage = {
  message: 'Bienvenidos',
  title: 'Mensaje de prueba',
  date: Date.now()
};

beforeAll(async () => {
  await loginUsers(tokens);
});

describe('Neighbours', () => {
  beforeEach(async () => {
    await clearDatabase();

    await insertAll();
  });
  test('Get all neighbours a user have', async () => {
    const response = await api
      .get('/api/neighbours')
      .set('pf-token', `${tokens[3]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  test('Update name of neighbour', async () => {
    const response = await api
      .put(`/api/neighbours/${users[3]._id}`)
      .set('pf-token', `${tokens[3]}`)
      .send({
        lastName: 'dario',
        cellphone: '1111111111',
        name: 'DARIOOO'
      });

    expect(response.status).toBe(200);
  });

  test('Get proposals', async () => {
    const response = await api
      .get(`/api/neighbours/proposals/${users[3].neighbour}`)
      .set('pf-token', `${tokens[3]}`);

    expect(response.status).toBe(200);
    expect(response.body.acceptedProposals).toHaveLength(0);
    expect(response.body.finalizedProposals).toHaveLength(1);
    expect(response.body.waitingProposals).toHaveLength(0);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
