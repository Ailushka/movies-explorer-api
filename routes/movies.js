const movies = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const { validateMovieId, validateMovie } = require('../middlewares/validation');

movies.get('/', getMovies);
movies.post('/', validateMovie, createMovie);
movies.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = movies;
