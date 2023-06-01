import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
  return {
    treasuryLoading: null,
    treasury: null
  };
}

const TreasuryReducer = (state: any = getInitialState(), action: any) =>
  produce(state, (draft: any) => {
    const { payload } = action;
    switch (action.type) {
        case actionTypes.LOAD_TREASURY_LOADING: {
            draft.treasuryLoading = payload
            break;
        }
        case actionTypes.SET_TREASURY: {
            draft.treasury = payload
            draft.treasuryLoading = null
            break;
        }
    }
  });

export default TreasuryReducer;
