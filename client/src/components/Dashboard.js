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
    await this.props.linkFacebook(res.accessToken)
  }

  unlinkFacebook = async () => {
    await this.props.unlinkFacebook()
  }

  linkGoogle = async (res) => {
    await this.props.linkGoogle(res.accessToken)
  }

  unlinkGoogle = async () => {
    await this.props.unlinkGoogle()
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
        <br />
        <br />

        <h2>Unlink your social media accounts</h2>
        <button
          style={{ marginRight: 15 }}
          className="btn btn-primary"
          onClick={() => this.unlinkFacebook()}
          disabled={this.props.dashboard.methods.includes('facebook') ? false : true}
        >
          Unlink from Facebook
        </button>

        <button
          className="btn btn-danger"
          onClick={() => this.unlinkGoogle()}
          disabled={this.props.dashboard.methods.includes('google') ? false : true}
        >
          Unlink from Google
        </button>
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
