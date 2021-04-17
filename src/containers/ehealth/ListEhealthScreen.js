import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtils from 'mainam-react-native-date-utils';
import hospitalProvider from '@data-access/hospital-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import {Card} from 'native-base';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import connectionUtils from '@utils/connection-utils';
import ehealthProvider from '@data-access/ehealth-provider';
import ListProfile from '@components/ehealth/ListProfile';
import resultUtils from './utils/result-utils';
import objectUtils from '@utils/object-utils';
import EhealthScreen from '@containers/ehealth/EhealthScreen';
import firebaseUtils from '@utils/firebase-utils';
import HistorySharingScreen from './HistorySharingScreen';
const ListEhealthScreen = ({navigation}) => {
  const [profile, setProfile] = useState({});
  const [index, setIndex] = useState();
  const goToHealthMonitoring = () => {
    firebaseUtils.sendEvent('Healthdairy_screen_personal');
    navigation.navigate('healthMonitoring', {
      index,
    });
  };

  return (
    <ActivityPanel title={constants.title.ehealth} style={styles.container}>
      <View style={styles.viewContent}>
        <View style={styles.containerListProfile}>
          <View style={styles.viewProfile}>
            <ListProfile
              onSeletedProfile={(profile, index) => {
                setProfile(profile);
                setIndex(index);
              }}
            />
          </View>
        </View>
        <View style={styles.containerProfile}>
          <View style={styles.viewTxProfile}>
            {profile?.type == 'share' ? (
              <View
                style={{
                  paddingRight: 10,
                }}>
                <Text style={styles.txNameProfile}>
                  {profile?.profileInfo?.personal?.fullName}
                </Text>
                <Text style={styles.dobProfile}>
                  Hồ sơ đang được chia sẻ với tôi
                </Text>
              </View>
            ) : (
              <View
                style={{
                  paddingRight: 10,
                }}>
                <Text style={styles.txNameProfile}>
                  {profile?.profileInfo?.personal?.fullName}
                </Text>
                <Text style={styles.dobProfile}>
                  {profile?.profileInfo?.personal?.dateOfBirth
                    ? profile?.profileInfo?.personal?.dateOfBirth
                        .toDateObject('-')
                        .format('dd/MM/yyyy') + ' - '
                    : ''}
                  {profile?.profileInfo?.personal?.age
                    ? profile?.profileInfo?.personal?.age + ' tuổi'
                    : ''}
                </Text>
              </View>
            )}

            <View>
              {profile?.defaultProfile ? (
                <TouchableOpacity
                  onPress={goToHealthMonitoring}
                  style={styles.buttonHealth}>
                  <ScaleImage
                    source={require('@images/new/ehealth/ic_health.png')}
                    height={30}
                  />
                  <Text style={styles.txtFollow}>Theo dõi SK</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.viewFlatList}>
            {profile?.type == 'share' ? (
              <HistorySharingScreen />
            ) : (
              <EhealthScreen profile={profile} />
            )}
          </View>
        </View>
      </View>
    </ActivityPanel>
  );
};
const styles = StyleSheet.create({
  containerListProfile: {
    backgroundColor: '#00000010',
  },
  containerProfile: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {height: 1},
    shadowOpacity: 0.2,
    backgroundColor: '#FFF',
    flex: 1,
  },
  txtFollow: {
    color: '#E63950',
  },
  buttonHealth: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  lineBettwen: {
    height: '95%',
    width: 1,
    backgroundColor: '#00000060',
  },
  buttonShare: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  image: {width: 60, height: 60},
  container: {
    flex: 1,
  },
  txHeader: {
    marginTop: 10,
    fontSize: 16,
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
  viewTx: {marginLeft: 10},
  txHospitalName: {fontWeight: 'bold', color: '#000000', fontSize: 15},
  txLastTime: {color: '#5A5956', marginTop: 5},

  viewContent: {
    flex: 1,
  },
  viewFlatList: {flex: 1},
  viewTxNone: {alignItems: 'center', marginTop: 50},
  viewTxTime: {fontStyle: 'italic'},
  btnAddEhealth: {
    flexDirection: 'row',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#0291E1',
    marginHorizontal: 60,
    marginVertical: 20,
    alignItems: 'center',
  },
  txAddEhealth: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  txEhealth: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  viewProfile: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tittleStyle: {paddingLeft: 30},
  viewTxProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 15,
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 20,
  },
  txNameProfile: {color: '#000', fontSize: 17, fontWeight: 'bold'},
  dobProfile: {fontSize: 12, color: '#808080'},
  txHeaderMonth: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 20,
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    booking: state.auth.booking,
    profile: state.auth.profile,
  };
}
export default connect(mapStateToProps)(ListEhealthScreen);
