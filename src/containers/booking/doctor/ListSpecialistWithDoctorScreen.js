import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import bookingDoctorProvider from '@data-access/booking-doctor-provider'

class ListSpecialistWithDoctorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 0,
            size: 20,
            isLoading: true
        };
    }
    componentDidMount = () => {
        this.getData()
    };

    getData = () => {
        bookingDoctorProvider.get_list_specialists(this.state.page, this.state.size).then(res => {
            this.setState({ isLoading: false })
            if (res && res.length > 0) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        }).catch(er => {
            this.setState({ isLoading: false })
            this.formatData([])
        })
    }
    onFilter = (item) => () => {
        this.props.navigation.pop()
        let onSelected = this.props.navigation.getParam('onSelected')
        if (onSelected) onSelected(item)
    }
    formatData = (data) => {
        if (data.length == 0) {
            if (this.state.page == 0) {
                this.setState({ data })
            }
        } else {
            if (this.state.page == 0) {
                this.setState({ data })
            } else {
                this.setState(preState => {
                    return { data: [...preState.data, ...data] }
                })
            }
        }
    }
    loadMore = () => {
        const { page, size, data } = this.state
        if (data.length >= (page + 1) * size) {
            this.setState(preState => {
                return {
                    page: preState.page + 1
                }
            }, this.getData)
        }
    }
    footerComponent = () => {
        const { page, size, data } = this.state
        if (data.length >= (page + 1) * size) {
            return (
                <ActivityIndicator color="#00CBA7" size="small" />
            )
        } else {
            return null
        }
    }
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={this.onFilter(item)}
                style={styles.containerItem}
            >
                <Text style={styles.txtName}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    keyExtractor = (item, index) => `${item.id || index}`
    render() {
        const { data } = this.state
        return (
            <ActivityPanel
                title="Danh sách chuyên khoa"
                isLoading={this.state.isLoading}>
                <FlatList
                    data={data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.7}
                    ListFooterComponent={this.footerComponent}
                />

            </ActivityPanel>
        );
    }
}

export default ListSpecialistWithDoctorScreen;


const styles = StyleSheet.create({
    txtName: {
        color: '#000',
        fontWeight: 'bold'
    },
    containerItem: {
        borderBottomColor: '#BBB',
        borderBottomWidth: 1,
        paddingVertical: 15,
        paddingLeft: 10
    },
})