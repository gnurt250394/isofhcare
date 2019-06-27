import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import drugProvider from '@data-access/drug-provider'
import DrugItem from '@components/drug/DrugItem'
import HeaderLine from '@components/home/HeaderLine'
import Actionbar from '@components/home/Actionbar';
export default class DrugScreen extends Component {
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
        drugProvider.getListDrug().then(res => {
            this.setState({
                listData: res
            })
        }).catch(err => {
            console.log(err)
        })
    }
    getWidth = () => {
        let width = Dimensions.get("window").width;
        if(width < 375){
            return width - 10
        }
        return width / 2 - 10;
    }
    renderItem = (item) => {
        return (
            <DrugItem widthImg={this.getWidth()}  index={item.index} item={item.item}></DrugItem>
        )
    }
    render() {
        return (
            <View>
                <Actionbar />
                <HeaderLine onPress={this.onShowInfo} isShowViewAll={false} title={'SẢN PHẨM THUỐC BÁN CHẠY'} />
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <FlatList
                        data={this.state.listData}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        numColumns={Dimensions.get("window").width < 375 ? 1 : 2}
                        renderItem={this.renderItem}
                        showsVerticalScrollIndicator={false}
                    >

                    </FlatList>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({

})
