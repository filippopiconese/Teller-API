const mongoose = require('mongoose')
var gridfs = require('gridfs-stream');

const { mongoUri } = require('../configuration')

module.exports = {
  getMediaList: (req, res, next) => {
    mongoose.Promise = global.Promise
    mongoose.connect(mongoUri, { useNewUrlParser: true })
    gridfs.mongo = mongoose.mongo

    const connection = mongoose.connection
    connection.on('error', console.error.bind(console, 'connection error:'))

    connection.once('open', () => {
      console.log("Connection Successful!")
      const gfs = gridfs(connection.db, mongoose.mongo)

      gfs.files.find({}).toArray((err, files) => {
        if (err) {
          console.info(status[404])
          return res.status(404).json({ error: 'Stories not found' })
        }

        return res.status(200).json({
          media: files
        })
      })
    })
  }
}
