import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
  Image,
  Animated,
  DeviceEventEmitter,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import {connect} from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import questionProvider from '@data-access/question-provider';
import dateUtils from 'mainam-react-native-date-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import ListQuestion from '@components/question/ListQuestion';
import {IndicatorViewPager} from 'mainam-react-native-viewpager';
import ItemQuestion from '@components/question/ItemQuestion';
import ListSpecialQuestion from '@components/question/ListSpecialQuestion';
import RenderPlaceHolder from '@components/community/RenderPlaceHolder';
import firebaseUtils from '@utils/firebase-utils';
const {width, height} = Dimensions.get('screen');

const NAVBAR_HEIGHT = 180;
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 24});

const AnimatedListView = Animated.createAnimatedComponent(FlatList);
class ListQuestionScreen extends Component {
  constructor(props) {
    super(props);
    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);
    this.state = {
      tabIndex: 0,
      refreshing: false,
      data: [],
      isLoading: true,
      page: 0,
      size: 20,
      value: '',
      specialId: '',
      onFocus: true,
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        NAVBAR_HEIGHT,
      ),
    };
  }
  _clampedScrollValue = 0;
  _offsetValue = 0;
  _scrollValue = 0;
  componentDidMount() {
    firebaseUtils.sendEvent('Community_screen');
    this.state.scrollAnim.addListener(({value}) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        NAVBAR_HEIGHT,
      );
    });
    this.state.offsetAnim.addListener(({value}) => {
      this._offsetValue = value;
    });
    // this.getListSpecialist();
    DeviceEventEmitter.addListener(
      'hardwareBackPress',
      this.handleHardwareBack.bind(this),
    );
    this.getListQuestions();
    this.onFocus = this.props.navigation.addListener('didFocus', payload => {
      if (!payload?.action?.preserveFocus)
        this.setState({page: 0, onFocus: true}, this.getListQuestions);
    });
    this.didBlur = this.props.navigation.addListener('didBlur', payload => {
      if (!payload?.action?.preserveFocus)
        this.setState({onFocus: false, specialId: '', value: ''});
    });
  }
  componentWillUnmount = () => {
    if (this.state.scrollAnim) this.state.scrollAnim.removeAllListeners();
    if (this.state.offsetAnim) this.state.offsetAnim.removeAllListeners();
    if (this.onFocus) {
      this.onFocus.remove();
    }
    if (this.didBlur) {
      this.didBlur.remove();
    }
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
  };
  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const toValue =
      this._scrollValue > NAVBAR_HEIGHT &&
      this._clampedScrollValue > NAVBAR_HEIGHT / 2
        ? this._offsetValue + NAVBAR_HEIGHT
        : this._offsetValue - NAVBAR_HEIGHT;

    Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  handleHardwareBack = () => {
    // this.props.navigation.goBack();
    return true;
  };
  getListQuestions = async value => {
    try {
      const {page, size, value, specialId} = this.state;
      let res = await questionProvider.listQuestionSocial(
        value,
        specialId,
        page,
        size,
      );

      this.setState({isLoading: false, refreshing: false});
      if (res?.content) {
        this.formatData(res.content);
      } else {
        this.formatData([]);
      }
    } catch (error) {
      this.formatData([]);
      this.setState({isLoading: false, refreshing: false});
    }
  };
  onSelected = item => {
    this.setState(
      {specialId: item.id, isLoading: true, page: 0, onFocus: false},
      () => {
        this.getListQuestions();
      },
    );
  };
  onChangeText = value => {
    this.setState({value}, () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.setState({isLoading: true, page: 0}, () => {
          firebaseUtils.sendEvent('question_search');
          this.getListQuestions();
        });
      }, 500);
    });
  };
  formatData = data => {
    if (data.length == 0) {
      if (this.state.page == 0) {
        this.setState({data: []});
      }
    } else {
      if (this.state.page == 0) {
        this.setState({data});
      } else {
        this.setState(preState => ({data: [...preState.data, ...data]}));
      }
    }
  };
  _onEndReached = () => {
    const {data, page, size} = this.state;
    if (data.length >= (page + 1) * size) {
      this.setState(pre => ({page: pre.page + 1}), this.getListQuestions);
    }
  };
  _onRefresh = () => {
    this.setState(
      {refreshing: true, page: 0, value: '', specialId: '', onFocus: true},
      this.getListQuestions,
    );
  };
  onClickCreateMenu = () => {
    firebaseUtils.sendEvent('askdoctor_screen_community');
    this.props.navigation.navigate('createQuestionStep');
  };
  onMyQuestion = () => {
    firebaseUtils.sendEvent('Yourquestion_screen');
    this.props.navigation.navigate('listMyQuestion');
  };
  menuCreate() {
    return (
      <TouchableOpacity style={{marginRight: 20}} onPress={this.onMyQuestion}>
        <ScaleImage source={require('@images/new/ic_chat.png')} width={32} />
      </TouchableOpacity>
    );
  }

  goToDetailQuestion = item => () => {
    firebaseUtils.sendEvent('Question_detail');
    this.props.navigation.navigate('detailQuestion', {item, social: true});
  };
  keyExtractor = (item, index) => `${index}`;
  renderItem = ({item, index}) => {
    return (
      <ItemQuestion
        item={item}
        onPress={this.goToDetailQuestion(item)}
        social={true}
      />
    );
  };
  ItemSeparator = () => {
    return <View style={styles.lineBetwenItem} />;
  };

  render() {
    const {clampedScroll} = this.state;

    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT],
      outputRange: [0, -NAVBAR_HEIGHT],
      extrapolate: 'clamp',
    });
    const navbarOpacity = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const icSupport = require('@images/new/user.png');
    const avatar = this.props?.userApp?.currentUser?.avatar
      ? {uri: this.props.userApp.currentUser.avatar.absoluteUrl()}
      : icSupport;
    return (
      <ActivityPanel
        // title={constants.title.advisory_online}
        backButtonClick={() => this.props.navigation.goBack()}
        titleView={
          <View style={styles.containerTitle}>
            <TextInput
              style={styles.inputTitle}
              onChangeText={this.onChangeText}
              value={this.state.value}
              placeholder="Tìm kiếm câu hỏi"
              placeholderTextColor="#FFF"
            />
            {/* <TouchableOpacity style={[styles.buttonSearch, { borderLeftColor: '#BBB', borderLeftWidth: 0.7 }]} onPress={this.onRefress}>
                            <ScaleImage source={require('@images/ic_close.png')} height={16} />
                        </TouchableOpacity>
                            : */}
            <TouchableOpacity
              style={[styles.buttonSearch]}
              onPress={this.onSearch}>
              <ScaleImage
                source={require('@images/new/ic_search.png')}
                height={16}
              />
            </TouchableOpacity>
          </View>
        }
        titleViewStyle={styles.titleViewStyle}
        menuButton={this.props.userApp.isLogin ? this.menuCreate() : null}
        titleStyle={[
          this.props.userApp.isLogin ? {marginRight: 0} : {},
          {color: '#FFF'},
        ]}>
        <View
          style={{
            flex: 1,
            zIndex: 0,
          }}>
          <View>
            {this.state.isLoading ? (
              <RenderPlaceHolder />
            ) : (
              <AnimatedListView
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                onEndReached={this._onEndReached}
                onEndReachedThreshold={0.7}
                onRefresh={this._onRefresh}
                contentContainerStyle={{
                  paddingTop: NAVBAR_HEIGHT,
                }}
                refreshing={this.state.refreshing}
                ItemSeparatorComponent={this.ItemSeparator}
                scrollEventThrottle={1}
                onMomentumScrollBegin={this._onMomentumScrollBegin}
                onMomentumScrollEnd={this._onMomentumScrollEnd}
                onScrollEndDrag={this._onScrollEndDrag}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: this.state.scrollAnim}}}],
                  {useNativeDriver: true},
                )}
              />
            )}
            <Animated.View
              style={[
                styles.conntainerSpecialAnim,
                {
                  transform: [{translateY: navbarTranslate}],
                  opacity: navbarOpacity,
                },
              ]}
              onLayout={({nativeEvent}) =>
                this.setState({height: nativeEvent.layout.height})
              }>
              <View style={styles.containerQuestion}>
                <ImageLoad
                  resizeMode="cover"
                  imageStyle={styles.boderImage}
                  borderRadius={20}
                  customImagePlaceholderDefaultStyle={styles.imgPlaceHoder}
                  placeholderSource={icSupport}
                  style={styles.avatar}
                  loadingStyle={{size: 'small', color: 'gray'}}
                  source={avatar}
                  defaultImage={() => {
                    return (
                      <ScaleImage
                        resizeMode="cover"
                        source={icSupport}
                        width={90}
                        style={styles.imgDefault}
                      />
                    );
                  }}
                />
                <TouchableOpacity
                  style={styles.buttonQuestion}
                  onPress={this.onClickCreateMenu}>
                  <Text>Hãy viết câu hỏi của bạn</Text>
                </TouchableOpacity>
              </View>
              <ListSpecialQuestion
                onSelected={this.onSelected}
                onFocus={this.state.onFocus}
              />
            </Animated.View>
          </View>
        </View>
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  conntainerSpecialAnim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: NAVBAR_HEIGHT,
    backgroundColor: '#fff',
  },
  lineBetwenItem: {
    backgroundColor: '#00000010',
    height: 6,
  },
  buttonQuestion: {
    borderColor: '#BBB',
    borderWidth: 1,
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    paddingLeft: 10,
    marginLeft: 10,
  },
  containerQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    elevation: 1,
    backgroundColor: '#FFF',
  },
  titleViewStyle: {
    flex: 1,
    marginRight: 10,
  },
  inputTitle: {
    color: '#FFF',
    flex: 1,
  },
  containerTitle: {
    flex: 1,
    backgroundColor: '#00000020',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginLeft: 10,
  },
  containerItemSpecialist: {
    maxWidth: width / 2.5,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 30,
    padding: 15,
  },
  boderImage: {borderRadius: 20},
  avatar: {width: 40, height: 40, alignSelf: 'flex-start'},
  imgPlaceHoder: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },

  buttonSearch: {
    marginRight: -2,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
export default connect(mapStateToProps)(ListQuestionScreen);
