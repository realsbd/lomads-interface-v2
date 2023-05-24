import * as actionTypes from '../actionTypes'

export const loadDAOListAction = () => {
    return {
        type: actionTypes.LOAD_DAOLIST_ACTION
    }
}

export const resetDAOAction = () => {
    return {
        type: actionTypes.RESET_DAO_ACTION
    }
}

export const loadDAOAction = (payload: string | null) => {
    return {
        type: actionTypes.LOAD_DAO_ACTION,
        payload
    }
}

export const setDAOAction = (payload: any) => {
    return {
        type: actionTypes.SET_DAO_ACTION,
        payload
    }
}
