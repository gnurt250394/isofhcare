import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';
export default class GetHistoryNumber extends Component {
    state = {
        data: [
            {
                name: 'Mai ngọc nam',
                number: 69,
                hospital: 'Bệnh viện E trung ương',
                phone: 755443354,
                date: '08/12/1978',
                location: '418 Phạm Văn Đồng, Mai Dịch, Cầu Giấy, Hà Nội…',
                image: 'https://congly.vn/data/news/2018/8/21/41/ngoc-trinh-khoe-ve-dep-van-nguoi-me-tai-ha-noi-hinh-anh0378168001.jpg',
                id: '2222212'
            }
        ]
    }
    renderItems = (item) => {
        return (
            <TouchableOpacity style={styles.itemView}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, alignItems: 'center', borderBottomColor: "rgba(0, 0, 0, 0.06)", paddingVertical: 5, paddingHorizontal: 10
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ textAlign: 'left', fontWeight: 'bold', color: '#000000', fontSize: 14 }}>{item.item.name}</Text>
                        <ScaledImage style={{ marginLeft: 10, }} height={18} source={require("@images/new/profile/ic_tick.png")} ></ScaledImage>
                    </View>
                    <TouchableOpacity style={{ borderRadius: 12, backgroundColor: '#0A9BE1', paddingVertical: 2, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 11 }}>Số khám: {item.item.number}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 / 4, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                        <ScaledImage style={{ borderRadius: 30, height: 60, width: 60, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.06)' }} source={{ uri: item.item.image}}></ScaledImage>
                        <Text style={{ fontWeight: 'bold', color: '#27AE60', marginTop: 5 }}>1231243</Text>
                    </View>
                    <View style={{ justifyContent: 'center', padding: 10, flex: 3 / 4 }}>
                        <Text style={{ fontSize: 13 }}>BỆNH VIỆN E TRUNG ƯƠNG</Text>
                        <Text style={{ fontSize: 13 }}>SĐT:<Text style={{ color: '#F05673',fontWeight:'bold' }}> 0123456789</Text></Text>
                        <Text>Ngày sinh:<Text style={{ fontWeight: 'bold', color: '#4A4A4A' }}> 08/12/1998</Text></Text>
                        <Text>Địa chỉ: {'418 Phạm Văn Đồng, Mai Dịch, Cầu Giấy, Hà Nội…'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={{padding:10}}>
            <Text>Hôm nay</Text>
                <FlatList
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
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgb(2,195,154)',
        borderRadius: 5,
        marginVertical:10
    }
})