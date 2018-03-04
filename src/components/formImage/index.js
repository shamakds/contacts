import React, {Component, PropTypes} from 'react';
import {encodeImageFileAsURL} from '../../helpers/form';
import './style.scss';

export default class Z extends Component {
    static displayName = "FormItem";
    static propTypes = {
        fieldId: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.any,
    };
    static defaultProps = {
        value: ""
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            pending: false,
            deleted: false,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value
        });
    }

    onChange = (element) => {
        this.setState({
            pending: true
        });
        encodeImageFileAsURL(element).then((base64) => {
            this.setState({
                value: base64 || "",
                pending: false
            });
        });
    };

    cancelEvent = (ev) => {
        ev.preventDefault();

        return false;
    };

    onDropFile = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        this.onChange(ev.dataTransfer || ev.target);
    };

    chooseFile = () => {
        this.refs.input.click();
    };

    renderContent = () => {
        const {fieldId} = this.props;
        const {value} = this.state;

        return (<div className="z-form-group-item" onClick={this.chooseFile}>
            <input id={fieldId} type="text" value={value} style={{display: "none"}}/>
            <input
                ref="input"
                type="file"
                style={{display: "none"}}
                onChange={ev => this.onChange(ev.target)}
            />
            <div
                draggable="draggable"
                className="z-form-image-drop-zone"
                onDrop={this.onDropFile}
                onDragOver={this.cancelEvent}
                onDragEnter={this.cancelEvent}
                style={{backgroundImage: `url("${value}")`}}
            >{!value && "Drop image file here"}</div>
        </div>);
    };

    render() {
        const {deleted} = this.state;

        return deleted ? this.renderUndo() : this.renderContent();
    }
}
