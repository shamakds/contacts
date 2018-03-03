import * as types from '../../constants/ActionTypes';
import { DEFAULT_CONTACT_PROPS } from "../../constants/contact";

export function loadingContacts() {
    return {
        type: types.LOADING_CONTACTS,
        loading: true
    };
}

export function loadContacts(contacts) {
    return {
        type: types.LOAD_CONTACTS,
        loading: false,
        records: contacts
    };
}

export function addContact() {
    return {
        type: types.ADD_CONTACT,
        data: {
            ...DEFAULT_CONTACT_PROPS
        }
    };
}

export function deleteContact(id) {
    return {
        type: types.DELETE_CONTACT,
        id
    };
}

export function editContact(id) {
    return {
        type: types.EDIT_CONTACT,
        id
    };
}

export function submitContact(data, records) {
    return {
        type: types.SUBMIT_CONTACT,
        data,
        records
    };
}

export function finishEditContact(id) {
    return {
        type: types.FINISH_EDIT_CONTACT,
        id
    };
}

export function selectContact(id) {
    return {
        type: types.SELECT_CONTACT,
        id
    };
}