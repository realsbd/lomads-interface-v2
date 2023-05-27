import * as actionTypes from '../actionTypes';

export const getProjectAction = (payload: string) => {
    return {
        type: actionTypes.GET_PROJECT_ACTION,
        payload
    }
}

export const createProjectAction = (payload: any) => {
    return {
        type: actionTypes.CREATE_PROJECT_ACTION,
        payload
    }
}
