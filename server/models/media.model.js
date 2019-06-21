const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create a schema
const mediaSchema = new Schema({

})

// Create a model
const Code = mongoose.model('tellerCode', mediaSchema, 'tellerCodes')

// Export the model
module.exports = Code
