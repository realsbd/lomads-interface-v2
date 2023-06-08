import {
    call,
    put,
    takeLatest
} from 'redux-saga/effects';
import * as actionTypes from 'store/actionTypes';
import { get as _get } from 'lodash';
import {
    archiveProjectService,
    createProjectService,
    deleteProjectService,
    editProjectKraService,
    editProjectMilestonesService,
    getProjectService,
    inviteProjectMembersService,
    updateProjectDetailsService,
    updateProjectKraService,
    updateProjectMembersService
} from 'store/services/project'

function* getProjectSaga(action: any) {
    try {
        yield put({ type: actionTypes.SET_PROJECT_LOADING, payload: true })
        const { data } = yield call(getProjectService, action.payload);
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data })
        yield put({ type: actionTypes.SET_PROJECT_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 2000)))
        yield put({ type: actionTypes.SET_PROJECT_LOADING, payload: null })
    } catch (e) {
        yield put({ type: actionTypes.SET_PROJECT_LOADING, payload: null })
    }
}

function* createProjectSaga(action: any) {
    try {
        yield put({ type: actionTypes.CREATE_PROJECT_LOADING, payload: true })
        const { data } = yield call(createProjectService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data })
        yield put({ type: actionTypes.CREATE_PROJECT_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 2000)))
        yield put({ type: actionTypes.CREATE_PROJECT_LOADING, payload: null })
    }
    catch (e) {
        yield put({ type: actionTypes.CREATE_PROJECT_LOADING, payload: null })
    }
}

function* updateProjectDetailsSaga(action: any) {
    try {
        yield put({ type: actionTypes.UPDATE_PROJECT_DETAILS_LOADING, payload: true })
        const { data } = yield call(updateProjectDetailsService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data.project })
        yield put({ type: actionTypes.UPDATE_PROJECT_DETAILS_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 2000)))
        yield put({ type: actionTypes.UPDATE_PROJECT_DETAILS_LOADING, payload: null })
    } catch (e) {
        yield put({ type: actionTypes.UPDATE_PROJECT_DETAILS_LOADING, payload: null })
    }
}

function* archiveProjectSaga(action: any) {
    try {
        yield put({ type: actionTypes.ARCHIVE_PROJECT_LOADING, payload: true })
        const { data } = yield call(archiveProjectService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data.project })
        yield put({ type: actionTypes.ARCHIVE_PROJECT_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 2000)))
        yield put({ type: actionTypes.ARCHIVE_PROJECT_LOADING, payload: null })
    } catch (e) {
        yield put({ type: actionTypes.ARCHIVE_PROJECT_LOADING, payload: null })
    }
}

function* deleteProjectSaga(action: any) {
    try {
        yield put({ type: actionTypes.DELETE_PROJECT_LOADING, payload: true })
        const { data } = yield call(deleteProjectService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data.project })
        yield put({ type: actionTypes.DELETE_PROJECT_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 2000)))
        yield put({ type: actionTypes.DELETE_PROJECT_LOADING, payload: null })
    } catch (e) {
        yield put({ type: actionTypes.DELETE_PROJECT_LOADING, payload: null })
    }
}

function* updateProjectKraSaga(action: any) {
    try {
        yield put({ type: actionTypes.UPDATE_PROJECT_KRA_LOADING, payload: true })
        const { data } = yield call(updateProjectKraService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data.project })
        yield put({ type: actionTypes.UPDATE_PROJECT_KRA_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 2000)))
        yield put({ type: actionTypes.UPDATE_PROJECT_KRA_LOADING, payload: null })
    } catch (e) {
        yield put({ type: actionTypes.UPDATE_PROJECT_KRA_LOADING, payload: null })
    }
}

function* editProjectKraSaga(action: any) {
    try {
        yield put({ type: actionTypes.EDIT_PROJECT_KRA_LOADING, payload: true })
        const { data } = yield call(editProjectKraService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data.project })
        yield put({ type: actionTypes.EDIT_PROJECT_KRA_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 2000)))
        yield put({ type: actionTypes.EDIT_PROJECT_KRA_LOADING, payload: null })
    } catch (e) {
        yield put({ type: actionTypes.EDIT_PROJECT_KRA_LOADING, payload: null })
    }
}

function* editProjectMilestonesSaga(action: any) {
    try {
        yield put({ type: actionTypes.EDIT_PROJECT_MILESTONES_LOADING, payload: true })
        const { data } = yield call(editProjectMilestonesService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data.project })
        yield put({ type: actionTypes.EDIT_PROJECT_MILESTONES_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 2000)))
        yield put({ type: actionTypes.EDIT_PROJECT_MILESTONES_LOADING, payload: null })
    } catch (e) {
        yield put({ type: actionTypes.EDIT_PROJECT_MILESTONES_LOADING, payload: null })
    }
}

function* updateProjectMembersSaga(action: any) {
    try {
        yield put({ type: actionTypes.UPDATE_PROJECT_MEMBERS_LOADING, payload: true })
        const { data } = yield call(updateProjectMembersService, action.payload)
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data })
        yield put({ type: actionTypes.UPDATE_PROJECT_MEMBERS_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 2000)))
        yield put({ type: actionTypes.UPDATE_PROJECT_MEMBERS_LOADING, payload: null })
    } catch (e) {
        yield put({ type: actionTypes.UPDATE_PROJECT_MEMBERS_LOADING, payload: null })
    }
}

function* inviteProjectMembersSaga(action: any) {
    try {
        yield put({ type: actionTypes.INVITE_PROJECT_MEMBERS_LOADING, payload: true })
        const { data } = yield call(inviteProjectMembersService, action.payload)
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data })
        yield put({ type: actionTypes.INVITE_PROJECT_MEMBERS_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 2000)))
        yield put({ type: actionTypes.INVITE_PROJECT_MEMBERS_LOADING, payload: null })
    } catch (e) {
        yield put({ type: actionTypes.INVITE_PROJECT_MEMBERS_LOADING, payload: null })
    }
}

export default function* projectSaga() {
    yield takeLatest(actionTypes.GET_PROJECT_ACTION, getProjectSaga)
    yield takeLatest(actionTypes.CREATE_PROJECT_ACTION, createProjectSaga)
    yield takeLatest(actionTypes.UPDATE_PROJECT_DETAILS_ACTION, updateProjectDetailsSaga)
    yield takeLatest(actionTypes.ARCHIVE_PROJECT_ACTION, archiveProjectSaga)
    yield takeLatest(actionTypes.DELETE_PROJECT_ACTION, deleteProjectSaga)
    yield takeLatest(actionTypes.UPDATE_PROJECT_KRA_ACTION, updateProjectKraSaga)
    yield takeLatest(actionTypes.EDIT_PROJECT_KRA_ACTION, editProjectKraSaga)
    yield takeLatest(actionTypes.EDIT_PROJECT_MILESTONES_ACTION, editProjectMilestonesSaga)
    yield takeLatest(actionTypes.UPDATE_PROJECT_MEMBERS_ACTION, updateProjectMembersSaga)
    yield takeLatest(actionTypes.INVITE_PROJECT_MEMBERS_ACTION, inviteProjectMembersSaga)
}