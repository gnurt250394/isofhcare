import React from 'react'
import { Provider } from 'react-redux'
import { Root } from 'native-base';
import { MenuProvider } from 'react-native-popup-menu';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import AppReducer from '@reducers';

import { RootNavigator } from '@navigators/AppNavigator';

const store = createStore(AppReducer, applyMiddleware(thunk));

const Kernel = () => (
    <Provider store={store}>
        <Root>
            <RootNavigator />
        </Root>
    </Provider>
)
export default Kernel