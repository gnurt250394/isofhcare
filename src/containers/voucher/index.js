import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, ScrollView, RefreshControl } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { IndicatorViewPager } from "mainam-react-native-viewpager";
import { Card } from 'native-base'
import FillMyVocherScreen from './FillMyVoucherScreen';
import MyVoucherCodeScreen from './MyVoucherCodeScreen';
import constants from '@resources/strings';
import Modal from '@components/modal';
import ItemListVoucher from '@components/voucher/ItemListVoucher';
import voucherProvider from '@data-access/voucher-provider'
import snackbar from '@utils/snackbar-utils';

// const data = [
//     {
//         code: "ISOFH1122",
//         counter: 0,
//         created: "2019-10-10T09:28:13.861+0000",
//         deleted: 0,
//         endTime: "2019-10-19 16:27:00",
//         id: 1,
//         price: 10000,
//         quantity: 10,
//         startTime: "2019-10-10 16:27:52",
//         type: 0,
//     },
//     {
//         code: "ISOFH1122",
//         counter: 0,
//         created: "2019-10-10T09:28:13.861+0000",
//         deleted: 0,
//         endTime: "2019-10-19 16:27:00",
//         id: 1,
//         price: 10000,
//         quantity: 10,
//         startTime: "2019-10-10 16:27:52",
//         type: 1,
//         status: true
//     },

// ]
class MyVoucherScreen extends Component {
    constructor(props) {
        super(props);
        let tabIndex = 0;
        let voucherSelected = this.props.navigation.getParam('voucher', {})
        let booking = this.props.navigation.getParam('booking', null)
        let selectTab = this.props.navigation.getParam('selectTab', null)
        if (selectTab)
            tabIndex = selectTab;
        this.state = {
            isMyVocher: true,
            tabIndex,
            refreshing: true,
            page: 1,
            size: 10,
            data: [],
            voucherSelected,
            booking,
            keyword: ''
        };
    }


    listEmpty = () => {
        console.log(this.state.refreshing, this.state.voucherSelected, this.state.data.length)
        if (!this.state.refreshing && !Object.keys(this.state.voucherSelected).length && !this.state.data.length) {
            return (
                <Text style={styles.none_data}>{constants.not_found}</Text>
            )
        }
    }
    comfirmVoucher = (item, index) => () => {
        const { voucherSelected, data } = this.state
        if (voucherSelected && voucherSelected.code && data[index].id == voucherSelected.id) {
            let onSelected = ((this.props.navigation.state || {}).params || {}).onSelected;
            if (onSelected) onSelected({})
            this.props.navigation.pop()
            return
        }
        item.status = true
        let onSelected = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (onSelected) onSelected(item)
        this.props.navigation.pop()
    }

    onSearchVoucher = () => {
        this.setState({ isLoading: true }, () => {
            let { booking } = this.state


            let voucher = this.state.keyword || ""
            let idHospital = booking.hospital.id

            if (voucher == "") {
                this.setState({ isLoading: false })
                snackbar.show(constants.voucher.voucher_not_null, "danger")
                return
            }
            voucherProvider.fillInVoucher(voucher.toUpperCase()).then(res => {
                this.setState({ isLoading: false });

                if (res.code == 0 && res.data) {
                    let hospitalVoucher = res.data.hospitalId
                    if (hospitalVoucher == idHospital || hospitalVoucher == 0) {
                        if (this.state.voucherSelected && res.data.id == this.state.voucherSelected.id) {

                            let onSelected = ((this.props.navigation.state || {}).params || {}).onSelected;
                            if (onSelected) onSelected({})
                            this.props.navigation.pop()
                        } else {
                            let data = res.data
                            data.status = true
                            data.active = true
                            let onSelected = ((this.props.navigation.state || {}).params || {}).onSelected;
                            if (onSelected) onSelected(data)
                            this.props.navigation.pop()
                        }
                    } else {
                        snackbar.show(constants.voucher.voucher_not_avalrible, "danger")
                    }
                } else {
                    snackbar.show(constants.voucher.voucher_not_found_or_expired, "danger")

                }
            }).catch(err => {
                this.setState({ isLoading: false })

            })
        }
        )
    }
    onRefresh = () => this.setState({ refreshing: true }, this.getListVoucher)
    duplicateArray(arr) {
        var obj = {}
        var result = [];
        let newArr = [...arr]
        newArr.forEach((item) => {
            var id = item["id"];
            if (obj[id]) {
                obj[id].count++;
            } else {
                obj[id] = {
                    count: 1,
                    ...item
                }
                result.push(obj[id]);
            }
        });
        return result
    }
    getListVoucher = () => {
        voucherProvider.getListVoucher().then(res => {

            switch (res.code) {
                case 0:
                    let { booking } = this.state

                    let idHospital = booking && booking.hospital && booking.hospital.id ? booking.hospital.id : null

                    let { voucherSelected } = this.state

                    let data = res.data
                    let arr = this.duplicateArray(data)
                    arr.forEach(item => {
                        if (item.hospitalId == idHospital || item.hospitalId == 0) {
                            item.active = true
                        }
                    })
                    if (voucherSelected && voucherSelected.code) {
                        arr.forEach(e => {
                            if (e.id == voucherSelected.id) {
                                e.status = voucherSelected.status
                            }

                        })
                    }

                    this.setState({ refreshing: false, data: arr })
                    break;
                default: this.setState({ refreshing: false })
                    break;
            }
        }).catch(err => {

            this.setState({ refreshing: false })
        })

    }

