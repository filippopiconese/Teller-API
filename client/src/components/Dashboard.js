import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'

import * as actions from '../actions'

class Dashboard extends Component {
  componentDidMount() {
    this.props.getSecret()
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
        <FacebookLogin
          appId="342011239791372"
          textButton="Facebook"
          fields="name,email,picture"
          callback={this.linkFacebook}
          cssClass="btn btn-outline-primary"
        />
        <GoogleLogin
          clientId="36699314176-o4be1skj1rn48ve97uerbomaed1d7meo.apps.googleusercontent.com"
          buttonText="Google"
          onSuccess={this.linkGoogle}
          onFailure={this.linkGoogle}
          className="btn btn-outline-danger"
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    secret: state.dashboard.secret
  }
}

export default connect(mapStateToProps, actions)(Dashboard)
