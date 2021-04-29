import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
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
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import connectionUtils from '@utils/connection-utils';
import ehealthProvider from '@data-access/ehealth-provider';
import {withNavigation} from 'react-navigation';
import ItemEhealth from './ItemEhealth';

const ListEhealthOnline = ({navigation, profile}) => {
  const [listEhealth, setListEhealth] = useState([
  ]);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (profile?.userProfileId) onGetEhealth();
  }, [refreshing, profile]);
  const onGetEhealth = async () => {
    try {
      let res = await ehealthProvider.getListEhelthWithProfile(
        profile?.userProfileId,
      );
      setRefreshing(false);
      setListEhealth(res);
    } catch (error) {
      setRefreshing(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
  };
  const goToDetail = item => () => {
    console.log('item: ', item);
    
    navigation.navigate('viewDetailEhealth', {item, listResult: listEhealth});
  };
  const renderItem = ({item, index}) => {
    return <ItemEhealth item={item} isShare={true} onPress={goToDetail(item)} />;
  };
  const onBackClick = () => {
    navigation.pop();
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
  const onUploadEhealth = () => {
    navigation.navigate('createEhealth');
  };
  const renderFooter = () => {
    return <View style={{height: 50}} />;
  };
  return (
    <View style={styles.viewFlatList}>
      <FlatList
        data={listEhealth}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        // ListEmptyComponent={emptyComponent}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  txtExpried: {
    color: '#00000070',
  },
  txtHospital: {
    paddingBottom: 10,
  },
  txtName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerHospital: {
    paddingLeft: 15,
    paddingTop: 10,
  },
  txtHistoryId: {color: '#FFF', fontWeight: 'bold'},
  containerItemHistoryId: {
    backgroundColor: '#166950',
    paddingLeft: 15,
    padding: 5,
    paddingRight: 10,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    alignSelf: 'flex-start',
  },
  containerItem: {
    borderLeftColor: '#00000040',
    borderLeftWidth: 1,
    flex: 1,
  },
  txtDateGoin: {
    fontSize: 40,
    color: '#16695080',
    fontWeight: 'bold',
  },
  txtNotFound: {
    fontStyle: 'italic',
  },
  containerNotFound: {
    alignItems: 'center',
    marginTop: 50,
  },
  flex: {flex: 1},
  txtServicesName: {
    marginLeft: 5,
    fontSize: 14,
    minHeight: 20,
    fontWeight: 'bold',
  },
  containerImageSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtTimeGoIn: {
    color: '#166950',
    marginVertical: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  containerImage: {
    width: 150,
    height: 100,
    alignItems: 'center',
  },
  buttonViewResult: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  cardStyle: {
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  viewItem: {
    padding: 2,
    paddingHorizontal: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },
  viewDetails: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    alignSelf: 'flex-start',
  },
  img: {
    // top:-50
  },

  imageStyle: {
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: 'rgba(151, 151, 151, 0.29)',
  },
  imgLoad: {
    alignSelf: 'center',
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  avatar: {
    alignSelf: 'center',
    borderRadius: 25,
    width: 45,
    height: 45,
  },
  titleStyle: {
    color: '#fff',
  },
});
export default withNavigation(ListEhealthOnline);
