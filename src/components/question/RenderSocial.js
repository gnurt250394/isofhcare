import React, {Component, useState} from 'react';
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
import SocialChatScreen from '@containers/chat/SocialChatScreen';
import {withNavigation} from 'react-navigation';
import ImageSensitive from './ImageSensitive';
const {width, height} = Dimensions.get('window');
const icSupport = require('@images/new/user.png');

const RenderSocial = ({navigation, item, social}) => {
  console.log('item: ', item);
  const [textShow, setTextShow] = useState(true);
  const [listImage, setListImage] = useState(() => {
    let data = [];
    for (let i = 0; i < item?.imageNo; i++) {
      data.push(i);
    }
    return data;
  });

  const onShowText = () => {
    setTextShow(pre => {
      return !pre;
    });
  };
  const showImage = i => () => {
    navigation.navigate('photoViewer', {
      index: i,
      urls: item.images.map(item => {
        return {uri: item};
      }),
    });
  };
  return (
    <View>
      <View style={styles.containerContent}>
        <View>
          <Text
            // onLayout={onLayout}
            // numberOfLines={textShow ? undefined : 3}
            style={styles.txtMessage}>
            {item.content}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            {item?.sensitive
              ? listImage.map((item, index) => {
                  return (
                    <Image
                      source={require('@images/new/community/ic_sensitive.png')}
                      style={styles.imgQuestion}
                    />
                  );
                })
              : item?.images?.length
              ? item.images.map((e, i) => {
                  return (
                    <TouchableOpacity key={i} onPress={showImage(i)}>
                      <Image source={{uri: e}} style={styles.imgQuestion} />
                    </TouchableOpacity>
                  );
                })
              : null}
          </View>
        </View>

        {/* {detail.image ?
                        <Image source={{ uri: detail.image }} style={styles.imgQuestion} />
                        : null
                    } */}
        <View style={styles.containerSpecialist}>
          {item.specializations.length ? (
            <Text
              numberOfLines={textShow ? undefined : 1}
              style={styles.groupSpecialist}>
              {item.specializations.map((e, i) => {
                return (
                  <Text key={i} style={styles.txtSpecialist} numberOfLines={1}>
                    {e.specializationName}
                    {i != item.specializations.length - 1 ? ', ' : ''}
                  </Text>
                );
              })}
            </Text>
          ) : (
            <View />
          )}

          {/* <TouchableOpacity onPress={onShowText} style={styles.buttonHide}>
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
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

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

export default withNavigation(RenderSocial);
