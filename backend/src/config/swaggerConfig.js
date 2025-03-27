const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'LMS API',
    description: 'Документация API для системы управления обучением (LMS)',
    version: '1.0.0',
  },
  host: 'localhost:5000',
  basePath: '/api',
  schemes: ['http'],
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Локальный сервер',
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'Операции с пользователями',
    },
    {
      name: 'Courses',
      description: 'Управление курсами и доступ к ним',
    },
    {
      name: 'Modules',
      description: 'Модули внутри курсов',
    },
    {
      name: 'Lessons',
      description: 'Уроки внутри модулей',
    }
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
const endpointsFiles = ['../routes/module.route.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);