const request = require('supertest');
const app = require('../src/app');
const { initializeDatabase } = require('../src/config/database');
const Role = require('../src/models/Role');

describe('Transactions', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  it('allows an analyst to create and soft delete a transaction', async () => {
    const analystRole = await Role.findByName('analyst');
    const email = `tx_analyst_${Date.now()}@example.com`;
    const password = 'secret123';

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: `tx_analyst_${Date.now()}`,
        email,
        password,
        role_id: analystRole.id
      });

    const token = registerRes.body.token;

    const createRes = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 120.5,
        type: 'expense',
        category: 'Food',
        date: '2025-01-15',
        description: 'Lunch'
      });

    expect(createRes.status).toBe(201);
    const transactionId = createRes.body.transaction.id;

    const listRes = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    const existsBefore = listRes.body.transactions.some((t) => t.id === transactionId);
    expect(existsBefore).toBe(true);

    const deleteRes = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);

    const listAfterRes = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);

    const existsAfter = listAfterRes.body.transactions.some((t) => t.id === transactionId);
    expect(existsAfter).toBe(false);
  });
});
