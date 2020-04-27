import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { Card, Icon } from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
const width = (Dimensions.get('window').width) / 2;
const spacing = 10;
import dateUtils from 'mainam-react-native-date-utils';
import resultUtils from './utils/result-utils';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';
import DateTimePicker from "mainam-react-native-date-picker";
const DEVICE_WIDTH = Dimensions.get('window').width;
import connectionUtils from '@utils/connection-utils';
import ehealthProvider from '@data-access/ehealth-provider';

class EhealthSharingScreen extends Component {
    constructor(props) {
        super(props);
        let history = this.props.navigation.state.params ? this.props.navigation.state.params.history || {} : {}
        this.state = {
            history: history,
            // fromDate: new Date(),
            // toDate: new Date()
        };
    }

    getTime(text) {
        try {
            if (text) {
                return text.toDateObject('-').format('dd/MM/yyyy');
            }
            return "";
        } catch (error) {
            return "";
        }
    }
    viewResult = (item) => () => {
        console.log(item);
        this.setState({ isLoading: true }, () => {
            let hospitalId = this.props.ehealth.hospital && this.props.ehealth.hospital.hospital && this.props.ehealth.hospital.hospital.id ? this.props.ehealth.hospital.hospital.id : this.props.ehealth.hospital.id

            resultUtils.getDetail(item.patientHistoryId, hospitalId, item.id).then(result => {
                this.setState({ isLoading: false }, () => {
                    if (!result.hasResult)
                        snackbar.show(constants.msg.ehealth.not_result_ehealth_in_day, "danger");
                    else {
                        this.props.navigation.navigate("viewDetailEhealth", { result: result.result, resultDetail: result.resultDetail })
                    }
                });
            });
        });
    }

    getImage(item) {
        switch (item.serviceType) {
            case "CheckUp":
                return require("@images/new/ehealth/img_checkup.png");
            case "MedicalTest":
                return require("@images/new/ehealth/ic_xet_nghiem.png");
            case "MR":
                return require("@images/new/ehealth/img_conghuongtu.png");
            case "CT":
                return require("@images/new/ehealth/ic_ct_catlop.png");
            case "US":
                return require("@images/new/ehealth/img_sieuam.png");
            case "ED":
                return require("@images/new/ehealth/img_endoscopic.png");
            case "XQ":
                return require("@images/new/ehealth/img_xquang.png");
            default:
                return require("@images/new/ehealth/img_orther_service.png");

        }

    }



    getImageSmall(item) {
        switch (item.serviceType) {
            case "CheckUp":
                return require("@images/new/ehealth/img_checkup_small.png");
            case "MedicalTest":
                return require("@images/new/ehealth/ic_xet_nghiem_small.png");
            case "MR":
                return require("@images/new/ehealth/img_conghuongtu_small.png");
            case "CT":
                return require("@images/new/ehealth/ic_ct_catlop_small.png");
            case "US":
                return require("@images/new/ehealth/img_sieuam_small.png");
            case "ED":
                return require("@images/new/ehealth/img_endoscopic_small.png");
            case "XQ":
                return require("@images/new/ehealth/img_xquang_small.png");
            default:
                return require("@images/new/ehealth/img_orther_service_small.png");

        }

    }

