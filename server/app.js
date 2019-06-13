const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const { atlasUri, userUri, testUri } = require('./configuration')

mongoose.Promise = global.Promise
if (process.env.NODE_ENV == 'test') {
  mongoose.connect(testUri, { useNewUrlParser: true })
    .catch((error) => {
      console.error(error + '\nCheck whether service mongod has started correctly - sudo service mongod start')
    })
} else if (process.env.NODE_ENV == 'prod') {
  mongoose.connect(atlasUri, { useNewUrlParser: true })
    .catch((error) => {
      console.error(error + '\nAdd current IP to Atlas MongoDB + sudo service mongod start')
    })
} else {
  mongoose.connect(userUri, { useNewUrlParser: true })
    .catch((error) => {
      console.error(error + '\nCheck whether service mongod has started correctly - sudo service mongod start')
    })
}

const app = express()

// Middlewears moved morgan into if for clear tests
if (!process.env.NODE_ENV == 'test') {
  app.use(morgan('dev'))
}

app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/users', require('./routes/users'))

module.exports = app
