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
  const preSaveSignUP = {
    email: 'mr.sometest@gmail.com',
    password: 'password',
    code: '1'
  }
  const preSaveSignIN = {
    email: 'mr.sometest@gmail.com',
    password: 'password',
  }
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    code: '2'
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

    it('should return 404 if code is not in the db', async () => {
      const res = await chai
        .request(server)
        .post(signup)
        .send({
          email: 'mr.sometest@gmail.com',
          password: 'password',
          code: '1111'
        })
      expect(res.status).to.equal(404)
      expect(res.text).to.equal('{"error":"Code not found"}')
    })

    it('should return 409 if code is already in use', async () => {
      const res = await chai
        .request(server)
        .post(signup)
        .send({
          email: 'oky@doky.com',
          password: 'lol',
          code: '1'
        })
      expect(res.status).to.equal(409)
      expect(res.text).to.equal('{"error":"Code already in use"}')
    })

    it('should return 403 if email was found', async () => {
      const res = await chai
        .request(server)
        .post(signup)
        .send({
          email: 'mr.sometest@gmail.com',
          password: 'lol',
          code: '3'
        })

      expect(res.status).to.equal(403)
      expect(res.text).to.equal('{"error":"Email is already in use"}')
    })
  })

  describe('dashboard', () => {
    it('should return status 401 because you are not authorized', async () => {
      const res = await chai.request(server).get(dashboard)

      expect(res.status).to.equal(401)
      expect(res.text).to.equal('Unauthorized')
    })

    it('should return status 200', async () => {
      const res = await chai
        .request(server)
        .get(dashboard)
        .set('Authorization', token)
      expect(res.status).to.equal(200)
      expect(res.body).to.deep.equal({ secret: 'Resource', methods: ['local'] })

    })
  })

  describe('signin', () => {
    it('should return error 400 if user email and password empty', async () => {
      const user = {
        email: '',
        password: ''
      }

      const res = await chai
        .request(server)
        .post(signin)
        .send(user)

      expect(res.status).to.be.equal(400)
    })

    it('should return 200 and our token', async () => {
      const res = await chai
        .request(server)
        .post(signin)
        .send(preSaveSignIN)

      expect(res.status).to.be.equal(200)
      expect(res.body).not.to.be.empty
      expect(res.body).to.have.property('token')
    })
  })
})
