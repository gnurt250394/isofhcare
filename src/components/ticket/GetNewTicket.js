import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, RefreshControl, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native'
import Modal from '@components/modal';
import ScaledImage from 'mainam-react-native-scaleimage';
import StarRating from 'react-native-star-rating';
import ActivityPanel from "@components/ActivityPanel";
import { connect } from "react-redux";
import hospitalProvider from '@data-access/hospital-provider';
import constants from '@resources/strings';
import questionProvider from '@data-access/question-provider';
import clientUtils from '@utils/client-utils';
import ActionSheet from 'react-native-actionsheet'
const deviceWidth = Dimensions.get("window").width;
class GetNewTicket extends Component {

    state = {
        data: [],
        service: null,
        index: '',
        keyword: '',
        loading: true,
        disabled: true
    }

    componentDidMount() {
        this.getListHospital()
        // this.getRatting()
    }
    // getRatting = () => {
    //     questionProvider.getResultReview(this.state.id).then(res => {
    //       if (res.code == 0) {
    //         console.log(res);
    //       }
    //     }).catch(err => {
    //       console.log(err)
    //     })

    //   }
    onRefesh = () => {
        this.setState({
            loading: true
        }, () => {
            this.getListHospital()
        })
    }
    getListHospital = () => {

        hospitalProvider.getDefaultHospital().then(res => {
            let data = res.data
            if (res.code == 0) {
                let keyword = (this.state.keyword || "").trim().toLowerCase().unsignText();
                let data2 = data.filter(data => {
                    return (data.hospital.defaultBookHospital && (
                        !keyword ||
                        ((data.hospital.name || "").trim().toLowerCase().unsignText().indexOf(keyword) != -1) ||
                        ((data.hospital.address || "").trim().toLowerCase().unsignText().indexOf(keyword) != -1)
                    ));
                })
                let data3 = data.filter(data => {
                    return (!data.hospital.defaultBookHospital && (
                        !keyword ||
                        ((data.hospital.name || "").trim().toLowerCase().unsignText().indexOf(keyword) != -1) ||
                        ((data.hospital.address || "").trim().toLowerCase().unsignText().indexOf(keyword) != -1)
                    ));
                }).sort(function (a, b) {
                    return a.hospital.sttHospital - b.hospital.sttHospital
                })
                this.setState({
                    data2,
                    data3,
                    loading: false
                })
            }
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }
    onPressService = (item, key, index) => {
        if (!item.hospital.defaultBookHospital && key == 3 || !item.hospital.defaultBookHospital) {

            return
        }
        this.setState({
            isVisible: true,
            service: key,
            index: item.hospital.id,
        }, () => {
        });
    }
    search = () => {
        this.getListHospital()

    }
    onScanQr = () => {
        this.setState({ isVisible: false }, () => {
            setTimeout(() => {
                this.props.navigation.navigate("scanQRCode");
            }, 500);
        });
    }
    onAssignTicket = () => {
        this.setState({ isVisible: false }, () => {
            setTimeout(() => {
                this.props.navigation.navigate("login", {
                    nextScreen: { screen: "scanQRCode", param: {} }
                });
            }, 500);
        });
    }
    showDialogError = (item) => () => {
        console.log('item: ', item);
        this.props.dispatch({ type: constants.action.action_select_hospital_get_ticket, value: item });
        this.actionSheetErr.show();
    }
    showDialog = (item) => () => {
        console.log('item: ', item);
        this.props.dispatch({ type: constants.action.action_select_hospital_get_ticket, value: item });
        this.actionSheetGetTicket.show();
    }
    showGetTicket = () => {
        this.actionSheetGetTicket.show();
    }
    renderItem = (item, index) => {
        return (
            <View style={[styles.viewItem, index > 0 ? { borderTopWidth: 0 } : { borderTopWidth: 1 }]} key={index}>

                <View style={styles.viewImg}>
                    <ScaledImage style={styles.viewAvt} source={{ uri: item.hospital.avatar.absoluteUrl() }}></ScaledImage>
                    <View style={styles.viewRating}>
                        <StarRating
                            disabled={true}
                            starSize={12}
                            maxStars={5}
                            rating={item.hospital.rankHospital}
                            starStyle={{ margin: 0 }}
                            fullStarColor={"#fbbd04"}
                            emptyStarColor={"#fbbd04"}
                        />
                    </View>
                </View>
                <View style={styles.viewService}>
                    <View style={styles.row}>
                        <Text style={styles.txtNameHospital}>{item.hospital.name}</Text>
                        <ScaledImage style={{ marginLeft: 8, }} height={12} source={require("@images/new/booking/ic_checked.png")} ></ScaledImage>
                    </View>
                    <Text style={styles.txtAddress}>{item.hospital.address}</Text>
                    {item.hospital.defaultBookHospital ? <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={this.showDialogError(item)} style={[styles.btnService, { backgroundColor: '#0A9BE1' }]}>
                            <Text style={[styles.txService, { color: '#fff' }]}>{constants.examination_services}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.showDialog(item)} style={[styles.btnService, { width: 62 }, item.hospital.defaultBookHospital ? { backgroundColor: '#0A9BE1' } : { backgroundColor: '#D7D7D9' }]}>
                            <Text style={[styles.txService, { color: '#fff' }]}>{constants.BHYT}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.showGetTicket} style={[styles.btnService, { backgroundColor: '#0A9BE1' }]}>
                            <Text style={[styles.txService, { color: '#fff' }]}>{constants.BHYT_CA}</Text>
                        </TouchableOpacity>
                    </View> :
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity disabled={true} style={[styles.btnService, this.state.service && this.state.service == 1 && this.state.index == item.hospital.id ? { backgroundColor: '#0A9BE1' } : { backgroundColor: '#D7D7D9' }]}>
                                <Text style={[styles.txService, { color: '#6B6B6C' }]}>{constants.examination_services}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={true} style={[styles.btnService, { width: 62 }, item.hospital.defaultBookHospital ? { backgroundColor: '#0A9BE1' } : { backgroundColor: '#D7D7D9' }]}>
                                <Text style={[styles.txService, { color: '#6B6B6C' }]}>{constants.BHYT}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={true} style={[styles.btnService, { backgroundColor: '#D7D7D9' }]}>
                                <Text style={[styles.txService, { color: '#6B6B6C' }]}>{constants.BHYT_CA}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        )
    }
    // shouldComponentUpdate() {
    //     if (this.state.isVisible || this.state.isShowErr) {
    //         return false
    //     }

    //     return true
    // }
    render() {

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.viewTx}>
                    <TextInput
                        value={this.state.keyword}
                        onChangeText={s => {
                            this.setState({ keyword: s })
                        }}
                        onSubmitEditing={this.search.bind(this)}
                        returnKeyType='search'
                        style={{ width: '80%', height: 41, marginLeft: -10, fontWeight: 'bold', paddingLeft: 9 }} placeholder={"Tìm kiếm…"} underlineColorAndroid={"transparent"} />
                    <TouchableOpacity style={{ marginRight: -2 }} onPress={this.search}><ScaledImage source={require('@images/new/hospital/ic_search.png')} height={16}></ScaledImage></TouchableOpacity>
                </View>
                {this.state.dataSearch && this.state.keyword ? (

                    (this.state.dataSearch && this.state.dataSearch.length > 0) &&
                    <View>
                        {this.state.dataSearch.map((item, index) => {
                            return this.renderItem(item, index)
                        })}
                    </View>

                ) : (<ScrollView refreshControl={
                    <RefreshControl
                        onRefresh={this.onRefesh}
                        refreshing={this.state.loading}
                    />
                }
                    showsVerticalScrollIndicator={false}>
                    {
                        (this.state.data2 && this.state.data2.length > 0) &&
                        <View>
                            <Text style={styles.txHospital}>Bệnh viện đã triển khai</Text>
                            {this.state.data2.map((item, index) => {
                                return this.renderItem(item, index)
                            })}
                        </View>
                    }
                    {
                        (this.state.data3 && this.state.data3.length > 0) &&
                        <View>
                            <Text style={styles.txHospital}>Bệnh viện sắp triển khai</Text>
                            {this.state.data3.map((item, index) => {
                                return this.renderItem(item, index)
                            })}
                        </View>
                    }
                </ScrollView>)}
                <ActionSheet
                    title={constants.ehealth.get_ticket}
                    ref={o => this.actionSheetGetTicket = o}
                    options={[constants.ehealth.get_ticket_for_me, constants.ehealth.get_ticket_other, constants.actionSheet.cancel]}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => {
                        switch (index) {
                            case 0:
                                this.props.navigation.navigate("scanQRCode");
                                break;
                            case 1:
                                this.props.navigation.navigate("login", {
                                    nextScreen: { screen: "scanQRCode", param: {} }
                                });
                        }
                    }}
                />
                <ActionSheet
                    title={"Thông báo"}
                    message={constants.ehealth.service_E_not_get_ticket}
                    ref={o => this.actionSheetErr = o}
                    options={[constants.actionSheet.ok]}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={0}
                    onPress={(index) => {
                    }}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    txtAddress: {
        color: '#00000050',
        marginTop: 5
    },
    txtNameHospital: {
        fontWeight: 'bold',
        color: '#000'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txGetTicket: { color: '#fff', fontWeight: 'bold' },
    txAssignTicket: { color: '#4A4A4A', fontWeight: 'bold' },
    viewTx: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', borderTopWidth: 0.5, borderStyle: "solid", borderBottomWidth: 0.5, borderColor: 'rgba(0,0,0,0.26)' },
    viewItem: { padding: 15, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.26)', flexDirection: 'row', borderTopWidth: 1 },
    btnService: { justifyContent: 'center', alignItems: 'center', marginRight: 5, borderRadius: 6, marginVertical: 10, paddingVertical: 5, paddingHorizontal: 12, },
    txService: { fontSize: 11, },
    viewBtnModal: { flexDirection: 'row' },
    viewModal: { flex: 1, justifyContent: 'center', alignItems: 'center', margin: 0, padding: 0 },
    viewDialog: { backgroundColor: '#fff', alignItems: 'center', borderRadius: 6, padding: 20 },
    viewBtn: { width: 120, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: '#0A9BE1', marginRight: 7 },
    txDialog: { marginBottom: 20, color: '#4a4a4a', fontWeight: 'bold', fontSize: 16 },
    viewBtn2: { width: 120, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.06)', marginLeft: 7, borderWidth: 1, borderColor: '#979797' },
    viewImg: { justifyContent: 'center', alignItems: 'center', marginTop: -10 },
    viewAvt: { width: 60, height: 60, borderRadius: 30, borderColor: 'rgba(0,0,0,0.15)', borderWidth: 1 },
    viewRating: { width: 60, marginTop: 5 },
    viewService: { marginHorizontal: 20, flex: 1 },
    txHospital: { marginLeft: 12, marginTop: 20, fontSize: 15, marginBottom: 10, color: '#4a4a4a' },
    viewContents: { width: 328, height: 167, backgroundColor: '#fff', borderRadius: 6, alignItems: 'center' },
    viewNoty: { marginVertical: 10, fontWeight: 'bold', color: '#4a4a4a' },
    TxContents: { marginBottom: 20, color: '#4a4a4a', marginHorizontal: 20, textAlign: 'center', },
    viewLine: { width: '100%', height: 1, backgroundColor: '#d8d8d8', marginTop: 20 },
    btnDone: { alignItems: 'center', justifyContent: 'center', flex: 1 }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(GetNewTicket);