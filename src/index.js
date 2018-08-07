import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'


import AppReducer from '@reducers';

import { AppNavigator, middleware } from '@navigators/AppNavigator';

const store = createStore(AppReducer, applyMiddleware(middleware));

const Kernel = () => (
    <Provider store={store}>
        <AppNavigator />
    </Provider>
)
export default Kernel