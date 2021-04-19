import React, {Component} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import constants from '@resources/strings';
import dateUtils from 'mainam-react-native-date-utils';
import stringUtils from 'mainam-react-native-string-utils';
import snackbar from '@utils/snackbar-utils';
import ProfileInfomation from '@components/ehealth/ProfileInfomation';
import CheckupResult from '@components/ehealth/CheckupResult';
import SurgeryResult from '@components/ehealth/SurgeryResult';
import MedicalTestResult from '@components/ehealth/MedicalTestResult';
import DiagnosticResult from '@components/ehealth/DiagnosticResult';
import Medicine from '@components/ehealth/Medicine';
import TotalMoney from '@components/ehealth/TotalMoney';
import ExportPDF from '@components/ehealth/ExportPDF';
import InfoHistoryBooking from '@components/ehealth/InfoHistoryBooking';
import AdministrationIsPatient from '@components/ehealth/AdministrationIsPatient';
import PriceIsPatient from '@components/ehealth/PriceIsPatient';
import resultUtils from './utils/result-utils';
import connectionUtils from '@utils/connection-utils';
import ItemReBooking from '@components/booking/history/ItemReBooking';
import CustomMenu from '@components/CustomMenu';
import ehealthProvider from '@data-access/ehealth-provider';
import ProfileInfomationV1 from '@components/ehealth/ProfileInfomationV1';
import InfoHistoryBookingV1 from '@components/ehealth/InfoHistoryBookingV1';
import CheckupResultItemV1 from '@components/ehealth/CheckupResultItemV1';
import MedicalTestResultV1 from '@components/ehealth/MedicalTestResultV1';
import DiagnosticResultV1 from '@components/ehealth/DiagnosticResultV1';
import SurgeryResultV1 from '@components/ehealth/SurgeryResultV1';
import MedicineV1 from '@components/ehealth/MedicineV1';
import ReBooking from '@components/booking/history/ReBooking';

