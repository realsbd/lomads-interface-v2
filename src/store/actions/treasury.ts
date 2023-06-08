import * as actionTypes from '../actionTypes'

export const loadTreasuryAction = (payload: any) => {
    return {
        type: actionTypes.LOAD_TREASURY_ACTION,
        payload
    }
}

export const CreateTreasuryTransactionAction = (payload: any) => {
    return {
        type: actionTypes.CREATE_TREASURY_TRANSACTION_ACTION,
        payload
    }
}

export const updateTreasuryTransactionAction = (payload: any) => {
    return {
        type: actionTypes.UPDATE_TREASURY_TRANSACTION_ACTION,
        payload
    }
}

export const updateTxLabelAction = (payload: any) => {
    return {
        type: actionTypes.UPDATE_TX_LABEL_ACTION,
        payload
    } 
}

export const syncSafeAction = (payload: any) => {
    return {
        type: actionTypes.SYNC_SAFE_ACTION,
        payload
    } 
}