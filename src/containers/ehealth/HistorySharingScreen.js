import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Card } from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import ImageLoad from 'mainam-react-native-image-loader';
const width = (Dimensions.get('window').width) / 2;
const spacing = 10;
import dateUtils from 'mainam-react-native-date-utils';
import resultUtils from './utils/result-utils';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';
import ehealthProvider from '@data-access/ehealth-provider';

class HistorySharingScreen extends Component {
    constructor(props) {
        super(props);
        let patientHistoryId = this.props.navigation.state.params ? this.props.navigation.state.params.patientHistoryId || "" : ""
        this.state = {
            patientHistoryId: patientHistoryId,
            refreshing: false
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

    componentDidMount() {

        this.onRefresh();
    }
    onLoad() {
        this.setState({
            loading: true,
            refreshing: true
        }, () => {
            ehealthProvider.getListShareUser(this.props.ehealth.hospital.hospital.id).then(s => {
                this.setState({
                    loading: false,
                    refreshing: false
                }, () => {
                    if (s) {
                        switch (s.code) {
                            case 0:
                                this.setState({
                                    data: (s.data.patientHistorys || [])//.filter(item => item.patientHistoryId == this.state.patientHistoryId)
                                });
                                break;
                        }
                    }
                });

            })
                .catch(e => {
                    this.setState({
                        loading: false,
                        refreshing: false
                    });
                });
        });
    }

    renderItem = ({ item }) => {
        return (
            <View style={styles.viewItem}>
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
            </View>
        )
    }

    onRefresh() {
        if (!this.state.loading)
            this.onLoad();
    }

    render() {
        return (
            <ActivityPanel style={styles.container}
                // title="HỒ SƠ Y BẠ GIA ĐÌNH"
                isLoading={this.state.isLoading}
                title={"Lịch sử chia sẻ y bạ"}
                icBack={require('@images/new/left_arrow_white.png')}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#02C39A"
                actionbarStyle={styles.actionbarStyle}
                titleStyle={styles.titleStyle}
            >
                <FlatList
                    numColumns={2}
                    onRefresh={this.onRefresh.bind(this)}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={1}
                    style={{ flex: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    ListHeaderComponent={() =>
                        !this.state.refreshing &&
                            (!this.state.data || this.state.data.length == 0) ? (
                                <View style={{ alignItems: "center", marginTop: 50 }}>
                                    <Text style={{ fontStyle: "italic" }}>
                                        Chưa có chia sẻ nào
                            </Text>
                                </View>
                            ) : null
                    }
                    ListFooterComponent={() => <View style={{ height: 10 }} />}
                ></FlatList>
            </ActivityPanel>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB'
    },
    cardStyle: {
        width: '100%',
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
        backgroundColor: '#02C39A',
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
        color: '#fff'
    }
})

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(HistorySharingScreen);