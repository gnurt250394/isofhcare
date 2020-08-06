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
  Image,
} from 'react-native';
import {Svg, Circle, TSpan} from 'react-native-svg';
import PreventativeMethod from '@components/covid/PreventativeMethod';
import {useState} from 'react';
const {width, height} = Dimensions.get('screen');

const realWidth = height > width ? width : height;
const realHeight = height > width ? height : width;
const TestResultScreen = ({navigation}) => {
  const [data, setData] = useState(state => navigation.getParam('data', {}));
  const [offsetAnim, setOffsetAnim] = useState(new Animated.Value(0));
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const scrollRef = useRef();
  const _scrollEndTimer = useRef(null);
  const _scrollValue = useRef(0);
  function handleBackButton() {
    return true;
  }

  //For header image opacity
  const _getHeaderImageOpacity = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: [1, 0],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };
  const _getHeaderBackground = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: ['#00000000', '#00BA99'],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };
  const _getIconColor = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: ['#000', '#FFF'],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  //artist profile image position from left
  const _getImageLeftPosition = () => {
    return scrollY.interpolate({
      inputRange: [0, 80, 140],
      outputRange: [width / 2 - 50, 38, 50],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  //artist profile image position from top
  const _getImageTopPosition = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: [width / 1.3 / 2, 50],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };
  const _getTextTopPosition = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: [width / 1.3 / 2 + 100, 50],
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
      outputRange: [width / 1.3 / 2 + 50, 55],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  const _getFontSize = () => {
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: [17, 0],
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

  useEffect(() => {
    scrollY.addListener(({value}) => {
      _scrollValue.current = value;
    });
    return () => {
      if (scrollY) scrollY.removeAllListeners();
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
    navigation.navigate('introCovid');
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
  const _onScrollEndDrag = () => {
    _scrollEndTimer.current = setTimeout(_onMomentumScrollEnd, 2000);
  };

  const _onMomentumScrollBegin = () => {
    if (_scrollEndTimer.current) clearTimeout(_scrollEndTimer.current);
  };

  const _onMomentumScrollEnd = () => {
    const toValue =
      _scrollValue.current < 140 && _scrollValue.current > 60
        ? 140
        : _scrollValue.current < 60 && _scrollValue.current > 0
        ? 0
        : null;
    if (toValue || toValue == 0) {
      scrollRef.current.getNode().scrollTo({
        y: toValue,
        animated: true,
      });
    } else {
      _onMomentumScrollBegin();
    }
  };
  const goBack = () => navigation.goBack();
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

        <Animated.View
          style={[
            styles.groupHeader2,
            {
              backgroundColor: _getHeaderBackground(),
            },
          ]}>
          <TouchableOpacity onPress={goBack} style={styles.buttonBack}>
            <Animated.Image
              source={require('@images/new/ic_back.png')}
              style={[]}
              style={[styles.ic_back, {tintColor: _getIconColor()}]}
            />
          </TouchableOpacity>
          <Animated.Text style={[styles.txtHeader, {color: _getIconColor()}]}>
            Kết quả kiểm tra
          </Animated.Text>
          <View style={styles.ic_back} />
        </Animated.View>
        <Animated.Image
          source={getSource()}
          style={{
            position: 'absolute',
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
              position: 'absolute',
              alignSelf: 'center',
              color: getColor(),
              fontSize: _getFontSize(),
              opacity: _getNormalTitleOpacity(),
              transform: [{translateY: _getTextTopPosition()}],
            },
          ]}>
          {data?.level?.name}
        </Animated.Text>
      </View>
      <Animated.ScrollView
        ref={scrollRef}
        onScrollEndDrag={_onScrollEndDrag}
        onMomentumScrollEnd={_onMomentumScrollEnd}
        onMomentumScrollBegin={_onMomentumScrollBegin}
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
              ? data?.suggestion?.guides.map((e, i) => {
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
  buttonBack: {
    paddingHorizontal: 15,
  },
  ic_back: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  groupHeader2: {
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txtHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    paddingRight: 30,
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
