import React, {useEffect, useState} from 'react';
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
import {logEventFB} from '@utils/facebook-utils';
import firebaseUtils from '@utils/firebase-utils';
import objectUtils from '@utils/object-utils';
import {withNavigation} from 'react-navigation';
import CustomMenu from '@components/CustomMenu';
import ListEhealthUpload from '@components/ehealth/ListEhealthUpload';
import ListEhealthOnline from '@components/ehealth/ListEhealthOnline';

const EhealthScreen = ({navigation, userApp, profile}) => {
  const [type, setType] = useState('online');
  console.log('type: ', type);
  useEffect(() => {
    logEventFB('ehealth');
  }, []);

  const onAddEhealth = () => {
    connectionUtils
      .isConnected()
      .then(s => {
        navigation.navigate('selectHospital', {
          hospital: hospital,
          onSelected: hospital => {
            // alert(JSON.stringify(hospital))
            setTimeout(() => {
              navigation.navigate('addNewEhealth', {
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

  const onUploadEhealth = () => {
    navigation.navigate('createEhealth', {profile});
  };
  const onSelect = (e, i) => {
    setType(e.type);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerHeaderOnline}>
        <CustomMenu
          MenuSelectOption={
            <View style={styles.buttonHeaderOnline}>
              <Text style={styles.txtTitleOnline}>
                {type == 'online'
                  ? 'Hồ sơ BV, PK'
                  : 'Hồ sơ tự tải'}
              </Text>
              <ScaledImage
                source={require('@images/new/profile/ic_dropdown.png')}
                height={19}
                width={19}
                style={{tintColor: '#FFF'}}
              />
            </View>
          }
          options={[
            type == 'upload'
              ? {value: 'Hồ sơ BV, PK', id: 1, type: 'online'}
              : {value: 'Hồ sơ tự tải', id: 1, type: 'upload'},
          ]}
          onSelected={onSelect}
        />
        {type == 'online' ? (
          <TouchableOpacity onPress={onAddEhealth} style={styles.btnAddEhealth}>
            <ScaledImage
              source={require('@images/new/ic_qr.png')}
              height={19}
              width={19}
            />
            <Text style={styles.txAddEhealth}>
              {constants.ehealth.add_new_result_examination}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onUploadEhealth}
            style={styles.btnAddEhealth}>
            <ScaledImage
              source={require('@images/new/ehealth/ic_upload_arrow.png')}
              height={19}
              width={19}
            />
            <Text style={styles.txAddEhealth}>
              {constants.ehealth.upload_new_result_examination}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.containerProfile}>
        {/** */}
        {type == 'online' ? (
          <ListEhealthOnline profile={profile} />
        ) : (
          <ListEhealthUpload profile={profile} />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  txtTitleOnline: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    paddingRight: 10,
    textTransform: 'uppercase',
  },
  buttonHeaderOnline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerHeaderOnline: {
    backgroundColor: '#3161AD',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerProfile: {
    backgroundColor: '#FFF',
    flex: 1,
    zIndex: 10,
  },
  container: {
    flex: 1,
  },

  btnAddEhealth: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderColor: '#FFF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  txAddEhealth: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    booking: state.booking,
  };
}
export default connect(mapStateToProps)(withNavigation(EhealthScreen));
