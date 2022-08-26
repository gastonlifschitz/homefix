const mongoose = require('mongoose');
const { server } = require('../server/server');
const {
  users,
  api,
  clearDatabase,
  insertAll,
  loginUsers
} = require('./helper');

const tokens = [];

beforeAll(async () => {
  await clearDatabase();

  await insertAll();

  await loginUsers(tokens);
});

describe('users', () => {
  test('Connection', async () => {
    await api.get('/api/users').expect(200);
  });

  test('There are 8 users', async () => {
    const response = await api.get('/api/users');

    expect(response.body).toHaveLength(users.length);
  });

  test('Get an existing employee user', async () => {
    const response = await api
      .get(`/api/users/${users[0]._id}`)
      .set('pf-token', `${tokens[0]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', users[0]._id.toString());
    expect(response.body).toHaveProperty('employee');
    expect(response.body).not.toHaveProperty('admin');
    expect(response.body).not.toHaveProperty('neighbour');
    expect(response.body.employee).toHaveProperty('email', users[0].email);
  });

  test('Get an existing neighbour user', async () => {
    const response = await api
      .get(`/api/users/${users[7]._id}`)
      .set('pf-token', `${tokens[7]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', users[7]._id.toString());
    expect(response.body).toHaveProperty('neighbour');
    expect(response.body).not.toHaveProperty('admin');
    expect(response.body).not.toHaveProperty('employee');
    expect(response.body.neighbour).toHaveProperty('email', users[7].email);
  });

  test('Get an existing admin user', async () => {
    const response = await api
      .get(`/api/users/${users[4]._id}`)
      .set('pf-token', `${tokens[4]}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', users[4]._id.toString());
    expect(response.body).toHaveProperty('neighbour');
    expect(response.body).toHaveProperty('admin');
    expect(response.body).not.toHaveProperty('employee');
    expect(response.body.admin).toHaveProperty('email', users[4].email);
    expect(response.body.neighbour).toHaveProperty('email', users[4].email);
  });

  test('Return error (401) if there is no token', async () => {
    const response = await api.get(`/api/users/${users[4]._id}`);

    expect(response.status).toBe(401);
  });

  test('Return error (400) if it tries to get another user', async () => {
    const response = await api
      .get(`/api/users/${users[0]._id}`)
      .set('pf-token', `${tokens[1]}`);

    expect(response.status).toBe(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
