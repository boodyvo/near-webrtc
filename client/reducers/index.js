import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import app from "modules/app";

export default combineReducers({
    routing: routerReducer,
    app,
});
