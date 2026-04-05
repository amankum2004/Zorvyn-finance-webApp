const request = require('supertest');
const app = require('../src/app');
const { initializeDatabase } = require('../src/config/database');
const Role = require('../src/models/Role');

describe('Auth and access control', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  it('registers and logs in an analyst', async () => {
    const analystRole = await Role.findByName('analyst');
    const email = `analyst_${Date.now()}@example.com`;
    const password = 'secret123';

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: `analyst_${Date.now()}`,
        email,
        password,
        role_id: analystRole.id
      });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.token).toBeTruthy();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeTruthy();
  });

  it('prevents viewers from accessing transactions', async () => {
    const email = `viewer_${Date.now()}@example.com`;
    const password = 'secret123';

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: `viewer_${Date.now()}`,
        email,
        password
      });

    const token = registerRes.body.token;

    const txRes = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(txRes.status).toBe(403);
  });
});
