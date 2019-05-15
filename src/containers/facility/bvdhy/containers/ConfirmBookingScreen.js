import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
class ConfirmBookingScreen extends Component {
    constructor() {
        super();
        let serviceType = this.props.navigation.state.params.serviceType;
        let hospital = this.props.navigation.state.params.hospital;
        let profile = this.props.navigation.state.params.profile;
        let specialist = this.props.navigation.state.params.specialist;
        let bookingDate = this.props.navigation.state.params.bookingDate;
        let schedule = this.props.navigation.state.params.schedule;

        this.state = {
            serviceType,
            hospital,
            profile,
            specialist,
            bookingDate,
            schedule
        }
    }


    render() {
        return (
            <ActivityPanel style={styles.AcPanel} title="Đặt Lịch Khám"
                titleStyle={{ marginLeft: 0 }}
                containerStyle={{
                    backgroundColor: "#f7f9fb"
                }} actionbarStyle={{
                    backgroundColor: '#ffffff',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0, 0, 0, 0.06)'
                }}>
                <View style={styles.container}>
                    <View style={styles.view1}>
                        <Text style={styles.title}>Xác Nhận Đặt Khám</Text>
                    </View>

                    <View style={styles.viewDetails}>
                        <View style={styles.view11} >
                            <View style={styles.view2}>
                                <ScaleImage style={styles.ic_Location} height={22} source={require("@images/new/booking/ic_placeholder.png")} />
                                <Text style={styles.text1}>Bệnh viện Đại học Y Hà Nội</Text>
                            </View>

                            <View style={styles.view2}>
                                <Text style={styles.text2}>Địa chỉ: Số 1 Tôn Thất Tùng, Đống Đa, Hà Nội</Text>
                            </View>

                            <View style={styles.view2}>
                                <ScaleImage style={styles.ic_Location} height={23} source={require("@images/new/booking/ic_doctor.png")} />
                                <Text style={styles.text3}>Bác sĩ khám: ThS. Lê Văn Tú</Text>
                            </View>

                            <View style={styles.view2}>
                                <ScaleImage style={styles.ic_Location} height={17} source={require("@images/new/booking/ic_bookingDate.png")} />
                                <Text style={styles.text5}>Thời gian: </Text>
                            </View>
                            <View style={styles.view2}>
                                <Text style={styles.text4}>10h00 sáng-Thứ 5<Text style={styles.text3}> ngày 06/03/2019</Text></Text>
                            </View>

                            <View style={styles.view2}>
                                <ScaleImage style={styles.ic_Location} height={22} source={require("@images/new/booking/ic_coin.png")} />
                                <Text style={styles.text3}>Giá dịch vụ: 120.000đ</Text>
                            </View>

                            <View style={styles.view2}>
                                <ScaleImage style={styles.ic_Location} height={22} source={require("@images/new/booking/ic_note.png")} />
                                <Text style={styles.text3}>Lý do: Tôi khám mắt vì gần đây thấy đau nhiều và đỏ</Text>
                            </View>

                        </View>
                    </View>

                    <Text style={styles.thanhtoan}>Chọn phương thức thanh toán</Text>

                    <View style={styles.ckeck}>
                        {/* <ScaleImage style={styles.ckecked} height={20} source={require("@images/new/ic_ckecked.png")} /> */}
                        <Text style={styles.ckeckthanhtoan}>Ví ISOFHCARE</Text>
                    </View>
                    <View>
                        <Text style={styles.sodu}>Số dư hiện tại: 350.000đ</Text>
                    </View>
                    <View style={styles.ckeck}>
                        {/* <ScaleImage style={styles.ckecked} height={20} source={require("@images/new/unckeck.png")} /> */}
                        <Text style={styles.ckeckthanhtoan}>VNPAY</Text>
                    </View>
                    <View style={styles.ckeck}>
                        {/* <ScaleImage style={styles.ckecked} height={20} source={require("@images/new/unckeck.png")} /> */}
                        <Text style={styles.ckeckthanhtoan}>Thanh toán tại bệnh viện</Text>
                    </View>

                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btntext}>Xác Nhận</Text>
                    </TouchableOpacity>


                </View>
            </ActivityPanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
const styles = StyleSheet.create({
    AcPanel: {
        flex: 1,
        backgroundColor: '#cacaca',
    },
    container: {
        flex: 1,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        backgroundColor: '#fff',


    },
    view1: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    ic_Location: {
        marginHorizontal: 20
    },
    title: {

        fontSize: 22,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        flex: 1,
        textAlign: 'center',
        shadowRadius: 8,
        shadowOpacity: 1
    },
    viewDetails: {
        backgroundColor: "#effbf9",
        marginTop: 12,


    },
    view2: {
        flexDirection: 'row',
        padding: 4,
    },

    text1: {
        opacity: 0.8,

        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        color: "#000000",
        marginLeft: 20,
        flex: 1
    },

    text2: {

        fontSize: 16,
        opacity: 0.8,
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#000000",
        marginLeft: 77,
        width: 280,
    },

    text3: {

        fontSize: 16,
        opacity: 0.8,
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#000000",
        marginLeft: 17,
        width: 280

    },
    text4: {
        color: "#6a0136",
        marginLeft: 77
    },
    text5: {

        fontSize: 16,
        opacity: 0.8,
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#000000",
        marginLeft: 20,
        width: 280
    },
    ckecked: {
        marginTop: 10,
        marginLeft: 25,
    },
    ckeck: {
        flexDirection: 'row'
    },
    btn: {
        backgroundColor: '#02c39a',
        shadowColor: 'rgba(0, 0, 0, 0.21)',
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        borderRadius: 6,
        marginTop: 40,
        marginLeft: 57,
        marginRight: 57,
    },
    btntext: {
        color: "#fff",
        textAlign: 'center',
        padding: 10
    },
    view11: {

        paddingVertical: 20,
    },
    thanhtoan: {
        opacity: 0.54,

        fontSize: 16, fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        marginHorizontal: 30,
        marginTop: 17
    },
    ckeckthanhtoan: {
        opacity: 0.8,

        fontSize: 16, fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        flex: 1, marginTop: 10,
        marginLeft: 10
    },
    sodu: {
        opacity: 0.72,

        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        marginLeft: 55
    }
})
export default connect(mapStateToProps)(ConfirmBookingScreen);