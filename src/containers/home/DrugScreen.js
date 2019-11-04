import React, { Component, PropTypes } from "react";
import {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Platform,
    Dimensions,
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
            dataDrug: [
                {
                    name: 'Đơn thuốc da liễu BS HUẤN',
                    date: '21/10/2019',
                    status: 1
                },
                {
                    name: 'Đơn thuốc da liễu BS HUẤN',
                    date: '21/10/2019',
                    status: 2
                },
                {
                    name: 'Đơn thuốc da liễu BS HUẤN',
                    date: '21/10/2019',
                    status: 3
                }
            ]
        }
    }
    renderStatus = (item) => {
        switch (Number(item.status)) {
            case 1:
                return (
                    <Text style={styles.txStatusFinding}>Đang tìm nhà thuốc</Text>
                )
            case 2:
                return (
                    <Text style={styles.txStatusFinded}>Đã thấy nhà thuốc</Text>
                )
            case 3:
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
        console.log('dropDown: ', dropDown);
        this.setState({
            dropDown: !dropDown,
            index: index
        })
    }
    onSelectDetails = () => {
        this.props.navigation.navigate('detailsDrug')
    }
    renderItem = ({ item, index }) => {
        return (
            <View style={styles.viewItem}>
                <Card style={styles.cardItem}>
                    <TouchableOpacity onPress = {this.onSelectDetails} style={styles.cardItem}>
                        <View style={styles.viewImg}><ScaleImage height={30} source={require('@images/new/drug/ic_drug_item.png')}></ScaleImage></View>
                        <View style={styles.viewContentsItem}>
                            <View style={styles.viewMenuDrug}><Text style={styles.txName}>{item.name}</Text><TouchableOpacity onPress={() => this.showDropdown(index)} style={styles.btnImage}><ScaleImage style={styles.imgDot} height={12} source={require('@images/new/drug/ic_dot.png')}></ScaleImage></TouchableOpacity></View>
                            <View style={styles.viewDate}><Text style={styles.txDate}>{item.date}</Text>{this.renderStatus(item)}</View>
                        </View>
                    </TouchableOpacity>
                    {
                        this.state.dropDown && index == this.state.index ? <View style={styles.dropDown}>
                            <TouchableOpacity><Text>Chỉnh sửa</Text></TouchableOpacity>
                            <TouchableOpacity><Text>Xóa</Text></TouchableOpacity>
                        </View> : null
                    }
                </Card>

            </View>
        )
    }
    onFindDrug = () => {
        this.props.navigation.navigate('findDrug')
    }
    render() {
        return (
            // <ActivityPanel
            //     style={{ flex: 1 }}
            //     title={constants.title.content}
            //     showFullScreen={true}
            //     // isLoading={this.state.isLoading}
            //     titleStyle={{
            //         color: '#FFF'
            //     }}
            // >
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                style={styles.scroll}
                keyboardShouldPersistTaps="handled"
            // keyboardDismissMode='on-drag' 
            >
                <ScaleImage width={devices_width} source={require('@images/new/drug/ic_bg_drug2.png')}></ScaleImage>
                <View style={styles.containerCard}>
                    <TouchableOpacity onPress = {this.onFindDrug} style={styles.btnAdd}>
                        <ScaleImage style={styles.imgBtn} height={30} source={require('@images/new/drug/ic_drug_btn.png')}></ScaleImage>
                        <View style={styles.viewContentBtn}>
                            <Text style={styles.txSearchDrug}>Tìm nhà thuốc</Text>
                            <Text style={styles.txSearchMenuDrug}>Theo đơn thuốc</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.viewFlatlish}></View>
                    <View style={styles.viewHeadFlat}>
                        <Text>Đơn thuốc của tôi {this.state.dataDrug && this.state.dataDrug.length ? `(${this.state.dataDrug.length})` : ''}</Text>
                        <TouchableOpacity><Text>Xem tất cả</Text></TouchableOpacity>
                    </View>
                    <FlatList
                        style={styles.viewFl}
                        data={this.state.dataDrug}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                    />

                </View>
                <View style = {styles.viewBottom}></View>
            </ScrollView>
            // {Platform.OS == "ios" && <KeyboardSpacer />}
            // </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    viewBottom:{
        height:50
    },
    scroll: {
        flex: 1,
        position: 'relative',
    },
    viewFl: {
    },
    containerCard: {
        margin: 22,
        marginTop: 10,
    },
    viewHeadFlat: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:50,
        marginBottom:10
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
        borderRadius: 5,
        paddingVertical: 10,
        alignSelf: 'flex-end',
        borderWidth: 0.5,
        borderColor: 'gray',
        flex: 1,
        top: 30,
        position: 'absolute',
        zIndex: 5,
    },
    viewItem: {
        flex: 1
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
        padding: 5
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
    }



});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(drugScreen);
