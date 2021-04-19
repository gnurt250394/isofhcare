import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import constants from '@resources/strings';
import {Table, Row} from 'react-native-table-component';
import ImageEhealth from './ImageEhealth';
import {Card} from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import ReminderMedicine from './ReminderMedicine';
import {FlatList} from 'react-native';
import NavigationService from '@navigators/NavigationService';
import reminderProvider from '@data-access/reminder-provider';
import ehealthProvider from '@data-access/ehealth-provider';
import {withNavigation} from 'react-navigation';
import snackbar from '@utils/snackbar-utils';

class Medicine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTime: [],
      isShow: this.props.showDrug,
      data: this.props.data,
    };
  }

  renderMedicine(list) {
    if (list) {
      return list.map((data, i) => this.renderMedicineItem(i, data));
    }
    return null;
  }
  renderMedicineItem(index, item) {
    var serviceName = '';
    if (item.ServiceName) serviceName += item.ServiceName + '\n';
    if (item.Measure) serviceName += item.Measure + '\n';
    if (item.Dosage) serviceName += item.Dosage + '\n';
    if (item.Usage) serviceName += item.Usage;
    var data = [index + 1, serviceName, item.Quantity, item.Unit];
    return (
      <Row
        data={data}
        key={index}
        textStyle={styles.text}
        flexArr={[1, 3, 1, 1]}
      />
    );
  }
  onSetShow = () => {
    this.setState({isShow: !this.state.isShow});
  };
  componentDidMount() {
    this.setState(
      {
        result: this.props.result,
      },
      () => {
        this.checkListReminder();
      },
    );
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.result != nextProps.result) {
      this.setState(
        {
          result: nextProps.result,
        },
        () => {
          this.checkListReminder();
        },
      );
    }
  }
  checkListReminder = () => {
    // 
    // reminderProvider.getListReminder(new Date().format('yyyy-MM-dd')).then(s => {

    // }).catch(err => {

    // })
    this.setState({
      listReminder: this.props?.userApp?.currentUser?.remindMedicines,
    });
  };
  onCreateAlarm = item => () => {
    NavigationService.navigate('detailReminder', {
      drug: item,
    });
  };

  renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.itemViewShb,
          index % 2 ? styles.bgGray : styles.bgWrite,
        ]}>
        <View style={styles.viewNameDrug}>
          <Text style={styles.txNameDrug}>{item.ServiceName}</Text>
          <Text style={styles.txUseDrug}>{item.Dosage}</Text>
        </View>
        <View style={styles.viewItemBtn}>
          <TouchableOpacity
            onPress={this.onCreateAlarm(item)}
            style={styles.btnAlarm}>
            {item.isReminder ? (
              <ScaledImage
                source={require('@images/new/reminderDrug/ic_bell_check.png')}
                height={20}
              />
            ) : (
              <ScaledImage
                style={styles.tintColor}
                source={require('@images/new/reminderDrug/ic_bell_uncheck.png')}
                height={20}
              />
            )}
          </TouchableOpacity>
          <View />
          <Text style={styles.txQuantity}>
            {item?.Quantity + '  '}
            <Text style={styles.txUnit}>{item?.Unit}</Text>
          </Text>
        </View>
      </View>
    );
  };
  onShowList = () => {
    NavigationService.navigate('listRemind');
  };
  renderForShb = data => {
    const tableHead = ['STT', 'Tên thuốc', 'Số lượng', 'Đơn vị'];
    data.map(obj =>
      this.state.listReminder?.map(obj2 => {
        if (
          obj.ServiceName?.toString().trim() ==
          obj2.medicineName?.toString().trim()
        ) {
          obj.isReminder = true;
        }
      }),
    );

    return (
      <View>
        <View style={styles.viewHeaderDrug}>
          <Text style={styles.txMenuDrug}>Đơn thuốc</Text>
          <TouchableOpacity
            onPress={this.onShowList}
            style={styles.btnListDrug}>
            <Text style={styles.txViewListDrug}>Xem tất cả lịch nhắc</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewRow}>
          <View style={styles.viewLabelName}>
            <Text style={styles.labelNameDrug}>Tên thuốc</Text>
          </View>
          <View style={styles.viewLabel}>
            <Text style={styles.labelNameDrug}>Lịch nhắc</Text>
            <Text style={styles.labelNameDrug}>Số lượng</Text>
          </View>
        </View>
        <FlatList
          data={data}
          extraData={this.state}
          keyExtractor={(item, index) => item.id || index}
          renderItem={this.renderItem}
        />
      </View>
    );
  };
  onShare = async () => {
    try {
      
      let res = await ehealthProvider.getFilePdfDrug(
        this.props.data.patientHistoryId,
      );
      this.setState({isLoading: false});

      if (!res?.length) {
        snackbar.show('Hồ sơ không tồn tại đơn thuốc đã ký số', 'danger');
        return;
      }
      this.props.navigation.navigate('pdfViewer', {data: res});
      // let data = res.map(e => e.path);
      // this.exportPdfCom.shareFilePdf(data, () => {
      // });
    } catch (error) {
      snackbar.show('Có lỗi xảy ra vui lòng thử lại', 'danger');
      
    }
  };
  render() {
    const tableHead = ['STT', 'Tên thuốc', 'Số lượng', 'Đơn vị'];

    let {result} = this.state;

    if (
      !result ||
      !result.ListResultCheckup ||
      !result.ListResultCheckup.length
    )
      return null;
    let resultCheckup = result.ListResultCheckup || [];
    let medinine = [];
    resultCheckup.forEach(item => {
      if (item.ListMedicine && item.ListMedicine.length)
        medinine = medinine.concat(item.ListMedicine);
      if (item.ListExternalMedicine && item.ListExternalMedicine.length)
        medinine = medinine.concat(item.ListExternalMedicine);
    });

    // medinine = medinine.filter((obj, index, self) => { return self.indexOf(obj) === index })

    // if (result.ListMedicine && result.ListMedicine.length) {
    //     medinine = medinine.concat(result.ListMedicine);
    // }

    if (medinine && medinine.length) {
      medinine = medinine.map(obj => JSON.stringify(obj));
      medinine = medinine.filter(
        (obj, index, self) => self.indexOf(obj) === index,
      );
      medinine = medinine.map(obj => JSON.parse(obj));
      if (
        !medinine[0]?.SummaryResult &&
        !medinine[0]?.ServiceName &&
        medinine[0]?.Image?.length == 0
      ) {
        return null;
      }

      return (
        <View style={styles.viewMedinine}>
          <Card style={styles.card}>
            <TouchableOpacity
              onPress={this.onSetShow}
              style={[
                styles.buttonShowInfo,
                this.state.isShow ? {backgroundColor: '#075BB5'} : {},
              ]}>
              <ScaledImage
                source={require('@images/new/ehealth/ic_drug.png')}
                height={19}
                style={{
                  tintColor: this.state.isShow ? '#FFF' : '#075BB5',
                }}
              />
              <Text
                style={[
                  styles.txtTitle,
                  this.state.isShow ? {color: '#FFF'} : {},
                ]}>
                THUỐC
              </Text>
              <ScaledImage
                source={require('@images/new/ehealth/ic_down2.png')}
                height={10}
                style={
                  this.state.isShow
                    ? {
                        tintColor: '#FFF',
                      }
                    : {
                        transform: [{rotate: '-90deg'}],
                        tintColor: '#075BB5',
                      }
                }
              />
            </TouchableOpacity>
            {this.state.isShow ? (
              this.props.userApp.currentUser?.accessShb ? (
                this.renderForShb(medinine)
              ) : (
                <View style={{padding: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingLeft: 15,
                    }}>
                    <Text>Đơn thuốc</Text>
                    <TouchableOpacity
                      onPress={this.onShare}
                      style={{paddingHorizontal: 15}}>
                      <ScaledImage
                        source={require('@images/new/ehealth/ic_print.png')}
                        height={25}
                        style={{tintColor: '#000'}}
                      />
                    </TouchableOpacity>
                  </View>
                  <ReminderMedicine
                    resultDetail={this.props.resultDetail}
                    result={this.props.result}
                    hospitalName={this.props.hospitalName}
                    currentIndex={this.props.currentIndex}
                    dataHistory={this.props.dataHistory}
                    user={this.props.user}
                    listResult={this.props.listResult}
                  />
                  {medinine[0].SummaryResult || medinine[0].Image ? (
                    <View style={{flex: 1, padding: 10}}>
                      <Text style={{paddingBottom: 10}}>
                        {medinine[0].SummaryResult}
                      </Text>
                      <ImageEhealth images={medinine[0].Image} />
                    </View>
                  ) : (
                    <Table
                      style={[styles.table, {marginTop: 10}]}
                      borderStyle={styles.borderStyle}>
                      <Row
                        data={tableHead}
                        style={styles.head}
                        textStyle={styles.textHead}
                        flexArr={[1, 3, 1, 1]}
                      />
                      {this.renderMedicine(medinine)}
                    </Table>
                  )}
                </View>
              )
            ) : null}
          </Card>
        </View>
      );
    } else return null;
  }
}

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    ehealth: state.auth.ehealth,
  };
}
const styles = StyleSheet.create({
  txtTitle: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#075BB5',
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
  round1: {
    width: 20,
    height: 20,
    backgroundColor: '#FFF',
    borderColor: '#8fa1aa',
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  round2: {width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c'},
  round3: {width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444'},
  itemlabel: {marginLeft: 5, flex: 1, marginTop: 2},
  itemcontent: {color: '#0076ff'},
  item: {marginTop: 10, flexDirection: 'row'},
  slide: {
    flex: 1,
  },
  table: {marginTop: 30},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  textHead: {textAlign: 'center', fontWeight: 'bold'},
  text: {padding: 4, textAlign: 'center'},
  diagnosticLabel: {
    color: constants.colors.primary_bold,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  breakline: {
    height: 1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: constants.colors.breakline,
  },
  viewMedinine: {flex: 1, paddingHorizontal: 10},
  txDrug: {fontWeight: 'bold', fontSize: 18},
  borderStyle: {borderWidth: 0.5, borderColor: '#c8e1ff'},
  itemViewShb: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  viewNameDrug: {
    width: '50%',
    paddingLeft: 10,
  },
  viewItemBtn: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 10,
  },
  txNameDrug: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  txUseDrug: {
    color: '#00000080',
    fontSize: 14,
    textAlign: 'left',
  },
  btnAlarm: {
    padding: 5,
  },
  tintColor: {
    tintColor: '#00000080',
  },
  txUnit: {
    color: '#00000080',
    fontSize: 14,
    textAlign: 'right',
  },
  txQuantity: {
    fontSize: 14,
    color: '#000000',
  },
  bgGray: {
    backgroundColor: '#00000008',
  },
  bgWrite: {
    backgroundColor: '#fff',
  },
  viewRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3161AD10',
  },
  labelNameDrug: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3161AD',
  },
  viewLabel: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  viewLabelName: {
    width: '50%',
    paddingLeft: 10,
  },
  viewHeaderDrug: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  txMenuDrug: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  txViewListDrug: {
    color: '#ED1846',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
    textDecorationColor: '#ED1846',
  },
  btnListDrug: {padding: 5},
});
export default connect(mapStateToProps)(withNavigation(Medicine));
