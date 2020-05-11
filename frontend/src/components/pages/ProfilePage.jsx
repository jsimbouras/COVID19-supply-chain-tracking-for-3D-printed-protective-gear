import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { web3Actions, boxActions, contractActions } from "../../actions";
import tempProfile from "../../assets/img/profile.webp";
import { getImageUrl } from "../../helpers";

class ProfilePage extends React.Component {
    componentDidMount() {
        this.init();
    }

    async init() {
        //TODO: remove this extra call
        await this.props.loadWeb3();
        await this.props.loadBoxProfile(this.props.account);
        await this.props.getRole();
    }

    render() {
        let { profile, role, account, loggedIn } = this.props;
        return (
            <div className="profilePage page">
                <div className="profilePageInner pageInner">
                    <div className="photo">
                        <div className="photoInner">
                            {profile.image ? (
                                <img src={getImageUrl(profile.image)} />
                            ) : (
                                <img src={tempProfile} />
                            )}
                        </div>
                    </div>
                    <div className="titleBar">
                        <div className="name">{profile.name}</div>
                        <div className="location">{profile.location}</div>
                    </div>
                    <div className="display">
                        <span className="label">Account</span>
                        <p className="data">{account}</p>
                        <span className="label">Role</span>
                        <p className="data">{role}</p>
                    </div>
                    {loggedIn && <Link to="/login">Logout</Link>}
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { account } = state.web3;
    const { role } = state.contract;
    const { profile, loggedIn } = state.box;
    return { profile, role, account, loggedIn };
}

const actionCreators = {
    loadWeb3: web3Actions.loadWeb3,
    loadBoxProfile: boxActions.loadProfile,
    getRole: contractActions.getRole
};

const connectedProfilePage = connect(mapState, actionCreators)(ProfilePage);
export default connectedProfilePage;
