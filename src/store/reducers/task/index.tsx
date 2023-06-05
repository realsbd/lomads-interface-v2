import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
    return {
        Task: null,
        setTaskLoading: false,
        createTaskLoading: false,
        draftTaskLoading: false,
        archiveTaskLoading: false,
        deleteTaskLoading: false,
    };
}

const TaskReducer = (state: any = getInitialState(), action: any) =>
    produce(state, (draft: any) => {
        const { payload } = action;
        switch (action.type) {

            case actionTypes.SET_TASK_LOADING: {
                draft.setTaskLoading = payload;
                break;
            }

            case actionTypes.SET_TASK_ACTION: {
                draft.Task = payload;
                break;
            }

            case actionTypes.CREATE_TASK_LOADING: {
                draft.createTaskLoading = payload;
                break;
            }

            case actionTypes.DRAFT_TASK_LOADING: {
                draft.draftTaskLoading = payload;
                break;
            }

            case actionTypes.ARCHIVE_TASK_LOADING: {
                draft.archiveTaskLoading = payload;
                break;
            }

            case actionTypes.DELETE_TASK_LOADING: {
                draft.deleteTaskLoading = payload;
                break;
            }

        }
    });

export default TaskReducer;
