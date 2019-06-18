import { DASHBOARD_GET_DATA } from '../actions/types'

const DEFAULT_STATE = {
  secret: '',
  methods: []
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case DASHBOARD_GET_DATA:
      return { ...state, secret: action.payload.secret, methods: action.payload.method }
    default:
      return state
  }
}
