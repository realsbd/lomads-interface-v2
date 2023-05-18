import { applyMiddleware, compose } from 'redux';
import { createStore} from 'redux'
import rootReducer from 'store/reducers';
import createSagaMiddleware from 'redux-saga';
import sessionSaga from 'store/sagas/session.saga';
import daoSaga from './sagas/dao.saga';
import { persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import monitorReducerEnhancer from 'store/enhancers/monitorReducer'

export let persistor: any = null;

const configureStore = (initialState: any = {}) => {
  const middlewares = [];

  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  const middlewareEnhancer = composeWithDevTools(applyMiddleware(...middlewares));
  const enhancers = [middlewareEnhancer, monitorReducerEnhancer];
  const composedEnhancers: any = compose(...enhancers)
  const store = createStore(rootReducer, initialState, composedEnhancers);
  sagaMiddleware.run(sessionSaga);
  sagaMiddleware.run(daoSaga);
  persistor = persistStore(store);
  return store;
};

export default configureStore
