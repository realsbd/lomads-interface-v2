import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
    return {
        project: null,
        createProjectLoading: false
    };
}

const ProjectReducer = (state: any = getInitialState(), action: any) =>
    produce(state, (draft: any) => {
        const { payload } = action;
        switch (action.type) {

            case actionTypes.CREATE_PROJECT_LOADING: {
                draft.createProjectLoading = payload;
                break;
            }
        }
    });

export default ProjectReducer;
