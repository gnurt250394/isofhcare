import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import {useSelector} from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import TabMonitoringHealth from '@components/ehealth/healthMonitoring/TabMonitoringHealth';

const HealthMonitoringScreen = () => {
  const userApp = useSelector(state => state.auth.userApp);
  console.log('userApp: ', userApp);
  const icSupport = require('@images/new/user.png');
  const avatar = userApp?.currentUser?.avatar
    ? {uri: userApp.currentUser.avatar}
    : icSupport;
  return (
    <ActivityPanel title={'Chỉ số sức khoẻ'}>
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
              ({userApp?.currentUser?.dob?.toDateObject().format('dd/MM/yyyy')} -{' '}
              {userApp?.currentUser?.dob?.toDateObject().getAge()} tuổi)
            </Text>
          </View>
          <View style={styles.lineBettwen} />
          <View style={styles.buttonHealth}>
            <Text
              style={{
                color: '#00000080',
              }}>
              Chỉ số sức khoẻ
            </Text>
            <Text style={styles.txtFollow}>Bình thường</Text>
          </View>
        </View>

        {/** tab */}
        
        <TabMonitoringHealth />
      </View>
    </ActivityPanel>
  );
};

const styles = StyleSheet.create({
  buttonTab: {
    paddingBottom: 10,
    borderBottomColor: '#3161AD',
    borderBottomWidth: 2,
    marginRight: 15,
  },
  txtFollow: {
    color: '#3161AD',
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
    paddingBottom: 15,
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
});
export default HealthMonitoringScreen;
