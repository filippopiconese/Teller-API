const status = require('http-status')
const JWT = require('jsonwebtoken')
const Code = require('../models/tellerCodes.model')
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
    const { code, email, password } = req.value.body

    // Check if the provided code exists
    const existCode = await Code.findOne({ "code": code })

    if (!existCode) {
      console.info(status[404])
      return res.status(404).json({ error: 'Code not found' })
    }

    // Check if the code is available
    const query = { "code": code, "used": false }
    let codeAvailable = await Code.findOne(query)
    if (!codeAvailable) {
      console.info(status[409])
      return res.status(409).json({ error: 'Code already in use' })
    }

    // Check if there is a user with the same email
    let foundUser = await User.findOne({ "local.email": email })
    if (foundUser) {
      console.info(status[403])
      return res.status(403).json({ error: 'Email is already in use' })
    }

    // If we arrive here, the code exists and is not already in use, therefore we can assign that code to this account
    await Code.updateOne(query, { "code": code, "used": true, "email": email })

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
    res.status(200).json({ token })
  },

  signIn: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user)

    res.status(200).json({ token })
  },

  googleOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user)

    res.status(200).json({ token })
  },

  linkGoogle: async (req, res, next) => {
    res.json({
      success: true,
      methods: req.user.methods,
      message: 'Successfully linked account with Google'
    })
  },

  unlinkGoogle: async (req, res, next) => {
    // Delete Google sub-object
    if (req.user.google) {
      req.user.google = undefined
    }

    // Remove 'google' from methods array
    const googleStrPos = req.user.methods.indexOf('google')
    if (googleStrPos >= 0) {
      req.user.methods.splice(googleStrPos, 1)
    }
    await req.user.save()

    // Return something
    res.json({
      success: true,
      methods: req.user.methods,
      message: 'Successfully unlinked account from Google'
    })
  },

  facebookOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user)

    res.status(200).json({ token })
  },

  linkFacebook: async (req, res, next) => {
    res.json({
      success: true,
      methods: req.user.methods,
      message: 'Successfully linked account with Facebook'
    })
  },

  unlinkFacebook: async (req, res, next) => {
    // Delete Facebook sub-object
    if (req.user.facebook) {
      req.user.facebook = undefined
    }

    // Remove 'facebook' from methods array
    const facebookStrPos = req.user.methods.indexOf('facebook')
    if (facebookStrPos >= 0) {
      req.user.methods.splice(facebookStrPos, 1)
    }
    await req.user.save()

    // Return something
    res.json({
      success: true,
      methods: req.user.methods,
      message: 'Successfully unlinked account from Facebook'
    })
  },

  dashboard: async (req, res, next) => {
    res.json({
      secret: 'Resource',
      methods: req.user.methods
    })
  }
}
