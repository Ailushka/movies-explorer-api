const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ ...req.body, owner })
    .then((movie) => res.send(movie))
    .catch((err) => {
      throw new BadRequestError(err.message);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      }
      if (data.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Невозможно удаление фильма других пользователей');
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((movie) => res.send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};
