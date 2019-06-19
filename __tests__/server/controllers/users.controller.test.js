const chai = require('chai')
const faker = require('faker')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const { expect } = chai

const User = require('../../../server/models/user.model')
const Code = require('../../../server/models/tellerCodes.model')
const userController = rewire('../../../server/controllers/users.controller')

chai.use(sinonChai)

let sandbox = null

describe('Users controller', () => {
  let req = {
    user: {
      id: faker.random.number(),
      methods: ['local', 'google', 'facebook']
    },
    value: {
      body: {
        code: '4',
        email: faker.internet.email(),
        password: faker.internet.password()
      },
    },
  }
  let res = {
    json: function () {
      return this
    },
    status: function () {
      return this
    }
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('dashboard', () => {
    it('should return resource when called', async () => {
      sandbox.spy(console, 'log')
      sandbox.spy(res, 'json')

      await userController.dashboard(req, res)

      expect(res.json).to.have.been.calledWith({
        secret: 'Resource',
        methods: ['local', 'google', 'facebook']
      })
    })
  })

  describe('signIn', () => {
    it('should return token when signIn called', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')

      await userController.signIn(req, res)

      expect(res.status).to.have.been.calledWith(200)
      expect(res.json.callCount).to.equal(1)
    })

    it('should return fake token using rewire', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')

      // fake jwt token with rewire
      let signToken = userController.__set__('signToken', user => 'fakeToken')

      await userController.signIn(req, res)

      expect(res.json).to.have.been.calledWith({
        token: 'fakeToken',
      })
      signToken()
    })
  })

  describe('signUp', () => {
    it('should return 404 if code does not exist in the db', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')

      req.value.body.code = '1111'
      await userController.signUp(req, res)

      expect(res.status).to.have.been.calledWith(404)
      expect(res.json).to.have.been.calledWith({
        error: 'Code not found',
      })
    })

    it('should return 409 if code is already in use', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')

      req.value.body.code = '10'
      await userController.signUp(req, res)

      expect(res.status).to.have.been.calledWith(409)
      expect(res.json).to.have.been.calledWith({
        error: 'Code already in use',
      })
    })

    it('should return 403 if the user email is already saved in the db', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')
      sandbox.stub(User, 'findOne').returns(
        Promise.resolve({
          id: faker.random.number()
        }),
      )

      req.value.body.code = '5'
      req.value.body.email = 'test@test.com'
      await userController.signUp(req, res)

      expect(res.status).to.have.been.calledWith(403)
      expect(res.json).to.have.been.calledWith({
        error: 'Email is already in use',
      })
    })

    it('should return 200 if user is not in db and it was saved', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false))
      sandbox.stub(User.prototype, 'save').returns(
        Promise.resolve({
          id: faker.random.number(),
        }),
      )

      req.value.body.code = '6'
      await userController.signUp(req, res)

      expect(res.status).to.have.been.calledWith(200)
      expect(res.json.callCount).to.equal(1)
    })

    it('should return 200 if user is not in db using callback done', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false))
      sandbox.stub(User.prototype, 'save').returns(
        Promise.resolve({
          id: faker.random.number(),
        }),
      )

      req.value.body.code = '7'
      await userController.signUp(req, res)

      expect(res.status).to.have.been.calledWith(200)
      expect(res.json.callCount).to.equal(1)
    })

    it('should return fake token in res.json', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false))
      sandbox.stub(User.prototype, 'save').returns(
        Promise.resolve({
          id: faker.random.number(),
        }),
      )

      let signToken = userController.__set__('signToken', user => 'fakeTokenNumberTwo')

      req.value.body.code = '8'
      await userController.signUp(req, res)

      expect(res.json).to.have.been.calledWith({
        token: 'fakeTokenNumberTwo',
      })
      signToken()
    })
  })

  describe('googleOAuth', () => {
    it('should return token if user passed the passport google oauth', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')

      let signToken = userController.__set__('signToken', user => 'fakeTokenFromGoogleController')

      await userController.googleOAuth(req, res)

      expect(res.status).to.have.been.calledWith(200)
      expect(res.json).to.have.been.calledWith({
        token: 'fakeTokenFromGoogleController',
      })
      signToken()
    })
  })

  describe('facebookOAuth', () => {
    it('should return token if user passed the passport facebook oauth', async () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')

      let signToken = userController.__set__('signToken', user => 'fakeTokenFromFacebookController')

      await userController.facebookOAuth(req, res)

      expect(res.status).to.have.been.calledWith(200)
      expect(res.json).to.have.been.calledWith({
        token: 'fakeTokenFromFacebookController',
      })
      signToken()
    })
  })
})
