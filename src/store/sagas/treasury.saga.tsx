import {
	call,
	put,
	takeLatest
} from 'redux-saga/effects';
import * as actionTypes from 'store/actionTypes';
import { get as _get } from 'lodash';
import { loadTreasuryService, createTreasuryTransactionService, updateTxLabelService, updateTreasuryTransactionService } from 'store/services/treasury'

function* loadTreasurySaga(action:any) {
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

  function* createTreasuryTransactionSaga(action:any) {
	try {
	  const { data } = yield call(createTreasuryTransactionService, action.payload)
	  yield put({ type: actionTypes.APPEND_TREASURY_TRANSACTION, payload: data })
	  console.log('json, response', data)
	} catch (e) {

	}
  }

  function* updateTreasuryTransactionSaga(action:any) {
	try {
	  const { data } = yield call(updateTreasuryTransactionService, action.payload)
	  yield put({ type: actionTypes.UPDATE_TREASURY_TRANSACTION, payload: data })
	  console.log('json, response', data)
	} catch (e) {

	}
  }


  function* updateTxLabelAction(action:any) {
	try {
	  const { data } = yield call(updateTxLabelService, action.payload)
	  yield put({ type: actionTypes.SET_TX_LABEL, payload: data })
	  console.log('json, response', data)
	} catch (e) {

	}
  }

export default function* treasurySaga() {
	yield takeLatest(actionTypes.LOAD_TREASURY_ACTION, loadTreasurySaga)
	yield takeLatest(actionTypes.CREATE_TREASURY_TRANSACTION_ACTION, createTreasuryTransactionSaga)
	yield takeLatest(actionTypes.UPDATE_TREASURY_TRANSACTION_ACTION, updateTreasuryTransactionSaga)
	yield takeLatest(actionTypes.UPDATE_TX_LABEL_ACTION, updateTxLabelAction)
}