import React, {useEffect} from 'react';
import {DeviceEventEmitter,BackHandler} from 'react-native';
function useBackButton(handler) {
  // Frustration isolated! Yay! 🎉
  useEffect(() => {
    DeviceEventEmitter.addListener('hardwareBackPress', handler);

    return () => {
      DeviceEventEmitter.removeListener('hardwareBackPress', handler);
    };
  }, [handler]);
}
export default useBackButton;
