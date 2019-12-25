import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
const devices_width = Dimensions.get('window').width
import drugProvider from '@data-access/drug-provider'
import { connect } from "react-redux";
import ActionSheet from 'react-native-actionsheet'
import ActivityPanel from '@components/ActivityPanel';
import dataCacheProvider from '@data-access/datacache-provider';
import constants from '@resources/strings';
import snackbar from "@utils/snackbar-utils";

class SelectLocationScreen extends Component {
    constructor(props) {
        super(props);
        let dataSelect
        this.state = {
            dataLocation: [],
            isLoading: false
        };
    }
    componentDidMount() {
        this.onGetLocation()
    }
    componentWillUnmount() {
        let data = this.state.dataLocation
        let dataDefault = data.filter(function (item) { return (item.isDefault == true) })
        dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LOCATION_DEFAULT, dataDefault);
    }
    onGetLocation = () => {
        this.setState({
            isLoading: true
        }, () => {
            let id = this.props.userApp.currentUser.id
            let page = 1
            let size = 50
            if (id) {
                drugProvider.getLocation(id, page, size).then(res => {
                    this.setState({
                        isLoading: false,
                        dataLocation: res.data.content
                    })
                }).catch(e => {
                    this.setState({
                        isLoading: false,
                    })
                })
            }
        })
    }
    onSetOption = index => {
        var dataSelect = this.state.dataSelect

        try {
            switch (index) {
                case 0:
                    drugProvider.setLocationDefault(dataSelect.id).then(res => {
                        this.onGetLocation()
                    }).catch(err => {
                    })
                    return;
                case 1:
                    this.props.navigation.navigate('inputLocation', { dataLocation: this.state.dataSelect, onSelected: this.editLocation.bind(this), })
                    return;
                case 2:
                    drugProvider.deleteLocation(dataSelect.id).then(res => {
                        this.onGetLocation()
                    }).catch(err => {
                        if (err.response && err.response.data) {
                            switch (err.response.data) {
                                case 406:
                                    snackbar.show('Không thể xóa địa chỉ đã có đơn thuốc dùng để tìm kiếm nhà thuốc', 'danger')
                                    break
                                default:
                                    snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                                    break
                            }
                        } else {
                            snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')

                        }
                    })
                    return
            }
        } catch (error) {

        }

    };

    addLocation = (location) => {

        let locationError = location ? "" : this.state.locationError;
        if (!location || !this.state.location || location.id != this.state.location.id) {
            this.state.dataLocation.unshift(location)
        } else {
            this.onGetLocation()
        }
    }
    editLocation = (location) => {
        let locationError = location ? "" : this.state.locationError;
        if (!location || !this.state.location || location.id != this.state.location.id) {
            this.onGetLocation()
        } else {
            this.onGetLocation()
        }
    }
    onAddLocation = () => {
        this.props.navigation.navigate('inputLocation', {
            onSelected: this.addLocation.bind(this),
        })

    }
    selectLocation(data) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(data);
            this.props.navigation.pop();
        }
    }
    showOption = (item) => {
        this.setState({
            dataSelect: item
        }, () => {
            this.actionSheetOption.show();
        })

    }
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.selectLocation(item)} style={styles.viewItem}>
                <View style={styles.viewName}><Text style={styles.txName}>{item.ownerName}</Text><TouchableOpacity onPress={() => this.showOption(item)} style={styles.btnDot}><ScaledImage height={15} source={require('@images/new/drug/ic_dot.png')}></ScaledImage></TouchableOpacity></View>
                <Text style={styles.txPhone}>{item.phone}</Text>
                <Text style={styles.txLocation}>{item.address}</Text>
                {item.isDefault && <Text style={styles.txStatus}>Địa chỉ mặc định</Text>}
            </TouchableOpacity>
        )
    }
    renderFooter = () => {
        return (
            <View style={{ height: 50 }}></View>
            // <TouchableOpacity onPress={this.onAddLocation} style={styles.newLocation}><Text style={styles.newAddress}>Thêm địa chỉ mới</Text><TouchableOpacity style={styles.btnDot}><ScaledImage source={require('@images/new/drug/ic_input.png')} height={12}></ScaledImage></TouchableOpacity></TouchableOpacity>
        )

    }
    render() {

        return (
            <ActivityPanel style={styles.container} title={"Chọn địa chỉ đã lưu"} showFullScreen={true}>
                {/* <ScaledImage width={devices_width} source={require('@images/new/drug/ic_bg_find_drug.png')}></ScaledImage> */}
                {!this.state.isLoading && <TouchableOpacity onPress={this.onAddLocation} style={styles.newLocation}><Text style={styles.newAddress}>Thêm địa chỉ mới</Text><TouchableOpacity style={styles.btnDot}><ScaledImage source={require('@images/new/drug/ic_input.png')} height={12}></ScaledImage></TouchableOpacity></TouchableOpacity>}
                <FlatList
                    data={this.state.dataLocation}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    // ListHeaderComponent={this.renderFooter}
                    onRefresh={this.onGetLocation}
                    refreshing={this.state.isLoading}
                // ListEmptyComponent={this.renderEmpty}
                ></FlatList>
                {/* <View style = {{height:50}}></View> */}
                {/* <TouchableOpacity onPress={this.onAddLocation} style={styles.newLocation}><Text style={styles.newAddress}>Thêm địa chỉ mới</Text><TouchableOpacity style={styles.btnDot}><ScaledImage source={require('@images/new/drug/ic_input.png')} height={12}></ScaledImage></TouchableOpacity></TouchableOpacity> */}
                <ActionSheet
                    ref={o => this.actionSheetOption = o}
                    options={['Đặt làm mặc định', 'Chỉnh sửa', 'Xóa', 'Hủy']}
                    cancelButtonIndex={3}
                    // destructiveButtonIndex={1}
                    onPress={this.onSetOption}
                />
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f1f1f1',
        flex: 1
    },
    viewItem: {
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 10,
    },
    viewName: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    viewPhone: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    txName: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    txPhone: {
        fontSize: 14,
        color: '#808080',
        textAlign: 'left'
    },
    txLocation: {
        fontSize: 14,
        color: '#808080',
        textAlign: 'left',
        maxWidth: '80%'
    },
    txStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF8A00'
    },
    btnDot: {
        padding: 10
    },
    newLocation: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        height: 48
    },
    newAddress: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#33B5FF',
        textAlign: 'left'
    }

})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
    };
}
export default connect(mapStateToProps)(SelectLocationScreen);