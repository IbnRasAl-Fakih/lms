require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger-output.json');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

const userRoutes = require('./routes/user.route');

app.use('/api/users', userRoutes);

const logger = require('./utils/logger');

app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).json({ message: 'Ошибка сервера' });
});

if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger доступен по адресу: http://localhost:5000/api-docs');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
