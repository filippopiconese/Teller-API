import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import * as actions from '../actions'

class Dashboard extends Component {
  componentDidMount() {
    this.props.getDashboard()
  }

  linkFacebook = async (res) => {
    console.log('Link with FB', res)
    await this.props.linkFacebook(res.accessToken)
  }

  linkGoogle = async (res) => {
    console.log('Link with Google', res)
    await this.props.linkGoogle(res.accessToken)
  }

  render() {
    return (
      <div>
        This is a Dashboard component
        <br />
        Our secret: <h3>{this.props.secret}</h3>
        <br />
        <h2>Link your social media accounts</h2>
        <FacebookLogin
          appId="342011239791372"
          render={renderProps => (
            <button style={{ marginRight: 15 }} className="btn btn-primary" onClick={renderProps.onClick} disabled={this.props.dashboard.methods.includes('facebook') ? true : false}>Link with Facebook</button>
          )}
          fields="name,email,picture"
          callback={this.linkFacebook}
        />
        <GoogleLogin
          clientId="36699314176-o4be1skj1rn48ve97uerbomaed1d7meo.apps.googleusercontent.com"
          disabled={this.props.dashboard.methods.includes('google') ? true : false}
          render={renderProps => (
            <button className="btn btn-danger" onClick={renderProps.onClick} disabled={renderProps.disabled}>Link with Google</button>
          )}
          onSuccess={this.linkGoogle}
          onFailure={this.linkGoogle}
        />

        <br />

        <h2>Unlink your social media accounts</h2>
        <FacebookLogin
          appId="342011239791372"
          render={renderProps => (
            <button style={{ marginRight: 15 }} className="btn btn-primary" onClick={renderProps.onClick} disabled={renderProps.disabled}>Unlink with Facebook</button>
          )}
          fields="name,email,picture"
          callback={this.linkFacebook}
        />
        <GoogleLogin
          clientId="36699314176-o4be1skj1rn48ve97uerbomaed1d7meo.apps.googleusercontent.com"
          render={renderProps => (
            <button className="btn btn-danger" onClick={renderProps.onClick} disabled={renderProps.disabled}>Unlink with Google</button>
          )}
          onSuccess={this.linkGoogle}
          onFailure={this.linkGoogle}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    secret: state.dashboard.secret,
    dashboard: state.dashboard,
    auth: state.auth
  }
}

export default connect(mapStateToProps, actions)(Dashboard)
