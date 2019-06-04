import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';

export default class SelectProfileMedical extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    renderItems = () => {
        return (
            <TouchableOpacity style={styles.itemView}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, alignItems: 'center', borderBottomColor: "rgba(0, 0, 0, 0.06)", paddingVertical: 5, paddingHorizontal: 10
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ textAlign: 'left', fontWeight: 'bold', color: '#000000', fontSize: 14 }}>MAI NGỌC NAM</Text>
                        <ScaledImage style={{ marginLeft: 10, }} height={18} source={require("@images/new/profile/ic_tick.png")} ></ScaledImage>
                    </View>
                    <TouchableOpacity style={{ borderRadius: 12, backgroundColor: '#27AE60', paddingVertical: 2, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 11 }}>Chọn hồ sơ</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 / 4, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                        <ScaledImage style={{ borderRadius: 30, height: 60, width: 60, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.06)' }} source={{ uri: 'https://kenh14cdn.com/2018/9/25/hnn6110-15378732210561772501979.jpg' }}></ScaledImage>
                        <Text style={{ fontWeight: 'bold', color: '#27AE60', marginTop: 5 }}>1231243</Text>
                    </View>
                    <View style={{ justifyContent: 'center', padding: 10, flex: 3 / 4 }}>
                        <Text style={{ fontSize: 13 }}>BỆNH VIỆN E TRUNG ƯƠNG</Text>
                        <Text style={{ fontSize: 13 }}>SĐT:<Text style={{ color: '#F05673' }}> 0123456789</Text></Text>
                        <Text>Ngày sinh:<Text style={{ fontWeight: 'bold', color: '#4A4A4A' }}> 08/12/1998</Text></Text>
                        <Text>Địa chỉ: {'418 Phạm Văn Đồng, Mai Dịch, Cầu Giấy, Hà Nội…'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <ActivityPanel
                title="Hồ sơ bệnh viện E"
                titleStyle={{ marginRight: -10 }}
                menuButton={
                    <Text style={{ marginRight: 10, color: '#0A7FFE' }}>Tạo mới</Text>
                }
            >
                <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ textAlign: 'center', marginVertical: 20 }}> Chọn hồ sơ bạn muốn lấy số </Text>
                    <Text>Của tôi:</Text>
                    {this.renderItems()}
                </View>
            </ActivityPanel>
        );
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
        marginVertical: 10
    }
})