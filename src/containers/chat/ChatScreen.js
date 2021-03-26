/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  Component,
  useEffect,
  useContext,
  useRef,
  useState,
  useCallback,
} from 'react';
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
import {
  GiftedChat,
  Send,
  Actions,
  Composer,
  InputToolbar,
  LoadEarlier,
  Message,
  Bubble,
} from 'react-native-gifted-chat';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import io from 'socket.io-client';
import RenderProfile from '@components/question/RenderProfile';
import ImageLoad from 'mainam-react-native-image-loader';
import {withNavigation} from 'react-navigation';
import objectUtils from '@utils/object-utils';
import Footer from './Footer';
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
      let res = await questionProvider.listAnwser(item.id, false, page, size);

      setLoading(false);
      if (res?.content) {
        let newKeys = {id: '_id', content: 'text', images: 'image'};
        let list = res.content
          .map(e => {
            e.user = {_id: e.userId};
            if (e.userId == item?.userInfo?.id) {
              e.user = {...item.userInfo, _id: e.userId};
            } else if (e.userId == item?.doctorInfo?.id) {
              e.user = {...item.doctorInfo, _id: e.userId};
            }
            return formatMessage(e, newKeys);
          })
          .reverse();

        formatData(list);
      } else formatData([]);
    } catch (error) {
      setLoading(false);
      formatData([]);
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
        setData(state => [...data, ...state]);
      }
    }
  };
  const onLoadMore = () => {
    if (data.length >= (page + 1) * size) {
      setLoading(true);
      setPage(page => page + 1);
    }
  };
  useEffect(() => {
    if (loading) getListAnwser();
  }, [page, loading]);
  useEffect(() => {
    getListAnwser();
    onScrollToEnd();
  }, []);
  const sendMessage = async () => {
    try {
      let res = await questionProvider.sendMessage(
        item.id,
        state.newMessage,
        listImage.map(e => e.url),
      );

      if (res) {
        let list = [...data];

        let newKeys = {id: '_id', content: 'text', images: 'image'};
        if (res.userId == item?.userInfo?.id) {
          res.user = {...item.userInfo, _id: res.userId};
        } else if (res.userId == item?.doctorInfo?.id) {
          res.user = {...item.doctorInfo, _id: res.userId};
        }
        res = formatMessage(res, newKeys);

        list.push(res);
        setData(state => list);
      }
    } catch (error) {}
  };
  const readQuestion = async () => {
    try {
      let res = await questionProvider.readQuestion(item.id);
    } catch (error) {}
  };
  useEffect(() => {
    const socket = io('http://35.198.240.51:8000', {
      host: 'http://35.198.240.51',
      port: 8000,
      autoConnect: true,
    });
    socket.connect();
    socket.on(constants.socket_type.QUESTION + item.id, (res, callback) => {
      let data2 = [];
      let newKeys = {id: '_id', content: 'text', images: 'image'};
      if (res.userId == item?.doctorInfo?.id) {
        res.user = {...item.doctorInfo, _id: res.userId};
        res.received = true;
      }
      res = formatMessage(res, newKeys);
      data2.push(res);
      setState({isLoading: false});
      setData(state => [...state, ...data2]);
      onScrollToEnd();
    });
    readQuestion();
    timeout.current = setInterval(() => {
      readQuestion();
    }, 2 * 60 * 1000);
    return () => {
      if (timeout.current) clearInterval(timeout.current);
      socket.disconnect();
    };
  }, []);

  const selectImage = () => {
    if (imagePicker.current) {
      connectionUtils
        .isConnected()
        .then(s => {
          if (imagePicker.current) {
            imagePicker.current
              .show({
                multiple: true,
                mediaType: 'photo',
                maxFiles: 3,
                compressImageMaxWidth: 500,
                compressImageMaxHeight: 500,
              })
              .then(images => {
                let listImages = [];
                if (images.length) listImages = [...images];
                else listImages.push(images);
                let imageUris = listImage;
                listImages.forEach(image => {
                  if (imageUris.length >= 3) {
                    snackbar.show('Chỉ được chọn tối đa 3 ảnh', 'warning');
                    return;
                  }
                  let temp = null;
                  imageUris.forEach(item => {
                    if (item.uri == image.path) temp = item;
                  });
                  if (!temp) {
                    imageUris.push({uri: image.path, loading: true});
                    imageProvider.upload(image.path, image.mime, (s, e) => {
                      if (s.success) {
                        if (s.data.code == 0) {
                          let imageUris = listImage;
                          imageUris.forEach(item => {
                            if (item.uri == s.uri) {
                              item.loading = false;
                              item.url = s.data.data.images[0].imageLink;
                              item.thumbnail = s.data.data.images[0].imageLink;
                            }
                          });
                          setListImage(imageUris);
                        }
                      } else {
                        imageUris.forEach(item => {
                          if (item.uri == s.uri) {
                            item.error = true;
                          }
                        });
                      }
                    });
                  }
                });
                setListImage([...imageUris]);
              });
          }
        })
        .catch(e => {
          snackbar.show(constants.msg.app.not_internet, 'danger');
        });
    }
  };

  const send = e => {
    onBackdropPress();
    e.preventDefault();
    if ((!state.newMessage || !state.newMessage.trim()) && !listImage.length) {
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
    setListImage([]);

    // txtMessage.current.clear();
    // Keyboard.dismiss();
  };
  const onScrollToEnd = () => {
    setTimeout(() => {
      if (flatList.current) flatList.current.scrollToEnd({animated: true});
    }, 500);
  };

  const onChangeText = s => {
    console.log('s: ', s);
    setState({newMessage: s});
  };
  const onBackdropPress = () => {
    setState({isVisible: false});
  };

  const _renderStatus = () => {
    switch (item.status) {
      case 'REJECT':
        return 'Câu hỏi của bạn đã bị từ chối vì vi phạm các quy định của ứng dụng.';
      case 'DONE':
        return 'Cuộc tư vấn của bạn đã kết thúc';
      case 'NEW':
      case 'ACCEPT':
        return '';
      default:
        return '* Câu trả lời của bạn sẽ được hiển thị trên cộng đồng';
    }
  };
  const removeImage = index => () => {
    var imageUris = [...listImage];
    imageUris.splice(index, 1);
    setListImage(imageUris);
  };
  const onDelete = (message, index) => async () => {
    try {
      let res = await questionProvider.deleteMessage(item.id, message.id);

      if (res) {
        let list = data.filter(e => e.id != message.id);
        setData(list);
      } else {
        snackbar.show('Xoá câu trả lời thất bại', 'danger');
      }
    } catch (error) {
      snackbar.show('Xoá câu trả lời thất bại', 'danger');
    }
    row.current[index] && row.current[index].close();
  };
  const renderRightActions = (item, index) => progress => {
    return (
      <View style={[styles.animButton, {marginTop: index == 0 ? 30 : 0}]}>
        <RectButton
          style={[styles.buttonSwiable]}
          onPress={onDelete(item, index)}>
          <Text style={styles.actionText}>Xoá</Text>
        </RectButton>
      </View>
    );
  };
  const closeRow = index => () => {
    if (
      prevOpenedRow.current &&
      row.current[index] &&
      prevOpenedRow.current !== row.current[index]
    ) {
      prevOpenedRow.current.close();
    }
    prevOpenedRow.current = row.current[index];
  };
  const onSend = useCallback((messages = []) => {
    setData(previousMessages => GiftedChat.append(previousMessages, messages));
  }, []);

  const formatMessage = (obj, newKeys) => {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return {[newKey]: obj[key]};
    });
    return Object.assign({}, ...keyValues);
  };
  const photoViewer = (urls, index) => () => {
    try {
      if (!urls) {
        snackbar.show(constants.msg.message.none_image);
        return;
      }
      navigation.navigate('photoViewer', {
        index,
        urls: urls.map(e => ({uri: e})),
      });
    } catch (error) {}
  };
  const goToProfileDoctor = doctorInfo => {
    navigation.navigate('detailsDoctor', {
      item: {id: doctorInfo.doctorId},
    });
  };
  return (
    // <TouchableWithoutFeedback
    //   onPress={() => prevOpenedRow.current && prevOpenedRow.current.close()}>
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <GiftedChat
        messages={data}
        // alwaysShowSend={true}
        dateFormat={'DD/MM/YYYY'}
        renderTime={() => null}
        inverted={false}
        onPressActionButton={selectImage}
        loadEarlier={true}
        onPressAvatar={goToProfileDoctor}
        renderBubble={props => {
          return (
            <View style={{}}>
              {props?.currentMessage?.user?._id !=
                props?.previousMessage?.user?._id &&
              props?.currentMessage?.user?._id != props?.user?._id ? (
                <Text
                  style={{
                    fontWeight: 'bold',
                    paddingBottom: 5,
                    color: '#00BA99',
                  }}>
                  {objectUtils.renderAcademic(
                    item?.doctorInfo?.academicDegreeValue,
                  )}
                  {item.doctorInfo.name}
                </Text>
              ) : null}
              <Bubble {...props} />
            </View>
          );
        }}
        renderAvatarOnTop={true}
        messagesContainerStyle={{
          paddingBottom: 20,
        }}
        renderLoadEarlier={props => {
          return (
            <View>
              <RenderProfile item={item} />
              {data.length >= (page + 1) * size ? (
                <LoadEarlier
                  {...props}
                  isLoadingEarlier={loading ? true : false}
                  onLoadEarlier={onLoadMore}
                  label={'Xem thêm câu trả lời'}
                />
              ) : null}
            </View>
          );
        }}
        renderMessageText={props => {
          return (
            <Text
              style={{
                color:
                  props.currentMessage.user._id == props.user._id
                    ? '#FFF'
                    : '#000',
                padding: 10,
              }}>
              {props.currentMessage.text}
            </Text>
          );
        }}
        renderMessageImage={props => {
          if (props.currentMessage.image.length) {
            return (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    paddingBottom: 10,
                  }}>
                  {props.currentMessage.image.map((e, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        style={{padding: 5}}
                        onPress={photoViewer(props.currentMessage.image, i)}>
                        <ImageLoad
                          resizeMode="cover"
                          placeholderSource={require('@images/noimage.png')}
                          style={{width: 100, height: 100}}
                          loadingStyle={{size: 'small', color: 'gray'}}
                          source={{
                            uri: e,
                          }}
                          defaultImage={() => {
                            return (
                              <ScaleImage
                                resizeMode="cover"
                                source={require('@images/noimage.png')}
                                width={150}
                              />
                            );
                          }}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          }
          return;
        }}
        keyboardShouldPersistTaps={'handled'}
        renderSend={props => {
          if (item.status == 'REPLY')
            return (
              <TouchableOpacity style={styles.buttonSend} onPress={send}>
                <ScaleImage
                  source={require('@images/new/ic_send.png')}
                  height={19}
                />
              </TouchableOpacity>
            );
        }}
        renderActions={props => {
          if (item.status == 'REPLY')
            return (
              <Actions
                {...props}
                icon={() => (
                  <ScaleImage
                    source={require('@images/image.png')}
                    width={25}
                    style={{resizeMode: 'contain'}}
                  />
                )}
              />
            );
        }}
        renderComposer={props => {
          console.log('props: ', props);
          if (item.status == 'REPLY')
            return (
              <View  style={[
                styles.containerSendMes,
                {
                  height:
                    props.composerHeight < 50 ? 50 : props.composerHeight,
                },
              ]}>
                <View
                 style={[
                  styles.containerInput,
                  {
                    height:
                      props.composerHeight < 50 ? 50 : props.composerHeight,
                  },
                ]}>
                  {/* <TextInput
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
                  /> */}
                   <Composer
                    {...props}
                    ref={txtMessage}
                    textInputStyle={styles.inputMes}
                    placeholderTextColor="#cacaca"
                    underlineColorAndroid="transparent"
                    placeholder={'Nhập nội dung cần gửi'}
                    onTextChanged={onChangeText}
                    multiline={true}
                    autoCorrect={false}
                    text={state.newMessage}
                  />
                </View>
              </View>
            );
        }}
        renderAccessory={() => {
          return isShowText ? (
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
              {_renderStatus()}
            </Text>
          ) : null;
        }}
        scrollToBottom={true}
        user={{
          _id: item.userInfo.id,
        }}
        renderChatFooter={() => (
          <View style={{height: listImage.length ? 130 : undefined}}>
            <View style={styles.containerFooter}>
              <ScaleImage
                source={require('@images/new/ic_thanks.png')}
                height={20}
              />
              <Text style={{paddingLeft: 5}}>{item?.thankNo}</Text>
            </View>
            {listImage.length ? (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  height: 100,
                }}>
                {listImage.map((item, index) => (
                  <View key={index} style={styles.groupImagePicker}>
                    <View style={styles.groupImage}>
                      <Image
                        source={{uri: item.url}}
                        resizeMode="cover"
                        style={styles.imagePicker}
                      />
                      {item.error ? (
                        <View style={styles.imageError}>
                          <ScaleImage
                            source={require('@images/ic_warning.png')}
                            width={40}
                          />
                        </View>
                      ) : item.loading ? (
                        <View style={styles.imageLoading}>
                          <ScaleImage
                            source={require('@images/loading.gif')}
                            width={20}
                          />
                        </View>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      onPress={removeImage(index)}
                      style={styles.buttonClose}>
                      <ScaleImage
                        source={require('@images/new/ic_close.png')}
                        width={15}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        )}
      />
      <Footer item={item} />
      <ImagePicker ref={imagePicker} />
    </View>
  );
};

export default withNavigation(ChatScreen);

const styles = StyleSheet.create({
  containerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingBottom: 15,
  },
  txtLoading: {
    fontWeight: 'bold',
    color: '#00CBA7',
  },
  buttonLoading: {
    paddingLeft: 10,
    paddingBottom: 10,
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
    alignSelf: 'flex-end',
  },
  inputMes: {
    color: '#000',
    padding: 0,
    paddingLeft: 5,
    paddingRight: 5,
    maxHeight: 200,
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
    backgroundColor: 'white',
    marginTop: 5,
    marginHorizontal: 10,
    flex: 1,
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
