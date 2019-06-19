const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const { mongoUri } = require('./configuration')

mongoose.Promise = global.Promise


mongoose.connect(mongoUri, { useNewUrlParser: true })
  .catch((error) => {
    console.error(error + `
Follow these steps:
1) If you are running this program locally, make sure that mongo has started. Type: "sudo service mongod start"
2) If you are running this program in production, make sure that the current IP is added in your MongoDB Atlas
`)
  })

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
