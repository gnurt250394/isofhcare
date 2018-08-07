import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import AppReducer from '@reducers';

import { RootNavigator } from './navigators/AppNavigator';

const store = createStore(AppReducer, applyMiddleware(thunk));

const Kernel = () => (
    <Provider store={store}>
        <RootNavigator />
    </Provider>
)
export default Kernel