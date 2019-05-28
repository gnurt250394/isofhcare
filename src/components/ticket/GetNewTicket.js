import React, { PureComponent } from 'react'
import { Text, View, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import Modal from 'react-native-modal';
import ScaledImage from 'mainam-react-native-scaleimage';
import StarRating from 'react-native-star-rating';
import ActivityPanel from "@components/ActivityPanel";
import { connect } from "react-redux";
import hospitalProvider from '@data-access/hospital-provider';
import constants from '@resources/strings';
import questionProvider from '@data-access/question-provider';
import clientUtils from '@utils/client-utils';

class GetNewTicket extends PureComponent {
    state = {
        data: [],
        service: null,
        index: ''

    }
    componentDidMount() {
        this.getListHospital()
        // this.getRatting()
    }
    // getRatting = () => {
    //     questionProvider.getResultReview(this.state.id).then(res => {
    //       if (res.code == 0) {
    //         console.log(res);
    //       }
    //     }).catch(err => {
    //       console.log(err)
    //     })

    //   }
    getListHospital = () => {
        hospitalProvider.getDefaultHospital().then(res => {
            let data = res.data
            if (res.code == 0) {
                let data2 = data.filter(data => data.hospital.defaultBookHospital)
                let data3 = data.filter(data => !data.hospital.defaultBookHospital)
                this.setState({
                    data2,
                    data3
                })
                console.log(data2, 'data2');
            }
        })
    }
    onPressService = (item, key, index) => {
        this.setState({
            service: key,
            isVisible: true,
            index: index,
        }, () => {
            this.props.dispatch({ type: constants.action.action_select_hospital_get_ticket, value: item })
        });
    }
    defaultBookHospital
    onCloseModal = () => this.setState({ isVisible: false, service: 0 })
    renderItem = (item, index) => {
        return (
            <View style={[styles.viewItem,index > 0 ? {borderTopWidth:0}:{borderTopWidth:1}]} key={index}>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: -10 }}>
                    <ScaledImage style={{ width: 60, height: 60, borderRadius: 30, borderColor: 'rgba(0,0,0,0.15)', borderWidth: 1 }} source={{ uri: item.hospital.avatar.absoluteUrl() }}></ScaledImage>
                    <View style={{ width: 60, marginTop: 5 }}>
                        <StarRating
                            disabled={true}
                            starSize={12}
                            maxStars={5}
                            rating={item.hospital.rankHospital}
                            starStyle={{ margin: 0 }}
                            fullStarColor={"#fbbd04"}
                            emptyStarColor={"#fbbd04"}
                        />
                    </View>
                </View>
                <View style={{ marginHorizontal: 20, flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>{item.hospital.name}</Text>
                        <ScaledImage style={{ marginLeft: 8, }} height={12} source={require("@images/new/booking/ic_checked.png")} ></ScaledImage>
                    </View>
                    <Text>{item.hospital.address}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={this.onPressService.bind(this, item, 1, item.index)} style={[styles.btnService, this.state.service && this.state.service == 1 && this.state.index == item.index ? { backgroundColor: '#0A9BE1' } : { backgroundColor: '#D7D7D9' }]}><Text style={[styles.txService, this.state.service && this.state.service == 1 && this.state.index == item.index ? { color: '#fff' } : { color: '#6B6B6C' }]}>Khám DV</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this.onPressService.bind(this, item, 2, item.index)} style={[styles.btnService, { width: 62 }, this.state.service && this.state.service == 2 && this.state.index == item.index ? { backgroundColor: '#0A9BE1' } : { backgroundColor: '#D7D7D9' }]}><Text style={[styles.txService, this.state.service && this.state.service == 2 && this.state.index == item.index ? { color: '#fff' } : { color: '#6B6B6C' }]}>BHYT</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this.onPressService.bind(this, item, 3, item.index)} style={[styles.btnService, this.state.service && this.state.service == 3 && this.state.index == item.index ? { backgroundColor: '#0A9BE1' } : { backgroundColor: '#D7D7D9' }]}><Text style={[styles.txService, this.state.service && this.state.service == 3 && this.state.index == item.index ? { color: '#fff' } : { color: '#6B6B6C' }]}>BHYT CA</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.viewTx}>
                    <TextInput placeholder={"Tìm kiếm…"} underlineColorAndroid={"transparent"} returnKeyType='search'
                        style={{ width: '80%', height: 41 }}></TextInput>
                    <ScaledImage source={require('@images/new/hospital/ic_search.png')} height={16}></ScaledImage>
                </View>
                <ScrollView>
                    {
                        (this.state.data2 && this.state.data2.length > 0) &&
                        <View>
                            <Text style={{marginLeft:10,marginTop:20,fontSize:12,marginBottom:10,color:'#4a4a4a'}}>Bệnh viện đã triển khai</Text>
                            {this.state.data2.map((item, index) => {
                                return this.renderItem(item, index)
                            })}
                        </View>
                    }
                    {
                        (this.state.data3 && this.state.data3.length > 0) &&
                        <View>
                            <Text style={{marginLeft:10,marginTop:20,fontSize:12,marginBottom:10,color:'#4a4a4a'}}>Bệnh viện sắp triển khai</Text>
                            {this.state.data3.map((item, index) => {
                                return this.renderItem(item, index)
                            })}
                        </View>
                    }
                </ScrollView>
                <Modal animationType="fade"
                    onBackdropPress={this.onCloseModal}
                    transparent={true} isVisible={this.state.isVisible} style={styles.viewModal} >
                    <View style={styles.viewModal}>
                        <View style={styles.viewDialog}>
                            <Text style={styles.txDialog}>Lấy số khám</Text>
                            <View style={styles.viewBtnModal}>
                                <TouchableOpacity style={styles.viewBtn} onPress={() => {
                                    this.setState({ isVisible: false }, () => {
                                        this.props.navigation.navigate("scanQRCode");
                                    });
                                }} ><Text style={{ color: '#fff' }} >Lấy số cho tôi</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.viewBtn2} onPress={() => {
                                    this.setState({ isVisible: false }, () => {
                                        this.props.navigation.navigate("login", {
                                            nextScreen: { screen: "scanQRCode", param: {} }
                                        });
                                    });
                                }} ><Text style={{ color: '#4A4A4A' }}>Lấy số hộ</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewTx: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: 'rgba(0,0,0,0.26)' },
    viewItem: { padding: 10, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.26)', flexDirection: 'row',borderTopWidth:1 },
    btnService: { justifyContent: 'center', alignItems: 'center', width: 82, height: 25, marginRight: 5, borderRadius: 6, marginVertical: 10, },
    txService: { fontSize: 11, },
    viewBtnModal: { flexDirection: 'row' },
    viewModal: { flex: 1, justifyContent: 'center', alignItems: 'center', },
    viewDialog: { height: 147, width: 308, backgroundColor: '#fff', alignItems: 'center', borderRadius: 6 },
    viewBtn: { width: 120, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: '#0A9BE1', marginRight: 5 },
    txDialog: { marginVertical: 20 },
    viewBtn2: { width: 120, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.06)', marginRight: 5, borderWidth: 1, borderColor: '#979797' }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(GetNewTicket);