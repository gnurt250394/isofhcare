import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,FlatList } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { Card } from 'native-base';

export default class DetailsDrugScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataShop: [
                {
                    name: 'Nhà thuốc Tấn Minh',
                    location: 'Hoàng Cầu, Đống Đa, Hà Nội',
                    long: '5km'
                },
                {
                    name: 'Nhà thuốc Tấn Minh',
                    location: 'Hoàng Cầu, Đống Đa, Hà Nội',
                    long: '5km'
                },
                {
                    name: 'Nhà thuốc Tấn Minh',
                    location: 'Hoàng Cầu, Đống Đa, Hà Nội',
                    long: '5km'
                }
            ]
        };
    }
    selectLocation = () => {
        this.props.navigation.navigate('selectLocation')
    }
    onClickItem = () => {
        this.props.navigation.navigate('drugStore')
    }
    renderItem = ({ item, index }) => {
        return (
            <View style = {styles.viewItem}>
                <Card style={styles.cardItem}>
                    <TouchableOpacity onPress = {this.onClickItem} style={styles.cardItem}>
                        <ScaledImage height={60} source={require('@images/new/drug/ic_shop_drug.png')}></ScaledImage>
                        <View style = {styles.viewContentItem}>
                            <Text style = {styles.txTitle}>
                                {item.name}
                            </Text>
                            <View style = {styles.viewLocationItem}><Text style={styles.txLocationItem}>{item.location}</Text><View><Text style = {styles.txLong}>{item.long}</Text></View></View>
                        </View>
                    </TouchableOpacity>
                </Card>
            </View>
        )
    }
    renderViewByStatus = () => {
        let status = 3
        switch (status) {
            case 1: return (
                <View style={styles.viewLocation}>
                    <Text style={styles.txLocation}>Nhập địa chỉ của bạn để tìm nhà thuốc gần nhất</Text>
                    <TouchableOpacity onPress={this.selectLocation} style={styles.btnLocation}>
                        <View style={styles.inputLocation}>
                            <ScaledImage source={require('@images/new/drug/ic_location.png')} height={20}></ScaledImage>
                            <Text style={styles.txLabelLocation}>Nhập địa chỉ</Text>
                        </View>
                        <ScaledImage source={require('@images/new/drug/ic_btn_location.png')} height={10}></ScaledImage>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnFind}><Text style={styles.txFind}>Tìm nhà thuốc</Text></TouchableOpacity>

                </View>
            )
            case 2: return (
                <View style={styles.viewLocation}>
                    <Text style={styles.txLocation}>Nhập địa chỉ của bạn để tìm nhà thuốc gần nhất</Text>
                    <TouchableOpacity onPress={this.selectLocation} style={styles.btnLocation}>
                        <View style={styles.inputLocation}>
                            <ScaledImage source={require('@images/new/drug/ic_location.png')} height={20}></ScaledImage>
                            <Text style={styles.txLabelLocation}>Nhập địa chỉ</Text>
                        </View>
                        <ScaledImage source={require('@images/new/drug/ic_btn_location.png')} height={10}></ScaledImage>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnFind}><Text style={styles.txFind}>Tìm nhà thuốc</Text></TouchableOpacity>

                </View>
            )
            case 3: return (
                <View style={styles.viewLocation}>
                    <Text style={styles.txLabel}>Nhà thuốc có bán đơn thuốc của bạn</Text>
                    <TouchableOpacity style={styles.btnViewAddress}><Text style={styles.txViewAddress}>Xem địa chỉ của bạn</Text></TouchableOpacity>
                    <FlatList
                        data={this.state.dataShop}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                    >

                    </FlatList>
                </View>
            )
        }

    }
    render() {
        return (
            <View style={styles.container}>
                <ScaledImage height={100} source={require('@images/new/drug/ic_bg_find_drug.png')}></ScaledImage>
                <View style={styles.viewTitle}>
                    <Text style={styles.txTitle}>Đơn thuốc da liễu BS Huấn</Text>
                    <Text style={styles.txContent}>Ngày tạo: 21/10/2019</Text>
                    <Text><Text style={styles.txContent}>Trạng thái: </Text><Text style={styles.txStatus}>Đã lưu</Text></Text>
                </View>
                <View style={styles.viewImg}>
                    <Text style={styles.txLabel}>Hình ảnh đơn thuốc(5)</Text>
                    <View>
                    </View>
                    <Text style={styles.txLabel}>Ghi chú</Text>
                    <Text style={styles.txContent}>Đơn thuốc uống trong 15 ngày, dừng 7 ngày mới có thể tiếp tục uống lại, kiêng thực phẩm tanh</Text>
                </View>
                {this.renderViewByStatus()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    btnLocation: {
        minHeight: 41,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    inputLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    txLabelLocation: {
        color: '#00A3FF',
        textDecorationLine: 'underline',
        fontSize: 14,
        marginLeft: 10,
        fontStyle: 'italic',
    },
    btnFind: {
        borderRadius: 6,
        alignSelf: 'center',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CBA7',
        paddingHorizontal: 60,
        marginTop: 30
    },
    txFind: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center'
    },
    txLocation: {
        fontSize: 14,
        color: '#000',
        textAlign: 'left',
        fontStyle: 'italic',
    },
    viewLocation: {
        padding: 10,
        marginTop: 10,
        backgroundColor: '#fff',
        flex: 1,
    },
    txLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00BA99',
        fontStyle: 'italic'
    },
    txContent: {
        fontSize: 14,
        color: '#808080',
        textAlign: 'left'
    },
    viewImg: {
        padding: 10, marginTop: 10, backgroundColor: '#fff'
    },
    viewTitle: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 10
    },
    txTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left'
    },
    txStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3161ad'
    },
    txViewAddress: {
        textDecorationLine: 'underline',
        color: '#00A3FF',
        fontSize: 14
    },
    btnViewAddress: {
        padding: 5
    },
    viewItem:{
        flex:1
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#fff',
        padding: 5,
        flex:1
    },
    viewContentItem: {
        padding:5,
        flex:1,
    },
    viewLocationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex:1,
        justifyContent: 'space-between',
    },
    txLocationItem: {
        fontSize: 14,
        textDecorationLine: 'underline',
        color: '#808080',
        textAlign:'left'

    },
    txLong: {
        fontSize: 14,
        color: '#808080',
        textAlign:'right'
    }

})