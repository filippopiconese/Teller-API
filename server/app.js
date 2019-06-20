const express = require('express')
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

if (process.env.NODE_ENV === 'test') {
  // get reference to database
  const db = mongoose.connection

  db.on('error', console.error.bind(console, 'connection error:'))

  db.once('open', async () => {
    console.log("Connection Successful!")

    // Create a code already used in order to test the permission denied
    // Leave this insertion as it is, otherwise one test occasionally crash
    const code = new Code({ code: '10', used: true, email: "test@test.com" })
    await code.save()

    // Populate the test database with 10 new codes
    for (let i = 1; i < 10; i++) {
      const code = new Code({ code: `${i}`, used: false, email: "" })
      await code.save()
    }
  })

  console.log('Test db populated!')
}

app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/users', require('./routes/users'))

module.exports = app
