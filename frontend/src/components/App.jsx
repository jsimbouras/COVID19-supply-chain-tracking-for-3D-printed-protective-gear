import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { history } from "../helpers";
import { web3Actions } from "../actions";
import {
    ErrorBoundary,
    PrivateRoute,
    NavBar,
    QRCode
} from "../components/common";
import loading from "../assets/img/loading.gif";
const LoginPage = React.lazy(() => import("../components/pages/LoginPage"));
const RegisterPage = React.lazy(() =>
    import("../components/pages/RegisterPage")
);
const ProfilePage = React.lazy(() => import("../components/pages/ProfilePage"));
const LandingPage = React.lazy(() => import("../components/pages/LandingPage"));
const HomePage = React.lazy(() => import("../components/pages/HomePage"));
const SearchPage = React.lazy(() => import("../components/pages/SearchPage"));
const ChatPage = React.lazy(() => import("../components/pages/ChatPage"));
const ActionsPage = React.lazy(() => import("../components/pages/ActionsPage"));
const CampaignPage = React.lazy(() =>
    import("../components/pages/CampaignPage")
);
const BatchPage = React.lazy(() => import("../components/pages/BatchPage"));

class App extends React.Component {
    constructor(props) {
        super(props);
        this.accountChanged = this.accountChanged.bind(this);
        this.networkChanged = this.networkChanged.bind(this);
    }

    async accountChanged() {
        if (this.props.web3) {
            await this.props.loadAccount();
        }
        if (!["/login", "/register"].includes(history.location.pathname)) {
            history.push("/login");
        }
    }
    async networkChanged() {
        if (this.props.web3) {
            await this.props.loadNetwork();
        }
        if (!["/login", "/register"].includes(history.location.pathname)) {
            history.push("/login");
        }
    }

    componentDidMount() {
        if (window.ethereum) {
            window.ethereum.autoRefreshOnNetworkChange = false;
            window.ethereum.on("accountsChanged", this.accountChanged);
            window.ethereum.on("networkChanged", this.networkChanged);
        }
        this.props.loadWeb3();
    }

    render() {
        return (
            <div className="app">
                <ToastContainer closeButton={false} autoClose={5000} />
                <QRCode open={this.props.open} />
                <Router history={history}>
                    <ErrorBoundary key={location.pathname}>
                        <React.Suspense
                            fallback={
                                <div className="suspense">
                                    <img className="loading" src={loading} />
                                </div>
                            }
                        >
                            <Switch>
                                <PrivateRoute
                                    exact
                                    path="/home"
                                    component={HomePage}
                                />
                                <PrivateRoute
                                    exact
                                    path="/actions"
                                    component={ActionsPage}
                                />
                                <PrivateRoute
                                    exact
                                    path="/search"
                                    component={SearchPage}
                                />
                                <PrivateRoute
                                    exact
                                    path="/chat"
                                    component={ChatPage}
                                />
                                {/*TODO: make profile route private */}
                                <Route
                                    exact
                                    path="/profile"
                                    component={ProfilePage}
                                />
                                <Route exact path="/" component={LandingPage} />
                                <Route
                                    exact
                                    path="/login"
                                    component={LoginPage}
                                />
                                <Route
                                    exact
                                    path="/register"
                                    component={RegisterPage}
                                />
                                <Route
                                    exact
                                    path="/campaign/:id"
                                    component={CampaignPage}
                                />
                                <Route
                                    path="/batch/:campaign/:batch"
                                    component={BatchPage}
                                />
                                <Redirect from="*" to="/" />
                            </Switch>
                        </React.Suspense>
                        <NavBar />
                    </ErrorBoundary>
                </Router>
            </div>
        );
    }
}

function mapState(state) {
    const { web3 } = state.web3;
    const { open } = state.qrCode;
    return { web3, open };
}

const actionCreators = {
    loadWeb3: web3Actions.loadWeb3,
    loadAccount: web3Actions.loadAccount,
    loadNetwork: web3Actions.loadNetwork
};

const connectedApp = connect(mapState, actionCreators)(App);
export default connectedApp;