class ViewEhealthDetailScreen extends Component {
  constructor(props) {
    super(props);
    let result = this.props.navigation.state.params.result;

    let resultDetail = this.props.navigation.state.params.resultDetail;

    let user = this.props.navigation.state.params.user;
    let hospitalName = this.props.navigation.state.params.hospitalName;
    let showDrug = this.props.navigation.state.params.showDrug;
    let dataHistory = this.props.navigation.getParam('dataHistory', null);
    let data = this.props.navigation.getParam('data', null);
    let item = this.props.navigation.getParam('item', null);

    let listResult = this.props.navigation.state.params.listResult;
    let currentIndex = listResult.findIndex(e => e.id == item.id);

    this.state = {
      result: result,
      resultDetail: resultDetail,
      user: user,
      hospitalName: hospitalName,
      detailsHospital: '',
      showDrug,
      currentIndex:
        currentIndex || currentIndex == 0 ? parseInt(currentIndex) : null,
      listResult,
      dataHistory,
      data,
      item,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.navigation.state.params &&
      nextProps.navigation.state.params.result
    ) {
      // let result = nextProps.navigation.state.params.result;
      // let resultDetail = nextProps.navigation.state.params.resultDetail;
      // let user = nextProps.navigation.state.params.user
      // let hospitalName = nextProps.navigation.state.params.hospitalName
      // this.setState({
      //     result: result,
      //     resultDetail: resultDetail,
      //     user: user,
      //     hospitalName: hospitalName
      // })
      if (this.state.currentIndex || this.state.currentIndex == 0) {
        if (this.state.currentIndex == 0) {
          this.setState({
            disabledBack: true,
          });
        }
        if (this.state.currentIndex == this.state.listResult.length - 1) {
          this.setState({
            disabledNext: true,
          });
        }
      } else {
        this.setState({
          fromHistory: true,
        });
      }
    }
  }
  renderDetailsV2 = () => {
    let data = {
      [false]: (
        <ScrollView
          ref={ref => (this.flListDate = ref)}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <ProfileInfomation data={this.state.data} />
          {/* <View style={styles.lineHeader} /> */}
          {this.state.dataHistory?.length ? (
            <View style={styles.viewHistory}>
              <ReBooking item={this.state.dataHistory[0]} />
            </View>
          ) : null}
          <InfoHistoryBooking
            result={this.state.result}
            resultDetail={this.state.resultDetail}
            data={this.state.data}
          />
          <CheckupResult
            medical={this.state.result?.medical}
            result={this.state.result}
            isContract={this.state.data?.isContract}
          />
          <MedicalTestResult medicalTest={this.state.result?.medicalTest} />
          <DiagnosticResult
            result={this.state.result}
            diagnosticImage={this.state.result?.diagnosticImage}
          />
          <SurgeryResult result={this.state.result} />
          <Medicine
            listResult={this.state.listResult}
            hospitalName={this.state.hospitalName}
            currentIndex={this.state.currentIndex}
            dataHistory={this.state.dataHistory}
            user={this.state.user}
            showDrug={this.state.showDrug}
            resultDetail={this.state.resultDetail}
            result={this.state.result}
            data={this.state.data}
            medicine={this.state.result?.prescription}
          />
          {/* <TotalMoney result={this.state.result} resultDetail={this.state.resultDetail} /> */}
          <View style={styles.end} />
        </ScrollView>
      ),
      [true]: (
        <ScrollView
          ref={ref => (this.flListDate = ref)}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <ProfileInfomation data={this.state.data} />
          {/* <View style={styles.lineHeader} /> */}

          <AdministrationIsPatient
            result={this.state.result}
            resultDetail={this.state.resultDetail}
            patientName={this.state.result?.Profile?.PatientName}
          />
          <PriceIsPatient
            result={this.state.result}
            resultDetail={this.state.resultDetail}
            patientHistoryId={this.state.data?.patientHistoryId}
          />
          {/* <TotalMoney result={this.state.result} resultDetail={this.state.resultDetail} /> */}
          <View style={styles.end} />
        </ScrollView>
      ),
    };

    return data[(this.state.data?.isInPatient)];
  };
  renderDetailsV1 = () => {
    let data = {
      [false]: (
        <ScrollView
          ref={ref => (this.flListDate = ref)}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <ProfileInfomationV1
            resultDetail={this.state.resultDetail}
            patientName={this.state.resultDetail?.Profile?.PatientName}
          />
          {this.state.dataHistory?.length ? (
            <View style={styles.viewHistory}>
              <ReBooking item={this.state.dataHistory[0]} />
            </View>
          ) : null}
          {/* <View style={styles.lineHeader} /> */}
          <InfoHistoryBookingV1
            result={this.state.result}
            resultDetail={this.state.resultDetail}
            patientName={this.state.resultDetail?.Profile?.PatientName}
          />
          <CheckupResultItemV1 result={this.state.result} />
          <MedicalTestResultV1 result={this.state.result} />
          <DiagnosticResultV1 result={this.state.result} />
          <SurgeryResultV1 result={this.state.result} />
          <MedicineV1
            listResult={this.state.listResult}
            hospitalName={this.state.hospitalName}
            currentIndex={this.state.currentIndex}
            dataHistory={this.state.dataHistory}
            user={this.state.user}
            showDrug={this.state.showDrug}
            resultDetail={this.state.resultDetail}
            result={this.state.result}
            data={this.state.data}
          />
          {/* <TotalMoney result={this.state.result} resultDetail={this.state.resultDetail} /> */}
          <View style={styles.end} />
        </ScrollView>
      ),
      [true]: (
        <ScrollView
          ref={ref => (this.flListDate = ref)}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <ProfileInfomation
            resultDetail={this.state.result}
            patientName={this.state.result?.Profile?.PatientName}
          />
          {/* <View style={styles.lineHeader} /> */}

          <AdministrationIsPatient
            result={this.state.result}
            resultDetail={this.state.resultDetail}
            patientName={this.state.result?.Profile?.PatientName}
          />
          <PriceIsPatient
            result={this.state.result}
            resultDetail={this.state.resultDetail}
            patientHistoryId={this.state.data?.patientHistoryId}
          />
          {/* <TotalMoney result={this.state.result} resultDetail={this.state.resultDetail} /> */}
          <View style={styles.end} />
        </ScrollView>
      ),
    };

    return data[(this.state.data?.isInPatient)];
  };
  getReCheckup = async item => {
    try {
      let res = await ehealthProvider.getRecheckups(item?.patientHistoryId);

      if (res?.length) {
        this.setState({dataHistory: res});
      }
    } catch (error) {}
  };
  componentDidMount() {
    this.viewResult(this.state.item);
    // if (this.state.currentIndex || this.state.currentIndex == 0) {
    //   if (this.state.currentIndex == 0) {
    //     this.setState({
    //       disabledBack: true,
    //     });
    //   }
    //   if (this.state.currentIndex == this.state.listResult.length - 1) {
    //     this.setState({
    //       disabledNext: true,
    //     });
    //   }
    // } else {
    //   this.setState({
    //     fromHistory: true,
    //   });
    // }
  }
  print = () => {
    let result = this.state.result;
    result.Profile = this.state.resultDetail.Profile;
    result.hospital = this.props.userApp.hospital;
    result.hospital.timeGoIn = this.props.ehealth.hospital.timeGoIn;
    let patientHistoryId = this.props.ehealth.hospital.patientHistoryId;
    this.setState({isLoading: true}, () => {
      try {
        this.exportPdfCom.exportPdf(
          {
            type: 'all',
            result: result,
            fileName: constants.filenamePDF + patientHistoryId,
            print: true,
          },
          () => {
            this.setState({isLoading: false});
          },
        );
      } catch (err) {
        this.setState({isLoading: false});
      }
    });
  };

