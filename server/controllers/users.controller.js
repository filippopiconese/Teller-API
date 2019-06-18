const status = require('http-status')
const JWT = require('jsonwebtoken')
const User = require('../models/user.model')
const { jwt_secret } = require('../configuration')

signToken = user => {
  return JWT.sign({
    iss: 'TellerApp',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, jwt_secret)
}

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body

    // Check if there is a user with the same email
    let foundUser = await User.findOne({ "local.email": email })
    if (foundUser) {
      console.info(status[403])
      return res.status(403).json({ error: 'Email is already in use' })
    }

    // Is there a Google account with the same email?
    foundUser = await User.findOne({ "google.email": email })

    if (foundUser) {
      // Let's merge them
      foundUser.methods.push('local')
      foundUser.local = {
        email: email,
        password: password
      }
      await foundUser.save()

      // Generate new token
      const token = signToken(foundUser)

      // Respond with token
      return res.status(200).json({
        token,
        methods: foundUser.methods
      })
    }

    // Is there a Facebook account with the same email?
    foundUser = await User.findOne({ "facebook.email": email })

    if (foundUser) {
      // Let's merge them
      foundUser.methods.push('local')
      foundUser.local = {
        email: email,
        password: password
      }
      await foundUser.save()

      // Generate new token
      const token = signToken(foundUser)

      // Respond with token
      return res.status(200).json({
        token,
        methods: foundUser.methods
      })
    }

    // Create a new user
    const newUser = new User({
      methods: ['local'],
      local: {
        email: email,
        password: password
      }
    })
    await newUser.save()

    // Generate new token
    const token = signToken(newUser)

    // Respond with token
    res.status(200).json({
      token,
      methods: newUser.methods
    })
  },

  signIn: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user)

    res.status(200).json({
      token,
      methods: req.user.methods
    })
  },

  googleOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user)

    res.status(200).json({
      token,
      methods: req.user.methods
    })
  },

  linkGoogle: async (req, res, next) => {
    res.json({ success: true, message: 'Successfully linked account with Google' })
  },

  facebookOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user)

    res.status(200).json({
      token,
      methods: req.user.methods
    })
  },

  linkFacebook: async (req, res, next) => {
    res.json({ success: true, message: 'Successfully linked account with Facebook' })
  },

  secret: async (req, res, next) => {
    console.log('I managed to get here!')
    res.json({ secret: 'Resource' })
  }
}
