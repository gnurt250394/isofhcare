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
        try {
            switch (index) {
                case 0:
                    let dataSelect = this.state.dataSelect
                    drugProvider.setLocationDefault(dataSelect.id).then(res => {
                        this.onGetLocation()
                    }).catch(err => {
                        console.log('err: ', err);

                    })
                    return;
                case 1:
                    this.props.navigation.navigate('inputLocation', { dataLocation: this.state.dataSelect, onSelected: this.editLocation.bind(this), })
                    return;
                case 2:
                    return
            }
        } catch (error) {

        }

    };
    renderAddress = (item) => {
        let district = item.district ? item.district : null
        let province = item.province ? item.province : null
        let zone = item.zone ? item.zone : ''
        let village = item.village ? item.village : null
        if (district && province && zone && village) {
            return (`${village}, ${zone}, ${district}, ${province}`)
        }
        else if (district && province && zone) {
            return (`${zone}, ${district}, ${province}`)

        }
        else if (district && province && village) {
            return (`${village}, ${district}, ${province}`)

        }
        else if (district && province) {
            return (`${district},${province},`)

        }

        else if (province && village) {
            return (`${village}, ${province}`)

        }
        else if (province) {
            return (`${province}`)

        }
        else if (village) {
            return (`${village}`)

        } else if (!village && !district && !province && !zone) {
            return ('')
        }

        // return (<Text style={styles.txContent}>{dataLocaotion.address}</Text>)
        // let dataLocaotion = this.state.data && this.state.data.medicalRecords ? this.state.data.medicalRecords : {}
        // if (dataLocaotion) {
        //     if (dataLocaotion.address && dataLocaotion.village) {
        //         return (<Text style={styles.txContent}>{dataLocaotion.village + ', ' + dataLocaotion.address}</Text>)
        //     }

        //     if (dataLocaotion.address && !dataLocaotion.village) {
        //         return (<Text style={styles.txContent}>{dataLocaotion.address}</Text>)
        //     }
        //     if (!dataLocaotion.address && dataLocaotion.village) {
        //         return (<Text style={styles.txContent}>{dataLocaotion.village}</Text>)
        //     }
        // }

    }
    addLocation = (location) => {
        console.log('location: ', location);
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
                <Text style={styles.txLocation}>{this.renderAddress(item)}</Text>
                {item.isDefault && <Text style={styles.txStatus}>Địa chỉ mặc định</Text>}
            </TouchableOpacity>
        )
    }
    renderFooter = () => {
        return (
            <TouchableOpacity onPress={this.onAddLocation} style={styles.newLocation}><Text style={styles.newAddress}>Thêm địa chỉ mới</Text><TouchableOpacity style={styles.btnDot}><ScaledImage source={require('@images/new/drug/ic_input.png')} height={12}></ScaledImage></TouchableOpacity></TouchableOpacity>
        )

    }
    render() {
        console.log('render')
        return (
            <ActivityPanel style={styles.container} title={"Chọn địa chỉ đã lưu"} showFullScreen={true}>
                <ScaledImage width={devices_width} source={require('@images/new/drug/ic_bg_find_drug.png')}></ScaledImage>
                <FlatList
                    data={this.state.dataLocation}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.onGetLocation}
                    refreshing={this.state.isLoading}
                // ListEmptyComponent={this.renderEmpty}
                ></FlatList>
                <View style = {{height:50}}></View>
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
        flex: 1,
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