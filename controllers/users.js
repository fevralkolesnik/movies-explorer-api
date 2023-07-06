const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signToken } = require('../utils/jwtAuth');
const ValidationError = require('../errors/ValidationError');
const DuplicateKeyError = require('../errors/DuplicateKeyError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const duplicateKeyError = 11000;

const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new UnauthorizedError('Пользователь не авторизован'));
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Переданы некорректные данные при обновлении пользователя'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === duplicateKeyError) {
        return next(new DuplicateKeyError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(() => next(new UnauthorizedError('Неправильные почта или пароль')))
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, matched]) => {
      if (!matched) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      const token = signToken({ _id: user._id });
      return res.status(200).send({ token });
    })
    .catch((err) => next(err));
};

module.exports = {
  getMyUser,
  updateUser,
  createUser,
  login,
};
