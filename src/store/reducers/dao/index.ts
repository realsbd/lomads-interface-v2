import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
  return {
    DAOLoading: false,
    DAOListLoading: false,
    DAO: null,
    DAOList: null
  };
}

const DAOReducer = (state: any = getInitialState(), action: any) =>
  produce(state, (draft: any) => {
    const { payload } = action;
    switch (action.type) {
      case actionTypes.LOAD_DAOLIST_SUCCESS: {
        draft.DAOList = payload;
        draft.DAOListLoading = false
        break;
      }
      case actionTypes.LOAD_DAOLIST_LOADING: {
        draft.DAOListLoading = payload;
        break;
      }
      case actionTypes.LOAD_DAO_SUCCESS: {
        draft.DAO = payload;
        draft.DAOLoading = false
        break;
      }
      case actionTypes.LOAD_DAO_LOADING: {
        draft.DAOLoading = payload;
        break;
      }
      case actionTypes.SET_DAO_ACTION: {
        draft.DAO = payload;
        break;
      }
      case actionTypes.SET_DAO_OPTION_ACTION: {
        draft.DAO = { ...draft.DAO, options: payload };
        break;
      }
      case actionTypes.RESET_DAO_ACTION: {
        draft.DAO = null;
        draft.DAOLoading = false
        break;
      }
    }
  });

export default DAOReducer;
