import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import advertiseProvider from "@data-access/advertise-provider";
import Slide from '@components/slide/Slide'
import ScaledImage from 'mainam-react-native-scaleimage';
import { Card } from 'native-base';
const DEVICE_WIDTH = Dimensions.get("window").width;
import { connect } from "react-redux";
import snackbar from "@utils/snackbar-utils";
class SlideBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ads: [
                "https://www.googleapis.com/storage/v1/b/isofh-care-dev/o/images%2fimg2@3x_9dd7cd71_775f_4d45_8f63_1cf8b5d8cf71.png?alt=media",
                "https://www.googleapis.com/storage/v1/b/isofh-care-dev/o/images%2fimg2@3x_9dd7cd71_775f_4d45_8f63_1cf8b5d8cf71.png?alt=media",
                "https://www.googleapis.com/storage/v1/b/isofh-care-dev/o/images%2fimg2@3x_9dd7cd71_775f_4d45_8f63_1cf8b5d8cf71.png?alt=media",
                "https://www.googleapis.com/storage/v1/b/isofh-care-dev/o/images%2fimg2@3x_9dd7cd71_775f_4d45_8f63_1cf8b5d8cf71.png?alt=media",
                "https://www.googleapis.com/storage/v1/b/isofh-care-dev/o/images%2fimg2@3x_9dd7cd71_775f_4d45_8f63_1cf8b5d8cf71.png?alt=media",
                "https://www.googleapis.com/storage/v1/b/isofh-care-dev/o/images%2fimg2@3x_9dd7cd71_775f_4d45_8f63_1cf8b5d8cf71.png?alt=media",
                "https://www.googleapis.com/storage/v1/b/isofh-care-dev/o/images%2fimg2@3x_9dd7cd71_775f_4d45_8f63_1cf8b5d8cf71.png?alt=media",
                "https://www.googleapis.com/storage/v1/b/isofh-care-dev/o/images%2fimg2@3x_9dd7cd71_775f_4d45_8f63_1cf8b5d8cf71.png?alt=media",
            ]
        }
    }
    componentDidMount() {

    }

    actions = [{
        icon: require("@images/new/home/ic_drug.png"),
        text: "MUA THUỐC\nONLINE",
        onPress: () => {
            snackbar.show("Tính năng đang phát triển", "");
        }
    },
    {
        icon: require("@images/new/home/ic_ticket.png"),
        text: "LẤY SỐ\nKHÁM",
        onPress: () => {
            if (this.props.userApp.isLogin)
                if (this.props.userApp.currentUser.bookingNumberHospital == true)
                    this.props.navigation.navigate("selectHealthFacilitiesScreen");
                else
                    snackbar.show("Tính năng đang phát triển", "");

            else
                this.props.navigation.navigate("login", {
                    nextScreen: { screen: "selectHealthFacilitiesScreen", param: {} }
                });
        }
    },
    {
        icon: require("@images/new/home/ic_booking.png"),
        text: "ĐẶT LỊCH\nKHÁM",
        onPress: () => {
            if (this.props.userApp.isLogin)
                if (this.props.userApp.currentUser.bookingStatus != false || this.props.userApp.currentUser.bookingStatus == undefined)
                    this.props.navigation.navigate("addBooking");
                else
                    snackbar.show("Tính năng đang phát triển", "");

            else
                this.props.navigation.navigate("login", {
                    nextScreen: { screen: "addBooking", param: {} }
                });
        }
    },
    {
        icon: require("@images/new/home/ic_ehealth.png"),
        text: "Y BẠ\nĐIỆN TỬ",
        onPress: () => {
            if (this.props.userApp.isLogin)
                this.props.navigation.navigate("ehealth");
            else
                this.props.navigation.navigate("login", {
                    nextScreen: { screen: 'ehealth' }
                });
        }
    },
    {
        icon: require("@images/new/home/ic_question.png"),
        text: "BÁC SĨ\nTƯ VẤN",
        onPress: () => {
            this.props.navigation.navigate("listQuestion");
        }
    }]

    getActionWidth() {
        let width = Dimensions.get("window").width;
        let itemWidth = ((width - 20) / 5) - 10;
        if (itemWidth > 100)
            return 100;
        return itemWidth;
    }

    render() {
        let width = Dimensions.get("window").width;
        let height = width / 1.93;
        let itemWidth = this.getActionWidth();
        return (
            <View style={[styles.containner, { height: height + 70 }]}>
                <Slide
                    style={{ position: 'relative' }}
                    indicatorStyle={
                        {
                            position: 'absolute',
                            bottom: 100, left: 0, right: 0,
                        }
                    }
                    indicatorItemActive={{
                        width: 8,
                        height: 8,
                        backgroundColor: 'transparent',
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: '#FFF',
                    }}
                    indicatorItem={{
                        width: 8,
                        height: 8,
                        backgroundColor: '#FFF',
                        borderRadius: 4,
                    }}
                    // autoPlay={true} inteval={2000} 
                    dataArray={this.state.ads} renderItemPager={(item, index) => {
                        return <View style={{ width: width, height: height }} >
                            <Image source={{ uri: item }} style={{ width: width, height: height }} resizeMode="cover" />
                        </View>
                    }} />
                <View style={styles.actions}>
                    {
                        this.actions.map((item, index) => {
                            return <TouchableOpacity key={index} style={{ marginHorizontal: 2 }} onPress={item.onPress}>
                                <Card style={[styles.action_item, { width: itemWidth }]}>
                                    <ScaledImage source={item.icon} height={40} width={40} />
                                    <Text style={styles.action_text} numberOfLines={2}>{(item.text || "").toUpperCase()}</Text>
                                </Card>
                            </TouchableOpacity>
                        })
                    }
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    containner:
    {
        position: "relative",
    },
    actions:
    {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    action_item: {
        // marginVertical: 10,
        padding: 2, borderRadius: 5,
        alignItems: 'center',
        paddingVertical: 10,
    },
    action_text: { fontWeight: 'bold', fontSize: 9, marginTop: 5, textAlign: "center" }
});
function mapStateToProps(state) {
    return {
        navigation: state.navigation,
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(SlideBanner);
