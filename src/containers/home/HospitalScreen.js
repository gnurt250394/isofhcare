import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions,TouchableOpacity } from 'react-native';
import hospitalProvider from '@data-access/hospital-provider'
import HospitalItem from '@components/hospital/HospitalItem'
import HeaderLine from '@components/home/HeaderLine'
import Actionbar from '@components/home/Actionbar';
import NavigationService from "@navigators/NavigationService";

export default class HospitalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: []
        }
    }
    componentDidMount() {
        this.getList()
    }
    getList = () => {
        hospitalProvider.getListTopRateHospital().then(res => {
            this.setState({
                listData: res
            })
        }).catch(err => {
            console.log(err)
        })
    }
    getWidth = () => {
        let width = Dimensions.get("window").width;
        return width / 2 - 10;
    }
    renderItem = (item) => {
        return (
            <HospitalItem widthImg={this.getWidth()} index={item.index} item={item.item}></HospitalItem>
        )
    }
    render() {
        return (
            <View style={styles.container}
            >
                <Actionbar />
                <HeaderLine onPress={this.onShowInfo} isShowViewAll={false} title={'PHÒNG KHÁM, BỆNH VIỆN HÀNG ĐẦU'} />
                <View style={styles.viewFlatList}>
                    <FlatList
                        style={{ flex: 1 }}
                        data={this.state.listData}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        numColumns={2}
                        renderItem={this.renderItem}
                        // ListFooterComponent={() =>
                        //     <View style={{ height: 200 }}>

                        //     </View>
                        // }
                        showsVerticalScrollIndicator={false}

                    >

                    </FlatList>
                </View>
            <View style={styles.viewBtn}>
                <TouchableOpacity onPress = {() => NavigationService.pop()} style = {styles.btnBack}>
                    <Text style={styles.txBtn}>Trở lại</Text>
                </TouchableOpacity>
            </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    btnBack:{
        width:115,
        height:30,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:"#4BBA7B",
        marginRight: 10,
        borderRadius: 5,
    },
    container:{ flex: 1,backgroundColor:'#fff',width:'100%' },
    viewFlatList:{ alignItems: 'center', width: '100%',flex:1 },
    viewBtn:{height:50,alignItems:'flex-end',backgroundColor:'#fff',justifyContent:'center'},
    txBtn:{color:'#fff',textAlign:'center'}
})
