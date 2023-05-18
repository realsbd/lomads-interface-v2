import {combineReducers} from 'redux';
import sessionReducer from './session';
import DAOReducer from './dao';
import {persistReducer} from 'redux-persist';
import localforage from 'localforage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

// const isRemember = async()=> await getValue(REMEBER_DATA)

const rootPersistConfig = {
  key: 'root',
  version: 0,
  storage: localforage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['session'],
};


const rootReducer: any = combineReducers({
  session: sessionReducer,
  dao: DAOReducer
});

export default persistReducer(rootPersistConfig, rootReducer);
