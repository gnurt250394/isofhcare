import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import {Icon, Card} from 'native-base';
import ImageLoad from 'mainam-react-native-image-loader';
import ScaleImage from 'mainam-react-native-scaleimage';
import ChatScreen from '@containers/chat/ChatScreen';
import RenderProfile from '@components/question/RenderProfile';
import questionProvider from '@data-access/question-provider';
// import DetailMessage from '@components/community/DetailMessage';
class DetailMessageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam('item', {}),
      isShow: false,
    };
  }
  getDetail = async () => {
    try {
      const {item} = this.state;
      let res = await questionProvider.getDetailQuestion(item.id);
      if (res) this.setState({item: res});
      console.log('res: ', res);
    } catch (error) {
      console.log('error: ', error);
    }
  };
  componentDidMount() {
    this.getDetail();
  }

  render() {
    const {item, isShow} = this.state;
    return (
      <ActivityPanel title="Tư vấn">
        <RenderProfile item={item} />
        <Text style={styles.txtAllQuestion}>Tất cả câu trả lời</Text>
        <ChatScreen
          isShowText={true}
          keyboardVerticalOffset={300}
          item={this.state.item}
        />
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  txtAllQuestion: {
    color: '#000',
    fontWeight: 'bold',
    paddingTop: 15,
    paddingLeft: 10,
    paddingBottom: 10,
  },
});
export default DetailMessageScreen;
