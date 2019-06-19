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
  }
})

// codeSchema.methods.isValidCode = async function (code) {
//   try {
//     return await e, this.local.password)
//   } catch (error) {
//     throw new Error(error)
//   }
// }

// Create a model
const Code = mongoose.model('tellerCode', codeSchema, 'tellerCodes')

// Export the model
module.exports = Code
