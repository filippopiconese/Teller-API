const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')
const { expect } = chai

const server = require('../../../server/app')

chai.use(chaiHttp)

let token

describe('Users route', () => {
  const signup = '/users/signup'
  const signin = '/users/signin'
  const dashboard = '/users/dashboard'
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    code: '1'
  }
  const preSaveSignUP = {
    email: 'mr.sometest@gmail.com',
    password: 'password',
    code: '1'
  }
  const preSaveSignIN = {
    email: 'mr.sometest@gmail.com',
    password: 'password',
  }

  before(async () => {
    const res = await chai
      .request(server)
      .post(signup)
      .send(preSaveSignUP)
    expect(res.status).to.equal(200)
    token = res.body.token
  })

  after('dropping test db', async () => {
    await mongoose.connection.dropDatabase(() => {
      console.log('\n Test database dropped')
    })
    await mongoose.connection.close()
  })

  describe('signup', () => {
    it('should create new user if email not found', async () => {
      try {
        const res = await chai
          .request(server)
          .post(signup)
          .send(user)
        expect(res.status).to.equal(200)
        expect(res.body).not.to.be.empty
        expect(res.body).to.have.property('token')
      } catch (err) {
        console.error(err)
      }
    })

    it('should return 403 if email was found', async () => {
      try {
        await chai
          .request(server)
          .post(signup)
          .send(preSaveSignUP)
      } catch (err) {
        expect(err.status).to.equal(403)
        expect(err.response.text).to.equal('{"error":"Email is already in use"}')
      }
    })
  })

  describe('dashboard', () => {
    it('should return status 401', async () => {
      try {
        await chai.request(server).get(dashboard)
      } catch (err) {
        expect(err.status).to.equal(401)
        expect(err.response.text).to.equal('Unauthorized')
      }
    })

    it('should return status 200', async () => {
      try {
        const res = await chai
          .request(server)
          .get(dashboard)
          .set('Authorization', token)
        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal({ secret: 'Resource', methods: ['local'] })
      } catch (err) {
        throw new Error(err)
      }
    })
  })

  describe('signin', () => {
    it('should return error 400 if user email and password empty', async () => {
      let user = {}
      try {
        const res = await chai
          .request(server)
          .post(signin)
          .send(user)
      } catch (err) {
        expect(err.status).to.be.equal(400)
      }
    })

    it('should return 200 and our token', async () => {
      try {
        const res = await chai
          .request(server)
          .post(signin)
          .send(preSaveSignIN)

        expect(res.status).to.be.equal(200)
        expect(res.body).not.to.be.empty
        expect(res.body).to.have.property('token')
      } catch (err) {
        throw new Error(err)
      }
    })
  })
})
