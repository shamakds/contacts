import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {selectContact} from '../../store/actions/contactActions'

function mapStateToProps(globalState, ownProps) {
    return {...ownProps};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({selectContact}, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ContactListItem extends Component {
    static displayName = "ContactListItem";
    static propTypes = {
        selectContact: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired,
        selected: PropTypes.bool
    };
    static defaultProps = {
        selected: false
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    onSelect = () => {
        const {selectContact, onSelect, id} = this.props;
        onSelect();
        selectContact(id);
    };

    render() {
        const {selected, info: {name, surname}} = this.props;

        return (<div
            className={`z-contact-item${selected ? " selected" : ""}`}
            onClick={this.onSelect}
        >{`${name.value} ${surname.value}`}</div>);
    }
}
