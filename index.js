/**
 * @format
 */

import {AppRegistry} from 'react-native';
import APP from './src';
import bgMessage from '@components/bgMessage';
import {name as appName} from './app.json';
if (process.env.NODE_ENV !== 'development') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
AppRegistry.registerComponent(appName, () => APP);
AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => bgMessage,
);
