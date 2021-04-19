import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtils from 'mainam-react-native-date-utils';
import constants from '@resources/strings';
import {Table, Row} from 'react-native-table-component';
import ImageEhealth from './ImageEhealth';
class EhealthItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTime: [],
    };
  }
  renderItemCheckup(item) {
    const tableHead = ['STT', 'Tên thuốc', 'Số lượng', 'Đơn vị'];
    if (
      item.ServiceName &&
      !item.First_Diagnostic &&
      !item.DiseaseDiagnostic &&
      !item.Diagnostic &&
      !item.Other_DiseaseDiagnostic &&
      !item.DoctorAdviceTxt &&
      !item.DoctorAdvice &&
      !item.Note &&
      (!item?.Image || item?.Image?.length == 0)
    ) {
      return null;
    }

    return (
      <View style={{flex: 1}}>
        <View style={styles.viewItemCheckUp}>
          <Text style={styles.txServiceName}>{item.ServiceName}</Text>
          {/* <TouchableOpacity onPress={() => this.exportPdf()}>
                        <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                    </TouchableOpacity> */}
        </View>
        <View style={styles.viewItem}>
          {[
            this.renderItem('Chẩn đoán', item.First_Diagnostic),
            this.renderItem(
              'Chẩn đoán bệnh',
              item.DiseaseDiagnostic,
              item.Diagnostic,
            ),
            this.renderItem('Chẩn đoán khác', item.Other_DiseaseDiagnostic),
            this.renderItem('Lời dặn', item.DoctorAdviceTxt, item.DoctorAdvice),
            this.renderItem('Ghi chú', item.Note),
          ].map((item, key) => (
            <View key={key}>{item}</View>
          ))}

          <ImageEhealth images={item.Image} />
        </View>
        {!(this.props.index == this.props.length - 1) && (
          <View style={styles.viewLineCheckup} />
        )}
      </View>
    );
  }
  renderListMedicine(value) {
    const tableHead = ['STT', 'Tên thuốc', 'Số lượng', 'Đơn vị'];
    if (!value) return null;
    return (
      <View>
        <Table
          style={[styles.table, {marginTop: 10}]}
          borderStyle={styles.borderStyle}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.textHead}
            flexArr={[1, 3, 1, 1]}
          />
          {this.renderMedicine(0, value)}
        </Table>
      </View>
    );
  }

  renderItem(lable, value, value2) {
    if (value || value2)
      return (
        <View>
          <Text style={styles.diagnosticLabel}>{lable}</Text>
          {value ? (
            <View style={styles.viewListItem}>
              <ScaleImage
                source={require('@images/new/ehealth/ic_dot.png')}
                width={5}
                style={{marginTop: 7}}
              />
              <Text style={styles.txValue}>{value}</Text>
            </View>
          ) : null}
          {value2 ? (
            <View style={styles.viewListItem}>
              <ScaleImage
                source={require('@images/new/ehealth/ic_dot.png')}
                width={5}
                style={{marginTop: 7}}
              />
              <Text style={styles.txValue}>{value2}</Text>
            </View>
          ) : null}
        </View>
      );
    return null;
  }
  renderMedicine(index, list) {
    if (list) {
      return list.map((data, i) => this.renderMedicineItem(i + index, data));
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
  renderLabel = item => {
    switch (item) {
      case 'Conclusion':
        return 'KẾT LUẬN';
      case 'ResultNoiKhoa':
        return 'KHÁM NỘI KHOA';
      case 'ResultRHM':
        return 'KHÁM RĂNG HÀM MẶT';
      case 'ResultNSTMH':
        return 'KHÁM NỘI SOI TAI MŨI HỌNG';
      case 'ResultTimMach':
        return 'KHÁM TIM MẠCH';
      case 'ResultHoHap':
        return 'KHÁM HÔ HẤP';
      case 'ResultTMH':
        return 'KHÁM TAI MŨI HỌNG';
      case 'ResultCLS':
        return 'KHÁM CẬN LÂM SÀNG';
      case 'ResultTheLuc':
        return 'KHÁM THỂ LỰC';
      case 'ResultSanPhuKhoa':
        return 'KHÁM SẢN PHỤ KHOA';
      case 'ResultTieuHoa':
        return 'KHÁM TIÊU HOÁ';
      case 'ResultThanKinh':
        return 'KHÁM THẦN KINH';
      case 'ResultDaLieu':
        return 'KHÁM DA LIỄU';
      case 'ResultMat':
        return 'KHÁM MẮT';
      case 'ResultNoiTiet':
        return 'KHÁM NỘI TIẾT';
      case 'ResultNgoaiKhoa':
        return 'KHÁM NGOẠI KHOA';
      case 'ResultUngBuou':
        return 'KHÁM UNG BUỚU';
      case 'ResultCoXuongKhop':
        return 'KHÁM CƠ XƯƠNG KHỚP';
      case 'ResultTamThan':
        return 'KHÁM TÂM THẦN';
      case 'ResultDiUng':
        return 'DỊ ỨNG - MIỄN DỊCH';
      default:
        return '';
    }
  };

  renderItemCheckupContract(item) {
    let itemLabel = item[0];
    let itemValue = item[1];

    if (itemValue && itemValue.length) return;
    return (
      <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
          <View style={styles.viewServiceName}>
            <Text style={styles.txServiceName}>
              {this.renderLabel(itemLabel)}
            </Text>
            <View style={styles.viewBorder} />
          </View>
          {[
            // this.renderItem("Nơi thực hiện", itemValue.Location),
            this.renderItem('Chuyên khoa tim mạch', itemValue.HeartSpecialist),
            this.renderItem('Tiền sử bệnh', itemValue.Anamnesis),
            this.renderItem('Tiền sử gia đình', itemValue.AnamnesisFamily),
            this.renderItem(
              'Tiền sử dị ứng thuốc',
              itemValue.AnamnesisMedicine,
            ),
            this.renderItem('Tiền sử thai sản', itemValue.AnamnesisMaternity),
            this.renderItem(
              'Chiều cao',
              itemValue.Height ? itemValue.Height + ' cm' : null,
            ),
            this.renderItem(
              'Cân nặng',
              itemValue.Weight ? itemValue.Weight + ' kg' : null,
            ),
            this.renderItem('BMI', itemValue.BMI),
            this.renderItem(
              'Huyết áp',
              itemValue.BloodPressure
                ? itemValue.BloodPressure + ' mmHg'
                : null,
            ),
            this.renderItem(
              'Nhịp tim',
              itemValue.Pulse ? itemValue.Pulse + ' lần/phút' : null,
            ),
            this.renderItem('Phân loại', itemValue.PhysicalClassify),
            this.renderItem('Số lượng Hồng cầu', itemValue.RBCCount),
            this.renderItem('Số lượng Bạch cầu', itemValue.LeukemiaCount),
            this.renderItem('Số lượng Tiểu cầu', itemValue.PlateletCount),
            this.renderItem('Đường máu', itemValue.BloodSugar),
            this.renderItem('Ure', itemValue.Ure),
            this.renderItem('Creatinin', itemValue.Creatinin),
            this.renderItem('Protein', itemValue.Protein),
            this.renderItem(
              'Xét nghiệm nước tiểu khác',
              itemValue.UrineTestOther,
            ),
            this.renderItem('Xét nghiệm máu khác', itemValue.BloodTestOther),
            this.renderItem('Chẩn đoán hình ảnh', itemValue.ImageDiagnose),
            this.renderItem('Dị ứng miễn dịch', itemValue.ImmunitySpecialist),
            this.renderItem('Phân loại', itemValue.ImmunityClassifySpecialist),
            this.renderItem('Phân loại', itemValue.HeartClassifySpecialist),
            this.renderItem(
              'Chuyên khoa thận tiết niệu',
              itemValue.CheckUpUrinationSpecialist,
            ),
            this.renderItem('Phân loại', itemValue.UrinationClassifySpecialist),
            this.renderItem('Chuyên khoa ung bướu', itemValue.TumorSpecialist),
            this.renderItem('Phân loại', itemValue.TumorClassifySpecialist),
            this.renderItem(
              'Chuyên khoa thần kinh',
              itemValue.CheckUpNerveSpecialist,
            ),
            this.renderItem('Phân loại', itemValue.NerveClassifySpecialist),
            this.renderItem('Chuyên khoa tâm thần', itemValue.MentalSpecialist),
            this.renderItem('Phân loại', itemValue.MentalClassifySpecialist),
            this.renderItem('Ngoại khoa', itemValue.Surgical),
            this.renderItem('Phân loại', itemValue.SurgicalClassify),
            this.renderItem(
              'Mắt trái không kính',
              itemValue.CheckUpLEyeWOGlass,
            ),
            this.renderItem('Mắt trái với kính', itemValue.CheckUpLEyeWGlass),
            this.renderItem(
              'Mắt phải không kính',
              itemValue.CheckUpREyeWOGlass,
            ),
            this.renderItem('Mắt phải với kính', itemValue.CheckUpREyeWGlass),
            this.renderItem('Bệnh về mắt', itemValue.EyeDisease),
            this.renderItem('Phân loại', itemValue.EyeClassify),
            this.renderItem('Sản phụ khoa', itemValue.Gynecology),
            this.renderItem('Phân loại', itemValue.GynecologyClassify),
            this.renderItem('Nói thường tai trái', itemValue.SpeakNormallyL),
            this.renderItem('Nói thường tai phải', itemValue.SpeakNormallyR),
            this.renderItem('Nói thầm tai trái', itemValue.WhisperL),
            this.renderItem('Nói thầm tai phải', itemValue.WhisperR),
            this.renderItem('Phân loại', itemValue.ENTClassify),
            this.renderItem('Kết luận', itemValue.Conclusion1),
            this.renderItem('Tai phải', itemValue.RightEar),
            this.renderItem('Tai trái', itemValue.LeftEar),
            this.renderItem('Mũi phải', itemValue.RightNose),
            this.renderItem('Mũi trái', itemValue.LeftNose),
            this.renderItem('Họng', itemValue.Throat),
            this.renderItem('Vách ngăn', itemValue.Bulkhead),
            this.renderItem('Vòm', itemValue.Nasopharynx),
            this.renderItem('Hạ họng - Thanh quản', itemValue.Laryngopharynx),
            this.renderItem('Kết luận', itemValue.ENTConclusion),
            this.renderItem('Phân loại', itemValue.EndoscopicClassify),
            this.renderItem('Hàm dưới', itemValue.LowerJaw),
            this.renderItem('Hàm trên', itemValue.UpperJaw),
            this.renderItem('Bệnh R-H-M', itemValue.DentalDisease),
            this.renderItem('Phân loại', itemValue.DentalClassify),
            this.renderItem(
              'Chuyên khoa cơ xương khớp',
              itemValue.CheckUpMusculoskelSpecialist,
            ),
            this.renderItem(
              'Phân loại',
              itemValue.MusculoskelClassifySpecialist,
            ),
            this.renderItem(
              'Chuyên khoa hô hấp',
              itemValue.CheckUpRespirationSpecialist,
            ),
            this.renderItem(
              'Phân loại',
              itemValue.RespirationClassifySpecialist,
            ),
            this.renderItem(
              'Chuyên khoa tiêu hóa',
              itemValue.CheckUpDigestionSpecialist,
            ),
            this.renderItem('Phân loại', itemValue.DigestionSpecialistClassify),
            this.renderItem('Chuyên khoa da liễu', itemValue.Dermatology),
            this.renderItem('Phân loại', itemValue.DermatologyClassify),
            this.renderItem('Các bệnh tật nếu có', itemValue.OtherDiseases),
            this.renderItem(
              'Những điều cần giải quyết',
              itemValue.OtherConclusion,
            ),
            this.renderItem('Phân loại', itemValue.HealthClassify),
            this.renderItem(
              'Tuần hoàn',
              itemValue.CheckUpCirculation || itemValue.CirculationClassify
                ? itemValue.CheckUpCirculation +
                    (itemValue.CirculationClassify
                      ? ' (Phân loại: ' + itemValue.CirculationClassify + ')'
                      : '')
                : null,
            ),
            this.renderItem(
              'Tiêu hóa',
              itemValue.CheckUpDigestion || itemValue.DigestionClassify
                ? itemValue.CheckUpDigestion +
                    (itemValue.DigestionClassify
                      ? ' (Phân loại: ' + itemValue.DigestionClassify + ')'
                      : '')
                : null,
            ),
            this.renderItem(
              'Cơ xương khớp',
              itemValue.CheckUpMusculoskel || itemValue.MusculoskelClassify
                ? itemValue.CheckUpMusculoskel +
                    (itemValue.MusculoskelClassify
                      ? ' (Phân loại: ' + itemValue.MusculoskelClassify + ')'
                      : '')
                : null,
            ),
            this.renderItem(
              'Thần kinh',
              itemValue.CheckUpNerve || itemValue.NerveClassify
                ? itemValue.CheckUpNerve +
                    (itemValue.NerveClassify
                      ? ' (Phân loại: ' + itemValue.NerveClassify + ')'
                      : '')
                : null,
            ),
            this.renderItem(
              'Tâm thần',
              itemValue.Mental || itemValue.MentalClassify
                ? itemValue.Mental +
                    (itemValue.MentalClassify
                      ? ' (Phân loại: ' + itemValue.MentalClassify + ')'
                      : '')
                : null,
            ),
            this.renderItem(
              'Hô hấp',
              itemValue.CheckUpRespiration || itemValue.RespirationClassify
                ? itemValue.CheckUpRespiration +
                    (itemValue.RespirationClassify
                      ? ' (Phân loại: ' + itemValue.RespirationClassify + ')'
                      : '')
                : null,
            ),
            this.renderItem(
              'Thận tiết niệu',
              itemValue.CheckUpUrination || itemValue.UrinationClassify
                ? itemValue.CheckUpUrination +
                    (itemValue.UrinationClassify
                      ? ' (Phân loại: ' + itemValue.UrinationClassify + ')'
                      : '')
                : null,
            ),
            this.renderItem(
              'Nội tiết',
              itemValue.Content || itemValue.ContentClassify
                ? itemValue.Content +
                    (itemValue.ContentClassify
                      ? ' (Phân loại: ' + itemValue.ContentClassify + ')'
                      : '')
                : null,
            ),
            this.renderItem('Bác sĩ', itemValue.ActUser),

            // this.renderListMedicine(itemValue.ListMedicine),
          ].map((item2, index2) => {
            {
              return <View key={index2}>{item2}</View>;
            }
          })}

          {/* {!(this.props.index == this.props.length - 1)
                    && <View style={styles.viewLineCheckup}></View>} */}
        </ScrollView>
      </View>
    );
  }

  onCheckEmty = (object, type) => {
    if (typeof object === 'object') {
      for (let key in object) {
        if (object[key]) {
          return !type
            ? this.renderItemCheckupContract(this.props.internalMedicine)
            : this.renderResultTes(this.props.itemMedical);
        }
      }
    }
  };
  renderContent = (item, index) => {
    if (item.result || item.result === true) {
      return (
        <View style={styles.content} key={index}>
          <Text style={styles.label}>{item.title}</Text>
          <Text style={styles.value}>
            {item.result === true
              ? 'Có'
              : item.result === false
              ? 'Không'
              : item.result}
          </Text>
        </View>
      );
    }
  };
  renderResultTes(item) {
    let conclusion = item?.conclude; //kết luận
    let anamnesis = item?.anamnesis?.filter(
      obj => obj.result !== false && obj.result,
    ); // tiền sử
    let description = item?.description.filter(
      obj => obj.result !== false && obj.result,
    ); // Thông tin khám
    let detail = item?.detail.filter(obj => obj.result !== false && obj.result); // chi tiết khám

    return (
      <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
          <View style={styles.viewServiceName}>
            <Text style={styles.txServiceName}>
              {'DỊCH VỤ KHÁM BỆNH THEO YÊU CẦU'}
            </Text>
            {/* <View style={styles.viewBorder}></View> */}
          </View>

          <View style={styles.viewInfo}>
            <Text style={styles.txLabelInfo}>{'Bác sĩ:'}</Text>
            <Text style={[styles.txValueInfo, {}]}>{item.doctor}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.txLabelInfo}>{'Phòng khám:'}</Text>
            <Text style={styles.txValueInfo}>{item?.room}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.txLabelInfo}>{'Khoa:'}</Text>
            <Text style={styles.txValueInfo}>{item?.department}</Text>
          </View>
          {description && description.length ? (
            <View>
              <View style={styles.viewServiceName}>
                <Text style={styles.txServiceName}>{'THÔNG TIN KHÁM'}</Text>
                <View style={styles.viewBorder} />
              </View>
              {description.map((item, index) => {
                return this.renderContent(item, index);
              })}
            </View>
          ) : null}
          {anamnesis && anamnesis.length ? (
            <View>
              <View style={styles.viewServiceName}>
                <Text style={styles.txServiceName}>{'TIỀN SỬ'}</Text>
                <View style={styles.viewBorder} />
              </View>
              {anamnesis.map((item, index) => {
                return this.renderContent(item, index);
              })}
            </View>
          ) : null}

          {detail && detail.length ? (
            <View>
              <View style={styles.viewServiceName}>
                <Text style={styles.txServiceName}>{'CHI TIẾT KHÁM'}</Text>
                <View style={styles.viewBorder} />
              </View>
              {detail.map((item, index) => {
                return this.renderContent(item, index);
              })}
            </View>
          ) : null}

          {conclusion ? (
            <View>
              <View style={styles.viewServiceName}>
                <Text style={styles.txServiceName}>{'KẾT LUẬN'}</Text>
                <View style={styles.viewBorder} />
              </View>
              <View style={styles.conclusion}>
                {conclusion.diagnostic?.initial ? (
                  <View style={{flex: 1}}>
                    <Text style={styles.labelConclusion}>
                      {'Chẩn đoán sơ bộ'}
                    </Text>
                    <View style={styles.viewRow}>
                      <ScaleImage
                        source={require('@images/new/ehealth/ic_dot.png')}
                        width={5}
                        style={{marginRight: 10, tintColor: '#0291E1'}}
                      />
                      <View style={{width: '100%'}}>
                        <Text style={styles.valueConclusion}>
                          {conclusion.diagnostic?.initial}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
                {conclusion.diagnostic?.detail ? (
                  <View style={{flex: 1}}>
                    <Text style={styles.labelConclusion}>
                      {'Chẩn đoán chi tiết'}
                    </Text>
                    <View style={styles.viewRow}>
                      <ScaleImage
                        source={require('@images/new/ehealth/ic_dot.png')}
                        width={5}
                        style={{marginRight: 10, tintColor: '#0291E1'}}
                      />
                      <View style={{width: '100%'}}>
                        <Text style={styles.valueConclusion}>
                          {conclusion.diagnostic?.detail}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
                {conclusion.diagnostic?.diseases ? (
                  <View style={{flex: 1}}>
                    <Text style={styles.labelConclusion}>
                      {'Chẩn đoán bệnh'}
                    </Text>
                    <View style={styles.viewRow}>
                      <ScaleImage
                        source={require('@images/new/ehealth/ic_dot.png')}
                        width={5}
                        style={{marginRight: 10, tintColor: '#0291E1'}}
                      />
                      <View style={{width: '100%'}}>
                        <Text style={styles.valueConclusion}>
                          {conclusion.diagnostic?.diseases}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
                {conclusion.diagnostic?.other ? (
                  <View style={{flex: 1}}>
                    <Text style={styles.labelConclusion}>
                      {'Chẩn đoán khác'}
                    </Text>
                    <View style={styles.viewRow}>
                      <ScaleImage
                        source={require('@images/new/ehealth/ic_dot.png')}
                        width={5}
                        style={{marginRight: 10, tintColor: '#0291E1'}}
                      />
                      <View style={{width: '100%'}}>
                        <Text style={styles.valueConclusion}>
                          {conclusion.diagnostic?.other}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
                {conclusion.advice ? (
                  <View style={{flex: 1}}>
                    <Text style={styles.labelConclusion}>{'Lời dặn'}</Text>
                    <View style={styles.viewRow}>
                      <ScaleImage
                        source={require('@images/new/ehealth/ic_dot.png')}
                        width={5}
                        style={{marginRight: 10, tintColor: '#0291E1'}}
                      />
                      <View style={{width: '100%'}}>
                        <Text style={styles.valueConclusion}>
                          {conclusion.advice}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
                {conclusion.note ? (
                  <View style={{flex: 1}}>
                    <Text style={styles.labelConclusion}>{'Ghi chú'}</Text>
                    <View style={styles.viewRow}>
                      <ScaleImage
                        source={require('@images/new/ehealth/ic_dot.png')}
                        width={5}
                        style={{marginRight: 10, tintColor: '#0291E1'}}
                      />
                      <View style={{width: '100%'}}>
                        <Text style={styles.valueConclusion}>
                          {conclusion.note}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }
  render() {
    let {item, resultTest} = this.props;

    let {internalMedicine} = this.props;
    let {itemMedical} = this.props;

    return (
      <View style={styles.container} key={this.props.index}>
        {item ? this.renderItemCheckup(item) : null}
        {
          // internalMedicine ? this.onCheckEmty(internalMedicine[1]) : null
        }
        {itemMedical ? this.onCheckEmty(itemMedical, true) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    ehealth: state.auth.ehealth,
  };
}
const styles = StyleSheet.create({
  viewRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  conclusion: {alignItems: 'flex-start'},
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  labelConclusion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
    textAlign: 'left',
  },
  valueConclusion: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Muli',
    textAlign: 'left',
    width: '90%',
  },
  txLabelInfo: {fontSize: 14, width: '30%'},
  txValueInfo: {fontSize: 14, flexWrap: 'wrap', width: '60%', marginLeft: 10},
  viewInfo: {flexDirection: 'row', alignItems: 'flex-start', marginTop: 10},
  viewBorder: {
    height: 1,
    backgroundColor: '#00000020',
    width: '40%',
    alignSelf: 'flex-end',
    marginRight: -10,
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
  itemcontent: {color: '#0291E1'},
  item: {marginTop: 10, flexDirection: 'row'},
  slide: {
    flex: 1,
  },
  table: {marginTop: 30, marginBottom: 50},
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
  viewItemCheckUp: {flexDirection: 'row', alignItems: 'center', marginTop: 10},
  txServiceName: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0291E1',
    flex: 1,
  },
  viewItem: {
    // backgroundColor: "#ffffff",
    // shadowColor: "rgba(0, 0, 0, 0.05)",
    // shadowOffset: {
    //     width: 0,
    //     height: 2
    // },
    // shadowRadius: 10,
    // shadowOpacity: 1,
    // elevation: 3,
    borderRadius: 5,
    padding: 10,
  },
  borderStyle: {borderWidth: 0.5, borderColor: '#c8e1ff'},
  viewListItem: {flexDirection: 'row', flex: 1},
  txValue: {marginLeft: 10, marginBottom: 10},
  viewServiceName: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  viewSpaceBottom: {height: 50},
  viewLine: {height: 1, backgroundColor: '#00000020', marginBottom: 10},
  viewLineCheckup: {height: 1, backgroundColor: '#00000020', marginTop: 10},
  value: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Muli',
    marginBottom: 10,
    alignItems: 'flex-end',
    width: '50%',
    textAlign: 'right',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
    width: '50%',
  },
});
export default connect(mapStateToProps)(EhealthItem);
