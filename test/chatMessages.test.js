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
  neighboursIds,
  employeeIds,
  chatMessages,
  chatInfoIds
} = require('./helper');

const tokens = [];

const mockedContent = {
  chatMessage: 'Hola! Como va?',
  userId: neighboursIds[4].toString(),
  type: 'Text',
  userType: 'Neighbour'
};

beforeAll(async () => {
  await loginUsers(tokens);
});

describe('Chat messages', () => {
  beforeEach(async () => {
    await clearDatabase();

    await insertAll();
  });

  test('Get chat message', async () => {
    const response = await api
      .get(
        `/api/chats/getChats/${employeeIds[0].toString()}/${neighboursIds[0].toString()}`
      )
      .set('pf-token', `${tokens[0]}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(
      chatMessages.filter(
        (chat) => chat.chatId.toString() === chatInfoIds[0].toString()
      ).length
    );
  });

  test('Create chat between employee and neighbour', async () => {
    const response = await api
      .post(`/api/chats`)
      .set('pf-token', `${tokens[7]}`)
      .send({
        _provider: employeeIds[2].toString(),
        _receiver: neighboursIds[4].toString(),
        content: mockedContent
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', mockedContent.chatMessage);
    expect(response.body).toHaveProperty('sender', mockedContent.userId);
    expect(response.body).toHaveProperty('type', mockedContent.type);
    expect(response.body).toHaveProperty('userType', mockedContent.userType);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
