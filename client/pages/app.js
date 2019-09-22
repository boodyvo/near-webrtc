import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { appOperations } from "modules/app";
import { routes } from "config";

import HomePage from "./home";
import RoomPage from "./room";

class App extends Component {
    constructor(props) {
        super(props);

        // eslint-disable-next-line react/prop-types
        const { dispatch } = this.props;
        dispatch(appOperations.initNear());
    }

    render() {
        return (
            <Switch>
                <Route
                    exact
                    path={routes.HOME_PAGE.path}
                >
                    <HomePage />
                </Route>
                <Route
                    exact
                    path={routes.ROOM_PAGE.path}
                >
                    <RoomPage />
                </Route>
                <Route
                    path={routes._404_PAGE.path}
                >
                    <HomePage />
                </Route>
            </Switch>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default withRouter(connect()(App));
