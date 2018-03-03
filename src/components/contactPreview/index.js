import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { bindActionCreators } from "redux";
import { editContact } from "../../store/actions/contactActions"

require("./style.scss");

const DEFAULT_IMAGE_URL = "https://i.pinimg.com/564x/c2/6a/68/c26a68b699ddeda90ea6d434149595c2.jpg";

function mapStateToProps(globalState, ownProps) {
    return { ...ownProps };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editContact }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ContactPreview extends Component {
  static displayName = "ContactPreview";
  static propTypes = {
    image: PropTypes.object,
    info: PropTypes.object,
    editContact: PropTypes.func.isRequired,
  };
  static defaultProps = {
    info: {}
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  onEditClickHandler = () => {
    const { editContact, id } = this.props;
    editContact(id);
  };

  renderBanner = () => {
    const { createdOn, info: { image, name, surname } } = this.props;
    const style = {
      backgroundImage: `url("${image ? image.value : DEFAULT_IMAGE_URL}")`
    };
    return (<div
      className="z-banner"
      style={style}
    >
      <div className="z-full-name">
        <span className="capital-letter">{name.value}</span>
        <span className="capital-letter">{surname.value}</span>
        {
          createdOn ?
              <span className="z-created-on">Created on: {moment(createdOn).format('MMMM D, YYYY')}</span> :
              null
        }
      </div>
      <div className="z-edit-button" onClick={this.onEditClickHandler}>Edit</div>
    </div>);
  };

  renderInformation = () => {
    const { info: { image, name, surname, ...other } } = this.props;
    const keys = Object.keys(other);

    if (keys.length === 0) {
      return null;
    }
    let infoItem; let hasValue;
    return (<div className="z-contact-info">{
      keys.map((key) => {
        infoItem = other[key];
        hasValue = !!infoItem.value;
        return (<div className="z-contact-info-item">
          <p className="z-label">{infoItem.label || "no label"}</p>
          <p className={`z-value${hasValue ? "" : " no-value"}`}>{infoItem.value || "no value"}</p>
        </div>);
      })
    }</div>);
  };

  render() {
    const { socials = [] } = this.props;

    return (<div className="z-contact">
      { this.renderBanner() }
      { this.renderInformation() }
    </div>);
  }
}
