import {
    call,
    put,
    takeLatest
} from 'redux-saga/effects';
import * as actionTypes from 'store/actionTypes';
import { get as _get } from 'lodash';
import { createTaskService, draftTaskService } from 'store/services/task'

function* createTaskSaga(action: any) {
    try {
        yield put({ type: actionTypes.CREATE_TASK_LOADING, payload: true })
        const { data } = yield call(createTaskService, action.payload)
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

export default function* taskSaga() {
    yield takeLatest(actionTypes.CREATE_TASK_ACTION, createTaskSaga)
    yield takeLatest(actionTypes.DRAFT_TASK_ACTION, draftTaskSaga)
}