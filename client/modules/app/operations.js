import io from "socket.io-client";
// import nearlib from "nearlib";
import { SOCKET_HOST, STUN_SERVER_URL } from "config/consts";
import MediaDevice from "components/MediaDevice";
import { consts } from "config";
import * as actions from "./actions";

export const setRoom = (roomId) => (dispatch) => dispatch(actions.setRoom({ roomId }));
export const setAccountId = (accountId) => (dispatch) => dispatch(actions.setAccountId({ accountId }));

export const initNear = () => async (dispatch) => {
    const near = await window.nearlib.connect({ deps: { keyStore: new window.nearlib.keyStores.BrowserLocalStorageKeyStore() }, ...consts.NEAR_CONFIG });
    dispatch(actions.setNear(near));
    const walletAccount = new window.nearlib.WalletAccount(near);
    dispatch(actions.setWalletAccount(walletAccount));
    const accountId = walletAccount.getAccountId();
    dispatch(actions.setAccountId(accountId));
    const contract = new window.nearlib.Contract(accountId, consts.NEAR_CONFIG.contractName, {
        viewMethods: ["whoSaidHi"],
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: ["sayHi"],
    });
    dispatch(actions.setContract(contract));
};

export const signInNearWallet = () => (dispatch, getState) => {
    getState().app.walletAccount.requestSignIn(consts.NEAR_CONFIG.contractName, consts.NEAR_CONFIG.CONTRACT_NAME)
};

export const connectSocket = () => (dispatch, getState) => {
    console.log("Will connect to", SOCKET_HOST);
    const socket = io(SOCKET_HOST);
    socket
        // .on("request", (data) => this.setState({ callModal: "active", callFrom: data.from }))
        .on("call", (data) => {
            if (data.sdp) {
                getState().app.peer.setRemoteDescription(data.sdp);
                if (data.sdp.type === "offer") {
                    getState().app
                        .peer
                        .createAnswer();
                }
            } else {
                getState().app.peer.addIceCandidate(data.candidate);
            }
        })
        .emit("register", {
            accountId: getState().app.accountId,
        });
    dispatch(actions.setSocket(socket));
};

export const initStream = () => (dispatch, getState) => {
    const peer = new RTCPeerConnection({ iceServers: [{ urls: [STUN_SERVER_URL] }] });
    peer.events = {};
    // eslint-disable-next-line func-names
    peer.emit = function (event, ...args) {
        console.log("emit");
        console.log(event);
        console.log(args);
        if (this.events[event]) {
            this.events[event].forEach((fn) => fn(...args));
        }
        return this;
    };
    // eslint-disable-next-line func-names
    peer.on = function (event, fn) {
        console.log("event");
        console.log(event);
        console.log(this.events);
        if (this.events[event]) this.events[event].push(fn);
        else this.events[event] = [fn];
        return this;
    };
    peer.onicecandidate = (event) => getState().app.socket.emit("call", {
        to: getState().app.roomId,
        candidate: event.candidate,
    });
    peer.on("localStream", (localSrc) => {
        console.log("onlocalStream", localSrc);
        dispatch(actions.setLocalSrc(localSrc));
    });
    peer.on("peerStream", (remoteSrc) => {
        console.log("onpeerStream");
        dispatch(actions.setRemoteSrc(remoteSrc));
    });
    dispatch(actions.setPeer(peer));

    const isStreamer = (getState().app.accountId === getState().app.roomId);

    dispatch(connectSocket());

    const media = new MediaDevice();
    media.on("stream", (stream) => {
        console.log("emited stream");
        getState().app.peer.addStream(stream);
        getState().app.peer.emit("localStream", stream);
        if (isStreamer) {
            getState().app.socket.emit("request", { to: getState().app.roomId });
        } else {
            this.createOffer();
        }
    });
    dispatch(actions.setMedia(media));

    const constraints = {
        video: {
            facingMode: "user",
            height: { min: 360, ideal: 720, max: 1080 },
        },
        audio: true,
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            // eslint-disable-next-line no-param-reassign
            getState().app.media.stream = stream;
            getState().app.media.emit("stream", stream);
        })
        .catch((err) => {
            if (err instanceof DOMException) {
                console.log("Cannot open webcam and/or microphone");
            } else {
                console.log(err);
            }
        });
};

export const startStream = () => (dispatch, getState) => {

    // eslint-disable-next-line no-param-reassign
};

export const createOffer = () => (dispatch, getState) => {
    getState.peer.createOffer()
        .then((description) => {
            getState().app.peer.setLocalDescription(description);
            getState().app.socket.emit("call", { to: getState().app.roomId, sdp: description });
        })
        .catch((err) => console.log(err));
};

export const createAnswer = () => (dispatch, getState) => {
    getState.peer.createAnswer()
        .then((description) => {
            getState().app.peer.setLocalDescription(description);
            getState().app.socket.emit("call", { to: getState().app.roomId, sdp: description });
        })
        .catch((err) => console.log(err));
};

export const setRemoteDescription = (sdp) => (dispatch, getState) => {
    const rtcSdp = new RTCSessionDescription(sdp);
    getState().app.peer.setRemoteDescription(rtcSdp);
};

export const addIceCandidate = (candidate) => (dispatch, getState) => {
    if (candidate) {
        const iceCandidate = new RTCIceCandidate(candidate);
        getState().app.peer.addIceCandidate(iceCandidate);
    }
};
