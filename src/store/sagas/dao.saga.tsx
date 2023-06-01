import {
	call,
	put,
	takeLatest
} from 'redux-saga/effects';
import * as actionTypes from 'store/actionTypes';
import { get as _get } from 'lodash';
import { loadDAOListService, loadDAOService } from 'store/services/dao';

function* loadDAOListSaga() {
	try {
        yield put({ type: actionTypes.LOAD_DAOLIST_LOADING, payload: true })
        const { data } = yield call(loadDAOListService)
        console.log('json, response', data)
          yield put({ type: actionTypes.LOAD_DAOLIST_LOADING, payload: false })
          yield put({ type: actionTypes.LOAD_DAOLIST_SUCCESS, payload: data })
      } catch (e) {
        console.log(e)
        yield put({ type: actionTypes.LOAD_DAOLIST_LOADING, payload: false })
      }
}

function* loadDAOSaga(action:any) {
	try {
        yield put({ type: actionTypes.LOAD_DAO_LOADING, payload: true })
        const { data } = yield call(loadDAOService, action.payload)
        console.log('json, response', data)
          yield put({ type: actionTypes.LOAD_DAO_LOADING, payload: false })
          yield put({ type: actionTypes.LOAD_DAO_SUCCESS, payload: data })
      } catch (e) {
        console.log(e)
        yield put({ type: actionTypes.LOAD_DAOLIST_LOADING, payload: false })
      }
}

export default function* daoSaga() {
	yield takeLatest(actionTypes.LOAD_DAOLIST_ACTION, loadDAOListSaga)
  yield takeLatest(actionTypes.LOAD_DAO_ACTION, loadDAOSaga)
}