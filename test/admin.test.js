const mongoose = require('mongoose');
const { Review } = require('../server/models/review');
const { User } = require('../server/models/user');
const { server } = require('../server/server');
const {
  api,
  clearDatabase,
  insertAll,
  loginUsers,
  reviews,
  proposals,
  neighboursIds,
  admins,
  users
} = require('./helper');

const tokens = [];

const mockedAdmin = {
  password: '111',
  join: false,
  email: 'mocked@yopmail.com',
  name: 'Mocked',
  lastName: 'Admin',
  cellphone: '1111111111',
  role: 'ADMIN',
  neighborhood: 'Ciudad de México',
  address: {
    lat: -34.611,
    lng: -58.445,
    address: 'Calle falsa 123',
    administrative_area_level_2: 'COMUNA 12'
  }
};

jest.mock('../server/utils/mail', () => ({
  sendMailAccountVerification: () => null
}));

beforeAll(async () => {
  await loginUsers(tokens);
});

describe('Admin', () => {
  beforeEach(async () => {
    await clearDatabase();

    await insertAll();
  });

  test('Get my profile', async () => {
    const response = await api
      .get(`/api/admin/${admins[0]._id.toString()}`)
      .set('pf-token', tokens[3]);

    expect(response.status).toBe(200);
  });

  test('Create admin', async () => {
    const response = await api.post(`/api/admin`).send(mockedAdmin);

    expect(response.status).toBe(200);
  });

  // Testear edit
});

afterAll(() => {
  mongoose.disconnect();
  mongoose.connection.close();
  server.close();
});
