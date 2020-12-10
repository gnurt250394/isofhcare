import firebase from 'react-native-firebase';
export default {
  sendEvent(event) {
    firebase.analytics().logEvent(event);
  },
};
