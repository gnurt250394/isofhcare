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
const {width, height} = Dimensions.get('screen');
class ListQuestionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      refreshing: false,
      data: [],
      isLoading: true,
      page: 0,
      size: 20,
      value: '',
      specialId: '',
    };
  }
  componentDidMount() {
    // this.getListSpecialist();
    this.onFocus = this.props.navigation.addListener('didFocus', () => {
      this.setState({page: 0}, this.getListQuestions);
    });
  }
  componentWillUnmount = () => {
    if (this.onFocus) {
      this.onFocus.remove();
    }
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
      console.log('res: ', res);
      this.setState({isLoading: false, refreshing: false});
      if (res?.content) {
        this.formatData(res.content);
      } else {
        this.formatData([]);
      }
    } catch (error) {
      console.log('error: ', error);
      this.formatData([]);
      this.setState({isLoading: false, refreshing: false});
    }
  };
  onSelected = item => {
    this.setState({specialId: item.id, isLoading: true, page: 0}, () => {
      this.getListQuestions();
    });
  };
  onChangeText = value => {
    this.setState({value}, () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.setState({isLoading: true, page: 0}, () => {
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
      {refreshing: true, page: 0, value: '', specialId: ''},
      this.getListQuestions,
    );
  };
  onClickCreateMenu = () =>
    this.props.navigation.navigate('createQuestionStep1');
  onMyQuestion = () => this.props.navigation.navigate('listMyQuestion');
  menuCreate() {
    return (
      <TouchableOpacity style={{marginRight: 20}} onPress={this.onMyQuestion}>
        <ScaleImage source={require('@images/new/ic_chat.png')} width={32} />
      </TouchableOpacity>
    );
  }

  goToDetailQuestion = item => () => {
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
    const icSupport = require('@images/new/user.png');
    const avatar = this.props?.userApp?.currentUser?.avatar
      ? {uri: this.props.userApp.currentUser.avatar.absoluteUrl()}
      : icSupport;
    return (
      <ActivityPanel
        // title={constants.title.advisory_online}
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
        <ListSpecialQuestion onSelected={this.onSelected} />
        {this.state.isLoading ? (
          <RenderPlaceHolder />
        ) : (
          <FlatList
            data={this.state.data}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.ItemSeparator}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0.7}
            onRefresh={this._onRefresh}
            refreshing={this.state.refreshing}
          />
        )}
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
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
