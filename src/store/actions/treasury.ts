import * as actionTypes from '../actionTypes'

export const loadTreasuryAction = (payload: any) => {
    return {
        type: actionTypes.LOAD_TREASURY_ACTION,
        payload
    }
}