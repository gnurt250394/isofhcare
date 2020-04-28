/**
 * @format
 */

import { AppRegistry } from 'react-native'
import APP from './src'
import bgMessage from '@components/bgMessage';
import { name as appName } from './app.json';
import RNCallKeepManager from '@components/RNCallKeepManager'
if (process.env.NODE_ENV !== 'development') {
    console.log = () => { }
    console.warn = () => { }
    console.error = () => { }
}
AppRegistry.registerComponent(appName, () => APP);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessage); 
