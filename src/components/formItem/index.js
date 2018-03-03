import React, { Component, PropTypes } from "react";

require("./style.scss");

export default class Z extends Component {
  static displayName = "FormItem";
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    custom: PropTypes.bool,
  };
  static defaultProps = {
    value: "",
    custom: false
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      deleted: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
        value: newProps.value
    });
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value || ""
    });
  };

  undo = () => {
    this.setState({
        deleted: false
    });
  };

  removeItem = () => {
      this.setState({
          deleted: true
      });
  };

  renderUndo = () => {
      return (<div className="z-form-group-item">
        <div className="z-form-group-item-undo-btn" onClick={this.undo} title="undo">
          <em className="fas fa-undo-alt" />
        </div>
      </div>);
  };

  renderContent = () => {
    const { fieldId, label, custom } = this.props;
    const { value } = this.state;

    return (<div className="z-form-group-item">
      <label htmlFor={fieldId} className="z-label">{label || "no label"}</label>
      <input id={fieldId} type="text" data-attr-label={label} value={value} placeholder="no value" onChange={this.onChange} />
      {
        custom ?
            <div className="z-form-group-item-delete-btn" onClick={this.removeItem} title="delete field" >
              <em className="fas fa-trash-alt" />
            </div> : null
      }
    </div>);
  };

  render() {
    const { deleted } = this.state;

    return deleted ? this.renderUndo() : this.renderContent();
  }
}
