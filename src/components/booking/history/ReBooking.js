import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import constants from '@resources/strings';
import connectionUtils from '@utils/connection-utils';
import resultUtils from '../../../containers/ehealth/utils/result-utils';
import snackbar from '@utils/snackbar-utils';
import NavigationService from '@navigators/NavigationService';
import {Card} from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import moment from 'moment';

class ReBooking extends PureComponent {
  constructor(props) {
    super(props);
  }
  onViewEhealth = item => {
    connectionUtils.isConnected().then(s => {
      try {
        let userId = this.props.userApp.currentUser.id;

        let hospitalId = this.props.userApp.hospital.id;
        resultUtils
          .getDetailByUserIdAndHospitalId(
            userId,
            hospitalId,
            item.patientHistoryId,
          )
          .then(result => {
            let dataResult = result.data;

            this.setState(
              {
                isLoading: false,
              },
              () => {
                if (dataResult) {
                  NavigationService.navigate('viewDetailEhealth', {
                    listResult: [dataResult],
                    currentIndex: 0,
                    resultSelected: dataResult,
                  });
                }
              },
            );
          })
          .catch(err => {});
      } catch (error) {}
    });
  };
  onBooking = () => {
    NavigationService.navigate('listDoctor');
  };
  render() {
    const item = this.props.item;
    console.log('item: ', item);
    let date = moment(this.props.item.time);

    return (
      <Card key={this.props.index} style={styles.listBtn}>
        <View style={styles.row}>
          <View style={styles.containerDate}>
            <View style={{marginVertical: 10}}>
              <Text style={styles.txtDate}>
                {!isNaN(date) ? date.format('DD') : ''}
              </Text>
              <Text style={styles.txtDate2}>
                {!isNaN(date) ? date.format('MM/yyyy') : ''}
              </Text>
            </View>
          </View>
          <View style={styles.containerBody}>
            <Text style={styles.txtLabel}>
              [Lịch hẹn tái khám]{' '}
              <Text style={styles.txtPatient}>
                {item.speciality ? item.speciality : ''}
              </Text>
            </Text>

            <View style={styles.viewBtn}>
              <Text style={styles.txtNote1}>
                {item.service ? item.service : ''}
              </Text>
              <TouchableOpacity
                style={styles.btnBooking}
                onPress={this.onBooking}>
                <Text style={styles.txBooking}>Đặt khám</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    );
  }
}
const styles = StyleSheet.create({
  txtLabel: {
    color: '#E73359',
    fontSize: 16,
    fontWeight: 'bold',
  },
  widthTxt: {
    width: '30%',
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 3,
  },
  txtSub: {
    color: '#FFF',
    fontSize: 12,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMore: {alignItems: 'center', position: 'absolute'},
  containerLoadMore: {
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  txtPatient: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  txtService: {
    fontSize: 14,
    color: '#000000',
  },
  txtNote1: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'normal',
    flex: 1,
    paddingRight: 7,
  },
  containerNoneData: {alignItems: 'center', marginTop: 50},
  colorRed: {
    color: 'rgb(208,2,27)',
  },
  colorWhite: {
    color: '#FFF',
    overflow: 'hidden',
  },
  flexStart: {
    paddingHorizontal: 5,
    alignSelf: 'flex-start',
  },
  txtUserName: {color: 'rgb(142,142,147)'},
  txtServiceType: {fontWeight: 'bold', color: 'rgb(74,74,74)'},
  containerBody: {
    width: '75%',
    borderLeftColor: '#E5E5E5',
    borderLeftWidth: 1,
    padding: 10,
  },
  txtDate2: {
    fontWeight: 'bold',
    color: '#333333',
    marginTop: -5,
  },
  txtDate: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#193D6B60',
    textAlign: 'center',
  },
  containerDate: {
    width: '25%',
    alignItems: 'center',
  },
  row: {flexDirection: 'row'},
  listBtn: {
    backgroundColor: '#F7F8FC',
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statusTx: {
    marginVertical: 5,
    backgroundColor: 'rgb(2,195,154)',
    borderRadius: 10,
    padding: 2,
  },
  statusReject: {
    marginVertical: 5,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: 'auto',
    borderRadius: 10,
    padding: 1,
  },

  titleStyle: {
    color: '#FFF',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
  },
  txReBooking: {color: '#ED1846'},
  btnBooking: {
    backgroundColor: '#0291E1',
    borderRadius: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    flex: 1,
  },
  btnEhealth: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
    borderColor: '#0291E1',
    borderWidth: 1,
    flex: 1,
    marginLeft: 10,
  },
  txBooking: {color: '#fff', fontSize: 14, fontWeight: 'bold'},
  txEhealth: {color: '#000000', fontSize: 14},
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    booking: state.auth.booking,
  };
}
export default connect(mapStateToProps)(ReBooking);
