import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { TouchableOpacity } from 'react-native-gesture-handler';
const devices_width = Dimensions.get('window').width
import drugProvider from '@data-access/drug-provider'
import { connect } from "react-redux";

class SelectLocationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLocation: [
                {
                    name: 'Nguyễn Đình Huấn',
                    phone: '0333876555',
                    location: 'Toà nhà Udic Complex Hoàng Đạo Thuý, Trung Hoà, Cầu Giấy, Hà Nội',
                    status: 1
                },
                {
                    name: 'Nguyễn Đình Huấn',
                    phone: '0333876555',
                    location: 'Toà nhà Udic Complex Hoàng Đạo Thuý, Trung Hoà, Cầu Giấy, Hà Nội',
                    status: 0
                },
                {
                    name: 'Nguyễn Đình Huấn',
                    phone: '0333876555',
                    location: 'Toà nhà Udic Complex Hoàng Đạo Thuý, Trung Hoà, Cầu Giấy, Hà Nội',
                    status: 0
                }
            ]
        };
    }
    componentDidMount() {
        this.onGetLocation()
    }
    onGetLocation = () => {
        let id = this.props.userApp.currentUser.id
        let page = 1
        let size = 50
        if (id) {
            drugProvider.getLocation(id, page, size).then(res => {
                console.log(res, 'location')
            }).catch(e => {
                console.log(e)
            })
        }
        ///

    }
    onAdd = () => {
        this.props.navigation.navigate('inputLocation')
    }
    selectLocation(data) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(data);
            this.props.navigation.pop();
        }
    }
    renderStatus = (item) => {
        switch (item.status) {
            case 1: return (
                <Text style={styles.txStatus}>Địa chỉ mặc định</Text>
            )
            default: return (
                <Text></Text>
            )
        }
    }
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={this.selectLocation} style={styles.viewItem}>
                <View style={styles.viewName}><Text style={styles.txName}>{item.name}</Text><TouchableOpacity style={styles.btnDot}><ScaledImage height={15} source={require('@images/new/drug/ic_dot.png')}></ScaledImage></TouchableOpacity></View>
                <Text style={styles.txPhone}>{item.phone}</Text>
                <Text style={styles.txLocation}>{item.location}</Text>
                {this.renderStatus(item)}
            </TouchableOpacity>
        )
    }
    renderFooter = () => {
        return (
            <TouchableOpacity onPress={this.onAdd} style={styles.newLocation}><Text style={styles.newAddress}>Thêm địa chỉ mới</Text><TouchableOpacity style={styles.btnDot}><ScaledImage source={require('@images/new/drug/ic_input.png')} height={12}></ScaledImage></TouchableOpacity></TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <ScaledImage width={devices_width} source={require('@images/new/drug/ic_bg_find_drug.png')}></ScaledImage>
                <FlatList
                    data={this.state.dataLocation}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderFooter}
                ></FlatList>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f1f1f1',
        flex: 1
    },
    viewItem: {
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 10,
    },
    viewName: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    viewPhone: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    txName: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    txPhone: {
        fontSize: 14,
        color: '#808080',
        textAlign: 'left'
    },
    txLocation: {
        fontSize: 14,
        color: '#808080',
        textAlign: 'left',
        maxWidth: '80%'
    },
    txStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF8A00'
    },
    btnDot: {
        padding: 5
    },
    newLocation: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        height: 48
    },
    newAddress: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#33B5FF',
        textAlign: 'left'
    }

})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
    };
}
export default connect(mapStateToProps)(SelectLocationScreen);