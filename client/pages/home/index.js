import React, { Component } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { Link, Redirect, withRouter } from "react-router-dom";
import {
    Button, Col, Container, FormControl, InputGroup, Row,
} from "react-bootstrap";
import uuid from "uuid/v4";

import { routes } from "config";
import { appOperations } from "modules/app";


class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
        };

        this.handleRoomCreation = this.handleRoomCreation.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    handleRoomCreation() {
        const { accountId, setRoom } = this.props;
        if (accountId != null) {
            setRoom(accountId);
            this.setState({
                redirect: <Redirect to={`${routes.ROOM_PAGE.basePath}/${accountId}`} />,
            });
        }
    }

    handleSignIn() {
        const { signInNearWallet } = this.props;
        console.log("sign in");
        console.log(signInNearWallet);
        signInNearWallet();
    }

    handleSignOut() {
        const { signOutNearWallet, accountId } = this.props;
        console.log("sign out", accountId);
        console.log(signOutNearWallet);
        signOutNearWallet();
    }

    render() {
        const { accountId } = this.props;
        const isSignedIn = !(accountId == undefined || accountId == null || accountId == "");
        const nameSignButton = isSignedIn ? "Sign Out" : "Sign In";

        return (
            <Container>
                <Row>
                    <Col>
                        Some WebRTC text
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            onClick={isSignedIn ? this.handleSignOut : this.handleSignIn}
                        >
                            { nameSignButton }
                            {/* eslint-disable-next-line react/destructuring-assignment */}
                            {this.state.redirect}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            onClick={this.handleRoomCreation}
                        >
                            Create new room
                            {/* eslint-disable-next-line react/destructuring-assignment */}
                            {this.state.redirect}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup type="text" placeholder="room id">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Room ID</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                aria-label="Room ID"
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <Button>Connect to room</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

HomePage.propTypes = {
    accountId: PropTypes.string,
    setRoom: PropTypes.func.isRequired,
    signInNearWallet: PropTypes.func.isRequired,
    signOutNearWallet: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    accountId: state.app.accountId,
});

const mapDispatchToProps = (dispatch) => ({
    setRoom: (roomId) => dispatch(appOperations.setRoom(roomId)),
    signInNearWallet: () => dispatch(appOperations.signInNearWallet()),
    signOutNearWallet: () => dispatch(appOperations.signOutNearWallet()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
