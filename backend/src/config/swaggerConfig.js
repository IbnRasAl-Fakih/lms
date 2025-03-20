const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      title: 'LMS API',
      description: 'Документация API для системы управления обучением (LMS)',
      version: '1.0.0',
    },
    host: 'localhost:5000',
    basePath: '/api/users',
    schemes: ['http'],
    servers: [
      {
        url: 'http://localhost:5000/api/users',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['../routes/*.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);