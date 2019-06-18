import {
  AUTH_SIGN_UP,
  AUTH_SIGN_OUT,
  AUTH_SIGN_IN,
  AUTH_ERROR
} from '../actions/types'

const DEFAULT_STATE = {
  isAuthenticated: false,
  token: '',
  methods: [],
  errorMessage: ''
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case AUTH_SIGN_UP:
      console.log('[AuthReducer] got an AUTH_SIGN_UP action!')
      console.log('\n\naction.payload:\n', action.payload)
      return { ...state, token: action.payload.token, methods: action.payload.methods, isAuthenticated: true, errorMessage: '' }
    case AUTH_SIGN_IN:
      console.log('[AuthReducer] got an AUTH_SIGN_IN action!')
      return { ...state, token: action.payload.token, methods: action.payload.methods, isAuthenticated: true, errorMessage: '' }
    case AUTH_SIGN_OUT:
      console.log('[AuthReducer] got an AUTH_SIGN_OUT action!')
      return { ...state, token: action.payload.token, methods: [], isAuthenticated: false, errorMessage: '' }
    case AUTH_ERROR:
      console.log('[AuthReducer] got an AUTH_ERROR action!')
      return { ...state, errorMessage: action.payload }
    default:
      return state
  }
}
