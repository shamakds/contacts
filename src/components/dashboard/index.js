import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {contact} from "../../apiClient";
import {bindActionCreators} from "redux";
import {loadingContacts, loadContacts, addContact} from "../../store/actions/contactActions";
import ContactListItem from "../contactListItem";
import ContactPreview from "../contactPreview";
import ContactEditor from "../contactEditor";

require("./style.scss");

function mapStateToProps(globalState, ownProps) {
    const { contacts: { editMode = false, records, selectedContact } } = globalState;

    return {
        ...ownProps,
        contacts: records,
        selectedContact,
        editMode
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({loadingContacts, loadContacts, addContact}, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Dashboard extends Component {
    static displayName = "Dashboard";
    static propTypes = {
        contacts: PropTypes.array,
        selectedContact: PropTypes.object,
        editMode: PropTypes.bool.isRequired,
        loadingContacts: PropTypes.func.isRequired,
        loadContacts: PropTypes.func.isRequired,
    };
    static defaultProps = {
        contacts: [],
        selectedContact: null
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedContactID: null,
            showList: true
        };
    }

    componentDidMount() {
        const {loadingContacts, loadContacts} = this.props;

        loadingContacts();
        contact.get().then(loadContacts)
    }

    addContact = () => {
        const { addContact } = this.props;

        addContact();
    };

    renderSelectedContact = () => {
        const {selectedContact} = this.props;

        if (!selectedContact) {
            return null;
        }

        return <ContactPreview {...selectedContact} />;
    };

    renderEditContact = () => {
        const {selectedContact} = this.props;

        if (!selectedContact) {
            return null;
        }

        return <ContactEditor item={selectedContact}/>;
    };

    expandList = (show) => {
        const { showList } = this.state;

        this.setState({
            showList: show || !showList
        });
    };

    renderContactsList = () => {
        const {contacts, selectedContact} = this.props;
        const { showList } = this.state;

        return (<div className={`z-list${showList ? " active" : ""}`}>
            <div className="z-search-wrapper">
                <input autoFocus disabled title="Sorry, this feature is not allowed in trial version" type="text"
                       placeholder="Search"/>
            </div>
            <div className="z-toggle-btn" onClick={e => this.expandList()}>
                <em className="fas fa-bars" />
            </div>
            {
                contacts.map((contact) => {
                    return (<ContactListItem
                        key={contact.id}
                        {...contact}
                        onSelect={() => this.expandList(false)}
                        selected={selectedContact && selectedContact.id === contact.id}
                    />);
                })
            }
            <div className="z-contact-add-btn" title="Add contact" onClick={this.addContact}>
                <em className="fas fa-user-plus"/>
            </div>
        </div>);
    };

    render() {
        const {editMode, selectedContact} = this.props;
        return (<div className="z-dashboard">
            { this.renderContactsList() }
            {
                selectedContact ? <div className="z-dashboard-content">{
                    editMode ? this.renderEditContact() : this.renderSelectedContact()
                }</div> : null
            }
        </div>);
    }
}
