import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { compose } from 'redux'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import * as actions from '../actions'
import CustomInput from './Custominput'
class SignIn extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.responseGoogle = this.responseGoogle.bind(this)
    this.responseFacebook = this.responseFacebook.bind(this)
  }

  async onSubmit(formData) {
    await this.props.signIn(formData)

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

            <button type="submit" className="btn btn-primary">Sign In</button>
          </form>
        </div>
        <div className="col">
          <div className="text-center">
            <div className="alert alert-primary">
              Or sign-in using third-party services
            </div>
            <FacebookLogin
              appId="342011239791372"
              render={renderProps => (
                <button style={{ marginRight: 15 }} className="btn btn-primary" onClick={renderProps.onClick}>Facebook</button>
              )}
              fields="name,email,picture"
              callback={this.responseFacebook}
            />
            <GoogleLogin
              clientId="36699314176-o4be1skj1rn48ve97uerbomaed1d7meo.apps.googleusercontent.com"
              render={renderProps => (
                <button className="btn btn-danger" onClick={renderProps.onClick}>Google</button>
              )}
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
            />
          </div>
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
  reduxForm({ form: 'signin' })
)(SignIn)
