import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { compose } from 'redux'

import * as actions from '../actions'
import CustomInput from './Custominput'
class SignUp extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.responseGoogle = this.responseGoogle.bind(this)
    this.responseFacebook = this.responseFacebook.bind(this)
  }

  async onSubmit(formData) {
    // We need to call some Action Creator
    await this.props.signUp(formData)

    if (!this.props.errorMessage) {
      this.props.history.push('dashboard')
    }
  }

  async responseGoogle(res) {
    await this.props.oauthGoogle(res.accessToken)

    if (!this.props.errorMessage) {
      this.props.history.push('dashboard')
    }
  }

  async responseFacebook(res) {
    await this.props.oauthFacebook(res.accessToken)

    if (!this.props.errorMessage) {
      this.props.history.push('dashboard')
    }
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <div className="row">
        <div className="col">
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <fieldset>
              <Field
                name="code"
                type="text"
                id="code"
                label="Enter your Teller code"
                placeholder="1"
                component={CustomInput}
              />
            </fieldset>
            <fieldset>
              <Field
                name="email"
                type="text"
                id="email"
                label="Enter your email"
                placeholder="example@example.com"
                component={CustomInput}
              />
            </fieldset>
            <fieldset>
              <Field
                name="password"
                type="password"
                id="password"
                label="Enter your password"
                placeholder="yoursuperpassword"
                component={CustomInput}
              />
            </fieldset>

            {
              this.props.errorMessage ?
                <div className="alert alert-danger">
                  {this.props.errorMessage}
                </div>
                : null
            }

            <button type="submit" className="btn btn-primary">Sign Up</button>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage
  }
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'signup' })
)(SignUp)
