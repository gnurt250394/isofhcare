import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
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
    viewResult = (item) => {
        console.log(item);
        this.setState({ isLoading: true }, () => {
            resultUtils.getDetail(item.patientHistoryId, this.props.ehealth.hospital.hospital.id, item.id).then(result => {
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
            snackbar.show("Vui lòng chọn người cần chia sẻ", "danger");
            return;
        }
        if (!this.state.fromDate) {
            snackbar.show("Vui lòng chọn ngày bắt đầu", "danger");
            return;
        }
        if (!this.state.toDate) {
            snackbar.show("Vui lòng chọn ngày kết thúc", "danger");
            return;
        }
        if (this.state.toDate < this.state.fromDate) {
            snackbar.show("Ngày bắt đầu phải lớn hơn ngày kết thúc", "danger");
            return;
        }
        connectionUtils.isConnected().then(s => {
            let hospitalId = this.props.ehealth.hospital.hospital.id
            let patientHistoryId = this.state.history.patientHistoryId;
            this.setState({ isLoading: true }, () => {
                ehealthProvider.shareWithProfile(this.state.user.id, hospitalId, patientHistoryId, this.state.fromDate.format("yyyy-MM-dd HH:mm:ss"), this.state.toDate.format("yyyy-MM-dd HH:mm:ss")).then(res => {
                    this.setState({ isLoading: false }, () => {
                        if (res.code == 0 && res.data.status == 1) {
                            snackbar.show("Chia sẻ thành công", "success");
                            this.props.navigation.pop();
                        } else {
                            snackbar.show("Chia sẻ không thành công", "danger");
                        }
                    })
                }).catch(err => {
                    this.setState({ isLoading: false }, () => {
                        snackbar.show("Chia sẻ không thành công", "danger");
                    });
                })
            })
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })

    }
    render() {
        let item = this.state.history;
        return (
            <ActivityPanel style={styles.container}
                // title="HỒ SƠ Y BẠ GIA ĐÌNH"
                isLoading={this.state.isLoading}
                title={"Chia sẻ y bạ"}
                icBack={require('@images/new/left_arrow_white.png')}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#4BBA7B"
                actionbarStyle={styles.actionbarStyle}
                titleStyle={styles.titleStyle}
            >
                <ScrollView>
                    <View style={{ margin: 10 }}>
                        <Card style={styles.cardStyle}>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {
                                this.viewResult(item)
                            }}>
                                <View style={{ width: 150, height: 100, alignItems: 'center' }}>
                                    <ScaledImage style={styles.img} height={100} width={150} source={this.getImage(item)}></ScaledImage>
                                </View>
                                <View style={styles.viewDetails}>
                                    <Text style={{ color: '#479AE3', marginVertical: 10, fontSize: 14 }}>{this.getTime(item.timeGoIn)}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <ScaledImage style={styles.img} height={20} width={20} source={this.getImageSmall(item)}></ScaledImage>
                                        <Text style={{ marginLeft: 5, fontSize: 14, minHeight: 20, fontWeight: 'bold' }}>{item.serviceName}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Card>
                        <Card>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    pickFromDate: true,
                                    mode: "date",
                                    toggelDateTimePickerVisible: true
                                })
                            }} style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Icon name='calendar' style={{ color: '#00000080' }} />
                                <Text style={{ marginHorizontal: 10 }}>
                                    Hiệu lực từ:
                                </Text>
                                {
                                    !this.state.fromDate ?
                                        <Text style={{ fontStyle: 'italic', color: '#00000080', textAlign: 'right', flex: 1 }}>
                                            Chọn ngày
                                </Text> :
                                        <Text style={{ fontWeight: 'bold', color: 'red', textAlign: 'right', flex: 1 }}>
                                            {this.state.fromDate.format("dd/MM/yyyy HH:mm")}
                                        </Text>
                                }
                            </TouchableOpacity>
                            <View style={{ height: 1, backgroundColor: '#caccac50' }} />
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    pickFromDate: false,
                                    mode: "date",
                                    toggelDateTimePickerVisible: true
                                })
                            }} style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Icon name='calendar' style={{ color: '#00000080' }} />
                                <Text style={{ marginLeft: 10 }}>
                                    Hiệu lực đến:
                                </Text>
                                {
                                    !this.state.toDate ?
                                        <Text style={{ fontStyle: 'italic', color: '#00000080', textAlign: 'right', flex: 1 }}>
                                            Chọn ngày
                                    </Text> :
                                        <Text style={{ fontWeight: 'bold', color: 'red', textAlign: 'right', flex: 1 }}>
                                            {this.state.toDate.format("dd/MM/yyyy HH:mm")}
                                        </Text>

                                }
                            </TouchableOpacity>
                            <View style={{ height: 1, backgroundColor: '#caccac50' }} />
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('searchProfile', {
                                    onSelected: this.onSelectProfile
                                });
                            }} style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Icon name='person' style={{ color: '#00000080' }} />
                                <Text style={{ marginLeft: 10 }}>
                                    Người nhận:
                                </Text>
                                {
                                    !this.state.user ?
                                        <Text style={{ fontStyle: 'italic', color: '#00000080', textAlign: 'right', flex: 1 }}>
                                            Chọn thành viên
                                    </Text> :
                                        <Text style={{ fontWeight: 'bold', color: 'red', textAlign: 'right', flex: 1 }}>
                                            {this.state.user.name}
                                        </Text>
                                }
                            </TouchableOpacity>
                        </Card>
                        <TouchableOpacity onPress={this.onShare} style={styles.viewBtn}>
                            <Text style={styles.txCheckResult}>{'CHIA SẺ'}</Text>
                        </TouchableOpacity>

                    </View>

                </ScrollView>
                <DateTimePicker
                    mode={this.state.mode}
                    isVisible={this.state.toggelDateTimePickerVisible}
                    onConfirm={newDate => {
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
                    }}
                    onCancel={() => {
                        this.setState({ toggelDateTimePickerVisible: false });
                    }}
                    cancelTextIOS={"Hủy bỏ"}
                    confirmTextIOS={"Xác nhận"}
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
    actionbarStyle: {
        backgroundColor: '#4BBA7B',
        borderBottomWidth: 0
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
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(EhealthSharingScreen);