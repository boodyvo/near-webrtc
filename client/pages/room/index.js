import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import {
    Button, Col, Container, FormControl, InputGroup, Row,
} from "react-bootstrap";
import { appOperations } from "modules/app";
import { routes } from "config";

class RoomPage extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        dispatch(appOperations.initStream());
    }

    componentDidMount() {
        this.setMediaStream();
    }

    componentDidUpdate() {
        this.setMediaStream();
    }

    setMediaStream() {
        const { peerSrc, localSrc } = this.props;
        if (this.peerVideo && peerSrc) this.peerVideo.srcObject = peerSrc;
        if (this.localVideo && localSrc) this.localVideo.srcObject = localSrc;
    }

    render() {
        const { accountId } = this.props;
        let redirect = null;
        if (accountId === undefined || accountId === null) {
            redirect = <Redirect to={routes.HOME_PAGE.path} />;
        }
        console.log("accountId", accountId);
        console.log("redirect", redirect);

        return (
            <Container>
                <Row>
                    <Col>
                        New room
                    </Col>
                </Row>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption,no-return-assign */}
                <video id="peerVideo" ref={(el) => this.peerVideo = el} autoPlay />
                {/* eslint-disable-next-line no-return-assign */}
                <video id="localVideo" ref={(el) => this.localVideo = el} autoPlay muted />
                {redirect}
            </Container>
        );
    }
}

RoomPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.object, // eslint-disable-line
    localSrc: PropTypes.object, // eslint-disable-line
    peerSrc: PropTypes.object, // eslint-disable-line
    accountId: PropTypes.string,
};

const mapStateToProps = (state) => ({
    media: state.app.media,
    localSrc: state.app.localSrc,
    peerSrc: state.app.peerSrc,
    accountId: state.app.accountId,
});

export default connect(mapStateToProps)(RoomPage);
