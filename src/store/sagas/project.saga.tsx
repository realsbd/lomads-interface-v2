import {
    call,
    put,
    takeLatest
} from 'redux-saga/effects';
import * as actionTypes from 'store/actionTypes';
import { get as _get } from 'lodash';
import { createProjectService, getProjectService } from 'store/services/project'

function* getProjectSaga(action: any) {
    try {
        yield put({ type: actionTypes.SET_PROJECT_LOADING, payload: true })
        const { data } = yield call(getProjectService, action.payload);
        yield put({ type: actionTypes.SET_PROJECT_ACTION, payload: data })
        yield put({ type: actionTypes.SET_PROJECT_LOADING, payload: false })
    } catch (e) {

    }
}

function* createProjectSaga(action: any) {
    try {
        yield put({ type: actionTypes.CREATE_PROJECT_LOADING, payload: true })
        const { data } = yield call(createProjectService, action.payload)
        console.log('json, response', data)
        yield put({ type: actionTypes.SET_DAO_ACTION, payload: data })
        yield put({ type: actionTypes.CREATE_PROJECT_LOADING, payload: false })
    } catch (e) {

    }
}

export default function* projectSaga() {
    yield takeLatest(actionTypes.GET_PROJECT_ACTION, getProjectSaga)
    yield takeLatest(actionTypes.CREATE_PROJECT_ACTION, createProjectSaga)
}