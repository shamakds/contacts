import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {finishEditContact, submitContact} from '../../store/actions/contactActions'
import {getFormData, getUniqueId, normalizeContactData} from '../../helpers/form';
import {toCamelCase} from '../../helpers/string';
import {REQUIRED_CONTACT_PROPS} from '../../constants/contact';
import {contact as contactAPI} from '../../apiClient';
import FormItem from '../formItem';
import FormImage from '../formImage';
import './style.scss';

function mapStateToProps(globalState, ownProps) {
    const {contacts: {selectedContact, selectedContactID = null}} = globalState;
    const isNew = selectedContactID === null;

    return {...ownProps, isNew, selectedContact, selectedContactID};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({finishEditContact, submitContact}, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ContactEditor extends Component {
    static displayName = "ContactEditor";
    static propTypes = {
        selectedContact: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        const contact = normalizeContactData(props.selectedContact);
        this.state = {
            pending: false,
            editData: contact.info
        };
    }

    componentWillReceiveProps(newProps) {
        const contact = normalizeContactData(newProps.selectedContact);
        this.setState({
            editData: contact.info
        });
    }

    renderFormItemGroup = (data) => {
        return <FormItem key={data.fieldId} {...data} />;
    };

    addNewField = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();

        const {editData} = this.state;
        const fieldLabel = prompt("Field Label", "");
        const fieldId = toCamelCase(fieldLabel);
        const newField = {
            label: fieldLabel,
            value: null,
            custom: true
        };

        this.setState({
            editData: {
                ...editData,
                [fieldId]: newField
            }
        })
    };

    closeEdit = () => {
        const {finishEditContact, selectedContactID} = this.props;

        finishEditContact(selectedContactID);
    };

    deleteContact = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();

        const {submitContact, selectedContactID} = this.props;
        const confirmation = confirm("Delete contact? Are you sure?");

        if (!confirmation) {
            return;
        }

        this.setState({pending: true});

        contactAPI.delete(selectedContactID).then((response) => {
            this.setState({pending: false});
            submitContact(null, response.all);
            this.closeEdit();
        });
    };

    renderInformation = () => {
        const {editData: {image, ...rest}} = this.state;
        const required = REQUIRED_CONTACT_PROPS;
        const keys = Object.keys(rest);

        if (keys.length === 0) {
            return null;
        }

        let infoItem;
        return (<div className="z-form-group">{
            keys.map((key) => {
                infoItem = rest[key];
                return this.renderFormItemGroup({
                    fieldId: key,
                    required: required.indexOf(key) >= 0,
                    ...infoItem
                });
            })
        }</div>);
    };

    renderImage = () => {
        const {editData: {image}} = this.state;

        return (<div className="z-form-group">
            <FormImage fieldId="image" {...image} />
        </div>);
    };

    renderFormControls = () => {
        const {isNew} = this.props;

        return (<div className="z-form-controls">
            <button type="submit" value="Submit">Save</button>
            <button onClick={this.addNewField}>Add New Field</button>
            <button type="reset" value="Reset" onClick={this.closeEdit}>Cancel</button>
            {isNew ? null : <button type="delete" value="Delete" onClick={this.deleteContact}>Delete Contact</button>}
        </div>);
    };

    onSubmit = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        const {submitContact, selectedContactID, isNew} = this.props;
        const form = this.refs.form;
        const contact = {
            id: selectedContactID || getUniqueId('contact_'),
            info: getFormData(form)
        };
        const requestType = isNew ? "post" : "update";

        this.setState({pending: true});

        contactAPI[requestType](contact).then((response) => {
            this.setState({pending: false});
            submitContact(response.data, response.all);
            this.closeEdit();
        })
    };

    render() {
        return (<div className="z-contact-form">
            <form
                ref="form"
                onSubmit={this.onSubmit}>
                {this.renderImage()}
                {this.renderInformation()}
                {this.renderFormControls()}
            </form>
        </div>);
    }
}
