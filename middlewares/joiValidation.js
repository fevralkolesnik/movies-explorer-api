const { celebrate, Joi } = require('celebrate');

const RegExpURL = /^(https?:\/\/(www\.)?)([-a-zA-Z0-9\W]){1,}/;
const RegExpEN = /[A-z]/;
const RegExpRU = /[А-я]/;

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
    image: Joi.string().required().regex(RegExpURL),
    trailerLink: Joi.string().required().regex(RegExpURL),
    thumbnail: Joi.string().required().regex(RegExpURL),
    // id length
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(3).regex(RegExpRU),
    nameEN: Joi.string().required().min(3).regex(RegExpEN),
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
