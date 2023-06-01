import {
	call,
	put,
	takeLatest
} from 'redux-saga/effects';
import * as actionTypes from 'store/actionTypes';
import { get as _get } from 'lodash';
import { loadTreasuryService } from 'store/services/treasury'

function* loadTreasurySage(action:any) {
	try {
	  yield put({ type: actionTypes.LOAD_TREASURY_LOADING, payload: true })
	  const { data } = yield call(loadTreasuryService, action.payload)
	  console.log('json, response', data)
		yield put({ type: actionTypes.LOAD_TREASURY_LOADING, payload: false })
		yield put({ type: actionTypes.SET_TREASURY, payload: data })
		yield put({ type: actionTypes.LOAD_TREASURY_LOADING, payload: null })
	} catch (e) {

	}
  }

export default function* treasurySaga() {
	yield takeLatest(actionTypes.LOAD_TREASURY_ACTION, loadTreasurySage)
}