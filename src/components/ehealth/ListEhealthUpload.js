import React, {useState, useEffect} from 'react';
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
import {useDispatch} from 'react-redux';

const ListEhealthUpload = ({navigation, profile}) => {
  console.log('profile: ListEhealthUpload', profile);
  const [listHospital, setListHospital] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    onGetHospital();
  }, [profile, refreshing]);
  const onGetHospital = async () => {
    try {
      let res = await hospitalProvider.getHistoryHospital2();
      console.log('res: ', res);
      if (res.code == 0) {
        setListHospital(res.data);
      }
    } catch (error) {}
  };
  const onRefresh = () => {
    onGetHospital();
  };
  const onPress = item => () => {
    dispatch({
      type: constants.action.action_select_hospital_ehealth,
      value: item,
    });
    navigation.navigate('listProfile');
  };
  const renderItem = ({item, index}) => {
    const source =
      item.hospital && item.hospital.avatar
        ? {uri: item.hospital.avatar}
        : require('@images/new/user.png');

    return (
      <Card style={styles.viewItem}>
        <TouchableOpacity
          style={styles.btnItem}
          onPress={item.hospital.timeGoIn ? onPress(item) : onDisable}>
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
  const keyExtractor = (item, index) => index.toString();
  const emptyComponent = () => {
    return (
      <View style={styles.viewTxNone}>
        <Text style={styles.viewTxTime}>
          {constants.ehealth.not_result_ehealth_location}
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.viewFlatList}>
      <FlatList
        data={listHospital}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={keyExtractor}
        ListEmptyComponent={emptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewFlatList: {flex: 1,padding: 10 },
  image: {width: 60, height: 60},
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

  viewTxNone: {alignItems: 'center', marginTop: 50},
  viewTxTime: {fontStyle: 'italic'},
});
export default withNavigation(ListEhealthUpload);
