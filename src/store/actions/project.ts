import * as actionTypes from '../actionTypes'

export const createProjectAction = (payload: any) => {
    return {
        type: actionTypes.CREATE_PROJECT_ACTION,
        payload
    }
}
