import $ from '$';
import React from 'react';

import 'react-tabs/style/react-tabs.css';
import 'react-select/dist/react-select.css';

import BaseVisualForm from './BaseVisualFormReact';
import EndpointAggregation from 'summary/EndpointAggregation';

import h from 'shared/utils/helpers';
import { splitStartup } from 'utils/WebpackSplit';
import CheckboxInput from 'shared/components/CheckboxInput';
import MultiselectInput from 'shared/components/MultiselectInput';
import QuillTextInput from 'shared/components/QuillTextInput';
import SelectInput from 'shared/components/SelectInput';
import TextInput from 'shared/components/TextInput';
import TextAreaInput from 'shared/components/TextAreaInput';

class EndpointAggregationForm extends BaseVisualForm {
    formatIncoming = (json) => {
        let { endpoints, ...rest } = json;
        return {
            endpoints: this.getEndpointChoices(endpoints),
            ...rest,
        };
    };

    fetchEndpoints = (input, callback) => {
        fetch(
            `${this.config.endpoint_url}?related=${this.config.assessment}&term=${input}`,
            h.fetchGet
        )
            .then((response) => response.json())
            .then((json) => {
                callback(null, { options: json.data });
            });
    };

    getEndpointChoices = (endpoints) => {
        return endpoints.map((e) => {
            let s = e.animal_group.experiment.study.short_citation,
                x = e.animal_group.experiment.name,
                g = e.animal_group.name;
            return {
                value: e.id,
                label: `${s} | ${x} | ${g} | ${e.name}`,
            };
        });
    };

    updatePreviewGraph = (json) => {
        new EndpointAggregation(json).displayAsPage($(this.preview).empty());
    };

    renderForm = () => {
        let doseUnitChoices = this.config.dose_units.map((u) => {
            return { id: u.id, value: u.name };
        });

        return (
            <div>
                <TextInput
                    name="title"
                    label="Title"
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                    required
                />
                <TextInput
                    name="slug"
                    label="URL Name"
                    value={this.state.slug}
                    onChange={this.handleInputChange}
                    helpText="The URL (web address) used to describe this object
                              (no spaces or special-characters)."
                    required
                />
                <SelectInput
                    name="dose_units"
                    label="Dose Units"
                    className="span12 select"
                    choices={doseUnitChoices}
                    id="id_dose_units"
                    value={this.state.dose_units}
                    handleSelect={this.handleDoseUnitSelect}
                />
                <MultiselectInput
                    async
                    required
                    name="endpoints"
                    label="Endpoints"
                    value={this.state.endpoints}
                    onChange={this.handleInputChange}
                    loadOptions={this.fetchEndpoints}
                    onValueClick={(ep) => window.open(`/ani/endpoint/${ep.value}`, '_blank')}
                />
                <TextAreaInput
                    name="settings"
                    label="Settings"
                    value={this.state.settings}
                    onChange={this.handleInputChange}
                    helpText="Paste from another visualization to copy settings,
                              or set to &quot;undefined&quot;."
                    required
                />
                <QuillTextInput
                    name="caption"
                    label="Caption"
                    value={this.state.caption}
                    onChange={this.handleInputChange}
                />
                <CheckboxInput
                    name="published"
                    label="Publish visual for public viewing"
                    checked={this.state.published}
                    onChange={this.handleCheckboxChange}
                    helpText="For assessments marked for public viewing,
                              mark visual to be viewable by public"
                />
            </div>
        );
    };

    renderSettingsForm = () => {
        return (
            <div>
                <p className="help-block">No figure customization settings are available.</p>
            </div>
        );
    };
}

EndpointAggregationForm.propTypes = {};

export default EndpointAggregationForm;

const formRender = (element) => {
    splitStartup(element, EndpointAggregationForm);
};

// Shim class is for rendering using current VisualForm.create().
// Once all visual forms are refactored, the shim can be removed and formRender used.
class EndpointAggregationShim {
    constructor(element) {
        formRender(element[0]);
    }
}
export { formRender, EndpointAggregationShim };
