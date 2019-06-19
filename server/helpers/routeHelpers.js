const status = require('http-status')
const Joi = require('joi')

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema)

      if (result.error) {
        console.info(status[400])
        return res.status(400).json(result.error)
      }

      if (!req.value) {
        req.value = {}
      }

      req.value['body'] = result.value

      next()
    }
  },
  schemas: {
    signupSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      code: Joi.string().required().alphanum().min(1).max(1)
    }),
    signinSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }
}
