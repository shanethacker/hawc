import _ from 'underscore';
import React from 'react';

import {deepCopy} from 'shared/utils';

import * as types from 'bmd/constants';

import EditableModalFooter from 'bmd/components/EditableModalFooter';


class BMROptionModal extends React.Component {

    componentWillReceiveProps(nextProps){
        this.setState(deepCopy(nextProps.bmr));
    }

    handleSave(){
        let bmr = this.state;
        this.props.handleSave(bmr);
    }

    handleFieldChange(e){
        let d;
        if (e.target.name === 'type'){
            d = deepCopy(this.props.allOptions[e.target.value]);
        } else {
            d = {};
            d[e.target.name] = e.target.value;
        }
        this.setState(d);
    }

    renderReadOnlyTable(){
        let {bmr} = this.props;
        return (
            <table className="table table-condensed table-striped">
                <tbody>
                    <tr>
                        <th style={{width: '30%'}}>BMR type</th>
                        <td style={{width: '70%'}}>{bmr.type}</td>
                    </tr>
                    <tr>
                        <th>Value</th>
                        <td>{bmr.value}</td>
                    </tr>
                    <tr>
                        <th>Confidence level</th>
                        <td>{bmr.confidence_level}</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    renderEditingForm(){
        let {allOptions} = this.props,
            state = this.state,
            opts = _.values(allOptions);

        return (
            <form className="form-horizontal">
                <div className="control-group form-row">
                    <label className="control-label"
                           for="bmr_type">BMR type</label>
                    <div className="controls">
                        <select
                            id="bmr_type"
                            name="type"
                            value={state.type}
                            onChange={this.handleFieldChange.bind(this)}>
                            {opts.map((d, i)=>{
                                return <option key={i} value={d.type}>{d.type}</option>;
                            })}
                        </select>
                    </div>
                </div>

                <div className="control-group form-row">
                    <label className="control-label"
                           for="bmr_value">BMR value</label>
                    <div className="controls">
                        <input
                            id="bmr_value"
                            name="value"
                            type="number"
                            step="any"
                            value={state.value}
                            onChange={this.handleFieldChange.bind(this)}></input>
                    </div>
                </div>

                <div className="control-group form-row">
                    <label className="control-label"
                           for="bmr_confidence_level">BMR confidence level</label>
                    <div className="controls">
                        <input
                            id="bmr_confidence_level"
                            name="confidence_level"
                            type="number"
                            step="any"
                            value={state.confidence_level}
                            onChange={this.handleFieldChange.bind(this)}></input>
                    </div>
                </div>
            </form>
        );
    }

    render() {
        if (!this.props.bmr){
            return null;
        }

        let {editMode, bmr} = this.props,
            title = (this.props.editMode)?
                `Edit benchmark response: ${bmr.type}`:
                `Benchmark response: ${bmr.type}`,
            tableFunc = (editMode)? this.renderEditingForm: this.renderReadOnlyTable;

        return (
            <div className="modal hide fade" role="dialog" id={types.BMR_MODAL_ID}>

                <div className="modal-header">
                    <button className="close" type="button"
                        data-dismiss="modal">×</button>
                    <h3>{title}</h3>
                </div>

                <div className="modal-body">
                    {tableFunc.bind(this)()}
                </div>

                <EditableModalFooter
                    editMode={editMode}
                    handleSave={this.handleSave.bind(this)}
                    handleDelete={this.props.handleDelete} />
            </div>
        );
    }
}

BMROptionModal.propTypes = {
    bmr: React.PropTypes.object,
    allOptions: React.PropTypes.object.isRequired,
    editMode: React.PropTypes.bool.isRequired,
    handleSave: React.PropTypes.func.isRequired,
    handleDelete: React.PropTypes.func.isRequired,
};

export default BMROptionModal;
