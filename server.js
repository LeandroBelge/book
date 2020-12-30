const app = require('express')()
const consign = require('consign')
const db = require('./config/db')

app.db = db

consign()
    .include('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api/userValidation.js')
    .then('./api/collectionValidation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

module.exports = app
