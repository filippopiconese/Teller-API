const express = require('express')
const router = require('express-promise-router')()
const passport = require('passport')
const passportConf = require('../passport') // This is needed for the strategies 'jwt', 'googleToken' and 'facebookToken'

const { validateBody, schemas } = require('../helpers/routeHelpers')
const UserController = require('../controllers/users.controller')
const MediaController = require('../controllers/media.controller')
const passportSignIn = passport.authenticate('local', { session: false })
const passportGoogle = passport.authenticate('googleToken', { session: false })
const passportFacebook = passport.authenticate('facebookToken', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })

router.route('/signup')
  .post(validateBody(schemas.signupSchema), UserController.signUp)

router.route('/signin')
  .post(validateBody(schemas.signinSchema), passportSignIn, UserController.signIn)

router.route('/oauth/google')
  .post(passportGoogle, UserController.googleOAuth)

router.route('/oauth/facebook')
  .post(passportFacebook, UserController.facebookOAuth)

router.route('/oauth/link/google')
  .post(passportJWT, passport.authorize('googleToken', { session: false }), UserController.linkGoogle)

router.route('/oauth/unlink/google')
  .post(passportJWT, UserController.unlinkGoogle)

router.route('/oauth/link/facebook')
  .post(passportJWT, passport.authorize('facebookToken', { session: false }), UserController.linkFacebook)

router.route('/oauth/unlink/facebook')
  .post(passportJWT, UserController.unlinkFacebook)

router.route('/dashboard')
  .get(passportJWT, UserController.dashboard)

router.route('/dashboard/media')
  .get(passportJWT, MediaController.getMediaList)

router.route('/dashboard/media/download')
  .get(passportJWT, MediaController.downloadMedia)

module.exports = router
