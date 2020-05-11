import React from "react";
import { connect } from "react-redux";
import * as Views from "../views";

class ActionsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { role } = this.props;
        return (
            <div className="actionsPage page">
                <div className="actionsPageInner pageInner">
                    <RoleBasedView role={role} />
                </div>
            </div>
        );
    }
}

function RoleBasedView(props) {
    switch (props.role) {
        case "ADMIN":
            return <Views.AdminView />;
        case "COORDINATOR":
            return <Views.CoordinatorView />;
        case "COURIER":
            return <Views.CourierView />;
        case "MANUFACTURER":
            return <Views.ManufacturerView />;
        case "RECEIVER":
            return <Views.ReceiverView />;
        default:
            return <Views.VisitorView />;
    }
}

function mapState(state) {
    const { role } = state.contract;
    return { role };
}

const actionCreators = {};

const connectedActionsPage = connect(mapState, actionCreators)(ActionsPage);
export default connectedActionsPage;
