import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { contractActions } from "../../actions";
import { contractConstants } from "../../constants";
import { getBatchDateString } from "../../helpers";
import { Icon, InlineIcon } from "@iconify/react";
import packageIcon from "@iconify/icons-feather/package";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: undefined
        };
        this.setSelected = this.setSelected.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        this.props.clean();
        await this.props.getMyCampaigns();
    }

    setSelected(selected) {
        this.props.cleanMyBatches();
        selected = selected == this.state.selected ? undefined : selected;
        if (selected >= 0) {
            this.props.getMyBatches(selected + 1);
        }
        this.setState({ selected });
    }

    render() {
        const { campaigns, batches } = this.props.data;
        return (
            <div className="homePage page">
                <div className="homePageInner pageInner">
                    <div className="title">My Campaigns</div>
                    {campaigns &&
                        campaigns.map((campaign, i) => (
                            <div className="campaign" key={i + 1}>
                                <div className="inner">
                                    Campaign #{i + 1}
                                    <br />
                                    Total: {campaign.totalPLA}
                                    <br />
                                    Remaining: {campaign.currentPLA}
                                    <br />
                                </div>
                                <div className="links">
                                    <Link
                                        to={"/campaign/" + (i + 1).toString()}
                                    >
                                        View Campaign Details {"\u2197"}
                                    </Link>
                                    <span onClick={() => this.setSelected(i)}>
                                        View My Batches {"\u21A7"}
                                    </span>
                                </div>
                                <div
                                    className={
                                        this.state.selected === i
                                            ? "batches selected"
                                            : "batches"
                                    }
                                >
                                    {batches &&
                                        batches.map((batch, j) => (
                                            <div className="batch" key={j + 1}>
                                                <Link
                                                    to={
                                                        "/batch/" +
                                                        (i + 1).toString() +
                                                        "/" +
                                                        (j + 1).toString()
                                                    }
                                                >
                                                    <Icon
                                                        icon={packageIcon}
                                                        className="icon"
                                                    />
                                                    <div className="inner">
                                                        Batch #{j + 1}
                                                        <br />
                                                        Status:{" "}
                                                        {
                                                            contractConstants
                                                                .STAGES[
                                                                parseInt(
                                                                    batch.stage
                                                                )
                                                            ]
                                                        }
                                                        <br />
                                                        Delivery:{" "}
                                                        {getBatchDateString(
                                                            batch
                                                        )}
                                                        <br />
                                                        <span className="details">
                                                            View Batch Details{" "}
                                                            {"\u2197"}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { data } = state.contract;
    return { data };
}

const actionCreators = {
    getMyCampaigns: contractActions.getMyCampaigns,
    getMyBatches: contractActions.getMyBatches,
    cleanMyBatches: contractActions.cleanMyBatches,
    clean: contractActions.clean
};

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export default connectedHomePage;
