import * as actionTypes from '../actionTypes';

export const getTaskAction = (payload: string) => {
    return {
        type: actionTypes.GET_TASK_ACTION,
        payload
    }
}

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

export const archiveTaskAction = (payload: any) => {
    return {
        type: actionTypes.ARCHIVE_TASK_ACTION,
        payload
    }
}

export const deleteTaskAction = (payload: any) => {
    return {
        type: actionTypes.DELETE_TASK_ACTION,
        payload
    }
}
