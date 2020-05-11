import React from "react";
import { connect } from "react-redux";
import { qrCodeActions, alertActions } from "../../actions";
import { history } from "../../helpers";

class GetBatchDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            campaignId: 0,
            batchId: 0,
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.clearForm = this.clearForm.bind(this);
    }

    componentDidMount() {
        this.props.cleanScanner();
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.qrData) {
            try {
                let { campaignId, batchId } = getQRValue(nextProps.qrData);
                return {
                    campaignId,
                    batchId,
                    submitted: false
                };
            } catch (e) {
                this.props.error(e.toString());
            }
        }
        return null;
    }

    clearForm(event) {
        event.preventDefault();
        this.setState({
            campaignId: 0,
            batchId: 0,
            submitted: false
        });
    }

    handleChange(event) {
        let { name, value } = event.target;
        value = value.trim();
        this.setState({
            [name]: value
        });
    }

    handleEnter(e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
            //13 is the enter keycode
            this.handleSubmit(e);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.props.inProgress) {
            return;
        }
        this.setState({ submitted: true, showScanner: false });
        const { campaignId, batchId } = this.state;
        if (campaignId > 0 && batchId > 0) {
            history.push("/batch/" + campaignId + "/" + batchId);
        }
    }

    render() {
        const { campaignId, batchId, submitted } = this.state;
        return (
            <div className="getBatchDetails form">
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
                <span className="label">Batch ID</span>
                <input
                    className="input"
                    type="number"
                    name="batchId"
                    value={batchId}
                    onChange={this.handleChange}
                    onKeyPress={this.handleEnter}
                />
                {submitted && batchId == 0 && (
                    <div className="helpBlock">BatchId cannot be 0</div>
                )}
                <div className="submitForm">
                    <div className="submit">
                        <a href="#" onClick={this.handleSubmit}>
                            Get
                        </a>
                    </div>
                    <div className="cancel">
                        <a href="#" onClick={this.clearForm}>
                            Clear
                        </a>
                    </div>
                </div>
                <div className="qrScan">
                    <a href="#" onClick={this.props.toggleScanner}>
                        Scan QR Code
                    </a>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const qrData = state.qrCode.data;
    return { qrData };
}

const actionCreators = {
    toggleScanner: qrCodeActions.toggle,
    cleanScanner: qrCodeActions.clean,
    error: alertActions.error
};

const connectedGetBatchDetails = connect(
    mapState,
    actionCreators
)(GetBatchDetails);
export { connectedGetBatchDetails as GetBatchDetails };
