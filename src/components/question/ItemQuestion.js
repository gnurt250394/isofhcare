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
import bookingDoctorProvider from '@data-access/booking-doctor-provider';
import ImageSensitive from './ImageSensitive';
const {width, height} = Dimensions.get('screen');
class ItemQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getTime(createdDate) {
    let date = createdDate.toDateObject('-');
    let hour = (new Date() - date) / 1000 / 60 / 60;
    if (hour > 24) return date.format('dd/MM/yyyy');
    else {
      if (hour < 1) return date.getPostTime();
      return Math.round(hour) + ' giờ trước';
    }
  }
  onNavigateDetails = item => {
    item.user && item.user.id != this.props.userApp.currentUser.id
      ? this.props.navigation.navigate('detailsDoctor', {
          id: item.assignee.id,
        })
      : this.props.navigation.navigate('detailsProfile', {
          id: item.author.id,
        });
  };
  render() {
    let {item, onPress, social} = this.props;

    const icSupport = require('@images/new/user.png');
    const avatar = icSupport;
    return (
      <TouchableOpacity onPress={onPress} style={styles.containerItem}>
        <View style={styles.containerProfile}>
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
          <View style={styles.groupName}>
            <Text style={styles.txtname}>
              {item?.gender == 1 ? 'Nam' : item.gender == 0 ? 'Nữ' : 'Ẩn danh'},{' '}
              {item.age} tuổi
            </Text>
            <Text style={styles.txtTime}>
              {item.createdAt.toDateObject('-').format('dd/MM/yyyy')}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.txtComment,
            {color: !social && item.userReaded ? '#00000050' : '#000'},
          ]}
          numberOfLines={3}>
          {item.content}
        </Text>
        {item?.sensitive ? (
          <ImageSensitive style={styles.imgQuestion} />
        ) : item?.images?.length ? (
          <Image source={{uri: item.images[0]}} style={styles.imgQuestion} />
        ) : null}
        <View style={styles.containerSpecialist}>
          {item.specializations.length ? (
            <Text numberOfLines={1} style={styles.groupSpecialist}>
              {item.specializations.length
                ? item.specializations.map((e, i) => {
                    return (
                      <Text
                        key={i}
                        style={styles.txtSpecialist}
                        numberOfLines={1}>
                        {e.specializationName}
                        {i != item.specializations.length - 1 ? ', ' : ''}
                      </Text>
                    );
                  })
                : null}
            </Text>
          ) : null}
          <View style={styles.containerRowChat}>
            <View style={styles.groupChatCount}>
              <ScaleImage
                source={require('@images/new/ic_chat2.png')}
                height={18}
              />
              <Text style={styles.txtCommentNo}>{item.commentNo}</Text>
            </View>
            <View style={styles.groupChatCount}>
              <ScaleImage
                source={require('@images/new/ic_ehealth.png')}
                height={18}
              />
              <Text style={styles.txtCommentNo}>{item.thankNo}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  txtCommentNo: {
    paddingLeft: 5,
    fontSize: 13,
    color: '#00000090',
  },
  groupChatCount: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  containerRowChat: {flexDirection: 'row', alignItems: 'center'},
  txtSpecialist: {
    color: '#3161AD',
    fontSize: 13,
    fontWeight: 'bold',
  },
  groupSpecialist: {
    backgroundColor: 'rgba(49, 97, 173, 0.1);',
    borderRadius: 4,
    padding: 5,
    maxWidth: '60%',
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  containerSpecialist: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 14,
    justifyContent: 'space-between',
  },
  imgQuestion: {
    width: '100%',
    height: 200,
  },
  txtComment: {
    paddingTop: 7.28,
    paddingBottom: 8,
  },
  txtTime: {
    color: '#00000080',
  },
  txtname: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
    shadowColor: '#00000040',
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.3,
    elevation: 1,
  },
  groupName: {
    paddingLeft: 10,
  },
  containerProfile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  containerItem: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    elevation: 1,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    padding: 15,
    paddingBottom: 4,
  },
  boderImage: {borderRadius: 20},
  avatar: {width: 40, height: 40, alignSelf: 'flex-start'},
  imgPlaceHoder: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    navigation: state.auth.navigation,
  };
}
export default connect(mapStateToProps)(ItemQuestion);
