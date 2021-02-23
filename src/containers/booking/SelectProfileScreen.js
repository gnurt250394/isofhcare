import React, {Component, PropTypes} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {View, StyleSheet, Text, TouchableOpacity, FlatList} from 'react-native';
import {connect} from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import medicalRecordProvider from '@data-access/medical-record-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import constants from '@resources/strings';
import profileProvider from '@data-access/profile-provider';
class SelectProfileScreen extends Component {
  constructor(props) {
    super(props);
    let profile = this.props.navigation.state.params.profile;
    this.state = {
      data: [],
      refreshing: false,
      size: 10,
      page: 1,
      profile,
    };
  }
  onRefresh(refreshing) {
    if (!refreshing)
      this.setState({refreshing: true}, () => {
        this.onLoad();
      });
  }
  componentDidMount() {
    this.onRefresh(this.state.refreshing);
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.navigation.state.params &&
      nextProps.navigation.state.params.loading
    ) {
      this.onRefresh();
    }
  }
  onLoad() {
    const {page, size} = this.state;
    this.setState(
      {
        // loading: true,
        refreshing: page == 1,
        loadMore: page != 1,
      },
      () => {
        profileProvider
          .getListProfile()
          .then(s => {
            console.log('s: ', s);
            this.setState(
              {
                // loading: false,
                refreshing: false,
                // loadMore: false
              },
              () => {
                this.setState({
                  data: s,
                });
              },
            );
          })
          .catch(e => {
            this.setState({
              loading: false,
              refreshing: false,
              loadMore: false,
            });
          });
      },
    );
  }
  onLoadMore() {
    if (!this.state.finish && !this.state.loading)
      this.setState(
        {
          loadMore: true,
          refreshing: false,
          loading: true,
          page: this.state.page + 1,
        },
        () => {
          this.onLoad(this.state.page);
        },
      );
  }
  selectPofile(profile) {
    this.setState(
      {
        disable: true,
      },
      () => {
        let callback = ((this.props.navigation.state || {}).params || {})
          .onSelected;
        if (callback) {
          callback(profile);
        }
        this.props.navigation.pop();
      },
    );
  }
  keyExtractor = (item, index) => index.toString();
  headerComponent = () => {
    return !this.state.refreshing &&
      (!this.state.data || this.state.data.length == 0) ? (
      <View style={{alignItems: 'center', marginTop: 50}}>
        <Text style={{fontStyle: 'italic'}}>{constants.none_info}</Text>
      </View>
    ) : null;
  };
  defaultImage = () => {
    return (
      <ScaleImage
        resizeMode="cover"
        source={require('@images/new/user.png')}
        width={40}
        height={40}
      />
    );
  };
  renderItem = ({item, index}) => {
    const source = item?.profileInfo?.personal?.avatar
      ? {uri: item?.profileInfo?.personal?.avatar.absoluteUrl()}
      : require('@images/new/user.png');

    return (
      <TouchableOpacity
        style={styles.bn}
        disabled={this.state.disable}
        onPress={this.selectPofile.bind(this, item)}>
        <ImageLoad
          resizeMode="cover"
          imageStyle={styles.borderImage}
          borderRadius={20}
          customImagePlaceholderDefaultStyle={[
            styles.avatar,
            styles.placeHolderImage,
          ]}
          placeholderSource={require('@images/new/user.png')}
          resizeMode="cover"
          loadingStyle={{size: 'small', color: 'gray'}}
          source={source}
          style={styles.image}
          defaultImage={this.defaultImage}
        />
        <Text style={styles.bntext}>{item.profileInfo.personal.fullName}</Text>
        {this.state.profile &&
        this.state.profile.userProfileId == item.userProfileId ? (
          <ScaleImage
            style={styles.ckeck}
            height={18}
            source={require('@images/new/profile/ic_tick.png')}
          />
        ) : null}
      </TouchableOpacity>
    );
  };
  footerComponent = () => <View style={{height: 10}} />;
  createProfile = () => {
    this.props.navigation.navigate('createProfile', {
      isDataNull:
        !this.state.data || this.state.data.length == 0 ? true : false,
      onCreate: this.onRefresh.bind(this),
    });
  };
  render() {
    return (
      <ActivityPanel title={constants.title.select_profile}>
        <FlatList
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.state.refreshing}
          onEndReached={this.onLoadMore.bind(this)}
          onEndReachedThreshold={1}
          style={styles.container}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
          data={this.state.data}
          ListHeaderComponent={this.headerComponent}
          ListFooterComponent={this.footerComponent}
          renderItem={this.renderItem}
        />

        {(this.state.data && this.state.data.length < 10) ||
        !this.state.data ? (
          <TouchableOpacity
            style={styles.buttonCreateProfile}
            onPress={this.createProfile}>
            {!this.state.data || this.state.data.length == 0 ? (
              <Text style={styles.btntext}>
                {constants.booking.add_profile}
              </Text>
            ) : (
              <Text style={styles.btntext}>
                {constants.booking.add_relatives}
              </Text>
            )}
          </TouchableOpacity>
        ) : null}
      </ActivityPanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
const styles = StyleSheet.create({
  buttonCreateProfile: {
    alignSelf: 'center',
    marginVertical: 10,
    marginBottom: 30,
  },
  placeHolderImage: {width: 40, height: 40},
  image: {
    alignSelf: 'center',
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  borderImage: {
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(151, 151, 151, 0.29)',
  },
  AcPanel: {
    flex: 1,
    backgroundColor: '#cacaca',
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  bn: {
    padding: 10,
    position: 'relative',
    backgroundColor: 'rgb(255, 255, 255)',
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bntext: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
    flex: 1,
  },
  ckeck: {
    marginRight: 15,
  },
  btntext: {
    fontSize: 18,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#02c39a',
    textAlign: 'center',
    margin: 10,
  },
  btntext2: {
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#02c39a',
    position: 'absolute',
    left: 240,
    top: 10,
  },
});
export default connect(mapStateToProps)(SelectProfileScreen);
