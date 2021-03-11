import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Card} from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from '@components/ActivityPanel';
import {connect} from 'react-redux';
import ImageLoad from 'mainam-react-native-image-loader';
const width = Dimensions.get('window').width / 2;
const spacing = 10;
import dateUtils from 'mainam-react-native-date-utils';
import resultUtils from './utils/result-utils';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';
import ehealthProvider from '@data-access/ehealth-provider';

const HistorySharingScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([
    {
      timeGoIn: '2020-01-10',
      serviceName: 'abc',
      name: 'Nguyen Van A',
      hospitalName: 'Benh vien phoi trung uong',
      patientHistoryId: '12321324321',
      expried: '2021-02-20',
    },
    {
      timeGoIn: '2020-01-10',
      serviceName: 'abc',
      name: 'Nguyen Van A',
      hospitalName: 'Benh vien phoi trung uong',
      patientHistoryId: null,
      expried: '2021-02-20',
    },
    {
      timeGoIn: '2020-01-10',
      serviceName: 'abc',
      name: 'Nguyen Van A',
      hospitalName: 'Benh vien phoi trung uong',
      patientHistoryId: '12321324321',
      expried: '2021-02-20',
    },
  ]);
  const getTime = text => {
    try {
      if (text) {
        return text.toDateObject('-');
      }
      return '';
    } catch (error) {
      return '';
    }
  };
  const viewResult = item => () => {
    setState({isLoading: true}, () => {
      let hospitalId =
        props.ehealth.hospital && props.ehealth.hospital.hospital
          ? props.ehealth.hospital.hospital.id
          : props.ehealth.hospital.id;

      resultUtils
        .getDetail(item.patientHistoryId, hospitalId, item.id)
        .then(result => {
          setState({isLoading: false}, () => {
            if (!result.hasResult)
              snackbar.show(
                constants.msg.ehealth.not_result_ehealth_in_day,
                'danger',
              );
            else {
              props.navigation.navigate('viewDetailEhealth', {
                result: result.result,
                resultDetail: result.resultDetail,
              });
            }
          });
        });
    });
  };

  useEffect(() => {}, []);
  const onLoad = () => {};

  const renderItem = ({item}) => {
    return (
      <View style={styles.viewItem}>
        <Card style={styles.cardStyle}>
          <TouchableOpacity
            style={styles.buttonViewResult}
            onPress={viewResult(item)}>
            <View style={styles.viewDetails}>
              <Text style={styles.txtDateGoin}>
                {item.timeGoIn.toDateObject('-').format('dd')}
              </Text>
              <Text style={styles.txtTimeGoIn}>
                {item.timeGoIn.toDateObject('-').format('MM/yyyy')}
              </Text>
            </View>
            <View style={styles.containerItem}>
              <View style={styles.containerItemHistoryId}>
                {item?.patientHistoryId ? (
                  <Text style={styles.txtHistoryId}>
                    HS:{item?.patientHistoryId}
                  </Text>
                ) : (
                  <Text style={styles.txtHistoryId}>{item?.name}</Text>
                )}
              </View>
              <View style={styles.containerHospital}>
                {item?.patientHistoryId ? (
                  <Text style={styles.txtName}>{item?.name}</Text>
                ) : null}

                <Text style={styles.txtHospital}>{item?.hospitalName}</Text>
                <Text style={styles.txtExpried}>
                  Hết hiệu lực:{' '}
                  {item?.expried.toDateObject('-').format('dd/MM/yyyy')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
    );
  };

  const onRefresh = () => {
    if (!loading) onLoad();
  };
  const headerComponent = () => {
    return !refreshing && (!data || data.length == 0) ? (
      <View style={styles.containerNotFound}>
        <Text style={styles.txtNotFound}>
          {constants.msg.ehealth.share_not_found}
        </Text>
      </View>
    ) : null;
  };
  const footerComponent = () => <View style={{height: 10}} />;
  const keyExtractor = (item, index) => index.toString();
  return (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReachedThreshold={1}
      style={styles.flex}
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
    />
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
    paddingBottom: 15,
    minHeight: 120,
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

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    ehealth: state.auth.ehealth,
  };
}
export default connect(mapStateToProps)(HistorySharingScreen);
