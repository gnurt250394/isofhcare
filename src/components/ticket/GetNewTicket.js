import React, { PureComponent } from 'react'
import { Text, View, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native'
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
        index: '',
        keyword: ''

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
                let stringQuyery = this.state.keyword ? this.state.keyword.trim() : ""
                if (stringQuyery) {
                    dataSearch = data.filter(data => {
                        const dataItem = `${data.hospital.name.toUpperCase()} ${data.hospital.address.toUpperCase()}`

                        return (dataItem.indexOf(stringQuyery) > -1
                        )
                    })
                    this.setState({
                        dataSearch: dataSearch
                    })
                    console.log(dataSearch);
                }

            }
        })
    }
    onPressService = (item, key, index) => {
        if(item.hospital.id == 165 && key == 1 ){
            this.setState({
                isShowErr : true
            })
            return
        }
        if( item.hospital.id == 165 && key == 3 || !item.hospital.defaultBookHospital ){
            
            return
        }
        this.setState({
            service: key,
            isVisible: true,
            index: item.hospital.id,
        }, () => {
            this.props.dispatch({ type: constants.action.action_select_hospital_get_ticket, value: item })
        });
    }
    search = () => {
        this.getListHospital()

    }
    onCloseModal = () => this.setState({ isVisible: false, service: 0 })
    onCloseErr = () => this.setState({isShowErr:false})
    renderItem = (item, index) => {
        return (
            <View style={[styles.viewItem, index > 0 ? { borderTopWidth: 0 } : { borderTopWidth: 1 }]} key={index}>

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
                        <TouchableOpacity onPress={this.onPressService.bind(this, item, 1, index)} style={[styles.btnService, this.state.service && this.state.service == 1 && this.state.index == item.hospital.id ? { backgroundColor: '#0A9BE1' } : { backgroundColor: '#D7D7D9' }]}><Text style={[styles.txService, this.state.service && this.state.service == 1 && this.state.index == item.hospital.id ? { color: '#fff' } : { color: '#6B6B6C' }]}>Khám DV</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this.onPressService.bind(this, item, 2, index)} style={[styles.btnService, { width: 62 }, this.state.service && this.state.service == 2 && this.state.index == item.hospital.id ? { backgroundColor: '#0A9BE1' } : { backgroundColor: '#D7D7D9' }]}><Text style={[styles.txService, this.state.service && this.state.service == 2 && this.state.index == item.hospital.id ? { color: '#fff' } : { color: '#6B6B6C' }]}>BHYT</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this.onPressService.bind(this, item, 3, index)} style={[styles.btnService, this.state.service && this.state.service == 3 && this.state.index == item.hospital.id ? { backgroundColor: '#0A9BE1' } : { backgroundColor: '#D7D7D9' }]}><Text style={[styles.txService, this.state.service && this.state.service == 3 && this.state.index == item.hospital.id ? { color: '#fff' } : { color: '#6B6B6C' }]}>BHYT CA</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    render() {
        const deviceWidth = Dimensions.get("window").width;
        const deviceHeight = Platform.OS === "ios"
            ? Dimensions.get("window").height
            : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.viewTx}>
                    <TextInput
                        value={this.state.keyword}
                        onChangeText={s => {
                            this.setState({ keyword: s })
                        }}
                        onSubmitEditing={this.search.bind(this)}
                        returnKeyType='search'
                        style={{ width: '80%', height: 41 }} placeholder={"Tìm kiếm…"} underlineColorAndroid={"transparent"} />
                    <TouchableOpacity onPress={this.search}><ScaledImage source={require('@images/new/hospital/ic_search.png')} height={16}></ScaledImage></TouchableOpacity>
                </View>
                {this.state.dataSearch && this.state.keyword ? (

                    (this.state.dataSearch && this.state.dataSearch.length > 0) &&
                    <View>
                        {this.state.dataSearch.map((item, index) => {
                            return this.renderItem(item, index)
                        })}
                    </View>

                ) : (


                    <ScrollView>
                    {
                        (this.state.data2 && this.state.data2.length > 0) &&
                        <View>
                            <Text style={{marginLeft:10,marginTop:20,fontSize:15,marginBottom:10,color:'#4a4a4a'}}>Bệnh viện đã triển khai</Text>
                            {this.state.data2.map((item, index) => {
                                return this.renderItem(item, index)
                            })}
                        </View>
                    }
                    {
                        (this.state.data3 && this.state.data3.length > 0) &&
                        <View>
                            <Text style={{marginLeft:10,marginTop:20,fontSize:15,marginBottom:10,color:'#4a4a4a'}}>Bệnh viện sắp triển khai</Text>
                            {this.state.data3.map((item, index) => {
                                return this.renderItem(item, index)
                            })}
                        </View>
                    }
                </ScrollView>
                )}
                <Modal animationType="fade"
                    onBackdropPress={this.onCloseModal}
                    transparent={true} isVisible={this.state.isVisible} style={[styles.viewModal]}
                    deviceWidth={deviceWidth}
                    deviceHeight={deviceHeight}
                >
                    <View style={styles.viewModal}>
                        <View style={styles.viewDialog}>
                            <Text style={styles.txDialog}>Lấy số khám</Text>
                            <View style={styles.viewBtnModal}>
                                <TouchableOpacity style={styles.viewBtn} onPress={() => {
                                    this.setState({ isVisible: false }, () => {
                                        this.props.navigation.navigate("scanQRCode");
                                    });
                                }} ><Text style={{ color: '#fff', fontWeight: 'bold' }} >Lấy số cho tôi</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.viewBtn2} onPress={() => {
                                    this.setState({ isVisible: false }, () => {
                                        this.props.navigation.navigate("login", {
                                            nextScreen: { screen: "scanQRCode", param: {} }
                                        });
                                    });
                                }} ><Text style={{ color: '#4A4A4A', fontWeight: 'bold' }}>Lấy số hộ</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="fade"
                onBackdropPress={this.onCloseErr}
                transparent={true} isVisible={this.state.isShowErr} >
                <View style={styles.viewModal}>
                    <View style={styles.viewDialog}>
                        <Text style={{marginVertical:10,fontWeight:'bold',color:'#4a4a4a'}}>Thông báo</Text>
                       <Text style={{marginBottom:20, color:'#4a4a4a',marginHorizontal:20,textAlign:'center'}}>Đối tượng dịch vụ tại bệnh viện E không cần có số khám</Text>
                       <View style={{width:'100%',height:1,backgroundColor:'#d8d8d8',marginBottom:-10}}></View>
                       <TouchableOpacity style={{alignItems:'center',justifyContent:'center',marginTop:10,flex:1}} onPress ={this.onCloseErr}><Text style={{color:'#02c39a'}}>OK</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewTx: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: 'rgba(0,0,0,0.26)' },
    viewItem: { padding: 10, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.26)', flexDirection: 'row', borderTopWidth: 1 },
    btnService: { justifyContent: 'center', alignItems: 'center', width: 82, height: 25, marginRight: 5, borderRadius: 6, marginVertical: 10, },
    txService: { fontSize: 11, },
    viewBtnModal: { flexDirection: 'row' },
    viewModal: { flex: 1, justifyContent: 'center', alignItems: 'center', margin: 0, padding: 0 },
    viewDialog: { backgroundColor: '#fff', alignItems: 'center', borderRadius: 6, padding: 20 },
    viewBtn: { width: 120, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: '#0A9BE1', marginRight: 7 },
    txDialog: { marginBottom: 20, color: '#4a4a4a', fontWeight: 'bold', fontSize: 16 },
    viewBtn2: { width: 120, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.06)', marginLeft: 7, borderWidth: 1, borderColor: '#979797' }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(GetNewTicket);