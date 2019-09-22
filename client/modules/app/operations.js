import io from "socket.io-client";
import { SOCKET_HOST, STUN_SERVER_URL } from "config/consts";
import MediaDevice from "components/MediaDevice";
import { consts } from "config";
import * as actions from "./actions";

export const setRoom = (roomId) => (dispatch) => dispatch(actions.setRoom(roomId));

export const createOffer = () => (dispatch, getState) => {
    getState().app.peer.createOffer()
        .then((description) => {
            getState().app.peer.setLocalDescription(description);
            getState().app.socket.emit("call", { to: getState().app.roomId, sdp: description });
        })
        .catch((err) => console.log(err));
};

export const createAnswer = () => (dispatch, getState) => {
    getState().app.peer.createAnswer()
        .then((description) => {
            getState().app.peer.setLocalDescription(description);
            console.log("request call");
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

export const connectSocket = () => (dispatch, getState) => {
    console.log("Will connect to", SOCKET_HOST);
    const socket = io(SOCKET_HOST);
    socket
        .on("call", (data) => {
            console.log("response on call");
            if (data.sdp) {
                dispatch(setRemoteDescription(data.sdp));
                if (data.sdp.type === "offer") {
                    dispatch(createAnswer());
                }
            } else {
                dispatch(addIceCandidate(data.candidate));
            }
        });
    dispatch(actions.setSocket(socket));
};

export const initNear = () => async (dispatch, getState) => {
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

    if (getState().app.socket) {
        getState().app.socket.emit("register", {
            accountId: getState().app.accountId,
        });
    }
};

export const signInNearWallet = () => (dispatch, getState) => {
    getState().app.walletAccount.requestSignIn(consts.NEAR_CONFIG.contractName, consts.NEAR_CONFIG.CONTRACT_NAME);
};

export const signOutNearWallet = () => (dispatch, getState) => {
    getState().app.walletAccount.signOut();
    dispatch(actions.setAccountId(null));
};

export const initStream = () => (dispatch, getState) => {
    const peer = new RTCPeerConnection({ iceServers: [{ urls: [STUN_SERVER_URL] }] });
    peer.events = {};
    // eslint-disable-next-line func-names
    peer.emit = function (event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach((fn) => fn(...args));
        }
        return this;
    };
    // eslint-disable-next-line func-names
    peer.on = function (event, fn) {
        if (this.events[event]) this.events[event].push(fn);
        else this.events[event] = [fn];
        return this;
    };
    peer.onicecandidate = (event) => getState().app.socket.emit("call", {
        to: getState().app.roomId,
        candidate: event.candidate,
    });
    peer.on("localStream", (localSrc) => {
        dispatch(actions.setLocalSrc(localSrc));
    });
    peer.on("peerStream", (remoteSrc) => {
        dispatch(actions.setRemoteSrc(remoteSrc));
    });
    dispatch(actions.setPeer(peer));

    const isStreamer = (getState().app.accountId === getState().app.roomId);

    dispatch(connectSocket());

    const media = new MediaDevice();
    media.on("stream", (stream) => {
        getState().app.peer.addStream(stream);
        getState().app.peer.emit("localStream", stream);
        if (isStreamer) {
            getState().app.socket.emit("request", { to: getState().app.roomId });
        } else {
            dispatch(createOffer());
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

    window.navigator.mediaDevices.getUserMedia(constraints)
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
