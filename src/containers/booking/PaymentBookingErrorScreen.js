import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import stringUtils from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import dateUtils from 'mainam-react-native-date-utils';

class PaymentBookingErrorScreen extends Component {
    constructor(props) {
        super(props)
    }

    renderVnPayDate(vnPayDate) {
        let year = vnPayDate.substring(0, 4)
        let month = vnPayDate.substring(4, 6)
        let day = vnPayDate.substring(6, 8)
        let hours = vnPayDate.substring(8, 10)
        let minutes = vnPayDate.substring(10, 12)
        let secons = vnPayDate.substring(12, 14)
        return `${day}/${month}/${year} ${hours}:${minutes}:${secons}`

    }
    getPriceSecive = (service, voucher) => {
        let priceVoucher = voucher && voucher.price ? voucher.price : 0
        let priceFinal = service.reduce((start, item) => {
            return start + parseInt(item.service.price)
        }, 0)
        return (priceFinal - priceVoucher).formatPrice()
    }
    render() {
        console.log(this.props.navigation.state.params)
        let booking = (this.props.navigation.state.params || {}).booking;
        if (!booking)
            return null;
        let service = this.props.navigation.state.params.service || [];
        let voucher = this.props.navigation.state.params.voucher || {};

        return (
            <ActivityPanel
                // hideBackButton={true}
                style={styles.AcPanel} title={constants.title.booking}
                titleStyle={styles.colorWhite}


                containerStyle={styles.colorGreen}
                actionbarStyle={styles.colorGreen}
            >
                <View style={styles.container}>
                    <ScrollView>
                        <ScaleImage style={styles.image1} height={68} source={require("@images/new/ic_failed.png")} />
                        <Text style={styles.text1}>{constants.booking.payment_error}</Text>
                        <Text style={styles.text6}>{constants.booking.payment_error_message}</Text>

                        <View style={styles.view2}>
                            {
                                booking.payment == 1 ?
                                    <View>
                                        <View style={styles.colt}>
                                            <Text style={styles.col1}>{constants.booking.payment_vnpay_no}</Text>
                                            <Text style={styles.col2}>{booking.transactionCode}</Text>
                                        </View>
                                        <View style={styles.colt}>
                                            <Text style={styles.col1}>{constants.booking.payment_vnpay_date}</Text>
                                            <Text style={styles.col2}>{this.renderVnPayDate(booking.vnPayDate)}</Text>
                                        </View>
                                    </View> :
                                    booking.transactionCode &&
                                    <View style={styles.colt}>
                                        <Text style={styles.col1}>{constants.booking.payment_code}</Text>
                                        <Text style={styles.col2}>{booking.transactionCode}</Text>
                                    </View>
                            }
                            {
                                booking.reasonError &&
                                <View style={styles.colt}>
                                    <Text style={styles.col1}>{constants.booking.payment_error}</Text>
                                    <Text style={styles.col2}>{booking.reasonError}</Text>
                                </View>
                            }
                            {
                                service && service.length ?
                                    <View style={styles.colt}>
                                        <Text style={styles.col1}>{constants.booking.sum_price}:</Text>
                                        <Text style={[styles.col2, { color: "#d0021b" }]}>{booking.amountError ? booking.amountError : this.getPriceSecive(service, voucher)}đ</Text>
                                    </View> : null
                            }


                        </View>

                    </ScrollView>
                    <TouchableOpacity style={styles.button}><Text style={styles.btntext} onPress={() => { this.props.navigation.pop() }}>{constants.booking.change_payment_method}</Text></TouchableOpacity>
                </View>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
const styles = StyleSheet.create({
    colorGreen: {
        backgroundColor: "#02C39A"
    },
    colorWhite: { color: '#FFF' },
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