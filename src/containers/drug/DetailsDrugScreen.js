import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { Card } from 'native-base';
import drugProvider from '@data-access/drug-provider'
import dateUtils from 'mainam-react-native-date-utils';
import ActivityPanel from "@components/ActivityPanel";
import snackbar from "@utils/snackbar-utils";
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from "react-redux";

class DetailsDrugScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataShop: [],
            dataDetail: []
        };
    }
    componentDidMount() {
        this.onGetDetail()
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.dataDrug) {
            // this.setState(prev => ({
            this.onGetDetail()
            // chưa dùng concat vì confilic với phần edit, tự add item mới
            //     dataDrug: prev.dataDrug.concat(nextProps.dataDrug.data)
            // }))
        }
    }
    onGetDetail = () => {
        this.setState({
            isLoading: true
        }, () => {
            let id = this.props.navigation.getParam('id', '')
            if (id) {
                drugProvider.getDetailsDrug(id).then(res => {
                    console.log('getDetailsDrug:', res.data)
                    this.setState({
                        dataDetail: res.data
                    })
                    this.setState({
                        isLoading: false
                    })
                }).catch(err => {
                    this.setState({
                        isLoading: false
                    })

                })
            } else {
                this.setState({
                    isLoading: false
                })
                this.props.navigation.pop()
            }
        })

    }
    onClickItem = (item) => {
        this.props.navigation.navigate('drugStore', { data: item })
    }
    findDrug = () => {
        if (this.state.dataDetail && this.state.dataDetail.address) {
            let id = this.props.navigation.getParam('id', '')
            this.setState({
                isLoading: true
            }, () => {
                drugProvider.findDrug(id).then(res => {
                    this.setState({
                        isLoading: false
                    })
                    let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
                    if (callback) {
                        callback(res.data);
                        this.props.navigation.pop();
                    }

                }).catch(err => {
                    this.setState({
                        isLoading: false
                    })
                    snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại')
                })
            })
        } else {
            let id = this.props.navigation.getParam('id', '')
            let addressId = this.state.location.id
            if (addressId) {
                this.setState({
                    isLoading: true
                }, () => {
                    drugProvider.findDrug(id, addressId).then(res => {
                        this.setState({
                            isLoading: false
                        })
                        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
                        if (callback) {
                            callback(res.data);
                            this.props.navigation.pop();
                        }

                    })
                })
            } else {
                snackbar.show('Vui lòng nhập địa chỉ để thực hiện tìm kiếm nhà thuốc')
            }
        }

    }
    selectLocation = (location) => {
        let locationError = location ? "" : this.state.locationError;
        if (!location || !this.state.location || location.id != this.state.location.id) {
            this.setState({ location, locationError })
        } else {
            this.setState({ location, locationError });
        }
    }
    onSelectLocation = () => {
        this.props.navigation.navigate('selectLocation', {
            onSelected: this.selectLocation.bind(this),
        })

    }
    renderAddress = () => {
        let item = this.state.location
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
    }
    renderItem = ({ item, index }) => {
        return (
            <View style={styles.viewItem}>
                <Card style={styles.cardItem}>
                    <TouchableOpacity onPress={() => this.onClickItem(item)} style={styles.cardItem}>
                        <ScaledImage height={60} source={require('@images/new/drug/ic_shop_drug.png')}></ScaledImage>
                        <View style={styles.viewContentItem}>
                            <Text style={styles.txTitleStore}>
                                {item.name}
                            </Text>
                            <View style={styles.viewLocationItem}><Text style={styles.txLocationItem}>{item.address}</Text><View><Text style={styles.txLong}>{item.distance}km</Text></View></View>
                        </View>
                    </TouchableOpacity>
                </Card>
            </View>
        )
    }
    renderViewByStatus = () => {
        let status = this.state.dataDetail && this.state.dataDetail.state
        switch (status) {
            case 'FOUND':
                return (
                    <View style={styles.viewLocation}>
                        <Text style={styles.txLabel}>Nhà thuốc có bán đơn thuốc của bạn</Text>
                        <FlatList
                            data={this.state.dataDetail.pharmacies}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                        >
                        </FlatList>
                        <View style={{ height: 50 }}></View>
                    </View>
                )
            case 'STORED': {
                if (this.state.dataDetail && this.state.dataDetail.address)
                    return (
                        <View>
                            <View style={styles.viewLocation} >
                                <Text style={styles.txLabel}>Nhà thuốc có bán đơn thuốc của bạn</Text>
                            </View>
                            <View style={styles.viewFinding}><TouchableOpacity onPress={this.findDrug} style={[styles.btnFind,]}><Text style={styles.txFind}>Tìm nhà thuốc</Text></TouchableOpacity></View>
                        </View>
                    )
                else
                    return (<View style={styles.viewLocation}>
                        <Text style={styles.txLocation}>Nhập địa chỉ của bạn để tìm nhà thuốc gần nhất</Text>
                        <TouchableOpacity onPress={this.onSelectLocation} style={styles.btnLocation}>
                            <View style={styles.inputLocation}>
                                <ScaledImage source={require('@images/new/drug/ic_location.png')} height={20}></ScaledImage>
                                <Text style={styles.txLabelLocation}>{this.state.location ? this.renderAddress() : 'Nhập địa chỉ'}</Text>
                            </View>
                            <ScaledImage source={require('@images/new/drug/ic_btn_location.png')} height={10}></ScaledImage>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.findDrug} style={styles.btnFind}><Text style={styles.txFind}>Tìm nhà thuốc</Text></TouchableOpacity>
                    </View>)
            }
            case 'FINDING':
                return (
                    <View style={styles.viewLocation}>
                        <Text style={styles.txLabel}>Nhà thuốc có bán đơn thuốc của bạn</Text>
                        <View style={styles.viewFinding}>
                            <Text style={styles.txFinding}>Đang xử lý đơn thuốc...</Text>
                        </View>
                    </View>
                )

        }

    }
    renderStatus = () => {
        switch (this.state.dataDetail && this.state.dataDetail.state) {
            case 'FINDING':
                return (
                    <Text style={styles.txStatus}>Đang tìm nhà thuốc</Text>
                )
            case 'FOUND':
                return (
                    <Text style={styles.txStatus}>Đã thấy nhà thuốc</Text>
                )
            case 'STORED':
                return (
                    <Text style={styles.txStatus}>Đã lưu</Text>
                )
            default:
                return (
                    <Text></Text>
                )
        }
    }
    renderDetails = (dataDetail) => {

        if (dataDetail && dataDetail.images && dataDetail.images.length) {
            return (
                <View>
                    <Text style={styles.txLabel}>Hình ảnh đơn thuốc({dataDetail.images.length})</Text>
                    <View style={styles.list_image}>
                        {
                            dataDetail.images.map((item, index) => <View key={index} style={styles.containerImagePicker}>
                                <View style={styles.groupImagePicker}>
                                    <Image source={{ uri: item.pathThumbnail.absoluteUrl() }} resizeMode="cover" style={styles.imagePicker} />
                                    {
                                        item.error ?
                                            <View style={styles.groupImageError} >
                                                <ScaledImage source={require("@images/ic_warning.png")} width={40} />
                                            </View> :
                                            item.loading ?
                                                <View style={styles.groupImageLoading} >
                                                    <ScaledImage source={require("@images/loading.gif")} width={40} />
                                                </View>
                                                : null
                                    }
                                </View>
                            </View>)
                        }
                    </View>
                </View>
            )
        }
        if (dataDetail && dataDetail.medicines && dataDetail.medicines.length) {
            return (
                <View style={styles.listSelect}>
                    <Text style={styles.txSelect}>Danh sách thuốc ({dataDetail.medicines.length})</Text>
                    <FlatList
                        data={dataDetail.medicines}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderDrugItem}
                    >
                    </FlatList>
                </View>
            )
        }
    }
    renderDrugItem = ({ item, index }) => {
        return (
            <View style={styles.viewItem}>
                <Text style={styles.txName}>{`${item.name}`}</Text>
            </View>
        )
    }
    onEdit = () => {
        let dataDetail = this.state.dataDetail
        if (dataDetail.state == 'STORED') {
            if (dataDetail && dataDetail.images && dataDetail.images.length) {
                this.props.navigation.navigate('editDrugScan', { dataEdit: this.state.dataDetail })
                return
            } if (dataDetail && dataDetail.medicines && dataDetail.medicines.length) {
                this.props.navigation.navigate('editDrugInput', { dataEdit: this.state.dataDetail })
                return
            }
        } else {
            snackbar.show('Đơn thuốc không được phép thay đổi', 'danger')
        }
    }
    render() {
        let dataDetail = this.state.dataDetail
        console.log('dataDetail: ', dataDetail);
        return (
            <ActivityPanel titleStyle={styles.txTitle} isLoading={this.state.isLoading} style={styles.container} title={"Chi tiết đơn thuốc"} showFullScreen={true} menuButton={<TouchableOpacity onPress={this.onEdit} style={{ padding: 5, marginRight: 16 }}>
                <ScaledImage source={require('@images/new/drug/ic_edit.png')} height={20}></ScaledImage>
            </TouchableOpacity>}>
                <ScrollView style={{ backgroundColor: '#f2f2f2' }}>
                    <ScaledImage height={100} source={require('@images/new/drug/ic_bg_find_drug.png')}></ScaledImage>
                    <View style={styles.viewTitle}>
                        <Text style={styles.txTitleMenu}>{dataDetail && dataDetail.name}</Text>
                        <Text style={styles.txContent}>Ngày tạo: {dataDetail && dataDetail.created ? dataDetail.created.toDateObject().format("dd/MM/yyyy") : ''}</Text>
                        <Text><Text style={styles.txContent}>Trạng thái: </Text>{this.renderStatus()}</Text>
                    </View>
                    <View style={styles.viewImg}>
                        {this.renderDetails(dataDetail)}
                        <View>
                        </View>
                        <Text style={styles.txLabel}>Ghi chú</Text>
                        <Text style={styles.txContent}>{dataDetail && dataDetail.note}</Text>
                        {dataDetail && dataDetail.address && dataDetail.address.address ? <View>
                            <Text style={styles.txLabel}>Địa chỉ</Text>
                            <Text style={styles.txContent}>{dataDetail && dataDetail.address && dataDetail.address.address}</Text>
                        </View> : <View></View>}
                    </View>
                    {this.renderViewByStatus()}
                </ScrollView>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    viewFinding: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60
    },
    list_image: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginHorizontal: 20, marginVertical: 20, },
    txFinding: {
        color: '#808080',
        fontStyle: 'italic',
        fontSize: 16
    },
    btnLocation: {
        minHeight: 41,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 20
    },
    inputLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    txLabelLocation: {
        color: '#00A3FF',
        textDecorationLine: 'underline',
        fontSize: 14,
        marginLeft: 10,
        fontStyle: 'italic',
    },
    btnFind: {
        borderRadius: 6,
        alignSelf: 'center',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CBA7',
        paddingHorizontal: 60,
        marginTop: 30
    },
    txFind: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center'
    },
    txLocation: {
        fontSize: 14,
        color: '#000',
        textAlign: 'left',
        fontStyle: 'italic',
    },
    viewLocation: {
        padding: 10,
        marginTop: 10,
        backgroundColor: '#fff',
        flex: 1,
    },
    txLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00BA99',
        fontStyle: 'italic'
    },
    txContent: {
        fontSize: 14,
        color: '#808080',
        textAlign: 'left'
    },
    viewImg: {
        padding: 10, marginTop: 10, backgroundColor: '#fff'
    },
    viewTitle: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 10
    },

    txStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3161ad'
    },
    txViewAddress: {
        textDecorationLine: 'underline',
        color: '#00A3FF',
        fontSize: 14
    },
    btnViewAddress: {
        padding: 5
    },
    viewItem: {
        flex: 1
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#fff',
        padding: 5,
        flex: 1
    },
    viewContentItem: {
        padding: 5,
        flex: 1,
    },
    viewLocationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
    },
    txLocationItem: {
        fontSize: 14,
        textDecorationLine: 'underline',
        color: '#808080',
        textAlign: 'left'

    },
    txLong: {
        fontSize: 14,
        color: '#808080',
        textAlign: 'right'
    },
    groupImageLoading: {
        position: 'absolute',
        left: 20,
        top: 20,
        backgroundColor: '#FFF',
        borderRadius: 20
    },
    groupImageError: {
        position: 'absolute',
        left: 20,
        top: 20
    },
    imagePicker: {
        width: 80,
        height: 80,
        borderRadius: 5
    },
    groupImagePicker: {
        marginTop: 8,
        width: 80,
        height: 80
    },
    containerImagePicker: {
        margin: 2,
        width: 88,
        height: 88,
        position: 'relative'
    },
    viewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 0.5,
        paddingVertical: 10

    },
    txName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00B090',
        textAlign: 'left',
        maxWidth: '80%'
    },
    listSelect: {
        padding: 10,
        paddingLeft: 0
    },
    txSelect: {
        fontStyle: 'italic',
    },
    txTitle: { color: '#fff', marginLeft: 50, fontSize: 18 },
    txTitleStore:{color: '#000', fontSize: 18,fontWeight:'bold'},
    txTitleMenu: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left'
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        dataDrug: state.dataDrug
    };
}
export default connect(mapStateToProps)(DetailsDrugScreen);