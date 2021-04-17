import React, {useEffect, useState, memo} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Card} from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import {useSelector} from 'react-redux';
const InfoHistoryBooking = ({resultDetail, patientName, result, data}) => {
  const [state, setstate] = useState({
    isShow: false,
  });
  const [isContract, setIsContract] = useState(false);
  const [serviceCheckup, setServiceCheckup] = useState();

  // useEffect(()     => {
  //     let resultContractCheckup = result?.ResultContractCheckup
  //     var arrayContractCheckup = Object.entries(resultContractCheckup ? resultContractCheckup : {})
  //     if (arrayContractCheckup && arrayContractCheckup.length) {
  //         setIsContract(true)
  //         setServiceCheckup((resultDetail.services || []).find(item => item.ServiceType == "CheckUp"))
  //     } else {
  //         setServiceCheckup((resultDetail.services || []).filter(item => item.ServiceType == "CheckUp"))
  //     }
  // }, [])
  const setState = (
    data = {
      isShow: false,
    },
  ) => {
    setstate(state => {
      return {
        ...state,
        ...data,
      };
    });
  };
  const onSetShow = () => {
    setState({isShow: !state.isShow});
  };
  const getSumPrice = () => {
    let price = 0;

    if (resultDetail.length) {
      price = resultDetail.reduce((pre, cur) => {
        return pre + cur.total;
      }, 0);
    }
    return price.formatPrice();
  };
  if (!serviceCheckup?.length) return null;
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <TouchableOpacity
          onPress={onSetShow}
          style={[
            styles.buttonShowInfo,
            state.isShow ? {backgroundColor: '#3161AD'} : {},
          ]}>
          <ScaledImage
            source={require('@images/new/ehealth/ic_info.png')}
            height={19}
            style={{
              tintColor: state.isShow ? '#FFF' : '#3161AD',
            }}
          />
          <Text style={[styles.txtTitle, state.isShow ? {color: '#FFF'} : {}]}>
            DANH SÁCH DỊCH VỤ
          </Text>
          <ScaledImage
            source={require('@images/new/ehealth/ic_down2.png')}
            height={10}
            style={
              state.isShow
                ? {
                    tintColor: '#FFF',
                  }
                : {
                    transform: [{rotate: '-90deg'}],
                    tintColor: '#3161AD',
                  }
            }
          />
        </TouchableOpacity>
        {state.isShow ? (
          <View style={styles.groupInfo}>
            <Text style={styles.txtHospital}>{data?.hospitalName}</Text>
            <View style={styles.containerTime}>
              <Text style={styles.txtLabel}>TG khám: </Text>
              <Text style={styles.txtTime}>
                {resultDetail.invoiceDate
                  ? resultDetail.invoiceDate
                      .toDateObject('-')
                      .format('dd/MM/yyyy')
                  : ''}
              </Text>
            </View>
            {isContract ? (
              <View>
                {/* <Text style={styles.txtLabel}>Nơi khám: </Text>
                            <Text style={styles.txtTime}>{serviceCheckup.RoomName && serviceCheckup.Location ? `${serviceCheckup.RoomName} - ${serviceCheckup.Location}` : ''}</Text> */}
              </View>
            ) : (
              serviceCheckup &&
              serviceCheckup?.length &&
              serviceCheckup.map((obj, i) => {
                return (
                  <View key={i}>
                    <Text
                      style={[
                        styles.txtTime,
                        {color: '#0291E1', marginTop: 10},
                      ]}>
                      {obj.Name ? obj.Name : ''}
                    </Text>
                    {/* <Text style={styles.txtLabel}>Nơi khám: </Text>
                                    <Text style={styles.txtTime}>{obj.RoomName && obj.Location ? `${obj.RoomName} - ${obj.Location}` : ''}</Text> */}
                    <View style={styles.containerTime}>
                      <Text style={styles.txtLabel}>Bác sĩ: </Text>
                      <Text style={styles.txtTime}>
                        {obj.DoctorFullName == 'System'
                          ? ''
                          : obj.DoctorFullName}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}

            <Text style={styles.txtServiceLabel}>Dịch vụ đã thực hiện</Text>
            {(resultDetail &&
              resultDetail.length &&
              resultDetail.map((obj, i) => {
                return obj?.services && obj?.services?.length
                  ? obj.services.map((item, index) => {
                      return (
                        <View key={index} style={styles.containerServices}>
                          <View style={styles.dots} />
                          <Text style={styles.servicesName}>{item.name}</Text>
                          {!isContract && (
                            <Text style={styles.txtPriceService}>
                              {item?.price?.formatPrice() ?? 0}đ
                            </Text>
                          )}
                        </View>
                      );
                    })
                  : null;
              })) ||
              null}

            {(!isContract && (
              <View style={styles.containerSumService}>
                <Text>Tổng chi phí</Text>
                <Text style={styles.txtSumPrice}>{getSumPrice()}đ</Text>
              </View>
            )) ||
              null}
          </View>
        ) : null}
      </Card>
    </View>
  );
};

export default memo(InfoHistoryBooking);

const styles = StyleSheet.create({
  txtSumPrice: {
    color: '#ED1846',
    fontWeight: 'bold',
    // textDecorationLine: 'line-through'
  },
  containerSumService: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingLeft: 25,
  },
  txtPriceService: {
    color: '#00000080',
  },
  servicesName: {
    flex: 1,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  dots: {
    height: 10,
    width: 10,
    backgroundColor: '#0291E1',
    borderRadius: 5,
    marginTop: 5,
  },
  containerServices: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    paddingTop: 7,
  },
  txtServiceLabel: {
    paddingTop: 10,
    fontStyle: 'italic',
    color: '#00000090',
    paddingBottom: 5,
  },
  txtLabel: {
    minWidth: '20%',
  },
  txtTime: {
    color: '#000',
    fontWeight: 'bold',
    flex: 1,
  },
  containerTime: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 5,
  },
  txtHospital: {
    color: '#0291E1',
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupInfo: {
    padding: 10,
  },
  txtTitle: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#3161AD',
    fontWeight: 'bold',
  },
  buttonShowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  card: {
    borderRadius: 5,
  },
  container: {
    paddingHorizontal: 10,
  },
});
