import * as types from "./types";

export const peerConnected = (payload) => ({
    payload,
    type: types.PEER_CONNECTED,
});

export const peerDisconnected = (payload) => ({
    payload,
    type: types.PEER_DISCONNECTED,
});

export const setPeer = (payload) => ({
    payload,
    type: types.SET_PEER,
});

export const setRoom = (payload) => ({
    payload,
    type: types.SET_ROOM,
});

export const setSocket = (payload) => ({
    payload,
    type: types.SET_SOCKET,
});

export const setAccountId = (payload) => ({
    payload,
    type: types.SET_ACCOUNT_ID,
});

export const setLocalSrc = (payload) => ({
    payload,
    type: types.SET_LOCAL_SRC,
});

export const setRemoteSrc = (payload) => ({
    payload,
    type: types.SET_REMOTE_SRC,
});

export const setMedia = (payload) => ({
    payload,
    type: types.SET_MEDIA,
});

export const setNear = (payload) => ({
    payload,
    type: types.SET_NEAR,
});

export const setWalletAccount = (payload) => ({
    payload,
    type: types.SET_WALLET_ACCOUNT,
});

export const setContract = (payload) => ({
    payload,
    type: types.SET_CONTRACT,
});
