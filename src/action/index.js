import * as types from './types'

export const setLoginStatus = (status) => {
    return {
        type: types.SET_LOGIN_STATUS,
        status
    }
}