const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

// Create a schema
const userSchema = new Schema({
  methods: {
    type: [String],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String,
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
})

// We want to salt&hash the password before the save action takes place
userSchema.pre('save', async function (next) {
  try {
    if (!this.methods.includes('local')) {
      next() // we won't have any password, so just skip this function
    }

    // The user schema is instantiated
    const user = this;
    // Check if the user has been modified to know if the password has already been hashed
    if (!user.isModified('local.password')) {
      next();
    }

    // Generate a password has (salt + hash)
    const passwordHash = await bcrypt.hash(this.local.password, 10)
    // Re-assign hashed version over original, plaintext passord
    this.local.password = passwordHash

    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password)
  } catch (error) {
    throw new Error(error)
  }
}

// Create a model
const User = mongoose.model('user', userSchema)

// Export the model
module.exports = User
