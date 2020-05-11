import React from "react";
import { connect } from "react-redux";

class ChatPage extends React.Component {
    componentDidMount() {
        this.init();
    }

    async init() {}

    render() {
        return (
            <div className="chatPage page">
                <div className="chatPageInner pageInner">
                    <div className="title">Chat</div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedChatPage = connect(mapState, actionCreators)(ChatPage);
export default connectedChatPage;
