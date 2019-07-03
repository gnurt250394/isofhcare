import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions,TouchableOpacity,SafeAreaView,StatusBar,Platform } from 'react-native';
import drugProvider from '@data-access/drug-provider'
import DrugItem from '@components/drug/DrugItem'
import HeaderLine from '@components/home/HeaderLine'
import Actionbar from '@components/home/Actionbar';
import NavigationService from "@navigators/NavigationService";

export default class DrugScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            refreshing:false
        }
    }
    componentDidMount() {
        this.onRefresh()
    }
    onRefresh = () => {
        this.setState({
            refreshing:true
        },() => {
            this.getList()
        })
    }
    getList = () => {
        drugProvider.getListDrug().then(res => {
            this.setState({
                listData: res,
                refreshing:false
            })
        }).catch(err => {
            this.setState({
            refreshing:false
            })
            console.log(err)
        })
    }
    getWidth = () => {
        let width = Dimensions.get("window").width;
        if (width < 375) {
            return width - 50
        }
        return width / 2 - 10;
    }
    renderItem = (item) => {
        return (
            <DrugItem widthImg={this.getWidth()} index={item.index} item={item.item}></DrugItem>
        )
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Actionbar />
                <StatusBar barStyle = {Platform.OS == 'ios'?'dark-content':'light-content'} backgroundColor={'#4BBA7B'}></StatusBar>

                <HeaderLine onPress={this.onShowInfo} isShowViewAll={false} title={'SẢN PHẨM THUỐC BÁN CHẠY'} />
                <View style={styles.viewFlatList}>
                    <FlatList
                        style={{ flex: 1 }}
                        data={this.state.listData}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        onRefresh = {this.onRefresh}
                        refreshing = {this.state.refreshing}
                        numColumns={Dimensions.get("window").width < 375 ? 1 : 2}
                        renderItem={this.renderItem}
                        showsVerticalScrollIndicator={false}
                    >

                    </FlatList>
                </View>
                <View style={styles.viewBtn}>
                    <TouchableOpacity onPress={() => NavigationService.pop()} style={styles.btnBack}>
                        <Text style={styles.txBtn}>Trở lại</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    btnBack: {
        width: 115,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#4BBA7B",
        marginRight: 10,
        borderRadius: 5,
    },
    container:{ flex: 1, backgroundColor: '#fff'},
    viewFlatList:{ alignItems: 'center', width: '100%', flex: 1 },
    viewBtn:{ height: 50, alignItems: 'flex-end', backgroundColor: '#fff', justifyContent: 'center' },
    txBtn:{ color: '#fff', textAlign: 'center' }



})