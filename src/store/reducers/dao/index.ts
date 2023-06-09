import produce from 'immer';
import { get as _get } from 'lodash'
import * as actionTypes from 'store/actionTypes';


export function getInitialState() {
	return {
		DAOLoading: false,
		DAOListLoading: false,
		DAO: null,
		DAOList: null,
		updateDAOLoading: null,
		addSingleMemberLoading: null,
		addMultiMemberLoading: null,
		editDaoMemberLoading: null,
		updateDaoMembersLoading: null,
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
			case actionTypes.UPDATE_DAO_LOADING: {
				draft.updateDAOLoading = payload
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
			case actionTypes.SET_DAO_MEMBER_ACTION: {
				draft.DAO = {
					...(draft.DAO ? draft.DAO : {}),
					members: _get(draft, 'DAO.members', []).map((member: any) => {
						if (member.member._id === action.payload._id)
							return { ...member, member: action.payload };
						return member;
					})
				}
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
			case actionTypes.ADD_SINGLE_MEMBER_LOADING: {
				draft.addSingleMemberLoading = payload;
				break;
			}
			case actionTypes.ADD_MULTI_MEMBER_LOADING: {
				draft.addMultiMemberLoading = payload;
				break;
			}
			case actionTypes.EDIT_DAO_MEMBER_LOADING: {
				draft.editDaoMemberLoading = payload;
				break;
			}
			case actionTypes.UPDATE_DAO_MEMBERS_LOADING: {
				draft.updateDaoMembersLoading = payload;
				break;
			}
		}
	});

export default DAOReducer;
