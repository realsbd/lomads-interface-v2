import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
    return {
        Project: null,
        setProjectLoading: false,
        createProjectLoading: false
    };
}

const ProjectReducer = (state: any = getInitialState(), action: any) =>
    produce(state, (draft: any) => {
        const { payload } = action;
        switch (action.type) {

            case actionTypes.SET_PROJECT_LOADING: {
                draft.setProjectLoading = payload;
                break;
            }

            case actionTypes.SET_PROJECT_ACTION: {
                draft.Project = payload;
                break;
            }

            case actionTypes.CREATE_PROJECT_LOADING: {
                draft.createProjectLoading = payload;
                break;
            }
        }
    });

export default ProjectReducer;
