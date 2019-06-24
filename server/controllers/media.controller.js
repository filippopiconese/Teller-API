const mongoose = require('mongoose')
const status = require('http-status')
const gridfs = require('gridfs-stream')

const { mongoUri } = require('../configuration')

module.exports = {
  getMediaList: (req, res, next) => {
    mongoose.Promise = global.Promise
    mongoose.connect(mongoUri, { useNewUrlParser: true })
    gridfs.mongo = mongoose.mongo

    const connection = mongoose.connection
    connection.on('error', console.error.bind(console, 'connection error:'))

    connection.once('open', () => {
      const gfs = gridfs(connection.db, mongoose.mongo)

      gfs.files.find({}).toArray((err, files) => {
        if (err || files.length === 0) {
          console.info(status[404])
          return res.status(404).json({ error: 'Stories not found' })
        }

        const mediaDetails = files.map(function (media) { return media['filename'] })

        return res.status(200).json({
          media: mediaDetails
        })
      })
    })
  },
  downloadMedia: (req, res, next) => {
    mongoose.Promise = global.Promise
    mongoose.connect(mongoUri, { useNewUrlParser: true })
    gridfs.mongo = mongoose.mongo

    const connection = mongoose.connection
    connection.on('error', console.error.bind(console, 'connection error:'))
    connection.once('open', () => {
      const gfs = gridfs(connection.db, mongoose.mongo)

      gfs.files.find({ filename: req.query }).toArray((err, files) => {
        if (err || files.length === 0) {
          console.info(status[404])
          return res.status(404).json({ error: 'Story not found' })
        }

        const readstream = gfs.createReadStream({ filename: req.query })
        readstream.pipe(res)
      })
    })
  }
}

// Tales

// { "name" : "Alice-In-Wonderland.opus", "length" : "14.04", "price" : "3", type: 'tale }
// http://localhost:5000/users/dashboard/media/download?name=Alice-In-Wonderland.opus&length=14.04&price=3&type=tale

// { "name" : "Pinocchio.opus", "length" : "5.29", "price" : "1.5", type: 'tale }
// http://localhost:5000/users/dashboard/media/download?name=Pinocchio.opus&length=5.29&price=1.5&type=tale

// { "name" : "The-Wonderful-Wizard-Of-Oz.opus", "length" : "9.52", "price" : "2", type: 'tale }
// http://localhost:5000/users/dashboard/media/download?name=The-Wonderful-Wizard-Of-Oz.opus&length=9.52&price=2&type=tale


// Lullabies

// { "name" : "Calm.opus", "length" : "2.03", "price" : "0.5", type: 'lullaby }
// http://localhost:5000/users/dashboard/media/download?name=Calm.opus&length=2.03&price=0.5&type=lullaby

// { "name" : "Babies-With-Mozart.opus", "length" : "3.31", "price" : "1", type: 'lullaby }
// http://localhost:5000/users/dashboard/media/download?name=Babies-With-Mozart.opus&length=3.31&price=1&type=lullaby

// { "name" : "Brahms-Lullaby.opus", "length" : "3.34", "price" : "1", type: 'lullaby }
// http://localhost:5000/users/dashboard/media/download?name=Brahms-Lullaby.opus&length=3.34&price=1&type=lullaby
