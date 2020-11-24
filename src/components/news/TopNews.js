import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
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
    renderItem = ({ item }) => {
        return (
            <NewsItem item={item} />
        )
    }

    componentDidMount() {
        this.getData()
    }
    getData = () => {
        newsProvider.listNews(0, 25).then(res => {
            this.setState({
                dataNews: res.content
            })

        }).catch(err => {

        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.countReset) {
            this.getData()
        }
    }
    keyExtractor = (item, index) => index.toString()
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* <View style={styles.viewTitle}><View> */}
                <HeaderLine title={'TIN TỨC'} />
                {/* <Text style={{ color: '#000', fontWeight: '600' }}>{'Sản phẩm thuốc bán chạy'.toUpperCase()}</Text>
                </View><Text style={{ color: '#02C39A' }}>Xem tất cả>></Text></View> */}
                {this.state.dataNews ? (
                    <FlatList
                        style={{ flex: 1 }}
                        data={this.state.dataNews}
                        extraData={this.state}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                    ></FlatList>
                ) :
                    (<ActivityIndicator></ActivityIndicator>)}

            </View>
        );
    }
}
const styles = StyleSheet.create({

});
export default TopNews;