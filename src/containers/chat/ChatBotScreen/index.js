import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import ActivityPanel from '@components/ActivityPanel';


import { dialogflowConfig } from './env';
// import quesBot from '@containers/chat/ChatBotScreen/listchatBot';

const BOT_USER = {
  _id: 2,
  name: 'ISC Bot',
  avatar: 'https://i.imgur.com/7k12EPD.png'
};

export default class index extends Component {
  state = {
    messages: [
      {
        _id: 1,
        text: `Xin chào! Mình là trợ lý Mini 🤖 đến từ iSofhcare.\n\nTôi có thể giúp gì cho bạn?`,
        createdAt: new Date(),
        user: BOT_USER
      }
    ]
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    console.log("Chat bot", text)
    this.sendBotResponse(text);

    // quesBot.requestQuery(result).then(s => {
    //   if (s.code == 0) {
    //     return this.sendBotResponse(s.data.text)
    //   } else {
    //     console.log("==== chat bot text ====", s)
    //     return this.sendBotResponse(s.data.message)
    //   }
    // });
  }

  onSend(messages = []) {

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
    let message = messages[0].text;
    // this.handleGoogleResponse(message);
    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error)
    );
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg])
    }));
  }


  render() {
    return (
      <ActivityPanel title="TEST CHAT BOT">
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1
            }}
          />
        </View>
      </ActivityPanel>

    );
  }
}