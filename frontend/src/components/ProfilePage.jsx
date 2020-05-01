import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class ProfilePage extends React.Component {
    render() {
        const { user, role, account } = this.props;
        return (
            <div className="profilePage page">
                <div className="profilePageInner pageInner">
                    <div className="title">
                        <span>Profile</span>
                    </div>
                    <div className="display">
                        <span className="label">Display Name</span>
                        <p className="data">{user.displayName}</p>
                        <span className="label">Account</span>
                        <p className="data">{account}</p>
                        <span className="label">Role</span>
                        <p className="data">{role}</p>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { account } = state.web3;
    const { role } = state.contract;
    const { user } = state.authentication;
    return { user, role, account };
}

const actionCreators = {};

const connectedProfilePage = connect(mapState, actionCreators)(ProfilePage);
export { connectedProfilePage as ProfilePage };