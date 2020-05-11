import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { contractActions, boxActions, authActions } from "../../actions";
import { history } from "../../helpers";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    componentDidMount() {
        this.props.logout();
    }

    handleChange(event) {
        let { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    componentDidUpdate(prevProps) {
        const { inProgress, loggedIn } = this.props;
        if (!inProgress && loggedIn) {
            history.push("/home");
        }
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
        if (this.props.inProgress) {
            return;
        }
        this.setState({ submitted: true });
        const { account } = this.props;
        if (account) {
            await this.props.loadBoxProfile(account);
            await this.props.loadBox(account);
            await this.props.getRole();
        }
    }

    render() {
        const { inProgress, account } = this.props;
        const { submitted } = this.state;

        return (
            <div className="loginPage page">
                <div className="loginPageInner pageInner">
                    <div className="title">Login</div>
                    <div className="loginForm form">
                        <span className="label">Account</span>
                        <input
                            className="account"
                            type="text"
                            name="account"
                            value={account}
                            disabled
                        />
                        {!account && (
                            <div className="helpBlock">
                                MetaMask not connected
                            </div>
                        )}
                        {account && (
                            <div className="successBlock">
                                MetaMask connected
                            </div>
                        )}
                        <a
                            className="login"
                            href="#"
                            onClick={this.handleSubmit}
                        >
                            Login with 3box
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { account } = state.web3;
    const { loggedIn } = state.box;
    const inProgress =
        state.web3.inProgress ||
        state.box.inProgress ||
        state.contract.inProgress;
    return { inProgress, account, loggedIn };
}

const actionCreators = {
    logout: authActions.logout,
    loadBoxProfile: boxActions.loadProfile,
    loadBox: boxActions.login,
    getRole: contractActions.getRole
};

const connectedLoginPage = connect(mapState, actionCreators)(LoginPage);
export default connectedLoginPage;
