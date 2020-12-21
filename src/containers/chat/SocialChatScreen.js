/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, useEffect, useContext, useRef, useState} from 'react';
import {
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
  AppState,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtisl from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import snackbar from '@utils/snackbar-utils';
import MyMessage from '@components/chat/MyMessage';
import TheirMessage from '@components/chat/TheirMessage';
import ImagePicker from 'mainam-react-native-select-image';
import firebaseUtils from '@utils/firebase-utils';
import {connect, useSelector} from 'react-redux';
import imageProvider from '@data-access/image-provider';
import constants from '@resources/strings';
import userProvider from '@data-access/user-provider';
import TypingAnimation from '@components/chat/TypingAnimation';
import KeyboardShift from '@components/question/KeyboardShift';
import ModalConfirmSend from '@components/chat/ModalConfirmSend';
import questionProvider from '@data-access/question-provider';
import connectionUtils from '@utils/connection-utils';
import {RectButton} from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import io from 'socket.io-client';
import RenderSocial from '@components/question/RenderSocial';
import Footer from './Footer';
const ChatView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();

const SocialChatScreen = ({
  item,
  isShowText,
  messageWarning,
  keyboardVerticalOffset,
  navigation,
  social,
}) => {
  // room = navigation ? navigation.getParam('item', {})
  const userApp = useSelector(state => state.auth.userApp);
  const [state, _setState] = useState({
    // title: room.roomName,
    lastMessage: null,
    firstTime: true,
    chatProfile: {},
    typing: [],
    text: '',
    data: [],
    dataId: [],
    isLoading: true,
    loadingMessage: false,
    isVisible: false,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listImage, setListImage] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const setState = (data = {}) => {
    _setState(state => ({...state, ...data}));
  };
  const flatList = useRef(null);
  const timeout = useRef(null);
  const row = useRef([]);
  const prevOpenedRow = useRef(null);
  const txtMessage = useRef(null);
  const imagePicker = useRef(null);
  const dataIds = useRef([]);
  const loadPreMessages = callback => {
    setState({loadingPre: true}, () => {
      firebaseUtils
        .getMessages(state.groupId, 10, state.lastMessage)
        .then(s => {
          let lastMessage = state.lastMessage;
          s.forEach(item => {
            if (dataIds.indexOf(item.id) == -1) {
              data.splice(0, 0, item.data());
              dataIds.splice(0, 0, item.id);
            }
          });
          if (s.length > 0) {
            lastMessage = s[s.length - 1];
          }
          setState(
            {
              lastMessage,
              loadingPre: false,
              data: [...data],
              loadFinish: s.length == 0,
            },
            callback,
          );
          if (state.firstTime) {
            setTimeout(() => {
              if (flatList.current)
                flatList.current.scrollToEnd({animated: true});
            }, 1000);
            setState({
              firstTime: false,
            });
          }
        })
        .catch(x => {
          setState({loadingPre: false}, callback);
        });
    });
  };
  const getListAnwser = async () => {
    try {
      let res = await questionProvider.listAnwser(item.id, true, page, size);
      console.log('res: ', res);
      setLoading(false);
      if (res?.content) formatData(res.content);
      else formatData([]);
    } catch (error) {
      setLoading(false);
      formatData([]);
      console.log('error: ', error);
    }
  };
  const formatData = data => {
    if (data.length == 0) {
      if (page == 0) {
        setData(state => []);
      }
    } else {
      if (page == 0) {
        setData(state => data);
      } else {
        setData(state => [...state, ...data]);
      }
    }
  };
  const onLoadMore = () => {
    if (data.length >= (page + 1) * size) {
      setPage(page => page + 1);
      setLoading(true);
    }
  };
  useEffect(() => {
    getListAnwser();
  }, []);
  useEffect(() => {
    if (loading) getListAnwser();
  }, [page, loading]);

  const listFooter = () => {
    if (data.length >= (page + 1) * size) {
      if (loading) {
        return (
          <View style={{alignItems: 'center'}}>
            <ActivityIndicator
              style={{margin: 5}}
              color={'#3161AD'}
              size="small"
            />
          </View>
        );
      } else {
        return (
          <TouchableOpacity onPress={onLoadMore} style={styles.buttonLoading}>
            <Text style={styles.txtLoading}>Xem thêm câu trả lời</Text>
          </TouchableOpacity>
        );
      }
    } else return null;
  };
  const _renderStatus = () => {
    switch (item.status) {
      case 'REJECT':
        return 'Câu hỏi của bạn đã bị từ chối vì vi phạm các quy định của ứng dụng.';
      case 'DONE':
        return 'Cuộc tư vấn của bạn đã kết thúc';
      case 'NEW':
        return '';
      default:
        return '* Câu trả lời của bạn sẽ được hiển thị trên cộng đồng';
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={{flex: 1, backgroundColor: '#FFF', paddingBottom: 10}}>
          <RenderSocial item={item} social={social} />
          <FlatList
            style={{flex: 1, paddingBottom: 20}}
            ref={flatList}
            keyExtractor={(item, index) => index.toString()}
            extraData={state}
            data={data}
            scrollEnabled={false}
            ListFooterComponent={listFooter}
            renderItem={props => (
              <View>
                {props.item?.userId != item?.doctorInfo?.id ? (
                  <MyMessage
                    isLast={props.index == 0}
                    message={props.item}
                    preMessage={props.index == 0 ? null : data[props.index - 1]}
                  />
                ) : (
                  <TheirMessage
                    // chatProfile={getChatProfile(props.item.userId)}
                    isLast={props.index == 0}
                    message={props.item}
                    info={item.doctorInfo}
                    preMessage={props.index == 0 ? null : data[props.index - 1]}
                  />
                )}
              </View>
            )}
          />
          <ImagePicker ref={imagePicker} />
        </View>
      </ScrollView>
      <Footer item={item} />
    </View>
  );
};

export default SocialChatScreen;

const styles = StyleSheet.create({
  txtLoading: {
    fontWeight: 'bold',
  },
  buttonLoading: {
    alignSelf: 'center',
    padding: 10,
  },
  actionText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  animButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonSwiable: {
    backgroundColor: 'red',
    minHeight: 40,
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelectImage: {
    marginTop: 10,
    width: 60,
    height: 60,
  },
  buttonClose: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  imageLoading: {
    position: 'absolute',
    left: 20,
    top: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  imageError: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  imagePicker: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  groupImage: {
    marginTop: 6,
    width: 60,
    height: 60,
  },
  groupImagePicker: {
    margin: 2,
    width: 66,
    height: 66,
    position: 'relative',
  },
  txtWarning: {
    textAlign: 'center',
    paddingTop: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  txtSend: {
    fontWeight: 'bold',
    color: 'white',
    minWidth: 50,
    textAlign: 'center',
  },
  buttonSend: {
    height: 40,
    margin: 5,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputMes: {
    color: '#000',
    padding: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
  containerInput: {
    flex: 1,
    backgroundColor: '#00000010',
    // maxHeight: 100,
    margin: 5,
    borderRadius: 7,
    marginLeft: 0,
    marginRight: 5,
    justifyContent: 'center',
  },
  buttonSelectImage: {
    width: 40,
    height: 40,
    marginTop: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: 10,
  },
  containerSendMes: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 0,
    marginTop: 5,
    borderTopColor: '#00000020',
    borderTopWidth: 1,
  },
  dotAnimation: {
    marginBottom: 10,
    marginLeft: 0,
  },
  txtTyping: {
    fontStyle: 'italic',
    padding: 10,
  },
  containerTyping: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtLoadPreMessage: {
    color: '#FFF',
    padding: 10,
  },
  buttonLoadPreMessage: {
    borderRadius: 15,
    margin: 10,
    backgroundColor: '#00000050',
  },
});
