import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import bookingProvider from '@data-access/booking-provider';
import ScaledImage from 'mainam-react-native-scaleimage';
export default class TicketHistory extends Component {
    state = {
        data: [],
        loading:true
    }
    componentDidMount(){
      this.onRefresh()
    }
    onRefresh = () => {
        this.setState({
            loading:true
        },() =>{
            this.onGetList()
        })
    }
    onGetList = () => {
        bookingProvider.getHistoryTicket().then(res => {
            console.log(res);
            this.setState({
                data:res.data.numberHospital,
                loading:false
            })
        }).catch(err => {
            this.setState({
                loading:false
            })
        })
    }
    renderItems = (item) => {
        return (
            <TouchableOpacity style={styles.itemView}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, alignItems: 'center', borderBottomColor: "rgba(0, 0, 0, 0.06)", paddingVertical: 5, paddingHorizontal: 10
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ textAlign: 'left', fontWeight: 'bold', color: '#000000', fontSize: 14 }}>Mai ngọc nam</Text>
                        <ScaledImage style={{ marginLeft: 10, }} height={18} source={require("@images/new/ticket/ic_verified.png")} ></ScaledImage>
                    </View>
                    <TouchableOpacity style={{ borderRadius: 12, backgroundColor: '#0A9BE1', paddingVertical: 3, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 14 }}>Số khám: 69</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 / 4, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                        <ScaledImage style={{ borderRadius: 30, height: 60, width: 60, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.06)' }} source={{ uri: 'https://congly.vn/data/news/2018/8/21/41/ngoc-trinh-khoe-ve-dep-van-nguoi-me-tai-ha-noi-hinh-anh0378168001.jpg' }}></ScaledImage>
                        <Text style={{ fontWeight: 'bold', color: '#27AE60', marginTop: 5 }}> 6969</Text>
                    </View>
                    <View style={{ justifyContent: 'center', padding: 10, flex: 3 / 4 }}>
                        <Text style={{ fontSize: 14 }}>BỆNH VIỆN E TRUNG ƯƠNG</Text>
                        <Text style={{ fontSize: 14, marginTop: 5 }}>SĐT:<Text style={{ color: '#F05673', fontWeight: 'bold' }}> 0123456789</Text></Text>
                        <Text style={{ fontSize: 14, marginTop: 5 }}>Ngày sinh:<Text style={{ fontWeight: 'bold', color: '#4A4A4A' }}> 08/12/1998</Text></Text>
                        <Text numberOfLines={2} style={{ fontSize: 14, marginTop: 5 }}>Địa chỉ: {'418 Phạm Văn Đồng, Mai Dịch, Cầu Giấy, Hà Nội…'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={{ padding: 10 }}>
                <Text>Hôm nay</Text>
                <FlatList
                refreshing
                onRefresh  = {this.onRefresh}
                refreshing = {this.state.loading}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItems}
                ></FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    AcPanel: {
        flex: 1,
        backgroundColor: '#cacaca',
    },
    itemView: {
        borderRadius: 6,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(39, 174, 96, 0.42)",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 6,
        shadowOpacity: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#27ae60",
        marginVertical: 10
    }
})