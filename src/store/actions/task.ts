import * as actionTypes from '../actionTypes';


export const createTaskAction = (payload: any) => {
    return {
        type: actionTypes.CREATE_TASK_ACTION,
        payload
    }
}

export const draftTaskAction = (payload: any) => {
    return {
        type: actionTypes.DRAFT_TASK_ACTION,
        payload
    }
}
