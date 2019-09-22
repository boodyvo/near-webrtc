import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer } from "redux-persist";
import app from "modules/app";

const appPersistConfig = {
    key: "app",
    storage,
    blacklist: ["socket", "localSrc", "peerSrc", "media", "near"],
};

export default combineReducers({
    routing: routerReducer,
    app: persistReducer(appPersistConfig, app),
});
