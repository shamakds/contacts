import * as types from '../../constants/ActionTypes';
import find from "lodash/find";

export default function (state = {}, action) {
    let selectedContact;
    switch (action.type) {

        case types.LOADING_CONTACTS:
            return {
                ...state,
                loading: action.loading
            };

        case types.LOAD_CONTACTS:
            return {
                ...state,
                loading: action.loading,
                records: action.records
            };

        case types.ADD_CONTACT:
            return {
                ...state,
                editMode: true,
                selectedContactID: null,
                selectedContact: action.data
            };

        case types.DELETE_CONTACT:
            return {
                ...state
            };

        case types.EDIT_CONTACT:
            return {
                ...state,
                editMode: true
            };

        case types.SUBMIT_CONTACT:
            return {
                ...state,
                selectedContactID: action.data ? action.data.id : null,
                selectedContact: action.data,
                records: action.records
            };

        case types.FINISH_EDIT_CONTACT:
            selectedContact = action.id !== null ? state.selectedContact : null;
            return {
                ...state,
                selectedContactID: action.id,
                selectedContact,
                editMode: false
            };

        case types.SELECT_CONTACT:
            selectedContact = find(state.records, o => o.id === action.id) || null;
            return {
                ...state,
                selectedContact,
                selectedContactID: action.id
            };

        default:
            return state;
    }
}