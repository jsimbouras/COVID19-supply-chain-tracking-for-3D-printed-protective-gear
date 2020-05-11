import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import { contractActions } from "../../actions";
import { getQRString, history } from "../../helpers";

class CreateNewBatch extends React.Component {
    constructor(props) {
        super(props);
        let currentTime = new Date().getTime() / 1000;
        this.state = {
            batch: {
                campaignId: 0,
                amountOfPLA: 0,
                expectedAmountOfMasks: 0,
                tfForDeliveryToManufacturer: currentTime,
                tfForMakingMasks: currentTime,
                tfForDeliveryToReceiver: currentTime,
                courier1: "",
                courier2: "",
                manufacturer: ""
            },
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.dateChange = this.dateChange.bind(this);
    }

    dateChange(name, date) {
        this.setState({
            batch: { ...this.state.batch, [name]: date.getTime() / 1000 }
        });
    }

    clearForm(event) {
        event.preventDefault();
        let currentTime = new Date().getTime() / 1000;
        this.setState({
            batch: {
                campaignId: 0,
                amountOfPLA: 0,
                expectedAmountOfMasks: 0,
                tfForDeliveryToManufacturer: currentTime,
                tfForMakingMasks: currentTime,
                tfForDeliveryToReceiver: currentTime,
                courier1: "",
                courier2: "",
                manufacturer: ""
            },
            submitted: false
        });
    }

    handleChange(event) {
        let { name, value } = event.target;
        value = value.trim();
        this.setState({
            batch: {
                ...this.state.batch,
                [name]: value
            }
        });
    }

    handleEnter(e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
            //13 is the enter keycode
            this.handleSubmit(e);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        console.log(this.state);
        const {
            campaignId,
            amountOfPLA,
            expectedAmountOfMasks,
            tfForDeliveryToManufacturer,
            tfForMakingMasks,
            tfForDeliveryToReceiver,
            courier1,
            courier2,
            manufacturer
        } = this.state.batch;
        let currentTime = new Date().getTime() / 1000;
        if (
            campaignId > 0 &&
            amountOfPLA > 0 &&
            expectedAmountOfMasks > 0 &&
            tfForDeliveryToManufacturer > currentTime &&
            tfForMakingMasks > tfForDeliveryToManufacturer &&
            tfForDeliveryToReceiver > tfForMakingMasks &&
            courier1 &&
            courier2 &&
            manufacturer
        ) {
            await this.props.createNewBatch(this.state.batch);
        }
    }

    componentDidUpdate(prevProps) {
        const { newCampaignId, newBatchId } = this.props;
        if (newBatchId && newCampaignId) {
            history.push("/batch/" + newCampaignId + "/" + newBatchId);
        }
    }

    render() {
        const {
            campaignId,
            amountOfPLA,
            expectedAmountOfMasks,
            tfForDeliveryToManufacturer,
            tfForMakingMasks,
            tfForDeliveryToReceiver,
            courier1,
            courier2,
            manufacturer
        } = this.state.batch;
        let currentTime = new Date().getTime() / 1000;
        const { submitted } = this.state;
        return (
            <div className="createNewBatch form">
                <span className="label">Campaign ID</span>
                <input
                    className="input"
                    type="number"
                    name="campaignId"
                    value={campaignId}
                    onChange={this.handleChange}
                    onKeyPress={this.handleEnter}
                />
                {submitted && campaignId == 0 && (
                    <div className="helpBlock">CampaignId cannot be 0</div>
                )}
                <span className="label">Amount of PLA</span>
                <input
                    className="input"
                    type="number"
                    name="amountOfPLA"
                    value={amountOfPLA}
                    onChange={this.handleChange}
                    onKeyPress={this.handleEnter}
                />
                {submitted && amountOfPLA == 0 && (
                    <div className="helpBlock">Amount of PLA cannot be 0</div>
                )}
                <span className="label">Expected Amount of Masks</span>
                <input
                    className="input"
                    type="number"
                    name="expectedAmountOfMasks"
                    value={expectedAmountOfMasks}
                    onChange={this.handleChange}
                    onKeyPress={this.handleEnter}
                />
                {submitted && expectedAmountOfMasks == 0 && (
                    <div className="helpBlock">
                        Expected Amount of Masks cannot be 0
                    </div>
                )}
                <span className="label">Expected Date for PLA Delivery</span>
                <DatePicker
                    selected={new Date(tfForDeliveryToManufacturer * 1000)}
                    onChange={date =>
                        this.dateChange("tfForDeliveryToManufacturer", date)
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={60}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
                {submitted && tfForDeliveryToManufacturer <= currentTime && (
                    <div className="helpBlock">Date must be in the future</div>
                )}
                <span className="label">Expected Date for Masks Made</span>
                <DatePicker
                    selected={new Date(tfForMakingMasks * 1000)}
                    onChange={date => this.dateChange("tfForMakingMasks", date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={60}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
                {submitted &&
                    tfForMakingMasks <= tfForDeliveryToManufacturer && (
                        <div className="helpBlock">
                            Date must be after PLA delivery
                        </div>
                    )}
                <span className="label">Expected Date for Masks Delivery</span>
                <DatePicker
                    selected={new Date(tfForDeliveryToReceiver * 1000)}
                    onChange={date =>
                        this.dateChange("tfForDeliveryToReceiver", date)
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={60}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
                {submitted && tfForDeliveryToReceiver <= tfForMakingMasks && (
                    <div className="helpBlock">
                        Date must be after masks made
                    </div>
                )}
                <span className="label">Courier 1 Address</span>
                <input
                    className="input"
                    type="text"
                    name="courier1"
                    value={courier1}
                    placeholder="0x..."
                    onChange={this.handleChange}
                    onKeyPress={this.handleEnter}
                />
                {submitted && !courier1 && (
                    <div className="helpBlock">Courier 1 Address Required</div>
                )}
                <span className="label">Courier 2 Address</span>
                <input
                    className="input"
                    type="text"
                    name="courier2"
                    value={courier2}
                    placeholder="0x..."
                    onChange={this.handleChange}
                    onKeyPress={this.handleEnter}
                />
                {submitted && !courier2 && (
                    <div className="helpBlock">Courier 2 Address Required</div>
                )}
                <span className="label">Manufacturer Address</span>
                <input
                    className="input"
                    type="text"
                    name="manufacturer"
                    value={manufacturer}
                    placeholder="0x..."
                    onChange={this.handleChange}
                    onKeyPress={this.handleEnter}
                />
                {submitted && !manufacturer && (
                    <div className="helpBlock">
                        Manufacturer Address Required
                    </div>
                )}
                <div className="submitForm">
                    <div className="submit">
                        <a href="#" onClick={this.handleSubmit}>
                            Create
                        </a>
                    </div>
                    <div className="cancel">
                        <a href="#" onClick={this.clearForm}>
                            Clear
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { data, inProgress } = state.contract;
    const { newCampaignId, newBatchId } = data;
    return { newCampaignId, newBatchId, inProgress };
}

const actionCreators = {
    createNewBatch: contractActions.createNewBatch
};

const connectedCreateNewBatch = connect(
    mapState,
    actionCreators
)(CreateNewBatch);
export { connectedCreateNewBatch as CreateNewBatch };
