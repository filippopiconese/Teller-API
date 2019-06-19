const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const { mongoUri } = require('./configuration')
const Code = require('./models/tellerCodes.model')

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
if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'))
}
if (process.env.NODE_ENV === 'test') {
  // get reference to database
  let db = mongoose.connection

  db.on('error', console.error.bind(console, 'connection error:'))

  db.once('open', function () {
    console.log("Connection Successful!")

    // define Schema
    // const codeSchema = mongoose.Schema({
    //   code: String,
    //   used: Boolean
    // })

    // compile schema to model
    // let Code = mongoose.model('tellerCode', codeSchema, 'tellerCodes')

    // a document instance
    let code1 = new Code({ code: '1', used: false })

    // save model to database
    code1.save(function (err, book) {
      if (err) return console.error(err)
      console.log(code1.code + " saved to tellerCodes collection.")
    })

  })
}

app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/users', require('./routes/users'))

module.exports = app
