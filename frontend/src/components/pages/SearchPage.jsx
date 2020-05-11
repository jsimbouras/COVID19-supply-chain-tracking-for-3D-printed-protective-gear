import React from "react";
import { connect } from "react-redux";

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="searchPage page">
                <div className="searchPageInner pageInner">
                    <div className="title">Search</div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    return { };
}

const actionCreators = {};

const connectedSearchPage = connect(mapState, actionCreators)(SearchPage);
export default connectedSearchPage;
