import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import Modal from "@components/modal";
import ActivityPanel from "@components/ActivityPanel";
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import ehealthProvider from '@data-access/ehealth-provider'
import ScaledImage from 'mainam-react-native-scaleimage';
import { connect } from "react-redux";
const device_width = Dimensions.get('window').width
class AddNewEhealthScreen extends Component {
    constructor(props) {
        super(props);
        let hospital = this.props.navigation.state.params && this.props.navigation.state.params.hospital ? this.props.navigation.state.params.hospital : null
        this.state = {
            hospital,
            countReset: 1
        };
    }
    onScanQr = () => {
        this.props.navigation.navigate("qrcodeScanner", {
            title: constants.title.scan_file,
            textHelp: constants.msg.ehealth.move_camera_to_file,
            onCheckData: data => {
                return new Promise((resolve, reject) => {
                    ehealthProvider.addEhealthWithCode(this.state.hospital.id, data).then(res => {
                        switch (res.code) {
                            case 2:
                                reject(2);
                                break
                            case 3:
                                reject(3);
                                break
                            case 4:
                                reject(4);
                                break
                            case 0:
                                resolve(data);
                                break
                        }
                        reject(-1);
                    }).catch(err => {
                        this.props.navigation.pop()
                        snackbar.show(constants.msg.ehealth.code_invalid, 'danger')

                    });
                });
            },
            onSuccess: data => {
                this.props.dispatch({ type: constants.action.action_select_hospital_ehealth, value: this.state.hospital })
                this.props.navigation.replace('listProfile');
                snackbar.show(constants.msg.ehealth.add_medical_records_success, 'success')
            },
            onError: error => {
                switch (error) {
                    case 2:
                        snackbar.show(constants.msg.ehealth.not_get_info_account, 'danger');
                        break;
                    case 3:
                        snackbar.show(constants.msg.ehealth.medical_records_not_found, 'danger')
                        break;
                    case 4:
                        snackbar.show(constants.msg.ehealth.account_not_owned_medical_records, 'danger')
                        break;
                    default:
                        snackbar.show(constants.msg.user.confirm_code_not_success, 'danger')
                        break;
                }
            }
        });
    }
    onInsertCode = () => {
        this.setState({
            isVisible: true
        })
    }
    onConfirm = () => {
        let patientHistoryId = this.state.valueCode
        let hospital = this.state.hospital
        this.setState({
            modalLoading: true,
            isVisible: false,

        }, () => {
            ehealthProvider.addEhealthWithCode(hospital.id, patientHistoryId).then(res => {

                switch (res.code) {
                    case 2:
                        snackbar.show(constants.msg.ehealth.not_get_info_account, 'danger')
                        break
                    case 3:
                        snackbar.show(constants.msg.ehealth.medical_records_not_found, 'danger')
                        break
                    case 4:
                        snackbar.show(constants.msg.ehealth.account_not_owned_medical_records, 'danger')
                        break
                    case 0:
                        this.props.dispatch({ type: constants.action.action_select_hospital_ehealth, value: hospital })
                        this.props.navigation.replace('listProfile');
                        snackbar.show(constants.msg.ehealth.add_medical_records_success, 'success')
                        break
                }
                this.setState({
                    valueCode: '',
                    modalLoading: false
                })

            }).catch(err => {
                snackbar.show(constants.msg.notification.error_retry, 'danger')

                this.setState({
                    isVisible: false,
                    valueCode: '',
                    modalLoading: false
                })
            })
        })


    }
    onBackdropPress = () => this.setState({ isVisible: false })

    onChangeText = state => value => {
        this.setState({ [state]: value })
    }
    render() {
        return (
            <ActivityPanel
                title={constants.title.ehealth}
                style={styles.container}
                isLoading={this.state.modalLoading}
            >
                <View style={styles.viewContent}>
                    <View style={styles.viewBtn}>
                        <TouchableOpacity onPress={this.onScanQr} style={styles.btnAddEhealth}><Text style={styles.txAddEhealth}>{constants.ehealth.scan_code}</Text></TouchableOpacity>
                        <View style={{ width: 10 }}></View>
                        <TouchableOpacity onPress={this.onInsertCode} style={styles.btnAddEhealth}><Text style={styles.txAddEhealth}>{constants.ehealth.input_code}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.containerHeaderTitle}>
                        <Text style={styles.txtContentTitle}>{constants.ehealth.input_or_scan_code}</Text>
                    </View>
                    <ScaledImage height={400} width={device_width} style={{ marginTop: 20 }} source={require('@images/new/ehealth/img_demo_scan.jpg')}></ScaledImage>
                </View>
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={this.onBackdropPress}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={styles.modal}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <View style={styles.viewModal}>
                        <Text style={styles.titleModal}>{constants.ehealth.input_profile_code}</Text>
                        <TextInput
                            multiline={true}
                            onChangeText={this.onChangeText('valueCode')}
                            value={this.state.valueCode}
                            style={styles.textInputCode}
                        ></TextInput>
                        <TouchableOpacity onPress={this.onConfirm} style={styles.btnConfirm}>
                            <Text style={styles.txtConfirmCode}>{constants.ehealth.confirm_code}</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    txtConfirmCode: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgScanDemo: { marginTop: 20 },
    txtContentTitle: {
        color: '#02C39A',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20
    },
    containerHeaderTitle: {
        maxWidth: '95%',
        marginTop: 20
    },
    container: {
        flex: 1,
    },
    titleModal: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000'
    },
    viewModal: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 250

    },
    viewContent: {
        paddingHorizontal: 10, flex: 1, backgroundColor: '#f0f5f9',
        alignItems: 'center'
    },
    textInputCode: {
        minHeight: 41,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#01bf89',
        minWidth: '50%',
        maxWidth: '50%',
        marginTop: 30,
        fontSize: 18

    },
    btnConfirm: {
        backgroundColor: '#01bf89',
        borderRadius: 5,
        height: 41,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        paddingHorizontal: 20
    },
    viewBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btnAddEhealth: {
        borderColor: '#02C39A',
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#02C39A',
        justifyContent: 'center',
        alignItems: 'center',
        height: 51,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    txAddEhealth: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    }
})
export default connect()(AddNewEhealthScreen);
