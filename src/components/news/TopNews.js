import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import homeProvider from '@data-access/home-provider'
import NewsItem from './NewsItem'
import HeaderLine from '@components/home/HeaderLine'

class TopNews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataNews: []
        }
    }
    renderItem = ({item}) => {
        return (
            <NewsItem item = {item} />
        )
    }

    componentDidMount() {
        this.getData()
    }
    getData = () => {
        homeProvider.getNews().then(res => {
                this.setState({
                    dataNews:res
                })
     
        }).catch(err => {
            console.log(err);
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.countReset){
            this.getData()
        }
    }
    render() {
        return (
            <View style={{flex:1}}>
                {/* <View style={styles.viewTitle}><View> */}
                    <HeaderLine title = {'TIN TỨC'} />
                    {/* <Text style={{ color: '#000', fontWeight: '600' }}>{'Sản phẩm thuốc bán chạy'.toUpperCase()}</Text>
                </View><Text style={{ color: '#4BBA7B' }}>Xem tất cả>></Text></View> */}
                <FlatList
                    style={{flex:1}}
                    data={this.state.dataNews}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    keyExtractor = {(item,index) => index.toString()}
                ></FlatList>
            </View>
        );
    }
}
const styles = StyleSheet.create({

});
export default TopNews;