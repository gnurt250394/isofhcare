import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import stringUtils from 'mainam-react-native-string-utils';
class PaymentBookingErrorScreen extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        console.log(this.props.navigation.state.params)
        let booking = (this.props.navigation.state.params || {}).booking;
        if (!booking)
            return null;
        return (
            <ActivityPanel
                // hideBackButton={true}
                style={styles.AcPanel} title="Đặt khám"
                titleStyle={{ color: '#FFF' }}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#02C39A"
                containerStyle={{
                    backgroundColor: "#02C39A"
                }}
                actionbarStyle={{
                    backgroundColor: '#02C39A'
                }}
            >
                <View style={styles.container}>
                    <ScrollView>
                        <ScaleImage style={styles.image1} height={68} source={require("@images/new/ic_failed.png")} />
                        <Text style={styles.text1}>Thanh toán không thành công!</Text>
                        <Text style={styles.text6}>Chúng tôi gặp khó khăn trong quá trình kết nối với đối tác. Vui lòng gọi tới số hotline 0923678905 nếu như bạn đã bị trừ tiền.</Text>

                        <View style={styles.view2}>
                            {
                                booking.transactionCode &&
                                <View style={styles.colt}>
                                    <Text style={styles.col1}>Mã giao dịch:</Text>
                                    <Text style={styles.col2}>{booking.transactionCode}</Text>
                                </View>
                            }
                            <View style={styles.colb}>
                                <Text style={styles.col1}>Dịch vụ:</Text>
                                <Text style={styles.col2}>{booking.service.name}</Text>
                            </View>
                            <View style={styles.colb}>
                                <Text style={styles.col1}>Số tiền thanh toán:</Text>
                                <Text style={styles.col2}>{booking.service.price.formatPrice()} đ</Text>
                            </View>
                        </View>

                    </ScrollView>
                    <TouchableOpacity style={styles.button}><Text style={styles.btntext} onPress={() => { this.props.navigation.pop() }}>Đổi phương thức thanh toán</Text></TouchableOpacity>
                </View>
            </ActivityPanel >
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

    image1: {
        alignSelf: 'center',
        marginTop: 40,
    },
    text1: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#6a0136"
    },
    text5: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold'
    },
    view2: {
        padding: 20,
        backgroundColor: '#f8f3f5',
        marginTop: 80,
    },
    col1: {
        fontSize: 15,
        padding: 5
    },
    col: {
        flexDirection: 'row',
    },
    colt: {
        marginTop: 10,
        flexDirection: 'row'
    },
    colb: {
        marginBottom: 10,
        flexDirection: 'row'
    },
    col2: {
        textAlign: 'right',
        flex: 1,
        padding: 5,
        fontSize: 15,
        fontWeight: 'bold',
        fontStyle: "normal",
        color: '#000000',
        opacity: 0.8,
    },
    text6: {
        opacity: 0.8,
        fontSize: 16,
        lineHeight: 23,
        fontWeight: "normal",
        fontStyle: "italic",
        letterSpacing: 0,
        color: "#000000",
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 30,
    },
    button: {
        borderRadius: 6,
        backgroundColor: "#02c39a",
        shadowColor: "rgba(0, 0, 0, 0.21)",
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        width: 250,
        marginVertical: 20,
        alignSelf: 'center'
    },
    btntext: {
        fontSize: 15,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#ffffff",
        padding: 15,
        textAlign: 'center'
    }
})
export default connect(mapStateToProps)(PaymentBookingErrorScreen);