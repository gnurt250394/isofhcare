import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import constants from '@dhy/strings';
import ActivityPanel from '@components/ActivityPanel';
import TabBookingType from '@dhy/components/TabBookingType';
import ScaleImageWithoutAnim from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import userProvider from '@data-access/user-provider';
import profileProvider from '@dhy/data-access/booking-profile-provider';
// import { Actions } from 'react-native-router-flux';
import Dimensions from 'Dimensions';
import banner from '@images/booking/booking_banner.png'
import snackbar from '@utils/snackbar-utils';
import RequiredLogin from '@components/account/RequiredLogin';
import * as Animatable from 'react-native-animatable';

ScaleImage = Animatable.createAnimatableComponent(ScaleImageWithoutAnim);

class BookingScreen extends Component {
    Actions
    constructor(props) {
        super(props);
        this.state = {
            width: Dimensions.get('window').width,
            updateBanner: false,
            bycat: true,
        };
        // this.props.dispatch({ type: constants.action.action_init_booking})
    }
    filter(byCat) {
        this.setState({ bycat: byCat });
    }
    selectCategory() {
        this.props.dispatch({ type: constants.action.action_select_booking_specialist, value: null })

        if (!this.props.dhyBooking.currentDepartment) {
            snackbar.show(constants.msg.booking.please_select_department_first);
            return;
        }
        if (this.state.bycat) {
            // Actions.selectCategory()
            this.props.navigation.navigate("dhySelectSpeciaList")

        } else {
            this.props.navigation.navigate("dhySelectDoctor")
        }
    }
    itemChange() {
        this.filter(true);
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="ĐẶT KHÁM" showFullScreen={true}>
                <Animatable.View animation="bounceIn"
                    duration={2000}
                    delay={100} style={{ backgroundColor: '#fFF', flex: 1 }}>
                    <View>
                        <View style={{ backgroundColor: constants.colors.actionbar_color }}>
                            {/* <View style={{ padding: 10, height: 50, alignItems: 'center', flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', color: 'white', padding: 3, flex: 1, textAlign: 'center', fontSize: 18 }}>ĐẶT KHÁM</Text>
                            </View>
                        </View> */}
                            <TabBookingType itemChange={() => { this.itemChange() }}></TabBookingType>
                        </View>
                        <View >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >
                                {
                                    this.state.updateBanner ? <ScaleImage
                                        width={this.state.width}
                                        source={banner}
                                    /> :
                                        <View>
                                            <ScaleImage
                                                width={this.state.width}
                                                source={banner}
                                            />
                                        </View>


                                }
                                <View style={{ flex: 1, height: 1, backgroundColor: "#0c8c8b", margin: 10, marginBottom: 0 }} />
                                <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
                                    <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                                        this.filter(true);
                                    }} >
                                        <Image source={this.state.bycat ? require("@images/ic_radio1.png") : require("@images/ic_radio0.png")} style={{ width: 20, height: 20 }} />
                                    </TouchableOpacity>
                                    <Text style={{ marginLeft: 5, marginRight: 20, fontWeight: 'bold' }}>Chuyên khoa</Text>
                                    <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                                        this.filter(false);
                                    }} >
                                        <Image source={this.state.bycat ? require("@images/ic_radio0.png") : require("@images/ic_radio1.png")} style={{ width: 20, height: 20 }} />
                                    </TouchableOpacity>
                                    <Text style={{ marginLeft: 5, marginRight: 20, fontWeight: 'bold' }}>Bác sĩ</Text>
                                </View>
                                <TouchableOpacity onPress={() => { this.selectCategory() }}>
                                    <View style={{ position: 'relative', margin: 20, marginTop: 0, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ borderColor: "#0c8c8b", borderWidth: 1, padding: 10, flex: 1 }}>
                                            {this.state.bycat ? "Chọn chuyên khoa" : "Chọn bác sĩ"}
                                        </Text>
                                        <Image source={require("@images/icdropdown.png")} style={{ width: 14, height: 10, position: 'absolute', right: 10 }} />
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Animatable.View>
            </ActivityPanel>
        )
    }
}


function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        dhyBooking: state.dhyBooking
    };
}
export default connect(mapStateToProps)(BookingScreen);