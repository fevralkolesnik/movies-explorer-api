require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const DocumentNotFoundError = require('./errors/DocumentNotFoundError');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { validationCreateUser, validationLogin } = require('./middlewares/joiValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(express.json());

mongoose.connect(DB_URL);

app.use(cors);

app.use(requestLogger);

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(errorLogger);

app.use((req, res, next) => {
  next(new DocumentNotFoundError('Данная страница не найдена'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
