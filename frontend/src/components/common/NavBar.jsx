import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import loading from "../../assets/img/loading.gif";
import { Icon, InlineIcon } from "@iconify/react";
import homeIcon from "@iconify/icons-ant-design/home-outlined";
import searchIcon from "@iconify/icons-ant-design/search-outlined";
import chatIcon from "@iconify/icons-bi/chat";
import profileIcon from "@iconify/icons-bi/person";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { loggedIn, inProgress } = this.props;
        return (
            <div className="navBar">
                <img
                    className="loading"
                    src={loading}
                    style={inProgress ? { opacity: 1 } : { opacity: 0 }}
                />
                <div className="bottomBar">
                    {loggedIn ? (
                        <div className="barInner loggedIn">
                            <div className="barIconContainer">
                                <Link to="/home">
                                    <Icon className="barIcon" icon={homeIcon} />
                                </Link>
                            </div>
                            <div className="barIconContainer">
                                <Link to="/search">
                                    <Icon className="barIcon" icon={searchIcon} />
                                </Link>
                            </div>
                            <div className="barIconContainer plus">
                                <Link to="/actions">
                                    <span>{"\uFF0B"}</span>
                                </Link>
                            </div>
                            <div className="barIconContainer">
                                <Link to="/chat">
                                    <Icon className="barIcon" icon={chatIcon} />
                                </Link>
                            </div>
                            <div className="barIconContainer">
                                <Link to="/profile">
                                    <Icon className="barIcon" icon={profileIcon} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="barInner needLogin">
                            <Link to="/login">Login</Link>
                            <Link to="/login">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
function mapState(state) {
    const { loggedIn } = state.box;
    const inProgress =
        state.contract.inProgress ||
        state.box.inProgress ||
        state.web3.inProgress;
    return { loggedIn, inProgress };
}

const actionCreators = {};

const connectedNavBar = connect(mapState, actionCreators)(NavBar);
export { connectedNavBar as NavBar };
