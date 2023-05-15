import * as actionTypes from '../actionTypes'

export const setTokenAction = (payload: string | null) => {
    return {
        type: actionTypes.SET_TOKEN_ACTION,
        payload
    }
}

export const setUserAction = (payload: string | null) => {
    return {
        type: actionTypes.SET_USER_ACTION,
        payload
    }
}

export const createAccountAction = (payload: any | null) => {
    return {
        type: actionTypes.CREATE_ACCOUNT_ACTION,
        payload
    }
}

export const setNetworkConfig = (payload: any) => {
    return {
        type: actionTypes.SET_NETWORK_CONFIG,
        payload
    }
}

export const logoutAction = () => {
    return {
        type: actionTypes.LOGOUT_ACTION
    }
}
