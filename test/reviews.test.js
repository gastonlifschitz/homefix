const mongoose = require('mongoose');
const { Review } = require('../server/models/review');
const { server } = require('../server/server');
const {
  api,
  clearDatabase,
  insertAll,
  loginUsers,
  reviews,
  proposals,
  neighboursIds
} = require('./helper');

const tokens = [];

const mockedReview = {
  comment: 'Bastante bien',
  _issuer: proposals[0]._receiver,
  _employee: proposals[0]._provider,
  rating: 4,
  report: false,
  likes: [],
  disLikes: []
};

beforeAll(async () => {
  await loginUsers(tokens);
});

describe('Reviews', () => {
  beforeEach(async () => {
    await clearDatabase();

    await insertAll();
  });

  test('Get all reviews', async () => {
    const response = await api.get(`/api/reviews/`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(reviews.length);
  });

  test('Get all reported reviews', async () => {
    await Review.findOneAndUpdate({}, { report: true });

    const response = await api
      .get(`/api/reviews/report`)
      .set('pf-token', tokens[tokens.length - 1]);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('Like a review', async () => {
    const response = await api
      .patch(`/api/reviews/like/${reviews[0]._id}`)
      .set('pf-token', tokens[4]);

    expect(response.status).toBe(200);
    const updatedReview = await Review.findOne({ _id: reviews[0]._id });
    expect(updatedReview.likes).toHaveLength(reviews[0].likes.length + 1);
  });

  test('Dislike a review', async () => {
    const response = await api
      .patch(`/api/reviews/dislike/${reviews[0]._id}`)
      .set('pf-token', tokens[4]);

    expect(response.status).toBe(200);
    const updatedReview = await Review.findOne({ _id: reviews[0]._id });
    expect(updatedReview.disLikes).toHaveLength(reviews[0].disLikes.length + 1);
  });

  test('Report a review', async () => {
    const response = await api
      .patch(`/api/reviews/report/${reviews[0]._id}`)
      .set('pf-token', tokens[3]);

    expect(response.status).toBe(200);
    const updatedReview = await Review.findOne({ _id: response.body._id });
    expect(updatedReview.reports).toHaveLength(reviews[0].reports.length + 1);
  });

  test('Create a review', async () => {
    const response = await api
      .post(`/api/reviews/proposal/${proposals[0]._id.toString()}`)
      .set('pf-token', tokens[3])
      .send(mockedReview);

    expect(response.status).toBe(200);
  });

  test('Get a review', async () => {
    const response = await api.get(`/api/reviews/${reviews[0]._id.toString()}`);

    expect(response.status).toBe(200);
  });

  test('Get all my reviews', async () => {
    const response = await api.get(
      `/api/reviews/issuedBy/${neighboursIds[0].toString()}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(
      reviews.filter(
        (review) => review._issuer.toString() === neighboursIds[0].toString()
      ).length
    );
  });

  test('Get some review', async () => {
    const response = await api.get(`/api/reviews/${reviews[0]._id.toString()}`);

    expect(response.status).toBe(200);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
