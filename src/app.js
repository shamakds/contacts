import React from 'react';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import * as reducers from './store/reducers';
import Dashboard from './components/dashboard';
import './app.scss';

const reducer = combineReducers(reducers);
const store = createStore(reducer);

export default () => {
    return (
        <div>
            <Provider store={store}>
                <Dashboard/>
            </Provider>
        </div>
    );
};
