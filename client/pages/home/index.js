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

        this.room = React.createRef();
        this.state = {
            redirect: null,
        };

        this.handleRoomCreation = this.handleRoomCreation.bind(this);
        this.handleEnterRoom = this.handleEnterRoom.bind(this);
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

    handleEnterRoom() {
        const { accountId, setRoom } = this.props;
        const room = this.room.current.value;
        if (accountId != null) {
            setRoom(room);
            this.setState({
                redirect: <Redirect to={`${routes.ROOM_PAGE.basePath}/${room}`} />,
            });
        }
    }

    handleSignIn() {
        const { signInNearWallet } = this.props;
        signInNearWallet();
    }

    handleSignOut() {
        const { signOutNearWallet, accountId } = this.props;
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
                { isSignedIn
                    ? (
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
                    ) : null }
                { isSignedIn
                    ? (
                        <Row>
                            <Col>
                                <InputGroup type="text" placeholder="room id">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">Room ID</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        aria-label="Room ID"
                                        aria-describedby="basic-addon1"
                                        ref={this.room}
                                    />
                                </InputGroup>
                            </Col>
                            <Col>
                                <Button
                                    onClick={this.handleEnterRoom}
                                >
Connect to room
                                </Button>
                            </Col>
                        </Row>
                    )
                    : null}
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
