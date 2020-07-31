import React, {Component, PropTypes} from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
  Platform,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import questionProvider from '@data-access/question-provider';
import commentProvider from '@data-access/comment-provider';
import dateUtils from 'mainam-react-native-date-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Form from 'mainam-react-native-form-validate/Form';
import TextField from 'mainam-react-native-form-validate/TextField';
import DialogBox from 'react-native-dialogbox';
import StarRating from 'react-native-star-rating';
import Dash from 'mainam-react-native-dash-view';
import connectionUtils from '@utils/connection-utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ChatScreen from '@containers/chat/ChatScreen';
import CustomMenu from '@components/CustomMenu';
const {width, height} = Dimensions.get('window');
class DetailQuestionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam('item', {}),
      textShow: false,
      data: [
        {
          id: 1,
          message: 'abc',
        },
        {
          id: 2,
          message: 'abc',
        },
        {
          id: 3,
          message: 'abc',
        },
      ],
    };
  }
  goBack = () => {
    this.props.navigation.pop();
  };
  renderItem = ({item, index}) => {
    return (
      <View>
        <Text>{item.message}</Text>
      </View>
    );
  };
  keyExtractor = (item, index) => `${index}`;
  onLayout = event => {
    const {height} = event.nativeEvent.layout;
    if (height > 80) {
      this.setState({isShow: true});
    }
  };
  onShowText = () => {
    this.setState(pre => {
      if (pre.textShow && this.scrollRef) {
        setTimeout(() => {
          this.scrollRef.scrollTo({y: 0});
        }, 500);
      }
      return {textShow: !pre.textShow};
    });
  };
  showImage = i => () => {
    this.props.navigation.navigate('photoViewer', {
      index: i,
      urls: this.state.item.images.map(item => {
        return {uri: item};
      }),
    });
  };
  render() {
    const {item, textShow} = this.state;
    console.log('item: ', item);
    const icSupport = require('@images/new/user.png');
    const avatar = item?.userInfo?.avatar
      ? {uri: item.userInfo.avatar.absoluteUrl()}
      : icSupport;
    return (
      <ActivityPanel
        style={styles.flex}
        // title={constants.title.advisory_online}
        showFullScreen={true}
        actionbar={() => null}
        hideBackButton={true}
        isLoading={this.state.isLoading}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.buttonBack} onPress={this.goBack}>
            <ScaleImage
              source={require('@images/new/ic_back.png')}
              height={16}
              style={{
                tintColor: '#00000090',
              }}
            />
          </TouchableOpacity>
          <View style={styles.containerProfile}>
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
            <View style={styles.groupName}>
              <Text style={styles.txtname}>
                {item?.gender == 1
                  ? 'Nam'
                  : item.gender == 0
                  ? 'Nữ'
                  : 'Ẩn danh'}
                , {item?.age} tuổi
              </Text>
              <Text style={styles.txtTime}>
                {item.createdAt.toDateObject('-').format('dd/MM/yyyy')}
              </Text>
            </View>
          </View>
          {/* <CustomMenu
            MenuSelectOption={
              <View style={styles.buttonMenu}>
                <ScaleImage
                  source={require('@images/new/ic_more.png')}
                  height={12}
                  style={{resizeMode: 'contain'}}
                />
              </View>
            }
            options={[
              {value: 'Báo cáo bài viết', id: 1},
              {value: 'Ẩn bài viết', id: 2},
            ]}
            onSelected={(e, i) => {
              console.log('i: ', i);
              console.log('e: ', e);
            }}
          /> */}
        </View>
        <View style={styles.containerContent}>
          <ScrollView ref={ref => (this.scrollRef = ref)} bounces={false}>
            <View onStartShouldSetResponder={() => true}>
              <Text
                // onLayout={onLayout}
                numberOfLines={textShow ? undefined : 3}
                style={styles.txtMessage}>
                {item.content}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                }}>
                {textShow && item?.images?.length
                  ? item.images.map((e, i) => {
                      return (
                        <TouchableOpacity key={i} onPress={this.showImage(i)}>
                          <Image source={{uri: e}} style={styles.imgQuestion} />
                        </TouchableOpacity>
                      );
                    })
                  : null}
              </View>
            </View>
          </ScrollView>

          {/* {detail.image ?
                        <Image source={{ uri: detail.image }} style={styles.imgQuestion} />
                        : null
                    } */}
          <View style={styles.containerSpecialist}>
            <Text numberOfLines={textShow ? undefined : 1} style={styles.groupSpecialist}>
              {item.specializations.length
                ? item.specializations.map((e, i) => {
                    return (
                      <Text
                        key={i}
                        style={styles.txtSpecialist}
                        numberOfLines={1}>
                        {e.specializationName}
                        {i != item.specializations.length - 1 ? ', ' : ''}
                      </Text>
                    );
                  })
                : null}
            </Text>

            <TouchableOpacity
              onPress={this.onShowText}
              style={styles.buttonHide}>
              <Text style={styles.txtHide}>
                {!textShow ? 'Xem thêm' : 'Rút gọn'}
              </Text>
              <ScaleImage
                style={{
                  tintColor: '#00000070',
                  transform: [{rotate: !textShow ? '0deg' : '180deg'}],
                }}
                source={require('@images/new/down.png')}
                height={9}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.txtLabelChat}>Xem thêm câu trả lời</Text>
        <View style={styles.containerChat}>
          <ChatScreen item={this.state.item} isShowText={false} />
        </View>
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  txtMessage: {
    color: '#000',
  },
  txtHide: {
    color: '#00000070',
    fontStyle: 'italic',
    paddingRight: 7,
  },
  buttonHide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerChat: {
    flex: 1,
  },
  txtLabelChat: {
    fontStyle: 'italic',
    paddingLeft: 10,
    paddingTop: 10,
    fontWeight: 'bold',
  },
  iconShow: {
    tintColor: '#00000070',
    transform: [{rotate: '180deg'}],
  },
  txtShow: {
    color: '#00000070',
    fontStyle: 'italic',
    paddingRight: 7,
  },
  buttonShow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerContent: {
    padding: 10,
    backgroundColor: '#00CBA720',
  },
  buttonBack: {
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  buttonMenu: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 10,
  },
  txtSpecialist: {
    color: '#3161AD',
    fontWeight: 'bold',
  },
  groupSpecialist: {
    backgroundColor: 'rgba(49, 97, 173, 0.1)',
    borderRadius: 4,
    padding: 5,
    maxWidth: '60%',
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  containerSpecialist: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  imgQuestion: {
    width: width / 4,
    height: width / 4,
    marginTop: 5,
    marginRight: 5,
  },

  txtTime: {
    color: '#00000080',
  },
  txtname: {
    color: '#3161AD',
    fontWeight: 'bold',
    fontSize: 15,
  },
  groupName: {
    paddingLeft: 10,
  },
  containerProfile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingLeft: 10,
  },
  containerItem: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    elevation: 1,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    padding: 10,
  },
  boderImage: {borderRadius: 20},
  avatar: {width: 40, height: 40, alignSelf: 'flex-start'},
  imgPlaceHoder: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
});

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
export default connect(mapStateToProps)(DetailQuestionScreen);
