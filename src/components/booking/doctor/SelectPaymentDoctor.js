import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import ScaleImage from "mainam-react-native-scaleimage";

class SelectPaymentDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentMethod: 2
        };
    }
    selectPaymentMethod = (paymentMethod) => () => {
        this.setState({ paymentMethod })
    }
    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <View style={styles.header}>
                    <Text style={styles.txtHeader}>CHỌN PHƯƠNG THỨC THANH TOÁN</Text>
                    <ScaleImage width={20} source={require("@images/new/booking/ic_tick.png")} />
                </View>

                <React.Fragment>
                    <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentMethod(1)}>
                        <View style={styles.containerPayment}>
                            {this.state.paymentMethod == 1 &&
                                <View style={styles.dot}></View>
                            }
                        </View>
                        <Text style={styles.ckeckthanhtoan}>VNPAY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentMethod(3)}>
                        <View style={styles.containerPayment}>
                            {this.state.paymentMethod == 3 &&
                                <View style={styles.dot}></View>
                            }
                        </View>
                        <Text style={styles.ckeckthanhtoan}>PAYOO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentMethod(5)}>
                        <View style={styles.containerPayment}>
                            {this.state.paymentMethod == 5 &&
                                <View style={styles.dot}></View>
                            }
                        </View>
                        <Text style={styles.ckeckthanhtoan}>PAYOO - Trả góp 0%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentMethod(4)}>
                        <View style={styles.containerPayment}>
                            {this.state.paymentMethod == 4 &&
                                <View style={styles.dot}></View>
                            }
                        </View>
                        <Text style={styles.ckeckthanhtoan}>PAYOO - Cửa hàng tiện ích</Text>
                    </TouchableOpacity>
                </React.Fragment>
                <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentMethod(2)}>
                    <View style={styles.containerPayment}>
                        {this.state.paymentMethod == 2 &&
                            <View style={styles.dot}></View>
                        }
                    </View>
                    <Text style={styles.ckeckthanhtoan}>Thanh toán sau tại CSYT</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dot: { backgroundColor: 'rgb(2,195,154)', width: 10, height: 10, borderRadius: 5 },
    containerPayment: { width: 20, height: 20, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgb(2,195,154)' },
    txtHeader: { fontWeight: 'bold', color: 'rgb(2,195,154)', marginRight: 10 },
    header: { paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center' },
    ckeckthanhtoan: {
        opacity: 0.8,
        fontSize: 16, fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        flex: 1,
        marginLeft: 10
    },
    ckeck: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 20
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
    },
});
export default SelectPaymentDoctor;
