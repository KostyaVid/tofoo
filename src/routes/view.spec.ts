import request from 'supertest';
import app from './../server';

describe(`GET '/'`, () => {
  it(`GET '/' response status 401 for Unauthorized user`, async () => {
    const response = await request(app).get('/');
    expect(response.status).toEqual(401);
  });
});

describe('/login', () => {
  it(`GET '/login' should return Unauthorized for Unauthorized user`, async () => {
    const res = await request(app).get('/login');
    expect(res.statusCode).toEqual(401);
  });
  it(`POST '/login' should return Unauthorized for Unauthorized user`, async () => {
    const res = await request(app).post('/login');
    expect(res.statusCode).toEqual(401);
  });
});

describe('/signup', () => {
  it(`GET '/signup' should return Unauthorized for Unauthorized user`, async () => {
    const res = await request(app).get('/signup');
    expect(res.statusCode).toEqual(401);
  });
  it(`POST '/signup' should return Unauthorized for Unauthorized user`, async () => {
    const res = await request(app).post('/signup');
    expect(res.statusCode).toEqual(401);
  });
});
