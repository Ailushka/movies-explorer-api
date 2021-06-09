const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports.validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required()
      .custom((value, helpers) => {
        if (validator.isURL(value, { require_protocol: true })) {
          return value;
        }
        return helpers.message('Неправильный формат ссылки');
      }),
    trailer: Joi.string().required()
      .custom((value, helpers) => {
        if (validator.isURL(value, { require_protocol: true })) {
          return value;
        }
        return helpers.message('Неправильный формат ссылки');
      }),
    thumbnail: Joi.string().required()
      .custom((value, helpers) => {
        if (validator.isURL(value, { require_protocol: true })) {
          return value;
        }
        return helpers.message('Неправильный формат ссылки');
      }),
    owner: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.validateUserInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports.validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
