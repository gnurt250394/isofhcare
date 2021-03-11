import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import constants from '@resources/strings';
import connectionUtils from '@utils/connection-utils';
import resultUtils from '../../../containers/ehealth/utils/result-utils';
import snackbar from '@utils/snackbar-utils';
import NavigationService from '@navigators/NavigationService';
import { Card } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import ScaledImage from 'mainam-react-native-scaleimage';

class ItemReBooking extends PureComponent {
    constructor(props) {
        super(props);
    }
    renderTextError = (status) => {
        switch (status) {
            case 1: return constants.msg.ehealth.not_result_of_this_date;
            case 2: return constants.msg.ehealth.re_examination_in_date + this.state.reCheckDate.toDateObject('-').format('dd/MM/yyyy') + '!';
            case 3: return constants.msg.ehealth.examination_in_date;
            case 4: return constants.msg.ehealth.not_re_examination;
            case 5: return constants.msg.ehealth.not_examination;
            case 6: return constants.msg.ehealth.not_result_ehealth_in_day;
            case 7: return constants.msg.ehealth.share_medical_records_success;
            case 8: return constants.msg.ehealth.share_fail;
            default: return constants.msg.ehealth.not_examination;
        }
    }
    onViewEhealth = item => {


        connectionUtils.isConnected().then(s => {
            let userId = this.props.userApp.currentUser.id;

            let hospitalId = this.props.userApp.hospital.id;
            try {
                resultUtils.getDetailByUserIdAndHospitalId(userId, hospitalId, item?.patientHistoryId).then(result => {
                    this.setState({
                        isLoading: false
                    }, () => {
                        this.props.dispatch({ type: constants.action.action_select_hospital_ehealth, value: item })
                        let results = JSON.parse(result.data?.result)
                        let resultDetails = JSON.parse(result.data?.resultDetail)
                        resultDetails.Profile = results.Profile
                        NavigationService.navigate("viewDetailEhealth", {
                            result: results,
                            resultDetail: resultDetails,
                            // data: result.data,
                            hasResult: true,
                            dataHistory: item,
                            // √: this.state.listResult,
                            // currentIndex: index
                            // resultDetail: data.resultDetail,
                            // result: data.result,
                            // hospitalName: data.hospitalName,
                            // currentIndex: data.currentIndex,
                            // dataHistory: data.dataHistory,
                            // user: data.user,
                            // listResult: data.listResult,
                            // currentIndex: index,
                            showDrug: true
                        })


                    });
                }).catch(err => {


                    this.setState({
                        isLoading: false
                    }, () => {
                        snackbar.show(this.renderTextError(6), "danger");
                    });
                })
            } catch (error) {


                this.setState({
                    isLoading: false,
                }, () => {
                    snackbar.show(this.renderTextError(6), "danger");
                });
            }

        });
    };
    onBooking = () => {
        Linking.openURL(`tel:${this.props.userApp?.hospital?.hotLine || '19006422'}`)

        // NavigationService.navigate('listDoctor');
    };
    render() {
        const item = this.props.item;
        let date = new Date(this.props?.item?.time);

        return (
            <Card key={this.props.index} style={styles.listBtn}>
                <View style={styles.row}>
                    <View style={styles.containerDate}>
                        <View style={{ marginVertical: 10 }}>
                            <Text style={styles.txtDate}>
                                {!isNaN(date) ? date.format('dd') : ''}
                            </Text>
                            <Text style={styles.txtDate2}>
                                {!isNaN(date) ? date.format('MM/yyyy') : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.containerBody}>
                        <Text
                            style={{
                                color: '#E73359',
                            }}>
                            [Lịch hẹn tái khám]
            </Text>

                        <Text style={styles.txtPatient}>
                            {item?.patient && item?.patient ? item?.patient : ''}
                        </Text>

                        <View
                            style={{
                                paddingTop: 15,
                            }}>
                            {item?.doctor ? (
                                <View style={styles.containerRow}>
                                    <Text style={styles.widthTxt}>Bác sĩ:</Text>
                                    <Text style={styles.txtNote1}>{item?.doctor}</Text>
                                </View>
                            ) : null}
                            {item?.speciality ? (
                                <View style={styles.containerRow}>
                                    <Text style={styles.widthTxt}>CK:</Text>
                                    <Text style={styles.txtNote1}>{item?.speciality}</Text>
                                </View>
                            ) : null}
                            {item?.service ? (
                                <View style={styles.containerRow}>
                                    <Text style={styles.widthTxt}>Dịch vụ:</Text>
                                    <Text style={styles.txtNote1}>{item?.service}</Text>
                                </View>
                            ) : null}
                            {item?.note ? (
                                <View style={styles.containerRow}>
                                    <Text style={styles.widthTxt}>Ghi chú:</Text>
                                    <Text style={styles.txtNote1}>{item?.note}</Text>
                                </View>
                            ) : null}
                        </View>

                        <View style={styles.viewBtn}>
                            <TouchableOpacity
                                style={styles.btnBooking}
                                onPress={this.onBooking}>
                                <ScaledImage
                                    source={require('@images/new/booking/ic_booking.png')}
                                    height={19}
                                    style={{ tintColor: '#FFF' }}
                                />
                                <View
                                    style={{
                                        paddingLeft: 5,
                                    }}>
                                    <Text style={styles.txBooking}>Đặt khám</Text>
                                    <Text style={styles.txtSub}>Tại cơ sở y tế</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btnEhealth}
                                onPress={() => this.onViewEhealth(item)}>
                                <ScaledImage
                                    source={require('@images/new/booking/ic_booking.png')}
                                    height={19}
                                />
                                <View
                                    style={{
                                        paddingLeft: 5,
                                    }}>
                                    <Text style={[styles.txBooking, { color: '#0291E1' }]}>
                                        Hồ sơ y tế
                  </Text>
                                    <Text style={[styles.txtSub, { color: '#0291E1' }]}>
                                        Kết quả khám
                  </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Card>
        );
    }
}
const styles = StyleSheet.create({
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
    loadMore: { alignItems: 'center', position: 'absolute' },
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
        fontStyle: 'italic',
        fontSize: 14,
        color: '#000000',
        fontWeight: 'normal',
        flex: 1,
    },
    containerNoneData: { alignItems: 'center', marginTop: 50 },
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
    txtUserName: { color: 'rgb(142,142,147)' },
    txtServiceType: { fontWeight: 'bold', color: 'rgb(74,74,74)' },
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
        color: '#3161AD60',
        textAlign: 'center',
    },
    containerDate: {
        width: '25%',
        alignItems: 'center',
    },
    row: { flexDirection: 'row' },
    listBtn: {
        backgroundColor: '#fff',
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
    txReBooking: { color: '#ED1846' },
    btnBooking: {
        backgroundColor: '#0291E1',
        borderRadius: 50,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 5,
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
    txBooking: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    txEhealth: { color: '#000000', fontSize: 14 },
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking,
    };
}
export default connect(mapStateToProps)(ItemReBooking);
