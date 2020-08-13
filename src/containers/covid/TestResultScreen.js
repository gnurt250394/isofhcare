import React, {useEffect, useRef} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  ScrollView,
  StyleSheet,
  DeviceEventEmitter,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {Svg, Circle, TSpan} from 'react-native-svg';
import PreventativeMethod from '@components/covid/PreventativeMethod';
import {useState} from 'react';
const {width, height} = Dimensions.get('screen');

const realWidth = height > width ? width : height;
const realHeight = height > width ? height : width;
const TestResultScreen = ({navigation}) => {
  const [data, setData] = useState(state => navigation.getParam('data', {}));
  
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const scrollRef = useRef();
  const timeout = useRef();
  function handleBackButton() {
    return true;
  }
  //For header background color from transparent to header color
  const _getHeaderBackgroundColor = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: ['rgba(0,0,0,0.0)', '#00CBA7'],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  //For header image opacity
  const _getHeaderImageOpacity = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: [1, 0],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  const relativeWidth = num => (realWidth * num) / 100;
  const relativeHeight = num => (realHeight * num) / 100;

  //artist profile image position from left
  const _getImageLeftPosition = () => {
    return scrollY.interpolate({
      inputRange: [0, 80, 140],
      outputRange: [width / 2 - 50, 38, 10],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  //artist profile image position from top
  const _getImageTopPosition = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: [
        Platform.select({
          android: width / 1.3 / 2 - StatusBar.currentHeight,
          ios: width / 1.3 / 2 - 20,
        }),
        Platform.OS === 'ios' ? 18 : 20,
      ],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  //artist profile image width
  const _getImageWidth = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: [100, 24],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  //artist profile image height
  const _getImageHeight = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: [100, 24],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  const _getScrollPaddingBottom = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: [width / 1.3 / 2 - 20, 55],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  const _getBorderWidth = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: [0, 10],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };
  //artist name opacity
  const _getNormalTitleOpacity = () => {
    return scrollY.interpolate({
      inputRange: [0, 20, 50],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  useEffect(() => {}, [navigation]);
  useEffect(() => {
    scrollY.addListener(({value}) => {
      if (value < 50) {
        if (timeout.current) clearTimeout(timeout.current);
        return;
      }
      if (value < 145) {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          
          scrollRef.current.getNode().scrollTo({
            y: 0,
            animated: true,
          });
        }, 250);
      } else {
        if (timeout.current) clearTimeout(timeout.current);
      }
      // const diff = value - _scrollValue.current;
      // _scrollValue.current = value;
      // _clampedScrollValue.current = Math.min(
      //   Math.max(_clampedScrollValue.current + diff, 0),
      //   NAVBAR_HEIGHT,
      // );
    });
    DeviceEventEmitter.addListener('hardwareBackPress', handleBackButton);
    return () => {
      if (scrollY) scrollY.removeAllListeners();
      DeviceEventEmitter.removeAllListeners(
        'hardwareBackPress',
        handleBackButton,
      );
    };
  }, []);
  const getSource = () => {
    switch (data.level.level) {
      case 1:
        return require('@images/new/covid/ic_success.png');
      case 2:
        return require('@images/new/covid/ic_warning.png');
      case 3:
        return require('@images/new/covid/ic_danger.png');
      default:
        return '';
    }
  };
  const getStatus = () => {
    switch (data.level.level) {
      case 1:
        return 'Bạn vẫn ổn';
      case 2:
        return 'Bạn có khả năng đã bị lây nhiễm';
      case 3:
        return 'Hãy tới gặp bác sĩ ngay';
      default:
        return '';
    }
  };
  const getColor = () => {
    switch (data.level.level) {
      case 1:
        return '#00AA63';
      case 2:
        return '#FF8A00';
      case 3:
        return '#FF0000';
      default:
        return '';
    }
  };
  const onTest = () => {
    navigation.replace('testCovid');
  };
  const goHome = () => {
    navigation.navigate('home');
  };
  const onBooking = () => {
    if (data.level.level == 2) {
      navigation.navigate('listDoctor');
    } else if (data.level.level == 3) {
      navigation.navigate('addBooking1');
    }
  };
  return (
    <View
      style={{
        flex: 1,
      }}>
      <StatusBar translucent backgroundColor="transparent" />

      <View>
        <Animated.View
          style={[styles.containerHeader, {opacity: _getHeaderImageOpacity()}]}
        />

        <Text style={[styles.txtHeader]}>Kết quả kiểm tra</Text>

        <Animated.Image
          source={getSource()}
          style={{
            height: _getImageHeight(),
            width: _getImageWidth(),
            resizeMode: 'contain',
            transform: [
              {translateY: _getImageTopPosition()},
              {translateX: _getImageLeftPosition()},
            ],
          }}
        />
        <Animated.Text
          style={[
            styles.txtStatus,

            {
              color: getColor(),
              opacity: _getNormalTitleOpacity(),
              transform: [{translateY: _getImageTopPosition()}],
            },
          ]}>
          {data?.level?.name}
        </Animated.Text>
      </View>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
        style={{zIndex: 10, paddingTop: _getScrollPaddingBottom()}}
        onScroll={Animated.event([
          {
            nativeEvent: {contentOffset: {y: scrollY}},
          },
        ])}>
        <View style={styles.flex}>
          <Text style={styles.txtSuggestion}>{data?.advice?.description}</Text>
          {data.level.level == 2 ? (
            <TouchableOpacity onPress={onBooking} style={styles.buttonBooking}>
              <Text style={styles.txtBooking}>TƯ VẤN ONLINE</Text>
              <Text style={styles.txtWhite}>
                Đặt lịch tư vấn online với bác sĩ
              </Text>
            </TouchableOpacity>
          ) : data.level.level == 3 ? (
            <TouchableOpacity onPress={onBooking} style={styles.buttonBooking}>
              <Text style={styles.txtBooking}>ĐẶT KHÁM NGAY</Text>
              <Text style={styles.txtWhite}>Đặt lịch hẹn khám tại CSYT</Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.containerGuide}>
            <Text style={styles.txtTitleGuide}>Nên làm gì tiếp theo?</Text>
            {data?.advice?.suggestion?.guides?.length
              ? data?.advice?.suggestion?.guides.map((e, i) => {
                  return (
                    <View key={i} style={styles.containerGuideList}>
                      <ScaledImage
                        source={require('@images/new/covid/ic_add_green.png')}
                        height={12}
                        style={{
                          marginTop: 3,
                        }}
                      />
                      <Text style={styles.txtGuide}>{e}</Text>
                    </View>
                  );
                })
              : null}
          </View>

          <PreventativeMethod />
          <TouchableOpacity onPress={onTest} style={styles.buttonnTest}>
            <Text style={styles.txtWhite}>TEST LẠI</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goHome} style={styles.buttonHome}>
            <Text style={styles.txtHome}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default TestResultScreen;

const styles = StyleSheet.create({
  txtHeader: {
    top: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    paddingBottom: 10,
  },
  txtHome: {
    textDecorationLine: 'underline',
    color: '#3161AD',
  },
  buttonHome: {
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  buttonnTest: {
    backgroundColor: '#00CBA7',
    paddingVertical: 10,
    alignSelf: 'center',
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtWhite: {
    color: '#FFF',
  },
  txtBooking: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonBooking: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#00CBA7',
    marginTop: 15,
    alignSelf: 'center',
    marginBottom: 15,
  },
  txtStatus: {
    fontWeight: 'bold',
    fontSize: 17,
    paddingTop: 10,
    textAlign: 'center',
  },
  txtGuide: {
    color: '#FFF',
    paddingLeft: 10,
  },
  containerGuideList: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  txtTitleGuide: {
    color: '#00CBA7',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  containerGuide: {
    backgroundColor: '#163560',
    padding: 13,
  },
  txtSuggestion: {
    color: '#00000080',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 15,
  },
  flex: {
    flex: 1,
  },
  contentHeader: {
    height: width / 1.3 / 2 - 20,
  },
  groupHeader: {
    position: 'absolute',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    // top: Platform.select({
    //   android: width / 1.3 / 2 - StatusBar.currentHeight,
    //   ios: width / 1.3 / 2 - 20,
    // }),
  },
  containerHeader: {
    backgroundColor: '#00000010',
    height: width * 1.3,
    width: width * 1.3,
    borderRadius: (width * 1.3) / 2,
    position: 'absolute',
    top: -(width / 1.3),
    alignSelf: 'center',
  },
});
