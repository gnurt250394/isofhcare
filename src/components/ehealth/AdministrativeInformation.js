import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import EhealthItem from '@components/ehealth/EhealthItem';
import { Card } from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';

class AdministrativeInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTime: [],
      isShow: false,
    };
  }

  onSetShow = () => {
    this.setState({ isShow: !this.state.isShow });
  };
  render() {
    let summary = this.props.summary;
    


    if (!summary) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <TouchableOpacity
            onPress={this.onSetShow}
            style={[
              styles.buttonShowInfo,
              this.state.isShow ? { backgroundColor: '#3161AD' } : {},
            ]}>
            <ScaledImage
              source={require('@images/new/ehealth/ic_info_admin.png')}
              height={19}
              style={{
                tintColor: this.state.isShow ? '#FFF' : '#3161AD',
              }}
            />
            <Text
              style={[
                styles.txtTitle,
                this.state.isShow ? { color: '#FFF' } : {},
              ]}>
              THÔNG TIN HÀNH CHÍNH
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
                    transform: [{ rotate: '-90deg' }],
                    tintColor: '#3161AD',
                  }
              }
            />
          </TouchableOpacity>
          {this.state.isShow ? (
            <View
              style={{
                padding: 10,
              }}>
              <View style={styles.row}>
                <Text style={styles.txtLabel}>Địa chỉ cư trú</Text>
                <Text style={styles.txtResult}>{summary?.address}</Text>
              </View>
              {summary?.passport?.no ? (
                <View style={styles.row}>
                  <Text style={styles.txtLabel}>Số CMTND/ HC</Text>
                  <Text style={styles.txtResult}>{summary?.passport?.no}</Text>
                </View>
              ) : null}
              {summary?.passport?.dateOfIssue ? (
                <View style={styles.row}>
                  <Text style={[styles.txtLabel, { fontWeight: '300' }]}>
                    Ngày cấp
                  </Text>
                  <Text style={styles.txtResult}>
                    {summary?.passport?.dateOfIssue
                      ?.toDateObject('-')
                      .format('dd/MM/yyyy')}
                  </Text>
                </View>
              ) : null}
              {summary?.passport?.placeOfIssue ? (
                <View style={styles.row}>
                  <Text style={[styles.txtLabel, { fontWeight: '300' }]}>
                    Nơi cấp
                  </Text>
                  <Text style={styles.txtResult}>
                    {summary?.passport?.placeOfIssue}
                  </Text>
                </View>
              ) : null}
              <View style={styles.line} />
              <View style={styles.row}>
                <Text style={styles.txtLabel}>Khoa</Text>
                <Text style={styles.txtResult}>{summary?.department}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.txtLabel}>Ngày ra viện</Text>
                <Text style={styles.txtResult}>
                  {summary?.dateStop?.toDateObject('-').format('dd/MM/yyyy')}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.txtLabel}>Ngày vào viện</Text>
                <Text style={styles.txtResult}>
                  {summary?.dateStart?.toDateObject('-').format('dd/MM/yyyy')}
                </Text>
              </View>
              {summary?.medicalNo ? (
                <View style={styles.row}>
                  <Text style={styles.txtLabel}>Mã bệnh án</Text>
                  <Text style={styles.txtResult}>{summary?.medicalNo}</Text>
                </View>
              ) : null}
              {summary?.assuranceNumber ? (
                <View style={styles.row}>
                  <Text style={styles.txtLabel}>Số thẻ BHYT</Text>
                  <Text style={styles.txtResult}>
                    {summary?.assuranceNumber}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </Card>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userApp: state.userApp,
    ehealth: state.ehealth,
  };
}
const styles = StyleSheet.create({
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#00000040',
    marginVertical: 10,
    alignSelf: 'center',
  },
  txtResult: {
    flex: 1,
    color: '#555555',
  },
  txtLabel: {
    width: '40%',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 7,
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
  round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
  round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
  itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
  itemcontent: { color: '#0291E1' },
  item: { marginTop: 10, flexDirection: 'row' },
  txCheckUp: { fontWeight: 'bold', fontSize: 18 },
});
export default connect(mapStateToProps)(AdministrativeInformation);
