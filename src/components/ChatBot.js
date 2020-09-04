import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
  StyleSheet,
} from 'react-native';
import {withNavigation} from 'react-navigation';
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
    };
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
    if (this.props?.navigation?.state?.routeName == 'chatBot') return null;
    return (
      <SafeAreaView>
        <TouchableOpacity
          style={styles.buttonChat}
          onPress={() => this.props.navigation.navigate('chatBot')}>
          {this.state.isShow ? (
            <View style={styles.containerText}>
              <View
                style={{
                  backgroundColor: '#3161AD',
                  height: 10,
                  width: 10,
                  position: 'absolute',
                  right: -5,
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

          <Image
            source={require('@images/new/ic_robot.gif')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </SafeAreaView>
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
    bottom: 15,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
