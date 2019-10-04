import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Modal from "@components/modal";
import ActivityPanel from "@components/ActivityPanel";
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import ehealthProvider from '@data-access/ehealth-provider'
import ScaledImage from 'mainam-react-native-scaleimage';
import { connect } from "react-redux";

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
            title: "QUÉT MÃ HỒ SƠ",
            textHelp: "Di chuyển camera đến vùng chứa mã hồ sơ để quét",
            onCheckData: data => {
                return new Promise((resolve, reject) => {
                    ehealthProvider.addEhealthWithCode(this.state.hospital.hospital.id, data).then(res => {
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
                        snackbar.show('Mã không hợp lệ', 'danger')

                    });
                });
            },
            onSuccess: data => {
                this.props.dispatch({ type: constants.action.action_select_hospital_ehealth, value: this.state.hospital })
                this.props.navigation.replace('listProfile');
                snackbar.show('Thêm y bạ thành công', 'success')
            },
            onError: error => {
                switch (error) {
                    case 2:
                        snackbar.show('Không lấy được thông tin tài khoản, xin vui lòng thử lại', 'danger');
                        break;
                    case 3:
                        snackbar.show('Không tìm thấy y bạ', 'danger')
                        break;
                    case 4:
                        snackbar.show('Tài khoản của bạn không sở hữu y bạ này', 'danger')
                        break;
                    default:
                        snackbar.show('Xác thực không thành công', 'danger')
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
            ehealthProvider.addEhealthWithCode(hospital.hospital.id, patientHistoryId).then(res => {

                switch (res.code) {
                    case 2:
                        snackbar.show('Không lấy được thông tin tài khoản, xin vui lòng thử lại', 'danger')
                        break
                    case 3:
                        snackbar.show('Không tìm thấy y bạ', 'danger')
                        break
                    case 4:
                        snackbar.show('Tài khoản của bạn không sở hữu y bạ này', 'danger')
                        break
                    case 0:
                        this.props.dispatch({ type: constants.action.action_select_hospital_ehealth, value: hospital })
                        this.props.navigation.replace('listProfile');
                        snackbar.show('Thêm y bạ thành công', 'success')
                        break
                }
                this.setState({
                    valueCode: '',
                    modalLoading: false
                })

            }).catch(err => {
                snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                console.log(err);
                this.setState({
                    isVisible: false,
                    valueCode: '',
                    modalLoading: false
                })
            })
        })


    }
    render() {
        return (
            <ActivityPanel
                icBack={require('@images/new/left_arrow_white.png')}
                titleStyle={styles.txTitle}
                title={constants.title.ehealth}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#02C39A"
                actionbarStyle={styles.actionbarStyle}
                style={styles.container}
                isLoading={this.state.modalLoading}
            >
                <View style={styles.viewContent}>
                    <View style={styles.viewBtn}>
                        <TouchableOpacity onPress={this.onScanQr} style={styles.btnAddEhealth}><Text style={styles.txAddEhealth}>QUÉT  MÃ</Text></TouchableOpacity>
                        <View style={{ width: 10 }}></View>
                        <TouchableOpacity onPress={this.onInsertCode} style={styles.btnAddEhealth}><Text style={styles.txAddEhealth}>NHẬP MÃ</Text></TouchableOpacity>
                    </View>
                    <View style={{ maxWidth: '95%', marginTop: 20 }}><Text style={{ color: '#02C39A', fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>NHẬP HOẶC QUÉT MÃ HỒ SƠ ĐỂ XEM KẾT QUẢ KHÁM MỚI</Text></View>
                    <ScaledImage height={400} resizemode='contain' style={{ marginTop: 20 }} source={require('@images/new/ehealth/img_demo_scan.jpg')}></ScaledImage>
                </View>
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={() => this.setState({ isVisible: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <View style={styles.viewModal}>
                        <Text style={styles.titleModal}>NHẬP MÃ HỒ SƠ ĐƯỢC IN TRÊN PHIẾU VÀO Ô DƯỚI</Text>
                        <TextInput
                            multiline={true}
                            onChangeText={text => this.setState({ valueCode: text })}
                            value={this.state.valueCode}
                            style={styles.textInputCode}
                        ></TextInput>
                        <TouchableOpacity onPress={this.onConfirm} style={styles.btnConfirm}><Text style={{ fontSize: 14, color: '#fff', fontWeight: 'bold' }}>XÁC NHẬN MÃ</Text></TouchableOpacity>
                    </View>
                </Modal>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
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
    txTitle: { color: '#fff' },
    actionbarStyle: {
        backgroundColor: '#02C39A',
        borderBottomWidth: 0
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
