import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select, { Async } from 'react-select';

class MultiselectInput extends Component {
    /**
     * Wraps ReactSelect to display either a regular or async multiple select input.
     *
     */

    onChange = (value) => {
        this.props.onChange({ target: { name: this.props.name, value: value } });
    };

    formatProps = () => {
        if (this.props.async) {
            return {
                Component: Async,
                options: {
                    loadOptions: this.props.loadOptions,
                },
                value: this.props.value,
            };
        } else {
            return {
                Component: Select,
                options: {
                    options: this.props.options,
                },
                value: this.props.value.map((v) => v.value),
            };
        }
    };

    render() {
        let { Component, options, value } = this.formatProps();

        return (
            <div className="control-group">
                <label htmlFor={`id_${this.props.name}`} className="control-label">
                    {this.props.label}
                    {this.props.required ? <span className="asteriskField">*</span> : null}
                </label>
                <Component
                    multi
                    className={this.props.className}
                    name={this.props.name}
                    onChange={this.onChange}
                    onValueClick={this.props.onValueClick}
                    required={this.props.required}
                    value={value}
                    {...options}
                    autoload={false}
                    backspaceRemoves={false}
                    deleteRemoves={false}
                    clearable={false}
                />
                {this.props.helpText ? <p className="help-block">{this.props.helpText}</p> : null}
            </div>
        );
    }
}

MultiselectInput.propTypes = {
    async: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    loadOptions: PropTypes.func,
    className: PropTypes.string,
    helpText: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onValueClick: PropTypes.func,
    required: PropTypes.bool,
    value: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default MultiselectInput;
