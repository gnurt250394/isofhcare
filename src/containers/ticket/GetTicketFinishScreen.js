import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Dash from 'mainam-react-native-dash-view';
import Modal from '@components/modal';
import NavigationService from "@navigators/NavigationService";
import dateUtils from 'mainam-react-native-date-utils'
import { connect } from "react-redux";
import ScaledImage from 'mainam-react-native-scaleimage';
class GetTicketFinishScreen extends Component {
    state = {

    }
    componentDidMount() {
        this.setState({
            ticketFinish: true,
        })
    }
    onCloseTicket = () => {
        this.setState({
            ticketFinish: false
        })
        NavigationService.pop()
    }
    render() {
        let { hospital, numberHospital } = this.props.navigation.state.params;
        if (!hospital || !numberHospital) {
            this.props.navigation.pop();
            return null;
        }
        let width = 300;
        const DEVICE_WIDTH = Dimensions.get('window').width;

        if (width > DEVICE_WIDTH - 50)
            width = DEVICE_WIDTH - 50;
        return (
            <View style={{ position: 'relative', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.pop();
                }} style={{ backgroundColor: '#00000050', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}></TouchableOpacity>

                <View style={styles.container} pointerEvent='none'>
                    <View style={styles.viewDialog}>
                        <View style={{ backgroundColor: '#FFF', width: width, alignItems: 'center', borderTopLeftRadius: 7, borderTopRightRadius: 7 }}>
                            <Text style={{ color: 'rgb(39,174,96)', fontWeight: '600', marginVertical: 20, marginBottom: 15, fontSize: 16 }}>Lấy số tiếp đón thành công!</Text>
                        </View>
                        <ScaledImage source={require("@images/new/ticket/split.png")} width={width} />
                        <View style={{ backgroundColor: '#FFF', width: width, alignItems: 'center', marginTop: -2 }}>
                            <Text style={{ textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 }}>Số tiếp đón của bạn tại {hospital.name} ngày {numberHospital.createdDate.toDateObject('-').format("dd/MM/yyyy")} là:</Text>
                        </View>
                        <View style={{ position: "relative" }}>
                            <ScaledImage source={require("@images/new/ticket/body.png")} width={width} />
                            <Text style={{ fontSize: 80, color: '#9013fe', textAlign: 'center', fontWeight: 'bold', position: 'absolute', left: 0, right: 0, top: 0 }}>{numberHospital.number}</Text>
                        </View>
                        <View style={{ height: 1, width: width, backgroundColor: "#e5e5e5" }}></View>

                        <TouchableOpacity style={{ backgroundColor: '#FFF', width: width, alignItems: 'center', paddingVertical: 5, borderBottomLeftRadius: 7, borderBottomRightRadius: 7 }} onPress={() => {
                            this.setState({ ticketFinish: false }, () => {
                                setTimeout(() => {
                                    this.props.navigation.navigate("selectHealthFacilitiesScreen", {
                                        selectTab: 1,
                                        requestTime: new Date()
                                    });
                                }, 700);
                                this.props.navigation.pop();
                            })
                        }}>
                            <Text style={{ color: "#27ae60", marginVertical: 10, fontSize: 16 }}>Xem chi tiết</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center'
    },
    viewDialog: {
        position: 'relative',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
        borderRadius: 6,
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(GetTicketFinishScreen);