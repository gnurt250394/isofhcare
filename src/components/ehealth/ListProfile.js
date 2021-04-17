import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  FlatList,
  Text,
} from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
import profileProvider from '@data-access/profile-provider';
import NavigationService from '@navigators/NavigationService';
import {connect} from 'react-redux';
import redux from '@redux-store';
import snackbar from '@utils/snackbar-utils';

const {width, height} = Dimensions.get('screen');
class ListProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: [],
      index: this.props.index || 0,
    };
  }
  componentDidMount() {
    this.onLoad();
  }
  onLoad = async () => {
    let s = await profileProvider.getListProfile();
    if (s.length) {
      let defaultProfile = s.find(e => e.defaultProfile);

      s.unshift({
        type: 'share',
        profileInfo: {personal: {fullName: 'Chia sẻ với tôi'}},
      });
      let index = s.findIndex(e => e.defaultProfile);

      this.setState({
        dataProfile: s,
      });
      if (!this.state.index) {
        this.setState({
          index,
        });
        await this.props.dispatch(redux.profileEhealth(defaultProfile));
        this.props.onSeletedProfile(defaultProfile, index);
      }
    }
  };
  onPressProfile = async (item, index) => {
    if (this.state.index == index) {
      return;
    }
    this.setState({
      index,
    });
    await this.props.dispatch(redux.profileEhealth(item));
    this.props.onSeletedProfile && this.props.onSeletedProfile(item, index);
  };
  renderProfile = (item, index) => {
    const source =
      item.type == 'share'
        ? require('@images/new/homev2/ic_ehealth.png')
        : item?.profileInfo?.personal?.avatar
        ? {uri: item?.profileInfo?.personal?.avatar.absoluteUrl()}
        : require('@images/new/user.png');
    return (
      <View style={styles.containerItem}>
        {index == this.state.index ? (
          <View style={{flex: 1}}>
            <TouchableOpacity
              disabled={this.state.disabled}
              onPress={() => this.onPressProfile(item, index)}
              style={styles.btnPress}
              key={index}>
              <ImageLoad
                resizeMode="cover"
                imageStyle={[styles.imageStyle, {borderRadius: 20}]}
                borderRadius={10}
                customImagePlaceholderDefaultStyle={styles.defaultImage}
                placeholderSource={source}
                resizeMode="cover"
                loadingStyle={{size: 'small', color: 'gray'}}
                source={source}
                style={styles.img}
                defaultImage={() => {
                  return (
                    <ScaleImage
                      resizeMode="cover"
                      source={source}
                      width={70}
                      height={70}
                    />
                  );
                }}
              />
            </TouchableOpacity>
            <View style={[styles.layoutTriangle]} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => this.onPressProfile(item, index)}
            style={[styles.btnItem]}
            key={index}>
            <ImageLoad
              resizeMode="cover"
              imageStyle={[styles.imageStyle, {borderRadius: 20}]}
              borderRadius={5}
              customImagePlaceholderDefaultStyle={styles.defaultImage}
              placeholderSource={source}
              resizeMode="cover"
              loadingStyle={{size: 'small', color: 'gray'}}
              source={source}
              style={styles.imgLoad}
              defaultImage={() => {
                return (
                  <ScaleImage
                    resizeMode="cover"
                    source={source}
                    width={60}
                    height={60}
                  />
                );
              }}
            />
            <Text
              style={{
                paddingTop: 6,
                textAlign: 'center',
              }}
              numberOfLines={2}>
              {item?.profileInfo?.personal?.fullName.trim()}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  onCreateProfile = () => {
    snackbar.show('Tính năng đang phát triển');
    return;
    NavigationService.navigate('createProfile');
  };
  render() {
    return (
      <ScrollView
        pagingEnabled={true}
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        horizontal={true}>
        <View style={styles.viewItem}>
          {this.state.dataProfile.length
            ? this.state.dataProfile.map((item, index) =>
                this.renderProfile(item, index),
              )
            : null}
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  containerItem: {
    width: width / 4,
    height: width / 4 + 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  layoutTriangle: {
    width: 0,
    height: 0,
    backgroundColor: '#00000000',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.6,
    bottom: -10,
    position: 'absolute',
    alignSelf: 'center',
  },
  imageStyle: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  container: {
    // height: width / 4,
  },
  viewItem: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: 10,
  },
  imgAdd: {borderRadius: 10},
  btnAdd: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 7,
  },
  imgLoad: {
    alignSelf: 'center',
    borderRadius: 30,
    width: width / 6,
    height: width / 6,
    borderWidth: 1,
    borderColor: '#FFF',
    shadowOpacity: 0.3,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    backgroundColor: '#FFF',
  },
  defaultImage: {
    width: width / 6,
    height: width / 6,
    borderRadius: 20,
    borderColor: '#FFF',
    borderWidth: 1,
    shadowOpacity: 0.6,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    elevation: 2,
    backgroundColor: '#FFF',
  },
  btnItem: {
    width: width / 5,
    height: '100%',
    marginRight: 5,
    transform: [{scale: 0.9}],
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  img: {
    alignSelf: 'center',
    borderRadius: 50,
    width: width / 6,
    height: width / 6,
    borderWidth: 1,
    borderColor: '#FFF',
    shadowOpacity: 0.3,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    backgroundColor: '#FFF',
  },
  placeholderStyle: {width: 70, height: 70, borderRadius: 20},
  btnPress: {
    width: width / 5 + 10,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{scale: 1.01}],
    marginTop: 7,
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    profile: state.auth.profile,
    hospital: state?.auth?.ehealth?.hospital || -1,
  };
}
export default connect(mapStateToProps)(ListProfile);