    componentDidMount = () => {
        this.getListVoucher()
    };
    keyExtractor = (item, index) => `${item.id || index}`
    _renderItem = ({ item, index }) => {
        return (
            <ItemListVoucher
                active={item.active}
                item={item}
                onPress={this.comfirmVoucher(item, index)}
                onPressLater={this.onPressLater}
            />
        )
    }
    onChangeText = (keyword) => {
        this.setState({ keyword })
    }
    unSelectedVoucher = () => {
        let onSelected = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (onSelected) onSelected({})
        this.props.navigation.pop()
    }
    render() {
        const { keyword, voucherSelected } = this.state
        return (
            <ActivityPanel
                // containerStyle={{ backgroundColor: '#eee' }}
                title={constants.title.voucher}
                transparent={true}
                useCard={true}
                showFullScreen={true} isLoading={this.state.isLoading}>
                <View style={styles.container}>
                    <View style={styles.containerSearch}>
                        <TextInput style={styles.input}
                            placeholder="Nhập mã ưu đãi"
                            value={keyword}
                            placeholderTextColor="#999"
                            onChangeText={this.onChangeText}
                        />
                        <TouchableOpacity
                            onPress={this.onSearchVoucher}
                            style={styles.buttonSearch}>
                            <Text style={styles.txtSearch}>Áp dụng</Text>
                        </TouchableOpacity>

                    </View>


                    <Text style={styles.txtHeader}>Tất cả ưu đãi</Text>
                    <ScrollView
                        refreshControl={<RefreshControl
                            onRefresh={this.onRefresh}
                            refreshing={this.state.refreshing}
                        />}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={false}>
                        <View>
                            {voucherSelected && voucherSelected.type == 2 && <ItemListVoucher active={this.state.voucherSelected.active} item={this.state.voucherSelected} onPress={this.unSelectedVoucher} />}

                            <FlatList
                                data={this.state.data}
                                renderItem={this._renderItem}
                                keyExtractor={this.keyExtractor}
                                showsVerticalScrollIndicator={false}
                            // ListEmptyComponent={this.listEmpty}
                            />
                            {this.listEmpty()}
                        </View>
                    </ScrollView>
                </View>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    txtHeader: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        paddingTop: 15,
        paddingBottom: 8,
    },
    txtSearch: {
        color: '#fff',
        fontWeight: 'bold'
    },
    buttonSearch: {
        backgroundColor: '#00CBA7',
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        height: 42
    },
    input: {
        height: 42,
        backgroundColor: '#F8F8F8',
        borderWidth: 0.7,
        borderColor: '#555',
        borderRadius: 7,
        paddingLeft: 8,
        flex: 1,
        color: '#000'
    },
    containerSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        // backgroundColor: '#fff',
    },
    headerAbsolute: {
        backgroundColor: '#27c8ad',
        height: 130,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    none_data: {
        fontStyle: 'italic',
        marginTop: 30,
        alignSelf: 'center',
        fontSize: 16
    },
    buttonSelected: { backgroundColor: '#27AE60' },
    selected: {
        color: '#27AE60',
        fontWeight: "bold",
        textAlign: 'center'
    },
    unSelected: {
        color: '#fff',
        fontWeight: "bold",
        textAlign: 'center'
    },
    viewBtn: {
        flexDirection: 'row',
        height: 40,
        margin: 10,
        borderRadius: 6,
        backgroundColor: "#ffffff",
        position: 'relative'
    },
    separateBackground: {
        borderColor: "#27ae60",
        borderWidth: 1,
        borderRadius: 6,
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0
    },
    btnGetNumber: {
        paddingVertical: 8,
        paddingTop: 10,
        flex: 1,
        borderRadius: 6,
        overflow: 'hidden'
    },
    viewPopup: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        paddingVertical: 40,
        borderRadius: 5
    },
    txNotifi: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        marginHorizontal: 40
    },
    btnDone: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: 78,
        backgroundColor: '#359A60',
        borderRadius: 5,
    },
    btnReject: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: 78,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: '#FFB800',
    },
})
export default MyVoucherScreen;
