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
import io from 'socket.io-client';
const ChatView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();

const ChatScreen = ({
  item,
  isShowText,
  messageWarning,
  keyboardVerticalOffset,
  navigation,
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
  const [listImage, setListImage] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const setState = (data = {}) => {
    _setState(state => ({...state, ...data}));
  };
  const flatList = useRef(null);
  const socket = useRef(null);
  const count = useRef(0);
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
      let res = await questionProvider.listAnwser(item.id, page, size);
      console.log('res: ', res);
      if (res?.content) formatData(res.content);
      else formatData([]);
    } catch (error) {
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
    }
  };
  useEffect(() => {
    getListAnwser();
  }, [page]);
  const sendMessage = async () => {
    try {
      let res = await questionProvider.sendMessage(
        item.id,
        state.newMessage,
        listImage,
      );
      console.log('res: ', res);
      if (res) {
        let list = [...data];
        // let i = data.findIndex(
        //   e => e && !e.id && e.user.id == res.userId,
        // );

        // if (i != -1) {
        //   list.splice(i, 1, res);
        // }
        list.unshift(res);
        setData(state => list);
      }
    } catch (error) {}
  };
  useEffect(() => {
    const socket = io("http://10.0.0.98:8000",{
      host: 'http://10.0.0.98',
      port: 8000,
      autoConnect:true,
    });
    socket.connect()
    console.log('socket: ', socket);
    socket.on(
      constants.socket_type.QUESTION + item.id,
      (res, callback) => {
        console.log('data: ', res);
        let data2 = [];

        data2.push(res);
        setState({isLoading: false});
        setData(state => [...data2, ...state]);
        onScrollToEnd();
      },
    );
    return () => {};
  }, []);

  const selectImage = () => {
    if (imagePicker.current) {
      imagePicker.current.open(false, 200, 200, selectImageCallback);
    }
  };

  const selectImageCallback = image => {
    // RNFS.readFile(image.path, 'base64').then(res => {
    //   let data2 = [];
    //   data2.push({
    //     message: image.path,
    //     user: userApp.currentUser,
    //     item,
    //     type: 4,
    //     base64: res,
    //   });
    //   setData(state => [...state, ...data2]);
    //   onScrollToEnd();
    // });
    setState({isLoading: true}, () => {
      imageProvider.upload(image.path, image.mime, (s, e) => {
        setState({isLoading: false});
        if (s.success) {
          if (
            s.data.code == 0 &&
            s.data.data &&
            s.data.data.images &&
            s.data.data.images.length > 0
          ) {
            firebaseUtils
              .sendImage(
                state.userId,
                state.groupId,
                s.data.data.images[0].image,
              )
              .catch(e => {
                snackbar.show(
                  constants.msg.upload.upload_image_error,
                  'danger',
                );
              });
          }
          return;
        }
        snackbar.show(constants.msg.upload.upload_image_error, 'danger');
      });
    });
  };
  // useEffect(() => {
  //   sendMessage(state.newMessage);
  // }, [data]);
  const send = e => {
    onBackdropPress();
    e.preventDefault();
    if (!state.newMessage || !state.newMessage.trim()) {
      setTimeout(() => {
        snackbar.show('Nhập nội dung cần gửi');
      }, 1000);
      return;
    }
    sendMessage();
    onScrollToEnd();
    setState({
      newMessage: '',
    });
    txtMessage.current.clear();
    // Keyboard.dismiss();
  };
  const onScrollToEnd = () => {
    setTimeout(() => {
      if (flatList.current)
        flatList.current.scrollToOffset({animated: true, offset: 0});
    }, 500);
  };
  const getChatProfile = id => {
    if (state.chatProfile && state.chatProfile.id == id) {
      return state.chatProfile;
    }
    try {
      userProvider.detail(id).then(res => {
        if (res.code == 0) {
          setState({chatProfile: res.data.user});
        }
      });
    } catch (error) {}
  };
  const onChangeText = s => {
    setState({newMessage: s});
  };
  const onBackdropPress = () => {
    setState({isVisible: false});
  };
  const onConfirmSend = () => {
    Keyboard.dismiss();
    setState({isVisible: true});
  };
  const listFooter = () => {
    if (data.length >= (page + 1) * size)
      return (
        <View style={{alignItems: 'center'}}>
          <ActivityIndicator
            style={{margin: 5}}
            color={'#3161AD'}
            size="small"
          />
        </View>
      );
    else return null;
  };

  return (
    // <ActivityPanel
    //   style={{flex: 1}}
    //   title={room.roomName}
    //   showFullScreen={true}
    //   containerStyle={{backgroundColor: '#afcccc'}}
    //   isLoading={state.isLoading}>
    <View style={{flex: 1, backgroundColor: '#FFF', paddingBottom: 10}}>
      <FlatList
        style={{flex: 1, paddingBottom: 20}}
        ref={flatList}
        keyExtractor={(item, index) => index.toString()}
        extraData={state}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.7}
        data={data}
        inverted={true}
        ListFooterComponent={listFooter}
        renderItem={({item, index}) => (
          <View>
            {item?.userId == userApp?.currentUser?.id ? (
              <MyMessage
                isLast={index == 0}
                message={item}
                preMessage={index == 0 ? null : data[index - 1]}
              />
            ) : (
              <TheirMessage
                // chatProfile={getChatProfile(item.userId)}
                isLast={index == 0}
                message={item}
                preMessage={index == 0 ? null : data[index - 1]}
              />
            )}
          </View>
        )}
      />
      {item?.userInfo?.id == userApp?.currentUser?.id &&
      (item.status == 'ACCEPT' || item.status == 'REPLY') ? (
        <ChatView
          keyboardVerticalOffset={keyboardVerticalOffset || 110}
          behavior="padding">
          {state.typing && state.typing.length != 0 ? (
            <View style={styles.containerTyping}>
              <Text style={styles.txtTyping}>
                <Text style={{fontWeight: 'bold'}}>{state.typing[0]}</Text>
                {state.typing.length > 1
                  ? ' và ' + (state.typing.length - 1) + ' người khác'
                  : ''}{' '}
                đang gõ
              </Text>
              <TypingAnimation
                dotColor="black"
                dotMargin={5}
                dotAmplitude={3}
                dotSpeed={0.15}
                dotRadius={2.5}
                dotX={12}
                dotY={6}
                show={true}
                style={styles.dotAnimation}
              />
            </View>
          ) : null}
          <View style={styles.containerSendMes}>
            <TouchableOpacity
              style={styles.buttonSelectImage}
              onPress={selectImage}>
              <ScaleImage
                source={require('@images/image.png')}
                width={25}
                style={{resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <View
              style={[
                styles.containerInput,
                Platform.OS == 'ios' ? {padding: 10, paddingTop: 7} : {},
              ]}>
              <TextInput
                ref={txtMessage}
                style={styles.inputMes}
                placeholderTextColor="#cacaca"
                underlineColorAndroid="transparent"
                placeholder={'Nhập nội dung cần gửi'}
                onChangeText={onChangeText}
                multiline={true}
                autoCorrect={false}
                value={state.newMessage}
                onFocus={() => {
                  onScrollToEnd();
                }}
              />
            </View>
            <TouchableOpacity style={styles.buttonSend} onPress={send}>
              <ScaleImage
                source={require('@images/new/ic_send.png')}
                height={19}
              />
            </TouchableOpacity>
          </View>
        </ChatView>
      ) : null}
      {isShowText ? (
        <Text
          style={[
            {
              color:
                item.status == 'REJECT' || item.status == 'DONE'
                  ? '#00000060'
                  : '#00BA99',
            },
            styles.txtWarning,
          ]}>
          {item.status == 'REJECT'
            ? 'Câu hỏi của bạn đã bị từ chối vì vi phạm các quy định của ứng dụng.'
            : item.status == 'DONE'
            ? 'Cuộc tư vấn của bạn đã kết thúc'
            : '* Câu trả lời của bạn sẽ được hiển thị trên cộng đồng'}
        </Text>
      ) : null}

      <ImagePicker ref={imagePicker} />
      {/* <ModalConfirmSend
        isVisible={state.isVisible}
        onBackdropPress={onBackdropPress}
        onSend={send}
      /> */}
    </View>
    // </ActivityPanel>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
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
    maxHeight: 100,
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
    borderTopColor:'#00000020',
    borderTopWidth:1
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
