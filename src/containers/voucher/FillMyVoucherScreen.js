import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, ScrollView, ImageBackground } from 'react-native';
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';
import constants from "../../res/strings";
import LinearGradient from 'react-native-linear-gradient'
import Field from "mainam-react-native-form-validate/Field";
import Form from "mainam-react-native-form-validate/Form";
import voucherProvider from '@data-access/voucher-provider'
import snackbar from '@utils/snackbar-utils';
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'

class FillMyVocherScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voucher: '',
            item: {},
            isVisible: false
        };
    }
    onChangeText = (s) => {
        if (s) {
            this.setState({ isVisible: true })
        }
        this.setState({ voucher: s })
    }

    checkVoucher = () => {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        let confirm = () => {

            let booking = this.props.booking
            let services = booking && booking.services ? booking.services : []
            let priceServices = services.reduce((total, item) => {
                return total + parseInt(item.price)
            }, 0)
            let voucher = this.state.voucher || ""
            voucherProvider.fillInVoucher(voucher.toUpperCase()).then(res => {
                if (this.props.parrent) {
                    this.props.parrent.setState({ isLoading: false });
                }

                if (res.code == 0 && res.data) {
                    if (this.props.voucher && res.data.id == this.props.voucher.id) {
                        this.setState({ isVisible: false })

                    } else {
                        this.setState({ item: res.data, isVisible: false })
                    }
                } else {
                    snackbar.show(constants.voucher.voucher_not_found_or_expired, "danger")

                }
            }).catch(err => {
                if (this.props.parrent)
                    this.props.parrent.setState({ isLoading: false })


            })
        }

        if (this.props.parrent)
            this.props.parrent.setState({ isLoading: true }, () => {
                confirm();
            })
        else
            confirm();

    }
    onClickLater = () => {
        this.props.onPress && this.props.onPress({})
    }
    confirmVoucher = () => {
        let booking = this.state.booking
        let idBooking = booking && booking.id ? booking.id : null
        let item = this.state.item || {}

        this.props.onPress && this.props.onPress(item)
    }
    defaultImage = () => {
        const icSupport = require("@images/new/user.png");
        return (
            <ScaleImage source={icSupport} width={100} />
        );
    }
    render() {
        const icSupport = require("@images/new/user.png");
        const { item, isVisible } = this.state
        const { voucher } = this.props

        return (
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <View style={styles.flex}>
                        <Form ref={ref => (this.form = ref)}>
                            <TextField
                                onChangeText={this.onChangeText}
                                inputStyle={styles.inputVoucher}
                                errorStyle={styles.errorStyle}
                                validate={{
                                    rules: {
                                        required: true,
                                    },
                                    messages: {
                                        required: constants.voucher.voucher_not_null,
                                    }
                                }}
                                placeholder={'Nhập mã ưu đãi'}
                                autoCapitalize={"none"}
                            />
                        </Form>
                        {isVisible ?
                            <LinearGradient
                                colors={['rgb(255, 214, 51)', 'rgb(204, 163, 0)', 'rgb(179, 143, 0)']}
                                locations={[0, 0.7, 1]}
                                style={styles.containerButton}>
                                <TouchableOpacity
                                    onPress={this.checkVoucher}
                                    style={styles.button}
                                >
                                    <Text style={styles.txtButtonConfirm}>{constants.actionSheet.confirm.toUpperCase()}</Text>
                                </TouchableOpacity>
                            </LinearGradient> :
                            <View
                                style={styles.containerButton}
                            />
                        }

                    </View>

                    {(item && item.code) &&
                        <View style={styles.container2}>
                            <Card style={styles.containerItem} >
                                <ImageBackground source={require('@images/new/profile/img_cover_profile.png')} style={styles.containerImageBackground}
                                    imageStyle={{ borderRadius: 5 }}
                                >
                                    <View style={styles.flex}>
                                        <Text numberOfLines={2}
                                            style={[styles.containerText, styles.txtPriceVoucher]}>GIẢM <Text style={{ fontStyle: 'italic' }}>{item.price.formatPrice()}đ</Text> KHI ĐẶT KHÁM</Text>
                                        <Text style={styles.containerText}>{`HẠN SỬ DỤNG ĐẾN ${item.endTime.toDateObject('-').format("HH:mm, dd/MM/yyyy")}`}</Text>
                                        <View style={styles.containerRow}>
                                            <Text numberOfLines={1} style={styles.quality}>{`CÒN ${item.quantity} LẦN`}</Text>
                                            <LinearGradient
                                                colors={['rgb(255, 214, 51)', 'rgb(204, 163, 0)', 'rgb(179, 143, 0)']}
                                                locations={[0, 0.7, 1]}
                                                style={styles.btn}>
                                                <TouchableOpacity
                                                    onPress={this.confirmVoucher}
                                                    style={[styles.button]}
                                                >
                                                    <Text style={styles.txtButton}>{constants.voucher.use_now}</Text>
                                                </TouchableOpacity>
                                            </LinearGradient>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </Card>
                        </View>
                    }
                    {(voucher && voucher.code && (voucher.type == 2)) &&
                        <View style={styles.container2}>
                            <Card style={styles.containerItem} >
                                <ImageBackground source={require('@images/new/profile/img_cover_profile.png')} style={styles.containerImageBackground}
                                    imageStyle={{ borderRadius: 5 }}
                                >
                                    <View style={styles.flex}>
                                        <Text numberOfLines={2}
                                            style={[styles.containerText, styles.txtPriceVoucher]}>GIẢM <Text style={{ fontStyle: 'italic' }}>{voucher.price.formatPrice()}đ</Text> KHI ĐẶT KHÁM</Text>
                                        <Text style={styles.containerText}>{`HẠN SỬ DỤNG ĐẾN ${voucher.endTime.toDateObject('-').format("HH:mm, dd/MM/yyyy")}`}</Text>
                                        <View style={styles.containerRow}>
                                            <Text numberOfLines={1} style={styles.quality}>{`CÒN ${voucher.quantity} LẦN`}</Text>
                                            <LinearGradient
                                                colors={['rgba(230, 51, 51, 0.70)', 'rgba(230, 51, 51, 0.90)', 'rgba(230, 51, 51, 1)']}
                                                locations={[0, 0.7, 1]}
                                                style={styles.btn}>
                                                <TouchableOpacity
                                                    onPress={this.onClickLater}
                                                    style={[styles.button]}
                                                >
                                                    <Text style={styles.txtButton}>DÙNG SAU</Text>
                                                </TouchableOpacity>
                                            </LinearGradient>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </Card>
                        </View>
                    }

                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    txtPriceVoucher: { fontWeight: 'bold', fontSize: 16, color: '#005CAA' },
    containerImageBackground: {
        width: null,
        height: null,
        flex: 1,
        padding: 15,
        paddingTop: 20
    },
    containerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingLeft: 4
    },
    customImagePlace: {
        height: 100,
        width: 100,
        borderRadius: 50
    },
    styleImgLoad: {
        width: 100,
        height: 100,
        paddingRight: 5
    },
    containerItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // padding: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF'
    },
    flex: {
        flex: 1
    },
    groupPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        flexWrap: 'wrap',
        flexShrink: 2
    },
    groupInfo: {
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1
    },
    titleInfoVoucher: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 10
    },
    container2: {
        padding: 10,
        marginTop: 15,
        flex: 2,
    },
    txtTitle: {
        fontSize: 15,
        color: '#111',
        paddingVertical: 5
    },
    button: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        paddingTop: 10
    },
    txtButtonConfirm: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    errorStyle: {
        color: "red",
        marginTop: 10,
        alignSelf: 'center'
    },
    container: {
        flex: 1,
        paddingTop: '10%'
    },
    inputVoucher: {
        width: '70%',
        height: 43,
        alignSelf: 'center',
        borderColor: '#111111',
        borderWidth: 0.7,
        backgroundColor: '#f2f2f2',
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 5,
        fontWeight: 'bold',
        color: '#27AE60',
    },
    containerButton: {
        height: 43,
        width: 140,
        alignSelf: 'center',
        borderRadius: 8,
        marginTop: 25,
        marginBottom: 5
    },


    txtButton: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
        textAlign: 'center'
    },
    quality: {
        color: '#005CAA',
        fontWeight: '500',
    },
    btn: {
        // backgroundColor: '#27AE60',
        height: 38,
        borderRadius: 7,
    },


    containerText: {
        padding: 4,
        // backgroundColor: '#FFFFFF',
        // width: '100%',
        marginBottom: 7,
        // color: '#27AE60'
        color: '#FF0000',
    },





});
export default FillMyVocherScreen;
