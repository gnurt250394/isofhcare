import React, { Component } from "react";
import {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Platform,
    Dimensions,
    RefreshControl
} from "react-native";
import { Card } from 'native-base';
import ActivityPanel from "@components/ActivityPanel";
import { connect } from "react-redux";
import constants from "@resources/strings";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import dataCacheProvider from '@data-access/datacache-provider';
import Field from "mainam-react-native-form-validate/Field";
import ScaleImage from 'mainam-react-native-scaleimage';
import { FlatList } from "react-native-gesture-handler";
import dateUtils from 'mainam-react-native-date-utils';
import drugProvider from '@data-access/drug-provider'
import ActionSheet from 'react-native-actionsheet'
import snackbar from "@utils/snackbar-utils";

const devices_width = Dimensions.get('window').width
const padding = Platform.select({
    ios: 7,
    android: 2
});
class drugScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropDown: false,
            dataDrug: [],
            page: 1,
            size: 10
        }
    }
    componentWillMount() {
        this.getListDrug()
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.dataDrug) {
            // this.setState(prev => ({
            this.getListDrug()
            // chưa dùng concat vì confilic với phần edit, tự add item mới
            //     dataDrug: prev.dataDrug.concat(nextProps.dataDrug.data)
            // }))
        }
    }
    getListDrug = () => {
        console.log('get list')
        this.setState({
            isLoading: true
        }, () => {
            let page = this.state.page
            let size = this.state.size
            let id = this.props.userApp.currentUser.id
            drugProvider.getListMenu(page, size, id).then(res => {
                this.setState({
                    dataDrug: res.data.content,
                    isLoading: false
                })
            }).catch(err => {
                this.setState({
                    isLoading: false
                })
            })
        })
    }
    onShowOption = (item) => {
        this.setState({
            dataSelect: item
        })
        this.actionSheetOption.show();

    };
    renderStatus = (item) => {
        switch (item.state) {
            case 'FINDING':
                return (
                    <Text style={styles.txStatusFinding}>Đang tìm nhà thuốc</Text>
                )
            case 'FOUND':
                return (
                    <Text style={styles.txStatusFinded}>Đã thấy nhà thuốc</Text>
                )
            case 'STORED':
                return (
                    <Text style={styles.txStatusSaved}>Đã lưu</Text>
                )
            default:
                return (
                    <Text></Text>
                )
        }
    }
    showDropdown = (index) => {
        let dropDown = this.state.dropDown
        this.setState({
            dropDown: !dropDown,
            index: index
        })
    }
    hideDrop = () => {
        this.setState({
            dropDown: false,
        })
    }

    addDrug = (data) => {
        let dataError = data ? "" : this.state.dataError;
        if (!data || !this.state.data || data.id != this.state.data.id) {
            this.setState({ data, dataError })

        } else {
            this.setState({ data, dataError });
        }
    }
    selectDetails = (data) => {
        this.getListDrug()
    }
    onSelectDetails = (id) => {
        this.props.navigation.navigate('detailsDrug', {
            id: id,
            onSelected: this.selectDetails.bind(this),
        })

    }
    renderItem = ({ item, index }) => {
        return (
            <View style={styles.viewItem}>
                <Card style={styles.cardItem}>
                    <TouchableOpacity onPress={() => this.onSelectDetails(item.id)} style={styles.cardItem}>
                        <View style={styles.viewImg}><ScaleImage height={30} source={require('@images/new/drug/ic_drug_item.png')}></ScaleImage></View>
                        <View style={styles.viewContentsItem}>
                            <View style={styles.viewMenuDrug}><Text style={styles.txName}>{item.name}</Text><TouchableOpacity onPress={() => this.onShowOption(item)} style={styles.btnImage}><ScaleImage style={styles.imgDot} height={12} source={require('@images/new/drug/ic_dot.png')}></ScaleImage></TouchableOpacity></View>
                            <View style={styles.viewDate}><Text style={styles.txDate}>{item.created ? item.created.toDateObject().format("dd/MM/yyyy") : ''}</Text>{this.renderStatus(item)}</View>
                        </View>
                    </TouchableOpacity>
                </Card>
            </View>
        )
    }
    onFindDrug = () => {
        this.props.navigation.navigate('findDrug', {
            onSelected: this.addDrug.bind(this)
        })
    }
    onSetOption = index => {
        const dataSelect = this.state.dataSelect

        try {
            switch (index) {
                case 0:
                    if (dataSelect.state == 'STORED') {
                        if (dataSelect && dataSelect.images && dataSelect.images.length) {
                            this.props.navigation.navigate('editDrugScan', { dataEdit: this.state.dataSelect })
                            return
                        } if (dataSelect && dataSelect.medicines && dataSelect.medicines.length) {
                            this.props.navigation.navigate('editDrugInput', { dataEdit: this.state.dataSelect })
                            return
                        }
                    } else {
                        snackbar.show('Đơn thuốc không được phép thay đổi', 'danger')
                    }
                case 1:
                    drugProvider.deleteDrug(dataSelect.id).then(res => {
                        this.getListDrug()
                    }).catch(err => {


                    })
                    return;
            }
        } catch (error) {

        }

    };
    listEmpty = () => !this.state.isLoading && <Text style={styles.none_data}>{constants.not_found}</Text>

    render() {

        return (
            <ActivityPanel
                style={{ flex: 1 }}
                title={constants.title.content}
                hideActionbar={true}
                // isLoading={this.state.isLoading}
                backgroundHeader={require('@images/new/drug/ic_bg_drug2.png')}
                containerStyle={{ marginTop: 150, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                titleStyle={{
                    color: '#FFF'
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    style={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.getListDrug}
                            refreshing={this.state.isLoading}
                        />
                    }
                // keyboardDismissMode='on-drag' 
                >
                    <View style={styles.containerCard}>
                        <TouchableOpacity onPress={this.onFindDrug} style={styles.btnAdd}>
                            <ScaleImage style={styles.imgBtn} height={30} source={require('@images/new/drug/ic_drug_btn.png')}></ScaleImage>
                            <View style={styles.viewContentBtn}>
                                <Text style={styles.txSearchDrug}>Tìm nhà thuốc</Text>
                                <Text style={styles.txSearchMenuDrug}>Theo đơn thuốc</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.viewFlatlish}></View>
                        <View style={styles.viewHeadFlat}>
                            {this.state.dataDrug && this.state.dataDrug.length ? <Text>Đơn thuốc của tôi {`(${this.state.dataDrug.length})`}</Text> : null}
                            {/* <TouchableOpacity><Text>Xem tất cả</Text></TouchableOpacity> */}
                        </View>
                        <FlatList
                            style={styles.viewFl}
                            data={this.state.dataDrug}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                            ListEmptyComponent={this.listEmpty}
                        />

                    </View>
                    <View style={styles.viewBottom}></View>
                    <ActionSheet
                        ref={o => this.actionSheetOption = o}
                        options={['Chỉnh sửa', 'Xóa', 'Hủy']}
                        cancelButtonIndex={2}
                        // destructiveButtonIndex={1}
                        onPress={this.onSetOption}
                    />
                </ScrollView>
                {Platform.OS == "ios" && <KeyboardSpacer />}
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    viewBottom: {
        height: 50
    },
    scroll: {
        flex: 1,
        position: 'relative',
    },
    viewFl: {
        flex: 1
    },
    containerCard: {
        margin: 22,
        marginTop: 10,
    },
    viewHeadFlat: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
        marginBottom: 10
    },
    btnAdd: {
        flexDirection: 'row',
        backgroundColor: '#3161AD',
        height: 54,
        borderRadius: 100,
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 30
    },
    txSearchDrug: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    dropDown: {
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
        borderWidth: 0.5,
        borderColor: 'gray',
        flex: 1,
        top: 30,
        right: 0,
        elevation: 1,
        position: 'absolute',
        zIndex: 5,
    },

    imgBtn: {
        alignSelf: 'center'
    },
    txSearchMenuDrug: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'left'
    },
    viewContentBtn: {
        alignSelf: 'center',
        marginHorizontal: 20
    },
    btnImage: {
        padding: 10
    },
    viewFlatlish: {

    },
    itemBtn: {

    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#fff',
        padding: 5,
        flex: 1,

    },
    viewImg: {
        width: 50, height: 50, borderRadius: 25, backgroundColor: '#00cba7',
        justifyContent: "center", alignItems: 'center'
    },
    viewContentsItem: {
        padding: 5,
        flex: 1
    },
    viewMenuDrug: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },
    txName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#000'
    },
    imgDot: {
    },
    viewDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        flex: 1

    },
    txDate: {
        color: 'gray',
        fontSize: 14
    },
    txStatusFinding: {
        color: '#FF8A00',
        fontSize: 14,
        fontStyle: 'italic',
        fontWeight: '800',
        textAlign: 'right'
    },
    txStatusFinded: {
        color: '#3161AD',
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'right',
        fontWeight: '800',
    },
    txStatusSaved: {
        color: '#00BA99',
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'right',
        fontWeight: '800',
    },
    txEdit: {
        color: '#000'
    },
    btnEdit: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 31,
        width: '100%'
    },
    none_data: {
        fontStyle: 'italic',
        marginTop: 30,
        alignSelf: 'center',
        fontSize: 16
    },



});
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        dataDrug: state.dataDrug
    };
}
export default connect(mapStateToProps)(drugScreen);
