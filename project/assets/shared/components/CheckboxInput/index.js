import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CheckboxInput extends Component {
    render() {
        const htmlId = `id_${this.props.name}`;
        return (
            <div id={`div_${htmlId}`} className="control-group">
                <div className="controls">
                    <label htmlFor={htmlId} className="checkbox">
                        {this.props.label}
                        <input
                            className="checkboxinput"
                            id={htmlId}
                            value={this.props.name}
                            name={this.props.name}
                            type="checkbox"
                            checked={this.props.checked}
                            onChange={this.props.onChange}
                        />
                    </label>
                    {this.props.helpText ? (
                        <p id={`hint_${htmlId}`} className="help-block">
                            {this.props.helpText}
                        </p>
                    ) : null}
                </div>
            </div>
        );
    }
}

CheckboxInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    helpText: PropTypes.string,
};

export default CheckboxInput;
