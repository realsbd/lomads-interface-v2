import {
	call,
	put,
	takeLatest
} from 'redux-saga/effects';
import * as actionTypes from 'store/actionTypes';
import { get as _get } from 'lodash';
import { loadDAOListService, loadDAOService, updateDAOService, addDAOMemberService } from 'store/services/dao';

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

function* updateDAOSaga(action:any) {
	try {
        yield put({ type: actionTypes.UPDATE_DAO_LOADING, payload: true })
        const { data } = yield call(updateDAOService, action.payload)
        console.log('json, response', data)
        yield put({ type: actionTypes.UPDATE_DAO_LOADING, payload: false })
        yield call(() => new Promise(resolve => setTimeout(resolve, 200)))
        yield put({ type: actionTypes.LOAD_DAO_SUCCESS, payload: data })
        yield put({ type: actionTypes.UPDATE_DAO_LOADING, payload: null })
      } catch (e) {
        console.log(e)
        yield put({ type: actionTypes.UPDATE_DAO_LOADING, payload: null })
      }
}


function* addDAOMemberSaga(action:any) {
	try {
        const { data } = yield call(addDAOMemberService, action.payload)
        console.log('json, response', data)
        yield put({ type: actionTypes.UPDATE_DAO_LOADING, payload: false })
        yield put({ type: actionTypes.LOAD_DAO_SUCCESS, payload: data })
      } catch (e) {
        console.log(e)
      }
}

export default function* daoSaga() {
	yield takeLatest(actionTypes.LOAD_DAOLIST_ACTION, loadDAOListSaga)
  yield takeLatest(actionTypes.LOAD_DAO_ACTION, loadDAOSaga)
  yield takeLatest(actionTypes.UPDATE_DAO_ACTION, updateDAOSaga)
  yield takeLatest(actionTypes.ADD_DAO_MEMBER_ACTION, addDAOMemberSaga)
}