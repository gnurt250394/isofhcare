import React, {useEffect, useState, useRef} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  DeviceEventEmitter,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';
import covidProvider from '@data-access/covid-provider';
import ScaledImage from 'mainam-react-native-scaleimage';
import stringUtils from 'mainam-react-native-string-utils';
import TypingAnimation from '@components/chat/TypingAnimation';
import LinearGradient from 'react-native-linear-gradient';
import snackbar from '@utils/snackbar-utils';
import useBackButton from '@components/useBackButton';
import CustomSlider from '@components/covid/CustomSlider';
const {width, height} = Dimensions.get('window');
const TestCovid = ({navigation}) => {
  const [data, setData] = useState([]);
  const [listAnswer, setListAnswer] = useState([]);
  const [value, setValue] = useState(20);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [questionParentId, setQuestionParentId] = useState('');
  const [type, setType] = useState('');
  const [isShowContinue, setIsShowContinue] = useState(false);
  const userApp = useSelector(state => state.auth.userApp);
  const listFinal = useRef([]);
  const listQuestionAll = useRef([]);
  const answerResponse = useRef(null);

  const getSurveys = async () => {
    try {
      let res = await covidProvider.getListLabel();
      getListQuestion(res.id);
    } catch (error) {
      snackbar.show('Có lỗi xảy ra, vui lòng thử lại.', 'danger');
    }
  };
  const getListQuestion = async surveysId => {
    try {
      let res = await covidProvider.getListQuestion(surveysId);

      let list = res?.template?.questions;
      res.text = res?.template?.intro;
      res._id = stringUtils.guid();
      res.createdAt = new Date();
      res.user = {
        _id: 2,
        avatar: require('@images/new/covid/ic_robot.png'),
      };

      setIsShowContinue(true);
      setData([res]);
      setQuestionParentId(res.id);
      list.forEach(e => {
        e.text = e.content;
        e._id = stringUtils.guid();
        e.user = {_id: 2, avatar: require('@images/new/covid/ic_robot.png')};
      });
      listQuestionAll.current = list;
    } catch (error) {
      snackbar.show('Có lỗi xảy ra, vui lòng thử lại.', 'danger');
    }
  };

  function handleBackButton() {
    return true;
  }

  useEffect(() => {
    getSurveys();
    DeviceEventEmitter.addListener('hardwareBackPress', handleBackButton);
    return () => {
      DeviceEventEmitter.removeAllListeners(
        'hardwareBackPress',
        handleBackButton,
      );
    };
  }, []);
  const onContinue = () => {
    if (type == 'MULTIPLE_CHOICE') {
      if (
        currentQuestion.mandatory &&
        listAnswer.filter(e => e.checked).length == 0
      ) {
        snackbar.show('Vui lòng chọn ít nhất 1 câu trả lời', 'danger');
        return;
      }
      let dataAnswer = listAnswer
        .filter(e => e.checked)
        .map(e => ({
          text: e.content.value,
          _id: stringUtils.guid(),
          user: {_id: 1},
          ...e,
        }));
      let obj = listAnswer.find(e => e.type == 'DEFAULT');
      console.log('obj: ', obj);
      console.log('dataAnswer: ', dataAnswer);
      if (dataAnswer.length == 0 && obj) {
        dataAnswer.push(obj);
      }
      console.log('dataAnswer: ', dataAnswer);

      listFinal.current.push({
        id: currentQuestion?.id,
        answers: dataAnswer.map(e => ({
          uid: e.uid,
        })),
      });
      let direction = dataAnswer.find(e => e.directQuestion);
      if (dataAnswer.length && !dataAnswer.find(e => e.type == 'DEFAULT')) {
        setData(state => GiftedChat.append(state, dataAnswer));
      } else {
        setData(state =>
          GiftedChat.append(state, [
            {_id: stringUtils.guid(), text: 'Tiếp tục', user: {_id: 1}},
          ]),
        );
      }
      setIsShowContinue(false);
      getDataMessage(direction?.directQuestion?.ordinal);
      return;
    }
    if (currentQuestion.mandatory && !value) {
      snackbar.show('Vui lòng nhập câu trả lời', 'danger');
      return;
    }

    if (value && type == 'NUMBER') {
      if (value > 120) {
        snackbar.show('Số tuổi không vượt quá 120 tuổi', 'danger');
        return;
      }
      if (value < 1) {
        snackbar.show('Số tuổi không nhỏ hơn 1', 'danger');
        return;
      }
      if (!Number.isInteger(Number(value))) {
        snackbar.show('Số tuổi phải là số nguyên', 'danger');
        return;
      }

      let dataAnswer = [
        {
          text: value,
          _id: stringUtils.guid(),
          user: {_id: 1},
        },
      ];
      listFinal.current.push({
        id: currentQuestion.id,
        answers: dataAnswer.map(e => ({
          uid: e.uid,
          content: {value: Number(value)},
        })),
      });
      setData(state => GiftedChat.append(state, dataAnswer));
      setIsShowContinue(false);
      getDataMessage();
      return;
    }
    setData(state =>
      GiftedChat.append(state, [
        {_id: stringUtils.guid(), text: 'Tiếp tục', user: {_id: 1}},
      ]),
    );
    setIsShowContinue(false);
    getDataMessage();
  };
  const getDataMessage = directQuestion => {
    setType(undefined);
    setListAnswer([]);
    setIsTyping(true);
    setTimeout(() => {
      let i = listQuestionAll.current.findIndex(
        e => e.ordinal == directQuestion,
      );

      let obj = {};
      if (i == -1) {
        obj = listQuestionAll.current.shift();
      } else {
        listQuestionAll.current = listQuestionAll.current.slice(i);
        obj = listQuestionAll.current.shift();
      }
      if (!obj) {
        createAnswer();
        return;
      }
      if (obj.format == 'MULTIPLE_CHOICE' || obj.format == 'NUMBER') {
        setIsShowContinue(true);
      }
      setCurrentQuestion(obj);
      setListAnswer(obj.answers);
      setType(obj.format);
      setIsTyping(false);
      setData(state => GiftedChat.append(state, obj));
    }, 1000);
  };
  const createAnswer = async isBack => {
    try {
      if (isBack && !listFinal.current.length) {
        return;
      }
      if (!listFinal.current.length) {
        snackbar.show('Bạn chưa chọn câu hỏi nào', 'danger');
        return;
      }

      let res = await covidProvider.createAnswer(
        questionParentId,
        listFinal.current,
      );
      if (res && !isBack) {
        answerResponse.current = res;
        setIsTyping(false);
        navigation.navigate('testResult', {
          data: res,
        });
      }
    } catch (error) {
      if (!isBack) snackbar.show('Có lỗi xảy ra, vui lòng thử lại.', 'danger');
    }
  };
  const onSelectAnswer = item => () => {
    if (type == 'MULTIPLE_CHOICE') {
      let data = [...listAnswer];
      data.forEach(e => {
        if (e.uid == item.uid) {
          e.checked = !e.checked;
        }
      });
      setListAnswer(data);
      return;
    }
    let data = [];
    if (typeof item.content.value == 'string') {
      data = [
        {
          _id: stringUtils.guid(),
          text: item.content.value,
          user: {_id: 1},
        },
      ];
    } else if (typeof item.content.value == 'object') {
      data = [
        {
          _id: stringUtils.guid(),
          text:
            'Từ ' +
            item.content.value.minimum +
            ' đến ' +
            item.content.value.maximum,
          user: {_id: 1},
        },
      ];
    }
    setData(state => [...data, ...state]);
    listFinal.current.push({
      id: currentQuestion.id,
      answers: [item].map(e => {
        if (typeof e.content.value == 'string')
          return {
            uid: e.uid,
          };
      }),
    });
    getDataMessage(item?.directQuestion?.ordinal);
  };

  const renderAnswerSelect = () => {
    if (type == 'NUMBER') {
      return <CustomSlider min={1} max={120} onValueChange={setValue} />;
    }
    if (type == 'MULTIPLE_CHOICE' || type == 'CHECKBOX') {
      return (
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          horizontal={type == 'CHECKBOX' ? true : false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.containerList,
              {flexWrap: type == 'CHECKBOX' ? 'nowrap' : 'wrap'},
            ]}>
            {listAnswer?.length
              ? listAnswer.map((e, i) => {
                  if (e.type == 'DEFAULT') return null;
                  if (typeof e?.content?.value == 'string') {
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={onSelectAnswer(e)}
                        style={[styles.buttonSelect]}>
                        {type == 'MULTIPLE_CHOICE' && e.checked ? (
                          <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            colors={['#EB5569', '#FEB692']}
                            style={{
                              padding: 10,
                              borderRadius: 5,
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: 16,
                                color:
                                  type == 'MULTIPLE_CHOICE' && e.checked
                                    ? '#FFF'
                                    : '#000',
                              }}>
                              {e?.content?.value}
                            </Text>
                          </LinearGradient>
                        ) : (
                          <Text
                            style={{
                              textAlign: 'center',
                              padding: 10,
                              fontSize: 16,
                            }}>
                            {e?.content?.value}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  } else if (typeof e?.content?.value == 'object') {
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={onSelectAnswer(e)}
                        style={[styles.buttonSelect, {padding: 10}]}>
                        <Text style={{textAlign: 'center', fontSize: 16}}>
                          Từ {e.content.value.minimum} đến{' '}
                          {e.content.value.maximum}
                        </Text>
                      </TouchableOpacity>
                    );
                  } else return null;
                })
              : null}
          </View>
        </ScrollView>
      );
    }
  };
  const handleBack = () => {
    if (!answerResponse.current)
      Alert.alert(
        'Thông báo',
        'Bạn muốn huỷ làm bài test?',
        [
          {
            text: 'Không',
            style: 'cancel',
          },
          {
            text: 'Có',
            onPress: () => {
              createAnswer(true);
              navigation.goBack();
            },
          },
        ],
        {cancelable: true},
      );
    else navigation.goBack();
  };
  return (
    <ActivityPanel backButtonClick={handleBack} title="Bài test COVID - 19">
      <View
        style={{
          backgroundColor: '#F8F8F8',
          flex: 1,
        }}>
        <GiftedChat
          messages={data}
          dateFormat={'HH:mm, DD/MM/YYYY'}
          renderTime={() => null}
          renderAvatarOnTop={true}
          keyboardShouldPersistTaps={'handled'}
          scrollToBottom={true}
          user={{
            _id: 1,
          }}
          isTyping={isTyping}
          renderFooter={() => {
            if (isTyping)
              return (
                <TypingAnimation
                  dotMargin={7}
                  dotAmplitude={3}
                  dotSpeed={0.2}
                  dotRadius={4}
                  dotX={25}
                  dotY={15}
                  style={styles.containerTyping}
                />
              );
            else return null;
          }}
          renderBubble={props => {
            if (props.currentMessage.user._id == props.user._id) {
              return (
                <View>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#EB5569', '#FEB692']}
                    style={{
                      padding: 10,
                      borderRadius: 25,
                    }}>
                    <Text style={{color: '#FFF', fontSize: 16}}>
                      {props.currentMessage.text}
                    </Text>
                  </LinearGradient>
                  <ScaledImage
                    source={require('@images/new/covid/ic_ehealth.png')}
                    height={13}
                    width={13}
                    style={{position: 'absolute', bottom: 0, right: 0}}
                  />
                </View>
              );
            } else {
              return (
                <View
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    borderBottomLeftRadius: 25,
                    padding: 10,
                    maxWidth: '80%',
                  }}>
                  <Text
                    style={{textAlign: 'left', color: '#000', fontSize: 16}}>
                    {props.currentMessage.text}
                  </Text>
                </View>
              );
            }
          }}
          maxComposerHeight={0}
          maxInputLength={0}
          composerHeight={0}
          renderInputToolbar={() => null}
        />
        {/* {type == 'MULTIPLE_CHOICE' || type == 'CHECKBOX' ? ( */}
        <View style={{paddingBottom: 20}}>
          {/* <Text
              style={{
                color: '#3161AD',
                fontSize: 16,
                fontWeight: 'bold',
                paddingLeft: 15,
                paddingRight: 5,
                paddingBottom: 5,
                textAlign: 'center',
              }}>
              {type == 'MULTIPLE_CHOICE'
                ? 'Chọn một hoặc nhiều đáp án sau đó bấm tiếp tục.'
                : type == 'CHECKBOX'
                ? 'Chọn một đáp án duy nhất.'
                : ''}
            </Text> */}

          {renderAnswerSelect()}
          {isShowContinue && typeof type != 'undefined' ? (
            <TouchableOpacity
              onPress={onContinue}
              style={styles.buttonContinue}>
              <ScaledImage
                source={require('@images/new/covid/ic_next.png')}
                height={20}
              />
              <Text style={styles.txtContinue}>Tiếp tục</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {/* ) : null} */}
      </View>
    </ActivityPanel>
  );
};

export default TestCovid;

const styles = StyleSheet.create({
  innput: {
    borderColor: '#00000050',
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    paddingLeft: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  containerList: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  buttonSelect: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    borderRadius: 5,
    marginLeft: 10,
    maxWidth: width / 2 - 10,
    marginBottom: 6,
    elevation: 2,
  },
  containerTyping: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    width: 60,
    height: 40,
    right: -60,
  },
  txtContinue: {
    color: '#EB5569',
    paddingLeft: 5,
    fontWeight: '600',
    fontSize: 16,
  },
  buttonContinue: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#EB5569',
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
