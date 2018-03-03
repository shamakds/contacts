import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { finishEditContact, submitContact } from "../../store/actions/contactActions"
import { getFormData, getUniqueId } from "../../helpers/form";
import { toCamelCase } from "../../helpers/string";
import { contact as contactAPI } from "../../apiClient";
import FormItem from "../formItem";
import FormImage from "../formImage";

require("./style.scss");

function mapStateToProps(globalState, ownProps) {
    const selectedContactID = globalState.contacts.selectedContactID || null;
    const isNew = selectedContactID === null;
    return { ...ownProps, isNew, selectedContactID };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ finishEditContact, submitContact }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ContactEditor extends Component {
  static displayName = "ContactEditor";
  static propTypes = {
    item: PropTypes.object.isRequired
  };
  static defaultProps = {
    info: {},
    image: {
      src: "https://i.pinimg.com/564x/c2/6a/68/c26a68b699ddeda90ea6d434149595c2.jpg"
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      editData: this.props.item.info
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
        editData: newProps.item.info
    });
  }

  renderFormItemGroup = (data) => {
    return <FormItem key={data.fieldId} {...data} />;
  };

  addNewField = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    const { editData } = this.state;
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
      const { finishEditContact, item: { id } } = this.props;

      finishEditContact(id || null);
  };

  deleteContact = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();

      const { submitContact, item: { id } } = this.props;
      const confirmation = confirm("Delete contact? Are you sure?");

      if (!confirmation) {
        return;
      }

      this.setState({ pending: true });

      contactAPI.delete(id).then((response) => {
          this.setState({ pending: false });
          submitContact(null, response.all);
          this.closeEdit();
      });
  };

  renderInformation = () => {
    const { editData: { image, ...rest } } = this.state;
    const keys = Object.keys(rest);

    if (keys.length === 0) {
      return null;
    }

    let infoItem;
    return (<div className="z-form-group">{
      keys.map((key) => {
          infoItem = rest[key];
          return this.renderFormItemGroup({ fieldId: key, ...infoItem });
      })
    }</div>);
  };

  renderImage = () => {
    const { editData: { image } } = this.state;

    return (<div className="z-form-group">
      <FormImage fieldId="image" {...image} />
    </div>);
  };

  renderFormControls = () => {
    const { isNew } = this.props;

    return (<div className="z-form-controls">
      <button type="submit" value="Submit">Save</button>
      <button onClick={this.addNewField}>Add New Field</button>
      <button type="reset" value="Reset" onClick={this.closeEdit}>Cancel</button>
        { isNew ? null : <button type="delete" value="Delete" onClick={this.deleteContact}>Delete Contact</button> }
    </div>);
  };

  onSubmit = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    const { selectedContactID, submitContact, item: { id }, isNew } = this.props;
    const form = this.refs.form;
    const contact = {
      id: id || getUniqueId('contact_'),
      info: getFormData(form)
    };
    const requestType = isNew ? "post" : "update";

    this.setState({ pending: true });

    contactAPI[requestType](contact).then((response) => {
      this.setState({ pending: false });
      submitContact(response.data, response.all);
      this.closeEdit();
    })
  };

  render() {
    return (<div className="z-contact-form">
      <form
          ref="form"
          onSubmit={this.onSubmit}>
        { this.renderImage() }
        { this.renderInformation() }
        { this.renderFormControls() }
      </form>
    </div>);
  }
}
