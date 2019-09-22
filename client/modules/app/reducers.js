import * as types from "./types";

const initialState = {
    peer: null,
    roomId: null,
    accountId: null,
    socket: null,
    localSrc: null,
    remoteSrc: null,
    media: null,
    near: null,
    walletAccount: null,
    contract: null,
};

const defaultState = JSON.parse(JSON.stringify(initialState));

const appReducer = (state = defaultState, action) => {
    switch (action.type) {
        case types.SET_ACCOUNT_ID:
            return { ...state, accountId: action.payload };
        case types.SET_PEER:
            return { ...state, peer: action.payload };
        case types.SET_ROOM:
            return { ...state, roomId: action.payload };
        case types.SET_SOCKET:
            return { ...state, socket: action.payload };
        case types.SET_LOCAL_SRC:
            return { ...state, localSrc: action.payload };
        case types.SET_REMOTE_SRC:
            return { ...state, remoteSrc: action.payload };
        case types.SET_MEDIA:
            return { ...state, media: action.payload };
        case types.SET_NEAR:
            return { ...state, near: action.payload };
        case types.SET_WALLET_ACCOUNT:
            return { ...state, walletAccount: action.payload };
        case types.SET_CONTRACT:
            return { ...state, contract: action.payload };
        default:
            return state;
    }
};

export default appReducer;
