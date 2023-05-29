import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
    return {
        Project: null,
        setProjectLoading: false,
        createProjectLoading: false,
        updateProjectDetailsLoading: false,
        archiveProjectLoading: false,
        deleteProjectLoading: false,
        updateProjectKraLoading: false,
        editProjectKraLoading: false,
        editProjectMilestonesLoading: false,
        updateProjectMembersLoading: false,
        inviteProjectMembersLoading: false,
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

            case actionTypes.UPDATE_PROJECT_DETAILS_LOADING: {
                draft.updateProjectDetailsLoading = payload;
                break;
            }

            case actionTypes.ARCHIVE_PROJECT_LOADING: {
                draft.archiveProjectLoading = payload;
                break;
            }

            case actionTypes.DELETE_PROJECT_LOADING: {
                draft.deleteProjectLoading = payload;
                break;
            }

            case actionTypes.UPDATE_PROJECT_KRA_LOADING: {
                draft.updateProjectKraLoading = payload;
                break;
            }

            case actionTypes.EDIT_PROJECT_KRA_LOADING: {
                draft.editProjectKraLoading = payload;
                break;
            }

            case actionTypes.EDIT_PROJECT_MILESTONES_LOADING: {
                draft.editProjectMilestonesLoading = payload;
                break;
            }

            case actionTypes.UPDATE_PROJECT_MEMBERS_LOADING: {
                draft.updateProjectMembersLoading = payload;
                break;
            }

            case actionTypes.INVITE_PROJECT_MEMBERS_LOADING: {
                draft.inviteProjectMembersLoading = payload;
                break;
            }

        }
    });

export default ProjectReducer;
