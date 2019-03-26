import React, { Component } from 'react';
import { Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import dateUtils from 'mainam-react-native-date-utils';
import constants from '@resources/strings'
import bookingProvider from '@data-access/booking-provider';
import {
    StyleSheet
} from 'react-native';

class DetailBookingNoCheckin extends Component {
    constructor(props) {
        super(props);
    }

    delete(bookingId, hospitalId) {
        let activity = this.props.activity;
        if (!activity)
            activity = this;
        activity.setState({
            isLoading: true
        }, () => {
            bookingProvider.delete(bookingId, hospitalId, (s, e) => {
                activity.setState({ isLoading: false })
                if (s) {
                    snackbar.show("Hủy lịch khám thành công", "success");
                    this.props.navigation.navigate("ehealth", { reloadTime: new Date().getTime() });
                } else {
                    snackbar.show("Hủy lịch khám không thành công", "danger");
                }
            })
        });
    }
    render() {
        let booking = this.props.booking;
        console.log(booking);
        return (
            <View style={{ padding: 10, flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <TouchableOpacity onPress={() => this.delete(booking.booking.id, booking.hospitalId)}>
                            <Text style={{ borderColor: 'red', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: 'red', fontWeight: 'bold' }}>Hủy khám</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}>
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
                                    this.props.booking.profile.name
                                }
                            </Text>

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <ScaleImage width={15} source={require("@ehealth/daihocy/resources/images/ic_location.png")} style={{ marginTop: 5 }} />
                            <Text style={{ marginLeft: 15 }}>
                                {
                                    // console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDD\n"+ JSON.stringify(this.props.booking.profile)+"\nDDDDDDDDDDDDDDDDDDDDDDDDDDD\n")
                                    this.props.booking.profile.address
                                }
                            </Text>
                        </View>
                        {
                            this.props.booking.profile.phone ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                    <ScaleImage width={20} source={require("@ehealth/daihocy/resources/images/ic_phone.png")} style={{ marginTop: 5 }} />
                                    <Text style={{ marginLeft: 10 }}>
                                        {
                                            this.props.booking.profile.phone
                                        }
                                    </Text>
                                </View> : null
                        }
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <ScaleImage width={20} source={require("@ehealth/daihocy/resources/images/ic_bookingDate.png")} style={{ marginTop: 5 }} />
                            <Text style={{ marginLeft: 10 }}>
                                {
                                    // (booking.booking.bookingDate + (booking.booking.bookingTime * 60 * 1000)).toDateObject().format("hh:mm Ngày dd/MM/yyyy")
                                    booking.booking.bookingTime.toDateObject('-').format("HH:mm ngày dd-MM-yyyy")
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
        navigation: state.navigation
    }
}
export default connect(mapStateToProps)(DetailBookingNoCheckin);