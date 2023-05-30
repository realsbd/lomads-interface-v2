import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
    return {
        createTaskLoading: false,
        draftTaskLoading: false,
    };
}

const TaskReducer = (state: any = getInitialState(), action: any) =>
    produce(state, (draft: any) => {
        const { payload } = action;
        switch (action.type) {

            case actionTypes.CREATE_TASK_LOADING: {
                draft.createTaskLoading = payload;
                break;
            }

            case actionTypes.DRAFT_TASK_LOADING: {
                draft.draftTaskLoading = payload;
                break;
            }

        }
    });

export default TaskReducer;
