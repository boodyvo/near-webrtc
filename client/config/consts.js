import { consts } from "./index";

export const STUN_SERVER_URL = "stun:stun.l.google.com:19302";

export const { NODE_ENV } = process.env;
export const SOCKET_HOST = "localhost:3000";
export const CONTRACT_NAME = "near-webrtc";

export const NEAR_CONFIG = {
    networkId: "default",
    nodeUrl: "https://rpc.nearprotocol.com",
    contractName: CONTRACT_NAME,
    walletUrl: "https://wallet.nearprotocol.com",
    initialBalance: 100000000,
};
