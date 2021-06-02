const path = require('path')

const isDevelopment = process.env.NODE_ENV !== 'production'

const PROJECT_PATH = path.resolve(__dirname, '../')
const PROJECT_NAME = path.parse(PROJECT_PATH).name

const SERVER_HOST = '127.0.0.1'
const SERVER_PORT = 8080

module.exports = {
  isDevelopment,
  PROJECT_PATH,
  PROJECT_NAME,
  SERVER_HOST,
  SERVER_PORT,
}
