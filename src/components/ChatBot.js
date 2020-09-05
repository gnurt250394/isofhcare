import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
  Animated,
  StyleSheet,
  PanResponder,
  Easing,
  Dimensions,
} from 'react-native';
import {withNavigation} from 'react-navigation';
const {height, width} = Dimensions.get('window');
const text = 'Xin chào tôi là mimi rất vui được trò truyện với bạn';
class ChatBot extends React.PureComponent {
  animatedText = [];
  constructor(props) {
    super(props);
    let arrText = text.trim().split(' ');
    arrText.forEach((_, i) => {
      this.animatedText[i] = new Animated.Value(0);
    });
    this.arrText = arrText;
    this.timeout = null;
    this.state = {
      isShow: true,
      showDraggable: true,
      dropZoneValues: null,
      pan: new Animated.ValueXY({x: 0, y: height - 150}),
    };
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        },
      ]),
      onPanResponderGrant: (event, gesture) => {
        this.state.pan.setOffset({
          x: this.state.pan.x._value,
          y: this.state.pan.y._value,
        });
      },
      onPanResponderRelease: (e, gesture) => {
        this.state.pan.flattenOffset();
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        //return true if user is swiping, return false if it's a single click
        return !(gestureState.dx === 0 && gestureState.dy === 0);
      },
    });
  }
  componentDidMount() {
    this.animated();
    this.timeout = setTimeout(() => {
      this.setState({isShow: false});
    }, 9000);
  }

  animated = (toValue = 1) => {
    const animations = this.arrText.map((_, i) => {
      return Animated.timing(this.animatedText[i], {
        toValue,
        duration: 1500,
      });
    });
    Animated.stagger(100, animations).start();
  };
  render() {
    if (
      this.props?.navigation?.state?.routeName == 'chatBot' ||
      this.props?.navigation?.state?.routeName == 'splash' ||
      this.props?.navigation?.state?.routeName == 'intro'
    )
      return null;
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        // onTouchEndCapture={() => this.props.navigation.navigate('chatBot')}
        style={[this.state.pan.getLayout(), styles.buttonChat]}>
        <TouchableWithoutFeedback
          onPress={() => this.props.navigation.navigate('chatBot')}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Image
              source={require('@images/new/ic_robot.gif')}
              style={styles.icon}
            />
            {this.state.isShow ? (
              <View style={styles.containerText}>
                <View
                  style={{
                    backgroundColor: '#3161AD',
                    height: 10,
                    width: 10,
                    position: 'absolute',
                    left: -5,
                    transform: [{rotate: '45deg'}],
                  }}
                />
                {this.arrText.map((item, index) => {
                  return (
                    <Animated.Text
                      key={index}
                      style={[
                        styles.txt,
                        {
                          opacity: this.animatedText[index],
                          transform: [
                            {
                              translateY: Animated.multiply(
                                this.animatedText[index],
                                new Animated.Value(-3),
                              ),
                            },
                          ],
                        },
                      ]}>
                      {item}
                    </Animated.Text>
                  );
                })}
              </View>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

export default withNavigation(ChatBot);

const styles = StyleSheet.create({
  icon: {
    height: 80,
    width: 80,
  },
  txt: {
    paddingRight: 5,
    paddingTop: 5,
    color: '#FFF',
    fontSize: 12,
  },
  containerText: {
    backgroundColor: '#3161AD',
    borderRadius: 5,
    padding: 5,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexShrink: 1,
    maxWidth: '50%',
  },
  buttonChat: {
    position: 'absolute',
  },
});
