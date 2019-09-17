import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, ScrollView, Clipboard, Linking } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import { connect } from 'react-redux';
import SendSMS from 'react-native-sms';
import constants from '@resources/strings';

class ConfirmGetTicketScreen extends Component {
  constructor(props) {
    super(props);
    let code = "LAYSO " + (this.props.bookingTicket.hospital.hospital.codeHospital || "") + " " + this.props.navigation.state.params.data.oderCode;
    this.state = {
      code
    };
  }

  onCopy = () => {
    Clipboard.setString(this.state.code);
    snackbar.show(constants.copy_success, "success");

  }
  sendSms = () => {
    if (Platform.OS == 'android') {
      Linking.openURL("sms:8300?body=" + this.state.code)
    }
    else
      SendSMS.send({
        body: this.state.code,
        recipients: ['8300'],
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true
      }, (completed, cancelled, error) => {
        if (completed) {
          this.props.navigation.navigate("selectHealthFacilitiesScreen", {
            selectTab: 1,
            requestTime: new Date()
          });
        }
      });
  }
  render() {
    let data = this.props.navigation.state.params.data;
    console.log(data.address);
    return (
      <ActivityPanel
        title={constants.title.confirm_info}
        containerStyle={styles.backgroundContainer}

      >
        <ScrollView>
          <View style={styles.containerHeader}>
            <Text style={styles.txtHeader}>{constants.ehealth.message1} <Text style={styles.fontBold}>{constants.ehealth.message2}</Text> {constants.ehealth.message3}</Text>
            <View style={styles.containerSms}>
              <Text style={{ fontSize: 15 }}>{constants.ehealth.syntax_sms}</Text>
              <View style={styles.containerCode}>
                <Text style={styles.txtCode}>{this.state.code}</Text>
                <TouchableOpacity onPress={this.onCopy}>
                  <ScaledImage style={{ marginLeft: 10 }} height={16} source={require('@images/new/booking/ic_Copy.png')}></ScaledImage></TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.containerExaminationPeople}>
            <Text>{constants.ehealth.info_examination_people}</Text>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>{constants.ehealth.code_BHYT}</Text>
              <Text style={styles.txtInfoExamination}>{data.id}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>{constants.fullname}</Text>
              <Text style={styles.txtInfoExamination}>{data.fullname}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>{constants.gender}</Text>
              <Text style={styles.txtInfoExamination}>{data.gender ? "Nam" : "Nữ"}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>{constants.dob}</Text>
              <Text style={styles.txtInfoExamination}>{data.bod}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>{constants.date_start}</Text>
              <Text style={styles.txtInfoExamination}>{data.startDate}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>{constants.ehealth.address_examination_initial}</Text>
              <Text style={styles.txtInfoExamination}>{data.hospitalCode}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>{constants.phone}</Text>
              <Text style={styles.txtPhone}>{this.props.userApp.currentUser.phone}</Text>
            </View>
            <View style={styles.viewInfo}>
              <Text style={styles.label}>{constants.ehealth.address}</Text>
              <Text style={styles.txtAddress} numberOfLines={3}>{data.address}</Text>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity style={[styles.button]} onPress={this.sendSms}><Text style={styles.txtSendSms}>{constants.ehealth.send_get_ticket}</Text></TouchableOpacity >
      </ActivityPanel >

    );
  }
}
const styles = StyleSheet.create({
  txtSendSms: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: '600'
  },
  txtAddress: {
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#4A4A4A',
    flex: 1,
    maxWidth: 200
  },
  txtPhone: {
    color: '#F05673'
  },
  txtInfoExamination: {
    fontWeight: 'bold',
    color: '#4A4A4A'
  },
  containerExaminationPeople: {
    marginVertical: 20,
    backgroundColor: 'rgba(39,174,96,0.11)',
    padding: 20
  },
  txtCode: {
    color: '#f05673',
    fontWeight: '600'
  },
  containerCode: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  containerSms: {
    borderWidth: 1,
    borderColor: '#f05673',
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    padding: 10
  },
  fontBold: { fontWeight: 'bold' },
  txtHeader: {
    textAlign: 'center',
    color: '#000'
  },
  containerHeader: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10
  },
  backgroundContainer: {
    backgroundColor: "#fff"
  },
  AcPanel: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  label: {
    marginRight: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: "rgb(10,155,225)",
    shadowColor: "rgba(0, 0, 0, 0.21)",
    shadowOffset: {
      width: 2,
      height: 4
    },
    paddingVertical: 17,
    shadowRadius: 10,
    marginVertical: 20,
    marginHorizontal: 60,
    shadowOpacity: 1
  },
})
function mapStateToProps(state) {
  return {
    userApp: state.userApp,
    bookingTicket: state.bookingTicket
  };
}
export default connect(mapStateToProps)(ConfirmGetTicketScreen);