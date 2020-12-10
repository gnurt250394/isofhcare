import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import clientUtils from '@utils/client-utils';
import bookingProvider from '@data-access/booking-provider';
import {connect} from 'react-redux';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';
import LinearGradient from 'react-native-linear-gradient';
import dateUtils from 'mainam-react-native-date-utils';
import hospitalProvider from '@data-access/hospital-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import {Card} from 'native-base';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import connectionUtils from '@utils/connection-utils';
import { logEventFB } from '@utils/facebook-utils';
import firebaseUtils from '@utils/firebase-utils';

class EhealthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listHospital: [],
      isLongPress: false,
      index: '',
      refreshing: false,
    };
  }
  componentDidMount() {
    logEventFB("ehealth")
    this.onRefresh();
  }
  onGetHospital = () => {
    hospitalProvider
      .getHistoryHospital2()
      .then(res => {
        if (res.code == 0) {
          this.setState({
            listHospital: res.data,
            refreshing: false,
          });
        } else {
          this.setState({
            refreshing: false,
          });
        }
      })
      .catch(err => {
        this.setState({
          refreshing: false,
        });
      });
  };
  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.onGetHospital();
      },
    );
  };
  onPress = item => {
    this.props.dispatch({
      type: constants.action.action_select_hospital_ehealth,
      value: item,
    });
    this.props.navigation.navigate('listProfile');
  };
  onDisable = () => {
    snackbar.show(constants.msg.ehealth.not_examination_at_hospital, 'danger');
  };
  onAddEhealth = () => {
    connectionUtils
      .isConnected()
      .then(s => {
        this.props.navigation.navigate('selectHospital', {
          hospital: this.state.hospital,
          onSelected: hospital => {
            // alert(JSON.stringify(hospital))
            setTimeout(() => {
              this.props.navigation.navigate('addNewEhealth', {
                hospital: hospital,
              });
            }, 300);
          },
        });
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, 'danger');
      });
  };
  renderItem = ({item, index}) => {
    const source =
      item.hospital && item.hospital.avatar
        ? {uri: item.hospital.avatar}
        : require('@images/new/user.png');

    return (
      <Card style={styles.viewItem}>
        <TouchableOpacity
          style={styles.btnItem}
          onPress={
            item.hospital.timeGoIn
              ? this.onPress.bind(this, item)
              : this.onDisable
          }>
          <ImageLoad
            resizeMode="cover"
            imageStyle={styles.imageStyle}
            borderRadius={30}
            customImagePlaceholderDefaultStyle={[styles.avatar, styles.image]}
            placeholderSource={require('@images/new/user.png')}
            resizeMode="cover"
            loadingStyle={{size: 'small', color: 'gray'}}
            source={source}
            style={styles.imgLoad}
            defaultImage={() => {
              return (
                <ScaleImage
                  resizeMode="cover"
                  source={require('@images/new/user.png')}
                  width={60}
                  height={60}
                />
              );
            }}
          />
          <View style={styles.viewTx}>
            <Text multiline style={styles.txHospitalName}>
              {item.hospital.name}
            </Text>
            <Text style={styles.txLastTime}>
              {constants.ehealth.lastTime}
              <Text>
                {item.hospital.timeGoIn
                  ? item.hospital.timeGoIn
                      .toDateObject('-')
                      .format('dd/MM/yyyy')
                  : ''}
              </Text>
            </Text>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };
  onBackClick = () => {
    this.props.navigation.pop();
  };
  keyExtractor = (item, index) => index.toString();
  headerComponent = () => {
    return !this.state.refreshing &&
      (!this.state.listHospital || this.state.listHospital.length == 0) ? (
      <View style={styles.viewTxNone}>
        <Text style={styles.viewTxTime}>
          {constants.ehealth.not_result_ehealth_location}
        </Text>
      </View>
    ) : null;
  };
  onUploadEhealth = () => {
    this.props.navigation.navigate('createEhealth');
  };
  listEhealthUpload = () => {
    
    this.props.navigation.navigate('listEhealthUpload');
  };
  goToHealthMonitoring=()=>{
      firebaseUtils.sendEvent('Healthdairy_screen_personal');
      this.props.navigation.navigate('healthMonitoring')
  }
  render() {
    const {userApp} = this.props;
    
    const icSupport = require('@images/new/user.png');
    const avatar = userApp?.currentUser?.avatar
      ? {uri: userApp.currentUser.avatar}
      : icSupport;
    return (
      <ActivityPanel
        title={constants.title.ehealth}
        style={styles.container}
        isLoading={this.state.refreshing}>
        <View style={styles.container2}>
          <View style={styles.containerHeader}>
            <View style={styles.groupProfile}>
              <Image source={avatar} style={styles.imgProfile} />
            </View>
          </View>
        </View>
        <View style={styles.containerProfile}>
          <View style={styles.layoutTriangle} />
          <View style={styles.containerProfileName}>
            <View style={styles.groupName}>
              <Text style={styles.txtName}>{userApp?.currentUser?.name}</Text>
              <Text>
                ({userApp?.currentUser?.dob?.toDateObject('-').format('dd/MM/yyyy')}{' '}
                - {userApp?.currentUser?.dob?.toDateObject('-').getAge()} tuổi)
              </Text>
            </View>
            <View style={styles.lineBettwen} />
            <TouchableOpacity onPress={this.goToHealthMonitoring} style={styles.buttonHealth}>
              <ScaledImage
                source={require('@images/new/ehealth/ic_health.png')}
                height={30}
              />
              <Text style={styles.txtFollow}>Theo dõi SK</Text>
            </TouchableOpacity>
          </View>

          {/** */}
          <ScrollView style={styles.viewContent}>
            <TouchableOpacity
              onPress={this.onAddEhealth}
              style={styles.btnAddEhealth}>
              <Text style={styles.txAddEhealth}>
                {constants.ehealth.add_new_result_examination}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onUploadEhealth}
              style={styles.btnUploadEhealth}>
              <Text style={styles.txAddEhealth}>
                {constants.ehealth.upload_new_result_examination}
              </Text>
            </TouchableOpacity>
            <Text style={styles.txHeader}>
              {constants.ehealth.ehealth_location}
            </Text>
            <View style={styles.viewFlatList}>
              <FlatList
                data={this.state.listHospital}
                extraData={this.state}
                renderItem={this.renderItem}
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
                keyExtractor={this.keyExtractor}
                ListHeaderComponent={this.headerComponent}>
                {' '}
              </FlatList>
            </View>
            <TouchableOpacity onPress={this.listEhealthUpload}>
              <Text style={styles.txBottom}>
                {constants.ehealth.ehealth_upload}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  txtFollow: {
    color: '#E63950',
  },
  buttonHealth: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  lineBettwen: {
    height: '95%',
    width: 1,
    backgroundColor: '#00000060',
  },
  txtName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  groupName: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  containerProfileName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomColor: '#00000040',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  layoutTriangle: {
    height: 14,
    width: 14,
    top: -7,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    transform: [{rotate: '45deg'}],
    zIndex: 0,
  },
  containerProfile: {
    backgroundColor: '#FFF',
    shadowOpacity: 0.3,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    flex: 1,
    zIndex: 10,
  },
  imgProfile: {
    height: 60,
    width: 60,
    borderRadius: 15,
  },
  groupProfile: {
    borderRadius: 15,
    borderColor: '#00BA99',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.4,
    backgroundColor: '#FFF',
    margin: 2,
  },
  containerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 12,
  },
  container2: {
    backgroundColor: '#00000010',
  },
  image: {width: 60, height: 60},
  container: {
    flex: 1,
  },
  txHeader: {
    marginVertical: 20,
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  txBottom: {
    marginVertical: 20,
    fontSize: 16,
    color: '#3161AD',
    fontWeight: 'bold',
  },
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    borderRadius: 5,
  },
  btnItem: {flexDirection: 'row', alignItems: 'center', flex: 1},
  imgLoad: {
    alignSelf: 'center',
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  imageStyle: {
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: '#27AE60',
  },
  viewTx: {marginLeft: 10, flex: 1},
  txHospitalName: {fontWeight: 'bold', color: '#5A5956', fontSize: 15},
  txLastTime: {color: '#5A5956', marginTop: 5},

  viewContent: {
    paddingHorizontal: 10,
    flex: 1,
  },
  // viewFlatList: { flex: 1 },
  viewTxNone: {alignItems: 'center', marginTop: 50},
  viewTxTime: {fontStyle: 'italic'},
  btnAddEhealth: {
    borderRadius: 5,
    backgroundColor: '#02C39A',
    justifyContent: 'center',
    alignItems: 'center',
    height: 51,
    marginTop: 30,
    marginHorizontal: 25,
    borderRadius: 10,
  },
  btnUploadEhealth: {
    borderRadius: 5,
    backgroundColor: '#3161AD',
    justifyContent: 'center',
    alignItems: 'center',
    height: 51,
    marginTop: 10,
    marginHorizontal: 25,
    borderRadius: 10,
  },
  txAddEhealth: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    booking: state.booking,
  };
}
export default connect(mapStateToProps)(EhealthScreen);
