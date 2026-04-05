const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Finance Dashboard API',
    version: '1.0.0',
    description: 'Role-based finance dashboard backend API'
  },
  servers: [{ url: 'http://localhost:3000/api' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          username: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string' }
        }
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          user_id: { type: 'integer' },
          amount: { type: 'number' },
          type: { type: 'string', enum: ['income', 'expense'] },
          category: { type: 'string' },
          date: { type: 'string', format: 'date' },
          description: { type: 'string' }
        }
      },
      Summary: {
        type: 'object',
        properties: {
          total_income: { type: 'number' },
          total_expenses: { type: 'number' },
          net_balance: { type: 'number' },
          total_transactions: { type: 'integer' }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  role_id: { type: 'integer' }
                },
                required: ['username', 'email', 'password']
              }
            }
          }
        },
        responses: {
          201: { description: 'Registered' },
          400: { description: 'Validation error' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Authenticated' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/users': {
      get: {
        summary: 'List users',
        responses: {
          200: { description: 'OK' },
          403: { description: 'Forbidden' }
        }
      },
      post: {
        summary: 'Create user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  role_id: { type: 'integer' }
                },
                required: ['username', 'email', 'password', 'role_id']
              }
            }
          }
        },
        responses: {
          201: { description: 'Created' },
          403: { description: 'Forbidden' }
        }
      }
    },
    '/users/{id}': {
      get: {
        summary: 'Get user',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'OK' },
          404: { description: 'Not found' }
        }
      },
      put: {
        summary: 'Update user',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Updated' }
        }
      },
      delete: {
        summary: 'Delete user',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Deleted' }
        }
      }
    },
    '/transactions': {
      get: {
        summary: 'List transactions',
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'start_date', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'end_date', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'OK' }
        }
      },
      post: {
        summary: 'Create transaction',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Transaction' }
            }
          }
        },
        responses: {
          201: { description: 'Created' }
        }
      }
    },
    '/transactions/{id}': {
      get: {
        summary: 'Get transaction',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'OK' },
          404: { description: 'Not found' }
        }
      },
      put: {
        summary: 'Update transaction',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Updated' }
        }
      },
      delete: {
        summary: 'Soft delete transaction',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Deleted' }
        }
      }
    },
    '/dashboard/summary': {
      get: {
        summary: 'Summary totals',
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Summary' } } } }
        }
      }
    },
    '/dashboard/categories': {
      get: {
        summary: 'Category totals',
        responses: {
          200: { description: 'OK' }
        }
      }
    },
    '/dashboard/trends': {
      get: {
        summary: 'Monthly trends',
        responses: {
          200: { description: 'OK' }
        }
      }
    },
    '/dashboard/recent': {
      get: {
        summary: 'Recent activity',
        responses: {
          200: { description: 'OK' }
        }
      }
    }
  }
};

const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: []
});

module.exports = swaggerSpec;
