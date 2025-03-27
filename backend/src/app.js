require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger-config.json');

const mongoose = require('mongoose');
const sequelize = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Подключение к PostgreSQL
sequelize.authenticate()
  .then(() => console.log('✅ Подключено к PostgreSQL'))
  .catch((err) => console.error('❌ Ошибка подключения к PostgreSQL:', err));

// Подключение к MongoDB
if (!process.env.MONGO_URI) {
  console.error('❌ Ошибка: переменная MONGO_URI не установлена в .env');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Подключено к MongoDB');
  })
  .catch((err) => {
    console.error('❌ Ошибка подключения к MongoDB:', err);
  });

// Роуты
const userRoutes = require('./routes/user.route');
const courseRoutes = require('./routes/course.route');
const moduleRoutes = require('./routes/module.route');

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);

// Swagger (только в dev-режиме)
if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger доступен по адресу: http://localhost:5000/api-docs');
}

// Логирование ошибок
const logger = require('./utils/logger');
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ message: 'Ошибка сервера' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});