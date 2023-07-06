const mongoose = require('mongoose');
const Movie = require('../models/movie');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const newMovie = req.body;

  Movie.create({ ...newMovie, owner: req.user._id })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Переданы некорректные данные при создании фильма'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail()
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Доступ к ресурсу запрещен'));
      }
      return Movie.deleteOne()
        .then(() => {
          res.status(200).send(movie);
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new DocumentNotFoundError('Фильм с указанным _id не найдена'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Передан невалидный _id'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
