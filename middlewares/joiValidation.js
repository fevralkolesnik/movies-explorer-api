const { celebrate, Joi } = require('celebrate');
const { RegExp } = require('../utils/const');

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
});

const validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(3),
    director: Joi.string().required().min(2),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4),
    description: Joi.string().required().min(20),
    image: Joi.string().required().regex(RegExp.URL),
    trailerLink: Joi.string().required().regex(RegExp.URL),
    thumbnail: Joi.string().required().regex(RegExp.URL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(3).regex(RegExp.RU),
    nameEN: Joi.string().required().min(3).regex(RegExp.EN),
  }),
});

const validationMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validationCreateUser,
  validationLogin,
  validationUpdateUser,
  validationCreateMovie,
  validationMovieId,
};
