import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { contractActions } from "../../actions";
import { contractConstants } from "../../constants";
import { getBatchDateString } from "../../helpers";
import { Icon, InlineIcon } from "@iconify/react";
import packageIcon from "@iconify/icons-feather/package";
import { PieChart } from "react-minimal-pie-chart";

class CampaignDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        const { campaignId, campaign } = this.props;
        await this.props.getBatches(
            campaignId,
            parseInt(campaign.totalBatches)
        );
    }

    render() {
        const { campaignId, campaign, batches } = this.props;
        let inProgressPLA = 0;
        let donePLA = 0;
        if (batches) {
            for (let batch of batches) {
                let status = parseInt(batch.stage);
                if (status >= 6) {
                    donePLA += parseInt(batch.amountOfPLA);
                } else {
                    inProgressPLA += parseInt(batch.amountOfPLA);
                }
            }
        }
        return (
            <div className="campaignDetails">
                <div className="title">State</div>
                <div className="pie">
                    <div className="center">
                        <span className="label">Total</span>
                        <span className="data">{campaign.totalPLA}</span>
                    </div>
                    <PieChart
                        style={{
                            fontSize: "8px"
                        }}
                        lineWidth={60}
                        segmentsStyle={{
                            transition: "stroke .3s",
                            pointerEvents: "none"
                        }}
                        animate
                        label={({ dataEntry }) => dataEntry.value}
                        labelPosition={70}
                        labelStyle={{
                            fill: "#fbfbfb",
                            pointerEvents: "none"
                        }}
                        data={[
                            {
                                title: "Remaining",
                                value: parseInt(campaign.currentPLA),
                                color: "purple"
                            },
                            {
                                title: "In Progress",
                                value: inProgressPLA,
                                color: "#3498db"
                            },
                            { title: "Done", value: donePLA, color: "#e74c3c" }
                        ]}
                    />
                </div>
                <div className="pieDetails">
                    <div className="remain">Remaining</div>
                    <div className="inProgress">In Progress</div>
                    <div className="done">Done</div>
                </div>
                {batches &&
                    batches.map((batch, i) => (
                        <div className="batch" key={i + 1}>
                            <Link
                                to={
                                    "/batch/" +
                                    campaignId +
                                    "/" +
                                    (i + 1).toString()
                                }
                            >
                                <Icon icon={packageIcon} className="icon" />
                                <div className="inner">
                                    Batch #{i + 1}
                                    <br />
                                    Status:{" "}
                                    {
                                        contractConstants.STAGES[
                                            parseInt(batch.stage)
                                        ]
                                    }
                                    <br />
                                    Delivery: {getBatchDateString(batch)}
                                    <br />
                                    <span className="details">
                                        View Details {"\u2197"}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
            </div>
        );
    }
}

function mapState(state) {
    const { batches } = state.contract.data;
    return { batches };
}

const actionCreators = {
    getBatches: contractActions.getBatches
};

const connectedCampaignDetails = connect(
    mapState,
    actionCreators
)(CampaignDetails);

export { connectedCampaignDetails as CampaignDetails };
