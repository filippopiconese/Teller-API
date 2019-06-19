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
  secretOrKey: jwt_secret,
  passReqToCallback: true
}, async (req, payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub)

    // if user doesn't exists, handle it
    if (!user) {
      return done(null, false)
    }

    // Otherwise, save and return the user
    req.user = user
    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: oauth.google.clientID,
  clientSecret: oauth.google.clientSecret,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    if (req.user) {
      // We are already logged in, time for linking account!

      // Add Google's data to an existing account
      req.user.methods.push('google')
      req.user.google = {
        id: profile.id,
        email: profile.emails[0].value
      }

      await req.user.save()
      return done(null, req.user)
    } else {
      // We are in the account creation process!

      // Check whether this current user exists in our DB
      let existingUser = await User.findOne({ "google.id": profile.id })
      if (existingUser) {
        return done(null, existingUser)
      }

      // Check if we have someone with the same email
      existingUser = await User.findOne({ "local.email": profile.emails[0].value })
      if (existingUser) {
        // We want to merge google's data with local auth
        existingUser.methods.push('google')
        existingUser.google = {
          id: profile.id,
          email: profile.emails[0].value
        }

        await existingUser.save()
        return done(null, existingUser)
      }

      // If new account, you have BEFORE to sign-up inserting the toy code, the email and choose a password.
      return done(null, false, { message: 'You have not an account, yet!' });
    }
  } catch (error) {
    done(error, false, error.message)
  }
}))

// FACEBOOK OAUTH STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: oauth.facebook.clientID,
  clientSecret: oauth.facebook.clientSecret,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    if (req.user) {
      // We are already logged in, time for linking account!

      // Add Facebook's data to an existing account
      req.user.methods.push('facebook')
      req.user.facebook = {
        id: profile.id,
        email: profile.emails[0].value
      }

      await req.user.save()
      return done(null, req.user)
    } else {
      // We are in the account creation process!

      // Check whether this current user exists in our DB
      let existingUser = await User.findOne({ "facebook.id": profile.id })
      if (existingUser) {
        return done(null, existingUser)
      }

      // Check if we have someone with the same email
      existingUser = await User.findOne({ "local.email": profile.emails[0].value })
      if (existingUser) {
        // We want to merge facebook's data with local auth
        existingUser.methods.push('facebook')
        existingUser.facebook = {
          id: profile.id,
          email: profile.emails[0].value
        }

        await existingUser.save()
        return done(null, existingUser)
      }

      // If new account, you have BEFORE to sign-up inserting the toy code, the email and choose a password.
      return done(null, false, { message: 'You have not an account, yet!' });
    }
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

    console.log('email', email)
    console.log('password', password)


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
