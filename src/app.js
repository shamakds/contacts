import React from "react";
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import * as reducers from './store/reducers';
import Dashboard from "./components/dashboard";

require("./app.scss");

const reducer = combineReducers(reducers);
const store = createStore(reducer);
// store.subscribe(() =>
//     console.log(store.getState())
// );
// store.dispatch({ type: 'INCREMENT' });

export default React.createClass({
    render() {
        return (
            <div>
                <Provider store={store}>
                    <Dashboard />
                </Provider>
            </div>
        );
    }
});
