const mongoose = require('mongoose');
const { server } = require('../server/server');
const {
  api,
  clearDatabase,
  insertAll,
  loginUsers,
  rubrosIds,
  rubros
} = require('./helper');

const tokens = [];

beforeAll(async () => {
  await loginUsers(tokens);
});

describe('Rubros', () => {
  beforeEach(async () => {
    await clearDatabase();

    await insertAll();
  });

  test('Get a rubro', async () => {
    const response = await api.get(`/api/rubros/${rubrosIds[0].toString()}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', rubros[0]._id.toString());
    expect(response.body.services[0]).toBe(rubros[0].services[0]);
    expect(response.body).toHaveProperty('rubroType', rubros[0].rubroType);
  });
});

afterAll(() => {
  mongoose.disconnect();
  mongoose.connection.close();
  server.close();
});
