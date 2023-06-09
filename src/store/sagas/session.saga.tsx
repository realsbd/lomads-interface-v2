import {
	call,
	put,
	takeLatest
} from 'redux-saga/effects';
import * as actionTypes from 'store/actionTypes';
import { get as _get } from 'lodash';
import { createAccountService, updateAccountService } from 'store/services/session'

function* createAccountSaga(action: any) {
	try {
		yield put({ type: actionTypes.CREATE_ACCOUNT_LOADING, payload: true })
		const { data } = yield call(createAccountService, action.payload.token)
		console.log('json, response', data)
		yield put({ type: actionTypes.CREATE_ACCOUNT_LOADING, payload: false })
		yield put({ type: actionTypes.SET_TOKEN_ACTION, payload: action.payload })
		yield put({ type: actionTypes.SET_USER_ACTION, payload: data })
		yield put({ type: actionTypes.CREATE_ACCOUNT_LOADING, payload: null })
	} catch (e) {

	}
}

function* updateAccountSaga(action: any) {
	try {
		const { data } = yield call(updateAccountService, action.payload)
		console.log('json, response', data)
		yield put({ type: actionTypes.SET_USER_ACTION, payload: data })
	} catch (e) {

	}
}

function* updateUserSaga(action: any) {
	try {
		const { data } = yield call(updateAccountService, action.payload)
		console.log('json, response', data)
		yield put({ type: actionTypes.SET_USER_ACTION, payload: data })
		yield put({ type: actionTypes.SET_DAO_MEMBER_ACTION, payload: data })
	} catch (e) {

	}
}

export default function* sessionSaga() {
	yield takeLatest(actionTypes.CREATE_ACCOUNT_ACTION, createAccountSaga)
	yield takeLatest(actionTypes.UPDATE_ACCOUNT_ACTION, updateAccountSaga)
	yield takeLatest(actionTypes.UPDATE_USER_ACTION, updateUserSaga)
}