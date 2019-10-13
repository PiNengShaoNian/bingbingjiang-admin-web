import * as types from '../action/types'
import { storage } from '../common/js/utils'

const user = storage.get('user')
const initState = {
    loginStatus: user ? true : false,
    user: user
}

export default function (state = initState, action) {
    switch (action.type) {
        case types.SET_LOGIN_STATUS:
            return {
                ...state,
                loginStatus: action.status
            }
        default:
            return state
    }
}