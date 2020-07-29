import React, {useEffect, useState, useRef} from 'react';
import {
  Animated,
  UIManager,
  TextInput,
  Keyboard,
  Dimensions,
} from 'react-native';
const {State: TextInputState} = TextInput;

const KeyboardShift = ({children}) => {
  const [shift, setShift] = useState(new Animated.Value(0));
  const keyboardDidShowListener = useRef(null);
  const keyboardDidHideListener = useRef(null);
  const keyboardDidHide = e => {
    console.log('e: ', e);
    Animated.timing(shift, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const keyboardDidShow = event => {
    const {height: windowHeight} = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    console.log('keyboardHeight: ', keyboardHeight);
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    console.log('currentlyFocusedField: ', currentlyFocusedField);
    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap =
          windowHeight - keyboardHeight - (fieldTop + fieldHeight) - 20;
        if (gap >= 0) {
          return;
        }
        Animated.timing(shift, {
          toValue: gap,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    );
  };
  useEffect(() => {
    keyboardDidHideListener.current = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );
    keyboardDidShowListener.current = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow,
    );
    return () => {
      keyboardDidHideListener.current.remove();
      keyboardDidShowListener.current.remove();
    };
  }, []);
  return (
    <Animated.View style={[{transform: [{translateY: shift}]}]}>
      {children}
    </Animated.View>
  );
};

export default KeyboardShift;
