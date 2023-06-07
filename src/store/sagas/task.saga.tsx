import {
    call,
    put,
    takeLatest
} from 'redux-saga/effects';
import * as actionTypes from 'store/actionTypes';
import { get as _get } from 'lodash';
import {
    applyTaskService,
    archiveTaskService,
    assignTaskService,
    createTaskService,
    deleteTaskService,
    draftTaskService,
    getTaskService,
    rejectTaskMemberService,
    submitTaskService
}
    from 'store/services/task';

function* getTaskSaga(action: any) {
    try {
        yield put({ type: actionTypes.SET_TASK_LOADING, payload: true })
        const { data } = yield call(getTaskService, action.payload);
        yield put({ type: actionTypes.SET_TASK_ACTION, payload: data })
        yield put({ type: actionTypes.SET_TASK_LOADING, payload: false })
    } catch (e) {

    }
}

function* createTaskSaga(action: any) {
    try {
        yield put({ type: actionTypes.CREATE_TASK_LOADING, payload: true })
        const { data } = yield call(createTaskService, action.payload)
        console.log("data : ")
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data.project })
        yield put({ type: actionTypes.CREATE_TASK_LOADING, payload: false })
    } catch (e) {

    }
}

function* draftTaskSaga(action: any) {
    try {
        yield put({ type: actionTypes.DRAFT_TASK_LOADING, payload: true })
        const { data } = yield call(draftTaskService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data.project })
        yield put({ type: actionTypes.DRAFT_TASK_LOADING, payload: false })
    } catch (e) {

    }
}

function* archiveTaskSaga(action: any) {
    try {
        yield put({ type: actionTypes.ARCHIVE_TASK_LOADING, payload: true })
        const { data } = yield call(archiveTaskService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data.project })
        yield put({ type: actionTypes.SET_TASK_ACTION, payload: data.task })
        yield put({ type: actionTypes.ARCHIVE_TASK_LOADING, payload: false })
    } catch (e) {

    }
}

function* deleteTaskSaga(action: any) {
    try {
        yield put({ type: actionTypes.DELETE_TASK_LOADING, payload: true })
        const { data } = yield call(deleteTaskService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data.project })
        yield put({ type: actionTypes.SET_TASK_ACTION, payload: data.task })
        yield put({ type: actionTypes.DELETE_TASK_LOADING, payload: false })
    } catch (e) {

    }
}

function* applyTaskSaga(action: any) {
    try {
        yield put({ type: actionTypes.APPLY_TASK_LOADING, payload: true })
        const { data } = yield call(applyTaskService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_TASK_ACTION, payload: data.task })
        yield put({ type: actionTypes.APPLY_TASK_LOADING, payload: false })
    } catch (e) {

    }
}

function* submitTaskSaga(action: any) {
    try {
        yield put({ type: actionTypes.SUBMIT_TASK_LOADING, payload: true })
        const { data } = yield call(submitTaskService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_TASK_ACTION, payload: data.task })
        yield put({ type: actionTypes.SUBMIT_TASK_LOADING, payload: false })
    } catch (e) {

    }
}

function* assignTaskSaga(action: any) {
    try {
        yield put({ type: actionTypes.ASSIGN_TASK_LOADING, payload: true })
        const { data } = yield call(assignTaskService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_TASK_ACTION, payload: data.task })
        yield put({ type: actionTypes.ASSIGN_TASK_LOADING, payload: false })
    } catch (e) {

    }
}

function* rejectTaskMemberSaga(action: any) {
    try {
        yield put({ type: actionTypes.REJECT_TASK_MEMBER_LOADING, payload: true })
        const { data } = yield call(rejectTaskMemberService, action.payload)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data.dao })
        yield put({ type: actionTypes.SET_TASK_ACTION, payload: data.task })
        yield put({ type: actionTypes.REJECT_TASK_MEMBER_LOADING, payload: false })
    } catch (e) {

    }
}

export default function* taskSaga() {
    yield takeLatest(actionTypes.GET_TASK_ACTION, getTaskSaga)
    yield takeLatest(actionTypes.CREATE_TASK_ACTION, createTaskSaga)
    yield takeLatest(actionTypes.DRAFT_TASK_ACTION, draftTaskSaga)
    yield takeLatest(actionTypes.ARCHIVE_TASK_ACTION, archiveTaskSaga)
    yield takeLatest(actionTypes.DELETE_TASK_ACTION, deleteTaskSaga)
    yield takeLatest(actionTypes.APPLY_TASK_ACTION, applyTaskSaga)
    yield takeLatest(actionTypes.SUBMIT_TASK_ACTION, submitTaskSaga)
    yield takeLatest(actionTypes.ASSIGN_TASK_ACTION, assignTaskSaga)
    yield takeLatest(actionTypes.REJECT_TASK_MEMBER_ACTION, rejectTaskMemberSaga)
}