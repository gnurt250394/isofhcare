import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Dash from 'mainam-react-native-dash-view';
import Modal from 'react-native-modal';
import NavigationService from "@navigators/NavigationService";
import dateUtils from 'mainam-react-native-date-utils'
import { connect } from "react-redux";
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
        let data = this.props.navigation.state.params.data;
        if (!data) {
            this.props.navigation.pop();
            return null;
        }
        return (
            <View style={{ position: 'relative', flex: 1 }}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.pop();
                }} style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: '#00000050' }}>
                    <View></View>
                </TouchableOpacity>
                <View style={styles.container}>
                    <View style={styles.viewDialog}>
                        <Text style={{ color: 'rgb(39,174,96)', fontWeight: '600', marginVertical: 20 }}>Lấy số khám thành công!</Text>
                        <Dash dashColor={'gray'} style={{ height: 1, flexDirection: 'row', width: '90%' }} />
                        <Text style={{ textAlign: 'center', marginTop: 10 }}>Số khám của bạn tại bệnh viện E ngày {data.createdDate.toDateObject('-').format("dd/MM/yyyy")} là:</Text>
                        <Text style={{ fontSize: 55, color: '#9013fe', textAlign: 'center', fontWeight: 'bold', marginVertical: 10, }}>{data.number}</Text>
                        <View style={{ height: 1, width: '100%', backgroundColor: 'gray' }}></View>
                        <TouchableOpacity onPress={() => {
                            this.setState({ ticketFinish: false }, () => {
                                this.props.navigation.navigate("selectHealthFacilitiesScreen", {
                                    selectTab: 1,
                                    requestTime: new Date()
                                });
                            })
                        }}>
                            <Text style={{ color: "#27ae60", marginVertical: 10 }}>Xem chi tiết</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    viewDialog: {
        backgroundColor: '#fff',
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