const express = require('express')
const router = require('express-promise-router')()
const passport = require('passport')
const passportConf = require('../passport')

const { validateBody, schemas } = require('../helpers/routeHelpers')
const UserController = require('../controllers/users.controller')
const passportSignIn = passport.authenticate('local', { session: false })
const passportGoogle = passport.authenticate('googleToken', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })

router.route('/signup')
  .post(validateBody(schemas.authSchema), UserController.signUp)

router.route('/signin')
  .post(validateBody(schemas.authSchema), passportSignIn, UserController.signIn)

router.route('/oauth/google')
  .post(passportGoogle, UserController.googleOAuth)

router.route('/secret')
  .get(passportJWT, UserController.secret)

module.exports = router
