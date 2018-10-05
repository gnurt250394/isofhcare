import React, { Component } from 'react';
import { Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';

import {
    StyleSheet
} from 'react-native';

class DetailBookingNoCheckin extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let booking = this.props.booking.booking;

        return (
            <View style={{ padding: 10, flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Khoa</Text>
                        <ScaleImage width={60} source={require("@ehealth/daihocy/resources/images/img_breakline.png")} style={{ marginTop: 5 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ flex: 1 }}>
                                {booking.department.name}
                            </Text>
                        </View>
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Dịch vụ: (giá tạm tính)</Text>
                        <ScaleImage width={60} source={require("@ehealth/daihocy/resources/images/img_breakline.png")} style={{ marginTop: 5 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <ScaleImage width={7} source={require("@ehealth/daihocy/resources/images/ic_dot.png")} />
                            <Text style={{ flex: 1, marginLeft: 10 }}>
                                {booking.specialist.name}
                            </Text>
                            <Text>
                                {booking.service.price.formatPrice() + " đ"}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontWeight: 'bold', marginRight: 10 }}>
                                Nơi khám:
                                </Text>
                            <Text>
                                {booking.room.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>
                                Bác sĩ: </Text>
                            <Text style={{ marginLeft: 10 }}>
                                {booking.doctor.academicRankShortName + " " + booking.doctor.fullname}
                            </Text>
                        </View>

                        {
                            booking.booking && booking.booking.sequenceNo ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', marginRight: 10 }}>
                                        Số khám:
                            </Text>
                                    <Text>
                                        {booking.booking.sequenceNo}
                                    </Text>
                                </View> : null
                        }
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
                            Thông tin cá nhân
        </Text>
                        <ScaleImage width={60} source={require("@ehealth/daihocy/resources/images/img_breakline.png")} style={{ marginTop: 5 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <ScaleImage width={20} source={require("@ehealth/daihocy/resources/images/ic_info.png")} style={{ marginTop: 5 }} />
                            <Text style={{ marginLeft: 10 }}>
                                {
                                    this.props.booking.profile.profile.name
                                }
                            </Text>

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <ScaleImage width={22} source={require("@ehealth/daihocy/resources/images/ic_location.png")} style={{ marginTop: 5 }} />
                            <Text style={{ marginLeft: 5 }}>
                                {
                                    // console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDD\n"+ JSON.stringify(this.props.booking.profile.profile)+"\nDDDDDDDDDDDDDDDDDDDDDDDDDDD\n")
                                    this.props.booking.profile.profile.address
                                }
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <ScaleImage width={20} source={require("@ehealth/daihocy/resources/images/ic_bookingDate.png")} style={{ marginTop: 5 }} />
                            <Text style={{ marginLeft: 10 }}>
                                {
                                    // (booking.booking.bookingDate + (booking.booking.bookingTime * 60 * 1000)).toDateObject().format("hh:mm Ngày dd/MM/yyyy")
                                    booking.booking.bookingTime
                                }
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    };
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    }
}
export default connect(mapStateToProps)(DetailBookingNoCheckin);