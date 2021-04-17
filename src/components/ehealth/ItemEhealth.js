import React from 'react';
import {withNavigation} from 'react-navigation';
import ScaledImage from 'mainam-react-native-scaleimage';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Card} from 'native-base';

const ItemEhealth = ({item, onPress, navigation, isShare, disabled}) => {
  const onShare = () => {
    navigation.navigate('ehealthSharing', {item});
  };
 
  return (
    <View style={styles.viewItem}>
      <Card style={styles.cardStyle}>
        <TouchableOpacity
          onPress={onPress(item)}
          disabled={disabled}
          style={styles.buttonViewResult}>
          <View style={styles.viewDetails}>
            <Text style={styles.txtDateGoin}>
              {item.timeGoIn.toDateObject().format('dd')}
            </Text>
            <Text style={styles.txtTimeGoIn}>
              {item.timeGoIn.toDateObject().format('MM/yyyy')}
            </Text>
          </View>
          <View style={styles.containerItem}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={styles.containerItemHistoryId}>
                {item?.patientHistoryId ? (
                  <Text style={styles.txtHistoryId}>
                    HS:{item?.patientHistoryId}
                  </Text>
                ) : (
                  <Text style={styles.txtHistoryId}>{item?.patientName}</Text>
                )}
              </View>
              {isShare ? (
                <TouchableOpacity
                  onPress={onShare}
                  style={{
                    paddingHorizontal: 10,
                  }}
                  hitSlop={{
                    top: 20,
                    left: 20,
                    bottom: 20,
                    right: 20,
                  }}>
                  <ScaledImage
                    source={require('@images/new/ehealth/ic_share.png')}
                    height={19}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.containerHospital}>
              {item?.patientHistoryId ? (
                <Text style={styles.txtName}>{item?.patientName}</Text>
              ) : null}

              <Text style={styles.txtHospital}>{item?.hospitalName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
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
  txtTimeGoIn: {
    color: '#166950',
    marginVertical: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonViewResult: {
    alignItems: 'flex-start',
    flexDirection: 'row',
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
});
export default withNavigation(ItemEhealth);
