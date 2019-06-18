import axios from 'axios'

import {
  AUTH_SIGN_UP,
  AUTH_SIGN_OUT,
  AUTH_SIGN_IN,
  AUTH_ERROR,
  DASHBOARD_GET_DATA
} from './types'
/*
  ActionCreators -> create/return Actions ({ }) -> dispatched -> middlewares -> reducers
*/

export const oauthGoogle = data => {
  return async dispatch => {
    const res = await axios.post('http://localhost:5000/users/oauth/google', {
      access_token: data
    })

    dispatch({
      type: AUTH_SIGN_UP,
      payload: res.data
    })

    localStorage.setItem('JWT_TOKEN', res.data.token)
    axios.defaults.headers.common['Authorization'] = res.data.token
  }
}

export const oauthFacebook = data => {
  return async dispatch => {
    const res = await axios.post('http://localhost:5000/users/oauth/facebook', {
      access_token: data
    })

    dispatch({
      type: AUTH_SIGN_UP,
      payload: res.data
    })

    localStorage.setItem('JWT_TOKEN', res.data.token)
    axios.defaults.headers.common['Authorization'] = res.data.token
  }
}

export const signUp = data => {
  /*
    Step 1) Use the form data and make HTTP request to our Back-End and send it along (axios library needed) [X]
    Step 2) Take the BE's response (jwtToken is here now!) [X]
    Step 3) Dispatch user just signed up (with jwtToken) [X]
    Step 4) Save the jwtToken into our localStorage [X]
  */

  return async dispatch => {
    try {
      console.log('[ActionCreator] signUp called!')
      const res = await axios.post('http://localhost:5000/users/signup', data)

      console.log('[ActionCreator] signUp dispatched an action!')
      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data
      })

      localStorage.setItem('JWT_TOKEN', res.data.token)
      axios.defaults.headers.common['Authorization'] = res.data.token
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: 'Email is already in use'
      })
    }
  }
}

export const signIn = data => {
  return async dispatch => {
    try {
      console.log('[ActionCreator] signIn called!')
      const res = await axios.post('http://localhost:5000/users/signin', data)

      console.log('[ActionCreator] signIn dispatched an action!')
      dispatch({
        type: AUTH_SIGN_IN,
        payload: res.data
      })

      localStorage.setItem('JWT_TOKEN', res.data.token)
      axios.defaults.headers.common['Authorization'] = res.data.token
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: 'Email and password combination is not valid!'
      })
    }
  }
}

export const getDashboard = () => {
  return async dispatch => {
    try {
      console.log('[ActionCreator] Trying to get back-end dashboard')
      const res = await axios.get('http://localhost:5000/users/dashboard')
      console.log('res', res)

      dispatch({
        type: DASHBOARD_GET_DATA,
        payload: res.data
      })
    } catch (error) {
      console.error('error', error)
    }
  }
}

export const signOut = () => {
  return dispatch => {
    localStorage.removeItem('JWT_TOKEN')
    axios.defaults.headers.common['Authorization'] = ''

    dispatch({
      type: AUTH_SIGN_OUT,
      payload: ''
    })
  }
}

export const linkGoogle = data => {
  return async dispatch => {
    const res = await axios.post('http://localhost:5000/users/oauth/link/google', {
      access_token: data
    })

    console.log('res in action creator - Google', res)
  }
}

export const linkFacebook = data => {
  return async dispatch => {
    const res = await axios.post('http://localhost:5000/users/oauth/link/facebook', {
      access_token: data
    })

    console.log('res in action creator - Facebook', res)
  }
}
