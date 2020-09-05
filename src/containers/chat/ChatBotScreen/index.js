import React, {useEffect, useState, Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import ActivityPanel from '@components/ActivityPanel';
// import { Dialogflow_V2 } from '@components/dialogFlow';
import {dialogflowConfig} from './env';
import TypingAnimation from '@components/chat/TypingAnimation';
// import quesBot from '@containers/chat/ChatBotScreen/listchatBot';

const BOT_USER = {
  _id: 2,
  name: 'ISC Bot',
  avatar:
    'https://lh3.googleusercontent.com/lL0BFgPGWt-fMQpzCtbuk_YEEENv94xo9KSrzC0Eht1M1Y1iCm8ZFsqTb-FP_vVGhEQ',
};

const ChatBotScreen = ({onHide}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [state, setState] = useState({
    isTyping: false,
    messages: [
      {
        _id: 1,
        text: `Xin chào! Mình là trợ lý Mini 🤖 đến từ iSofhcare.\n\nMình có thể giúp gì cho bạn?`,
        createdAt: new Date(),
        user: BOT_USER,
      },
    ],
  });

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }, []);

  const handleGoogleResponse = result => {
    console.log('result: ', result);
    let text = '';

    if (result.queryResult.intent.isFallback) {
      text = 'Tôi không hiểu bạn đang nói gì?';
    } else {
      text = result.queryResult.fulfillmentMessages[0].text.text[0];
    }
    return sendBotResponse(text);
  };

  const onSend = (messages = []) => {
    setIsTyping(true);
    setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      result => handleGoogleResponse(result),
      error => console.log(error),
    );
  };

  const sendBotResponse = text => {
    let msg = {
      _id: state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };
    setIsTyping(false);
    setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  };
  const onHideChat = () => {};
  return (
    // <ActivityPanel title="TEST CHAT BOT">
    <View style={styles.container}>
      <TouchableOpacity onPress={onHide} style={styles.buttonIcon}>
        <Image
          source={require('@images/new/ic_robot.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <View style={styles.containerChat}>
        <GiftedChat
          messages={state.messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
          scrollToBottom={true}
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
        />
      </View>
    </View>
    // </ActivityPanel>
  );
};

const styles = StyleSheet.create({
  containerChat: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  buttonIcon: {
    paddingTop: 15,
    paddingBottom: 5,
  },
  icon: {
    height: 50,
    width: 50,
    alignSelf: 'flex-end',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    padding: 20,
  },
  containerTyping: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    width: 60,
    height: 40,
    right: -60,
    bottom: 10,
  },
});
export default ChatBotScreen;
