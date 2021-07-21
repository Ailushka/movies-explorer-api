const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = require('../utils/config');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new Error('Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, name,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email,
      name,
      password: hash,
    }))
    .then((user) => res.send({
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      throw new BadRequestError('Переданы некорректные данные');
    })
    .catch(next);
};

module.exports.patchUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new Error('Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production'
          ? JWT_SECRET
          : 'some-secret-dev-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      throw new AuthorizationError(err.message);
    })
    .catch(next);
};
