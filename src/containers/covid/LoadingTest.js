import React from 'react';
import {View, StyleSheet} from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import TypingAnimation from '@components/chat/TypingAnimation';
const LoadingTest = () => {
  return (
    <View style={styles.container}>
      <TypingAnimation
        dotMargin={10}
        dotAmplitude={5}
        dotSpeed={0.2}
        dotRadius={5}
        dotX={35}
        dotY={20}
        style={styles.containerTyping}
      />
      <ScaledImage
        source={require('@images/new/covid/ic_robot.png')}
        height={100}
        width={100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerTyping: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    width: 85,
    height: 50,
    right: -60,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingTest;
