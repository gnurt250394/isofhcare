import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, ScrollView, Text, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import hospitalProvider from '@data-access/hospital-provider'
import HeaderLine from '@components/home/HeaderLine'
import HospitalItem from './HospitalItem'
import NavigationService from "@navigators/NavigationService";

class TopHospital extends Component {
    constructor(props) {
        super(props)
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
                listData: res.slice(0, 10)
            })
        }).catch(err => {
            console.log(err)
        })
    }
    renderItem = ({ item, index }) => {
        return (
            <HospitalItem widthImg={180} widthCard={170} index={index} item={item}></HospitalItem>

        )
    }
    onShowInfo = () => {
        NavigationService.navigate('hospital')
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.countReset) {
            this.getList()
        }
    }
    render() {
        return (
            <View style={{ backgroundColor: '#fff' }}>
                <HeaderLine onPress={this.onShowInfo} isShowViewAll={true} title={Dimensions.get("window").width <= 375 ? 'PHÒNG KHÁM,\nBỆNH VIỆN HÀNG ĐẦU' : 'PHÒNG KHÁM, BỆNH VIỆN HÀNG ĐẦU'} />
                {
                    this.state.listData ? (
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            data={this.state.listData}
                            renderItem={this.renderItem}
                        />
                    ) : (<ActivityIndicator></ActivityIndicator>)
                }

            </View>
        );
    }
}
const styles = StyleSheet.create({

});
export default TopHospital;