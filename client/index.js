import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "pages/app";
import configureStore from "store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/index.scss";

const { persistor, store } = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Router>
                <App />
            </Router>
        </PersistGate>
    </Provider>,
    document.getElementById("root"),
);
