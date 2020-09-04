import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {EasingNode} from 'react-native-reanimated';
import Interactable from '@components/Interactable';
const {width, height} = Dimensions.get('window');
const widthFactor = width / 375;
const heightFactor = (height - 75) / 667;

const showSecondFace = true;

export default class ChatHeads extends Component {
  constructor(props) {
    super(props);
    this._deltaX = new Animated.Value(0);
    this._deltaY = new Animated.Value(0);
    this._face1Scale = new Animated.Value(1);
    this._face2Scale = new Animated.Value(1);
  }

  render() {
    return (
      <View style={styles.container} pointerEvents="box-none">
        <Interactable.View
          snapPoints={[
            {x: -150 * widthFactor, y: 0},
            {x: -150 * widthFactor, y: -150 * heightFactor},
            {x: -150 * widthFactor, y: 150 * heightFactor},
            {x: -150 * widthFactor, y: -270 * heightFactor},
            {x: -150 * widthFactor, y: 270 * heightFactor},
            {x: 150 * widthFactor, y: 0},
            {x: 150 * widthFactor, y: 150 * heightFactor},
            {x: 150 * widthFactor, y: -150 * heightFactor},
            {x: 150 * widthFactor, y: -270 * heightFactor},
            {x: 150 * widthFactor, y: 270 * heightFactor},
          ]}
          initialPosition={{x: -150 * widthFactor, y: 270 * heightFactor}}>
          <TouchableWithoutFeedback onPress={this.props.onPress}>
            <Image
              style={styles.image}
              source={require('@images/new/ic_robot.gif')}
            />
          </TouchableWithoutFeedback>
        </Interactable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  head: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  image: {
    width: 78,
    height: 78,
    borderRadius: 40,
  },
  frame: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  marker: {
    width: 60,
    height: 60,
    margin: 10,
    position: 'relative',
  },
});
