const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require("passport-google-plus-token")
const FacebookTokenStrategy = require("passport-facebook-token")

const { jwt_secret, oauth } = require('./configuration')
const User = require('./models/user.model')

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: jwt_secret
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub)

    // if user doesn't exists, handle it
    if (!user) {
      return done(null, false)
    }

    // Otherwise, return the user
    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: oauth.google.clientID,
  clientSecret: oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)

    // Check whether this current user exists in our DB
    let existingUser = await User.findOne({ "google.id": profile.id })
    if (existingUser) {
      console.log('User already exists in our DB')
      return done(null, existingUser)
    }

    // Check if we have someone with the same email
    existingUser = await User.findOne({ "local.email": profile.emails[0].value })
    if (existingUser) {
      // We want to merge google's data with local auth
      existingUser.google = {
        id: profile.id,
        email: profile.emails[0].value
      }

      await existingUser.save()
      return done(null, existingUser)
    }

    // If new account
    const newUser = new User({
      method: 'google',
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })

    await newUser.save()
    done(null, newUser)
  } catch (error) {
    done(error, false, error.message)
  }
}))

// FACEBOOK OAUTH STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: oauth.facebook.clientID,
  clientSecret: oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)

    // Check whether this current user exists in our DB
    let existingUser = await User.findOne({ "facebook.id": profile.id })
    if (existingUser) {
      return done(null, existingUser)
    }

    // Check if we have someone with the same email
    existingUser = await User.findOne({ "local.email": profile.emails[0].value })
    if (existingUser) {
      // We want to merge facebook's data with local auth
      existingUser.facebook = {
        id: profile.id,
        email: profile.emails[0].value
      }

      await existingUser.save()
      return done(null, existingUser)
    }

    // If new account
    const newUser = new User({
      method: 'facebook',
      facebook: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })

    await newUser.save()
    done(null, newUser)
  } catch (error) {
    done(error, false, error.message)
  }
}))

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ "local.email": email })

    // If not, handle it
    if (!user) {
      return done(null, false)
    }

    // Check if the password is correct
    const isMatch = await user.isValidPassword(password)

    // If not, handle it
    if (!isMatch) {
      return done(null, false)
    }
    // Otherwise, return the user
    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))
