require('dotenv').config();

const {
  NODE_ENV,
  JWT_SECRET = 'some-secret-dev-key',
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

module.exports = {
  NODE_ENV, JWT_SECRET, PORT, MONGO_URL,
};
