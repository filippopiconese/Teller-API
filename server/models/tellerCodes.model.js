const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create a schema
const codeSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  used: {
    type: Boolean,
    required: true
  },
  email: {
    type: String
  }
})

// Create a model
const Code = mongoose.model('tellerCode', codeSchema, 'tellerCodes')

// Export the model
module.exports = Code
