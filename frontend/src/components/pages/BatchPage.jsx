import React from "react";
import { connect } from "react-redux";
import { contractActions, web3Actions } from "../../actions";
import {
    getBatchStatusString,
    getBatchDateString,
    getQRString
} from "../../helpers";
import QRCode from "qrcode";
import * as Displays from "../displays";

class BatchPage extends React.Component {
    constructor(props) {
        super(props);
        this.campaignId = this.props.match.params.campaign;
        this.batchId = this.props.match.params.batch;
        this.state = {
            dataURI: ""
        };
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        this.props.clean();
        //TODO: remove this extra call
        await this.props.loadWeb3();
        await this.props.getBatchDetails(this.campaignId, this.batchId);
        const qrString = getQRString(this.campaignId, this.batchId);
        const dataURI = await QRCode.toDataURL(qrString);
    }

    render() {
        const { batch } = this.props;
        const title = "Athens covid19";
        const location = "Greece";

        return (
            <div className="batchPage page">
                {batch && (
                    <div className="batchPageInner pageInner">
                        <div className="titleBar">
                            <div className="title">{title}</div>
                        </div>
                        <div className="statusBar">
                            <div className="status">
                                {getBatchStatusString(batch.stage)}
                            </div>
                            <div className="date">
                                {getBatchDateString(batch)}
                            </div>
                            <ProgressBar stage={parseInt(batch.stage) - 1} />
                        </div>
                        <div className="details">
                            <div className="id">
                                Campaign #{this.campaignId} {"\u27A2"} Batch #
                                {this.batchId}
                            </div>
                            <div className="from">
                                From: Mpotasi 6, Athens 104 33 on 27th May 2020,
                                5:00PM
                            </div>
                            <div className="to">
                                To: Ministry of Health, +1 232 545 4533
                                Aristotelous 17, Athens 104 33
                            </div>
                        </div>
                        <div className="qrDisplay">
                            <img
                                className="qrcode"
                                alt="qrcode"
                                src={this.state.dataURI}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

function ProgressBar(props) {
    let { stage } = props;
    const initStage = "Source";
    const midStage = "Manufacturer";
    const endStage = "Destination";
    //TODO: make this cleaner
    if (stage == 2 || stage == 3) {
        stage = 2;
    } else if (stage >= 3) {
        stage = stage - 1;
    }
    return (
        <div className="progress">
            <div className="bar">
                <div className="progress-check done"></div>
                {Array(4)
                    .fill(1)
                    .map((el, i) => (
                        <div className="item" key={i}>
                            <div
                                className={
                                    stage > i
                                        ? "progress-bar done"
                                        : "progress-bar"
                                }
                            ></div>
                            <div
                                className={
                                    stage > i
                                        ? "progress-check done"
                                        : "progress-check"
                                }
                            ></div>
                        </div>
                    ))}
            </div>
            <div className="label">
                <div className="init">{initStage}</div>
                <div className="mid">{midStage}</div>
                <div className="end">{endStage}</div>
            </div>
        </div>
    );
}

function mapState(state) {
    const { batch } = state.contract.data;
    return { batch };
}

const actionCreators = {
    getBatchDetails: contractActions.getBatchDetails,
    loadWeb3: web3Actions.loadWeb3,
    clean: contractActions.clean
};

const connectedBatchPage = connect(mapState, actionCreators)(BatchPage);
export default connectedBatchPage;