  renderTextError = status => {
    switch (status) {
      case 1:
        return constants.msg.ehealth.not_result_of_this_date;
      case 2:
        return (
          constants.msg.ehealth.re_examination_in_date +
          this.state.reCheckDate.toDateObject('-').format('dd/MM/yyyy') +
          '!'
        );
      case 3:
        return constants.msg.ehealth.examination_in_date;
      case 4:
        return constants.msg.ehealth.not_re_examination;
      case 5:
        return constants.msg.ehealth.not_examination;
      case 6:
        return constants.msg.ehealth.not_result_ehealth_in_day;
      case 7:
        return constants.msg.ehealth.share_medical_records_success;
      case 8:
        return constants.msg.ehealth.share_fail;
      default:
        return constants.msg.ehealth.not_examination;
    }
  };
  viewResult = item => {
    this.getReCheckup(item);
    connectionUtils
      .isConnected()
      .then(s => {
        this.setState(
          {
            isLoading: true,
          },
          () => {
            try {
              resultUtils
                .getDetail(item.id)
                .then(result => {
                  this.setState(
                    {
                      isLoading: false,
                    },
                    () => {
                      if (!result.hasResult) {
                        snackbar.show(this.renderTextError(6), 'danger');
                      }
                      this.props.dispatch({
                        type: constants.action.action_select_hospital_ehealth,
                        value: item,
                      });
                      this.setState({
                        result: result.result,
                        resultDetail: result.resultDetail,
                        data: result.data,
                        hasResult: result.hasResult,
                        isContract: result.data.isContract,
                      });
                    },
                  );
                })
                .catch(err => {
                  this.setState(
                    {
                      isLoading: false,
                      hasResult: false,
                    },
                    () => {
                      snackbar.show(this.renderTextError(6), 'danger');
                    },
                  );
                });
            } catch (error) {
              this.setState(
                {
                  isLoading: false,
                },
                () => {
                  snackbar.show(this.renderTextError(6), 'danger');
                },
              );
            }
          },
        );
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, 'danger');
      });
  };
  onBack = () => {
    this.setState(
      pre => {
        return {
          currentIndex: pre.currentIndex - 1,
          disabledNext: false,
          resultSelected: this.state.listResult[pre.currentIndex - 1],
        };
      },
      () => {
        this.viewResult(this.state.listResult[this.state.currentIndex]);
      },
    );
  };
  shareAndDownloadFile = async () => {
    try {
      this.setState({isLoading: true}, async () => {
        let res = await ehealthProvider.getFilePdfEhealth(
          this.state.data.patientHistoryId,
        );
        this.setState({isLoading: false});

        if (!res?.length) {
          snackbar.show('Hồ sơ không tồn tại kết quả đã ký số', 'danger');
          return;
        }
        this.props.navigation.navigate('pdfViewer', {data: res});
        // let data = res.map(e => e.path);
        // this.exportPdfCom.shareFilePdf(data, () => {
        // });
      });
    } catch (error) {
      snackbar.show('Có lỗi xảy ra vui lòng thử lại', 'danger');
    }
  };
  onNext = () => {
    this.setState(
      pre => {
        return {
          currentIndex: pre.currentIndex + 1,
          disabledBack: false,
          resultSelected: this.state.listResult[pre.currentIndex + 1],
        };
      },
      () => {
        this.viewResult(this.state.listResult[this.state.currentIndex]);
      },
    );
  };
  onPrintAndShare = (options, index) => {
    switch (options.id) {
      case 1:
        this.print();
        break;
      case 2:
        this.shareAndDownloadFile();
        break;

      default:
        break;
    }
  };
  renderWithVersion = () => {
    // let data ={
    //   1:
    // }
    let data = {
      1: this.renderDetailsV1(),
      2: this.renderDetailsV2(),
    };

    console.log('this.state.data?.version: ', this.state.data?.version);
    return data[(this.state.data?.version)];
  };
  render() {
    return (
      <ActivityPanel
        containerStyle={{
          backgroundColor: '#f2f2f2',
        }}
        style={styles.container}
        title={constants.title.ehealth_details}
        isLoading={this.state.isLoading}
        titleStyle={styles.titleStyle}
        menuButton={
          !this.state.data?.isInPatient ? (
            <CustomMenu
              MenuSelectOption={
                <View style={styles.btnPrint}>
                  <ScaledImage
                    source={require('@images/new/ehealth/ic_print.png')}
                    height={25}
                  />
                </View>
              }
              options={
                this.state.data?.isContract
                  ? [
                      {value: 'Kết quả thường', id: 1},
                      {value: 'Kết quả ký số', id: 2},
                    ]
                  : [{value: 'Kết quả ký số', id: 2}]
              }
              onSelected={this.onPrintAndShare}
            />
          ) : null
        }>
        {this.renderWithVersion()}
        {!this.state.fromHistory && (
          <View style={styles.containerBackAndNext}>
            <TouchableOpacity
              onPress={this.onBack}
              disabled={this.state.disabledBack}
              style={[styles.buttonBack]}>
              <ScaledImage
                source={require('@images/new/ehealth/ic_next.png')}
                height={10}
                style={[
                  styles.ic_back,
                  this.state.disabledBack ? {tintColor: '#00000050'} : {},
                ]}
              />
              <Text
                style={[
                  styles.txtBack,
                  {textAlign: 'left'},
                  this.state.disabledBack ? {color: '#00000050'} : {},
                ]}>
                Xem lần khám mới hơn
              </Text>
            </TouchableOpacity>

            <View style={styles.bettwen} />
            <TouchableOpacity
              onPress={this.onNext}
              disabled={this.state.disabledNext}
              style={[styles.buttonNext, {justifyContent: 'flex-end'}]}>
              <Text
                style={[
                  styles.txtBack,
                  {textAlign: 'right'},
                  this.state.disabledNext ? {color: '#00000050'} : {},
                ]}>
                Xem lần khám cũ hơn
              </Text>
              <ScaledImage
                source={require('@images/new/ehealth/ic_next.png')}
                style={this.state.disabledBack ? {tintColor: '#00000050'} : {}}
                height={10}
              />
            </TouchableOpacity>
          </View>
        )}
        <ExportPDF
          endLoading={() => {
            this.setState({isLoading: false});
          }}
          ref={element => (this.exportPdfCom = element)}
        />
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  viewHistory: {
    paddingHorizontal: 10,
  },
  bettwen: {
    width: 1,
    height: '80%',
    backgroundColor: '#075BB540',
    alignSelf: 'center',
  },
  txtBack: {
    color: '#075BB5',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    flex: 1,
    fontSize: 14,
  },
  ic_back: {
    transform: [{rotate: '180deg'}],
  },
  buttonBack: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttonNext: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  containerBackAndNext: {
    height: 50,
    width: '100%',
    backgroundColor: '#075BB530',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  end: {height: 50},
  lineHeader: {
    height: 1,
    backgroundColor: '#27ae60',
  },
  container: {flex: 1},
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
  viewRenderDetails: {height: 1, backgroundColor: '#27ae60'},
  viewBottomDetails: {height: 50},

  titleStyle: {
    color: '#FFF',
    marginLeft: 50,
  },
  btnPrint: {
    paddingHorizontal: 10,
  },
});

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    ehealth: state.auth.ehealth,
  };
}
export default connect(mapStateToProps)(ViewEhealthDetailScreen);
