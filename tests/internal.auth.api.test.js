const request = require('supertest');
const http    = require('http');
const app     = require('../app');
const config  = require('../config');
const server  = http.createServer(app);

//#region Mocks
const user    = require('./mocks/user');
const session = require('./mocks/session');
//#endregion

describe('Internal Authentication API', () => {
  it('should return "Route not found" error', () => {
    return request(server)
      .post('/api/v1/internal/auth/authenticate')
      .send({
        session
      })
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });

  it('should return "Session cannot be empty" error', () => {
    return request(server)
      .post('/api/v1/internal/auth/authenticate')
      .set('service_auth', config.internal_key || 'internal_key')
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  it('should return "Session not found" error', () => {
    return request(server)
      .post('/api/v1/internal/auth/authenticate')
      .set('service_auth', config.internal_key || 'internal_key')
      .send({
        session
      })
      .then(response => {
        expect(response.statusCode).toBe(400);
      });
  });

  it('should successfully authorize user', async () => {
    await request(server)
      .post('/api/v1/auth/register')
      .send({
        username: user.username,
        password: user.password
      });

    const login = await request(server)
      .post('/api/v1/auth/login')
      .send({
        username: user.username,
        password: user.password
      });

    const session = login.body.session;

    return request(server)
      .post('/api/v1/internal/auth/authenticate')
      .set('service_auth', config.internal_key || 'internal_key')
      .send({
        session
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.account).toBeDefined();
        expect(response.body.account.password).toBeUndefined();
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
