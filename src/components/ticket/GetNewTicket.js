import React, { PureComponent } from 'react'
import { Text, View, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal';
import ScaledImage from 'mainam-react-native-scaleimage';
import StarRating from 'react-native-star-rating';
import ActivityPanel from "@components/ActivityPanel";
import { connect } from "react-redux";
import hospitalProvider from '@data-access/hospital-provider';
import constants from '@resources/strings';
class GetNewTicket extends PureComponent {
    state = {
        data: [{
            name: 'Bệnh viện E trung ương ',
            rating: 5,
            location: '69 trần duy hưng, trung hòa, cầu giấy, hà nội',
            image: 'https://vcdn-giaitri.vnecdn.net/2019/03/17/ngoc-trinh-7-6846-1552530069-9335-1552791273.jpg'
        }, {
            name: 'Bệnh viện E trung ương ',
            rating: 5,
            location: '69 trần duy hưng, trung hòa, cầu giấy, hà nội',
            image: 'https://vcdn-giaitri.vnecdn.net/2019/03/17/ngoc-trinh-7-6846-1552530069-9335-1552791273.jpg'
        }, {
            name: 'Bệnh viện E trung ương ',
            rating: 5,
            location: '69 trần duy hưng, trung hòa, cầu giấy, hà nội',
            image: 'https://vcdn-giaitri.vnecdn.net/2019/03/17/ngoc-trinh-7-6846-1552530069-9335-1552791273.jpg'
        }, {
            name: 'Bệnh viện E trung ương ',
            rating: 5,
            location: '69 trần duy hưng, trung hòa, cầu giấy, hà nội',
            image: 'https://vcdn-giaitri.vnecdn.net/2019/03/17/ngoc-trinh-7-6846-1552530069-9335-1552791273.jpg'
        },],
        service: null,
        index: ''

    }
    componentDidMount() {
        this.getListHospital()
    }
    getListHospital = () => {
        hospitalProvider.getDefaultHospital().then(res => {
            console.log(res);
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
    onCloseModal = () => this.setState({ isVisible: false, service: 0 })
    renderItem = (item) => {
        return (
            <View style={styles.viewItem}>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: -10 }}>
                    <ScaledImage style={{ width: 60, height: 60, borderRadius: 30, borderColor: 'rgba(0,0,0,0.15)', borderWidth: 1 }} source={{ uri: item.item.image }}></ScaledImage>
                    <View style={{ width: 60, marginTop: 5 }}>
                        <StarRating
                            disabled={true}
                            starSize={12}
                            maxStars={5}
                            rating={item.item.rating}
                            starStyle={{ margin: 0 }}
                            fullStarColor={"#fbbd04"}
                            emptyStarColor={"#fbbd04"}
                        />
                    </View>
                </View>
                <View style={{ marginHorizontal: 20, flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>Bệnh viện E Trung Ương</Text>
                        <ScaledImage style={{ marginLeft: 8, }} height={12} source={require("@images/new/booking/ic_checked.png")} ></ScaledImage>
                    </View>
                    <Text>{item.item.location}</Text>
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
                <FlatList

                    data={this.state.data}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                ></FlatList>
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
    viewTx: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.26)' },
    viewItem: { padding: 10, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.26)', flexDirection: 'row' },
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