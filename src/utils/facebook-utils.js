import { AppEventsLogger } from 'react-native-fbsdk';
export const logEventFB = (event) => {
    AppEventsLogger.logEvent(event);
}