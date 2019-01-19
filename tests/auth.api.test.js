const request = require('supertest');
const http    = require('http');
const app     = require('../app');
const server  = http.createServer(app);

//#region Mocks
const user = require('./mocks/user');
//#endregion

describe('Authentication API', () => {
  it('should not find account', () => {
    return request(server)
      .post('/api/v1/auth/login')
      .send({
        username: user.username,
        password: user.password
      })
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });

  it('should throw validation error for username', () => {
    return request(server)
      .post('/api/v1/auth/register')
      .send({
        password: user.password
      })
      .then(response => {
        expect(response.statusCode).toBe(422);
      });
  });

  it('should throw validation error for password', () => {
    return request(server)
      .post('/api/v1/auth/register')
      .send({
        username: user.username
      })
      .then(response => {
        expect(response.statusCode).toBe(422);
      });
  });

  it('should successfully register account', () => {
    return request(server)
      .post('/api/v1/auth/register')
      .send({
        username: user.username,
        password: user.password
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  it('should throw "Already taken" error', () => {
    return request(server)
      .post('/api/v1/auth/register')
      .send({
        username: user.username,
        password: user.password
      })
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  it('should fail to login user', () => {
    return request(server)
      .post('/api/v1/auth/login')
      .send({
        username: user.username,
        password: user.password
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.session.length).toBe(36);
      });
  });

  it('should successfully login user', () => {
    return request(server)
      .post('/api/v1/auth/login')
      .send({
        username: user.username,
        password: user.password
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.session.length).toBe(36);
      });
  });
});

function removeTestAccount() {
  const db = require('../db');

  return db.Account.destroy({
    where: {
      username: user.username
    }
  });
}

afterAll(() => {
  return removeTestAccount();
});
