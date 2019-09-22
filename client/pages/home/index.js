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

    render() {
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
                            onClick={this.handleSignIn}
                        >
                            SignIn
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
};

const mapDispatchToProps = (dispatch) => ({
    setRoom: (roomId) => dispatch(appOperations.setRoom(roomId)),
    signInNearWallet: () => dispatch(appOperations.signInNearWallet()),
});

export default withRouter(connect(null, mapDispatchToProps)(HomePage));
