import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
class CreateBookingSuccessScreen extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <ActivityPanel
                hideBackButton={true}
                style={styles.AcPanel} title="Đặt lịch khám"
                containerStyle={{
                    backgroundColor: "#02C39A"
                }}
                actionbarStyle={{
                    backgroundColor: '#02C39A'
                }}>
                <View style={styles.container}>
                    <ScrollView style={{ flex: 1 }}>
                        <ScaleImage style={styles.image1} height={80} source={require("@images/new/booking/ic_rating.png")} />
                        <Text style={styles.text1}>Đặt khám thành công!</Text>
                        <View style={{ backgroundColor: '#effbf9' }}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Thời gian:</Text>
                                <Text style={styles.text}>Nguyễn Thị Hằng</Text>
                            </View>

                        </View>
                        <View style={styles.view3}>
                            <Text style={styles.diachi}>Địa chỉ đặt khám: Bệnh viện Đại học Y Hà Nội</Text>
                            <Text style={styles.time}>Thời gian:<Text style={styles.time1}>10h00 sáng - Thứ 5, 06/03/2019</Text></Text>
                            <Text style={styles.sokham}>Số khám: 124 - Thanh toán tại viện</Text>
                        </View>
                        <View style={styles.view2}>
                            <View style={styles.col}>
                                <Text style={styles.col1}>Mã code:</Text>
                                {/* <ScaleImage style={styles.image2} height={71} source={require("@images/new/ic_code.png")} /> */}
                            </View>
                        </View>
                        <View style={styles.view1}>
                            <Text style={styles.text2}>Lịch đặt khám của bạn đã được gửi đi. Vui lòng đến trước hẹn 15 phút để thực hiện các thủ tục khác.</Text>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.btn}><Text style={styles.btntext} onPress={() => {
                        this.props.navigation.pop();
                    }}>Về trang chủ</Text></TouchableOpacity>
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
    thanhngang: {
        textAlign: 'center',
        marginTop: 10,
    },
    image1: {
        alignSelf: 'center',
        marginTop: 30,
    },
    text1: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a"
    },
    text2: {
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#000000",
        textAlign: 'center',
        fontStyle: 'italic'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        opacity: 0.8,
        fontSize: 22,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: "#000000",
        marginTop: 20,
        flex: 1
    },
    text: {
        fontSize: 22,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
    },
    view1: {
        marginTop: 10,
        paddingLeft: 25,
        paddingRight: 25,
    },
    view2: {
        backgroundColor: '#effbf9',
    },
    col1: {
        textAlign: 'center',
        fontWeight: "bold",
        fontSize: 16,
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"
    },
    image2: {
        alignSelf: 'center'
    },
    col: {
        flexDirection: 'column',
        marginTop: 5,
        marginBottom: 15,
    },
    btn: {
        borderRadius: 6,
        backgroundColor: "#02c39a",
        shadowColor: "rgba(0, 0, 0, 0.21)",
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        marginTop: 30,
        marginLeft: 50,
        marginRight: 50,
        marginVertical: 20
    },
    btntext: {
        color: '#ffffff',
        textAlign: 'center',
        padding: 15,
        fontSize: 20
    },
    view3: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
    },
    diachi: {
        textAlign: 'center',
        letterSpacing: 0,
        color: "#000000",
        opacity: 0.7,
    },
    time: {
        textAlign: 'center',
        letterSpacing: 0,
        color: "#000000",
        opacity: 0.7,
        padding: 5
    },
    sokham: {
        textAlign: 'center',
        letterSpacing: 0,
        color: "#000000",
        opacity: 0.7,
    },
    time1: {
        color: '#6a0136',
        fontWeight: 'bold'
    }
})
export default connect(mapStateToProps)(CreateBookingSuccessScreen);