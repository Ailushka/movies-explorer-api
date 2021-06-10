const routes = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const users = require('./users');
const movies = require('./movies');

const { validateSignUp, validateSignIn } = require('../middlewares/validation');

routes.post('/signup', validateSignUp, createUser);
routes.post('/signin', validateSignIn, login);

routes.use('/users', auth, users);
routes.use('/movies', auth, movies);

module.exports = routes;
