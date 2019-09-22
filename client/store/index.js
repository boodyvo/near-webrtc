import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "reducers";
import { NODE_ENV } from "config/consts";

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let enhancer;

if (NODE_ENV === "production") {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = createLogger({
        collapsed: true,
        level: "info",
    });
    enhancer = applyMiddleware(thunk, logger);
}

export default () => {
    const store = createStore(persistedReducer, {}, enhancer);
    return { store, persistor: persistStore(store) };
};
