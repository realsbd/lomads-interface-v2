import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
    return {
        project: null
    };
}

const ProjectReducer = (state: any = getInitialState(), action: any) =>
    produce(state, (draft: any) => {
        const { payload } = action;
        switch (action.type) {
            case actionTypes.SET_PROJECT_ACTION: {
                draft.project = payload;
                break;
            }
        }
    });

export default ProjectReducer;
