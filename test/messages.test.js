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
  neighborhoods
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

describe('Parish messages', () => {
  beforeEach(async () => {
    await clearDatabase();

    await insertAll();
  });
  test('create a valid message', async () => {
    const response = await api
      .post('/api/messages/send-message')
      .set('pf-token', `${tokens[3]}`)
      .send({
        neighborhood: neighborhoods[0].name,
        ...mockedMessage
      });

    const allMessages = await Message.find({});
    const neighborhood = await Neighborhood.findOne({
      name: neighborhoods[0].name
    });

    expect(response.status).toBe(200);
    expect(allMessages.length).toBe(messages.length + 1);
    expect(neighborhood.messages.length).toBe(
      neighborhoods[0].messages.length + 1
    );
  });

  test('create a message for a neighborhood that does not exist', async () => {
    const response = await api
      .post('/api/messages/send-message')
      .set('pf-token', `${tokens[3]}`)
      .send({
        neighborhood: 'Calle false 123',
        ...mockedMessage
      });

    expect(response.status).toBe(401);
  });

  test('Return error if a non admin user creates a message', async () => {
    const response = await api
      .post('/api/messages/send-message')
      .set('pf-token', `${tokens[5]}`)
      .send({
        neighborhood: 'Norte',
        ...mockedMessage
      });

    console.log(response);
    expect(response.status).toBe(403);
    expect(response.text).toBe('Acceso denegado.');
  });

  test('Return error if an admin from another neighborhood creates a message', async () => {
    const response = await api
      .post('/api/messages/send-message')
      .set('pf-token', `${tokens[4]}`)
      .send({
        neighborhood: 'Norte',
        ...mockedMessage
      });

    expect(response.status).toBe(403);
    expect(response.text).toBe(
      'No sos el admin de este grupo! Acción denegada'
    );
  });

  test('Delete an existing message', async () => {
    const response = await api
      .delete(
        `/api/messages/${messages[0]._id.toString()}/neighborhood/${
          neighborhoods[0].name
        }`
      )
      .set('pf-token', `${tokens[3]}`);
    expect(response.status).toBe(200);
    expect(response.body.messageDeleted).toBe(true);
  });

  test('Return error if neighborhood does not exists', async () => {
    const response = await api
      .delete(
        `/api/messages/${messages[0]._id.toString()}/neighborhood/${'name'}`
      )
      .set('pf-token', `${tokens[3]}`);
    expect(response.status).toBe(401);
  });

  test('Return error if message does not exists', async () => {
    const response = await api
      .delete(
        `/api/messages/${'1111111111111111ffffffff'}/neighborhood/${
          neighborhoods[0].name
        }`
      )
      .set('pf-token', `${tokens[3]}`);
    expect(response.status).toBe(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
