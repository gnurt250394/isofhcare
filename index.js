/**
 * @format
 */

import { AppRegistry } from 'react-native'
import APP from './src'
import { name as appName } from './app.json';
if (process.env.NODE_ENV !== 'development') {
    console.log = () => { }
    console.warn = () => { }
    console.error = () => { }
}
AppRegistry.registerComponent(appName, () => APP);
