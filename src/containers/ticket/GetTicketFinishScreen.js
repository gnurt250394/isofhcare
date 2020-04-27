import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Dash from 'mainam-react-native-dash-view';
import Modal from '@components/modal';
import NavigationService from "@navigators/NavigationService";
import dateUtils from 'mainam-react-native-date-utils'
import { connect } from "react-redux";
import ScaledImage from 'mainam-react-native-scaleimage';
import constants from "@resources/strings";

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
    goBack = () => {
        this.props.navigation.pop();
    }
    onSelectHealthFacilities = () => {
        this.setState({ ticketFinish: false }, () => {
            setTimeout(() => {
                this.props.navigation.navigate("selectHealthFacilitiesScreen", {
                    selectTab: 1,
                    requestTime: new Date()
                });
            }, 700);
            this.props.navigation.pop();
        })
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
            <View style={styles.group}>
                <TouchableOpacity onPress={this.goBack} style={styles.buttonBack}></TouchableOpacity>

                <View style={styles.container} pointerEvent='none'>
                    <View style={styles.viewDialog}>
                        <View style={[styles.containerGetTicket,{width}]}>
                            <Text style={styles.txtGetticket}>{constants.ehealth.get_ticket_success}</Text>
                        </View>
                        <ScaledImage source={require("@images/new/ticket/split.png")} width={width} />
                        <View style={[styles.containerGetTickerHospital,{width}]}>
                            <Text style={styles.txtGetTickethospital}>Số tiếp đón của bạn tại {hospital.name} ngày {numberHospital.createdDate.toDateObject('-').format("dd/MM/yyyy")} là:</Text>
                        </View>
                        <View style={{ position: "relative" }}>
                            <ScaledImage source={require("@images/new/ticket/body.png")} width={width} />
                            <Text style={styles.txtNumberHospital}>{numberHospital.number}</Text>
                        </View>
                        <View style={[styles.between, { width }]}></View>

                        <TouchableOpacity style={[styles.buttonSelectHealthFacilities, { width }]} onPress={this.onSelectHealthFacilities}>
                            <Text style={styles.txtDetails}>{constants.details}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    txtDetails: {
        color: "#27ae60",
        marginVertical: 10,
        fontSize: 16
    },
    buttonSelectHealthFacilities: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7
    },
    between: {
        height: 1,
        backgroundColor: "#e5e5e5"
    },
    txtNumberHospital: {
        fontSize: 80,
        color: '#9013fe',
        textAlign: 'center',
        fontWeight: 'bold',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0
    },
    txtGetTickethospital: {
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10
    },
    containerGetTickerHospital: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        marginTop: -2
    },
    txtGetticket: {
        color: 'rgb(39,174,96)',
        fontWeight: '600',
        marginVertical: 20,
        marginBottom: 15,
        fontSize: 16
    },
    containerGetTicket: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7
    },
    buttonBack: {
        backgroundColor: '#00000050',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    group: {
        position: 'relative',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
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
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(GetTicketFinishScreen);