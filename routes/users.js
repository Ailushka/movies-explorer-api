const users = require('express').Router();
const {
  getUserInfo, patchUserInfo,
} = require('../controllers/users');

const { validateUserInfo } = require('../middlewares/validation');

users.get('/me', getUserInfo);
users.patch('/me', validateUserInfo, patchUserInfo);

module.exports = users;