    onSelectProfile = (profile) => {
        this.setState({ user: profile.user });
    }
    onShare = () => {
        if (!this.state.user) {
            snackbar.show(constants.msg.ehealth.please_select_people_share, "danger");
            return;
        }
        if (!this.state.fromDate) {
            snackbar.show(constants.msg.ehealth.please_select_date_start, "danger");
            return;
        }
        if (!this.state.toDate) {
            snackbar.show(constants.msg.ehealth.please_select_date_end, "danger");
            return;
        }
        if (this.state.toDate < this.state.fromDate) {
            snackbar.show(constants.msg.ehealth.date_start_bigger_than_date_end, "danger");
            return;
        }
        connectionUtils.isConnected().then(s => {
            let hospitalId = this.props.ehealth.hospital && this.props.ehealth.hospital.hospital ? this.props.ehealth.hospital.hospital.id : this.props.ehealth.hospital.id
            let patientHistoryId = this.state.history.patientHistoryId;
            this.setState({ isLoading: true }, () => {
                ehealthProvider.shareWithProfile(this.state.user.id, hospitalId, patientHistoryId, this.state.fromDate.format("yyyy-MM-dd HH:mm:ss"), this.state.toDate.format("yyyy-MM-dd HH:mm:ss")).then(res => {
                    this.setState({ isLoading: false }, () => {
                        if (res.code == 0 && res.data.status == 1) {
                            snackbar.show(constants.msg.ehealth.share_success, "success");
                            this.props.navigation.pop();
                        } else {
                            snackbar.show(constants.msg.ehealth.share_fail, "danger");
                        }
                    })
                }).catch(err => {
                    this.setState({ isLoading: false }, () => {
                        snackbar.show(constants.msg.ehealth.share_fail, "danger");
                    });
                })
            })
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })

    }
    onClickPickFormDate = (pickFromDate) => () => {
        this.setState({
            pickFromDate,
            mode: "date",
            toggelDateTimePickerVisible: true
        })
    }
    onClickSearchProfile = () => {
        this.props.navigation.navigate('searchProfile', {
            onSelected: this.onSelectProfile
        });
    }
    onConfirmDate = newDate => {
        if (this.state.pickFromDate) {
            if (this.state.mode == 'date' && this.state.fromDate) {
                newDate.setHours(this.state.fromDate.getHours())
                newDate.setMinutes(this.state.fromDate.getMinutes())
                newDate.setSeconds(this.state.fromDate.getSeconds())
            }
            this.setState(
                {
                    toggelDateTimePickerVisible: false,
                    fromDate: newDate
                }, () => {
                    if (this.state.mode == "date") {
                        this.setState({
                            mode: 'time',
                            toggelDateTimePickerVisible: true
                        })
                    }
                });
        } else {
            if (this.state.mode == 'date' && this.state.toDate) {
                newDate.setHours(this.state.toDate.getHours())
                newDate.setMinutes(this.state.toDate.getMinutes())
                newDate.setSeconds(this.state.toDate.getSeconds())
            }
            this.setState(
                {
                    toggelDateTimePickerVisible: false,
                    toDate: newDate
                }, () => {
                    if (this.state.mode == "date") {
                        this.setState({
                            mode: 'time',
                            toggelDateTimePickerVisible: true
                        })
                    }
                });
        }
    }
    onCancelDate = () => {
        this.setState({ toggelDateTimePickerVisible: false });
    }
    render() {
        let item = this.state.history;
        return (
            <ActivityPanel style={styles.container}
                // title="HỒ SƠ Y BẠ GIA ĐÌNH"
                isLoading={this.state.isLoading}
                title={constants.ehealth.share_ehealth}
            >
                <ScrollView>
                    <View style={styles.group}>
                        <Card style={styles.cardStyle}>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.viewResult(item)}>
                                <View style={styles.containerImage}>
                                    <ScaledImage style={styles.img} height={100} width={150} source={this.getImage(item)}></ScaledImage>
                                </View>
                                <View style={styles.viewDetails}>
                                    <Text style={styles.txtTimeGoIn}>{this.getTime(item.timeGoIn)}</Text>
                                    <View style={styles.containerImageSmall}>
                                        <ScaledImage style={styles.img} height={20} width={20} source={this.getImageSmall(item)}></ScaledImage>
                                        <Text style={styles.txtServicesName}>{item.serviceName}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Card>
                        <Card>
                            <TouchableOpacity onPress={this.onClickPickFormDate(true)} style={styles.buttonPickDate}>
                                <Image source={require('@images/ic_calendar.png')} style={styles.iconCalendar} />
                                <Text style={{ marginHorizontal: 10 }}>{constants.ehealth.validity_from}:</Text>
                                {
                                    !this.state.fromDate ?
                                        <Text style={styles.txtSelectDate}>
                                            {constants.ehealth.select_date}
                                        </Text> :
                                        <Text style={styles.txtDateFormat}>
                                            {this.state.fromDate.format("dd/MM/yyyy HH:mm")}
                                        </Text>
                                }
                            </TouchableOpacity>
                            <View style={styles.between} />
                            <TouchableOpacity onPress={this.onClickPickFormDate(false)} style={styles.buttonPickDate}>
                                <Image source={require('@images/ic_calendar.png')} style={styles.iconCalendar} />
                                <Text style={{ marginLeft: 10 }}>{constants.ehealth.validity_to}:</Text>
                                {
                                    !this.state.toDate ?
                                        <Text style={styles.txtSelectDate}>
                                            {constants.ehealth.select_date}
                                        </Text> :
                                        <Text style={styles.txtDateFormat}>
                                            {this.state.toDate.format("dd/MM/yyyy HH:mm")}
                                        </Text>

                                }
                            </TouchableOpacity>
                            <View style={styles.between} />
                            <TouchableOpacity onPress={this.onClickSearchProfile} style={styles.buttonPickDate}>
                                <Image source={require('@images/ic_person.png')} style={styles.iconCalendar} />
                                <Text style={{ marginLeft: 10 }}>{constants.ehealth.reciver}:</Text>
                                {
                                    !this.state.user ?
                                        <Text style={styles.txtSelectDate}>{constants.ehealth.select_member}</Text>
                                        :
                                        <Text style={styles.txtDateFormat}>
                                            {this.state.user.name}
                                        </Text>
                                }
                            </TouchableOpacity>
                        </Card>
                        <TouchableOpacity onPress={this.onShare} style={styles.viewBtn}>
                            <Text style={styles.txCheckResult}>{constants.ehealth.share}</Text>
                        </TouchableOpacity>

                    </View>

                </ScrollView>
                <DateTimePicker
                    mode={this.state.mode}
                    isVisible={this.state.toggelDateTimePickerVisible}
                    onConfirm={this.onConfirmDate}
                    onCancel={this.onCancelDate}
                    cancelTextIOS={constants.actionSheet.cancel2}
                    confirmTextIOS={constants.actionSheet.confirm}
                    minimumDate={
                        this.state.pickFromDate ? null : this.state.fromDate
                    }
                    maximumDate={
                        this.state.pickFromDate ? this.state.toDate : null
                    }
                    date={(this.state.pickFromDate ? this.state.fromDate : this.state.toDate) || new Date()}
                />

            </ActivityPanel >

        );
    }
}
const styles = StyleSheet.create({
    between: {
        height: 1,
        backgroundColor: '#caccac50'
    },
    txtDateFormat: {
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'right',
        flex: 1
    },
    txtSelectDate: {
        fontStyle: 'italic',
        color: '#00000080',
        textAlign: 'right',
        flex: 1
    },
    iconCalendar: { height: 18, width: 18, resizeMode: 'contain', tintColor: '#777' },
    buttonPickDate: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    txtServicesName: {
        marginLeft: 5,
        fontSize: 14,
        minHeight: 20,
        fontWeight: 'bold'
    },
    containerImageSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtTimeGoIn: {
        color: '#479AE3',
        marginVertical: 10,
        fontSize: 14
    },
    containerImage: {
        width: 150,
        height: 100,
        alignItems: 'center'
    },
    group: {
        margin: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB'
    },
    cardStyle: {
        margin: 10,
        width: 200, alignSelf: 'center',
        borderRadius: 5,
        alignItems: 'center',
        minHeight: 150,
        paddingVertical: 10,
        justifyContent: 'center',
    },
    viewItem: {
        width: width,
        padding: 5,
        paddingHorizontal: 10,

        // , padding: 5, flex: 1 / 2, height: 180, marginTop: 20, 
        justifyContent: 'center', alignItems: 'center',
        width: width
    },
    viewDetails: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        // top:-50

    },

    imageStyle: { borderRadius: 30, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' },
    imgLoad: {
        alignSelf: 'center',
        borderRadius: 30,
        width: 60,
        height: 60
    },
    avatar: {
        alignSelf: 'center',
        borderRadius: 25,
        width: 45,
        height: 45
    },
    titleStyle: {
        color: '#FFF'
    },
    viewBtn: {
        width: 252,
        maxWidth: DEVICE_WIDTH - 80,
        height: 50,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: '#F7685B',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    txCheckResult: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

})

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(EhealthSharingScreen);