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
            ads: []
        }
    }

    setAds(ads) {
        this.setState({
            ads: ads
        });
    }

    getAds() {
        return advertiseProvider.getListBanner();
    }

    getListBanner(reload) {
        if (reload)
            return;
        advertiseProvider.getListBanner().then(s => {
            if (s.length == 0) {
                if (!reload)
                    this.getListBanner(true);
            }
            this.setState({
                ads: s
            });
        }).catch(e => {
            if (!reload)
                this.getListBanner(true);
        });
    }
    componentWillMount() {
        this.getListBanner();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.countReset) {
            this.getListBanner()
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
                    this.props.navigation.navigate("getTicket");
                else
                    snackbar.show("Tính năng đang phát triển", "");

            else
                this.props.navigation.navigate("login", {
                    nextScreen: { screen: "getTicket", param: {} }
                });
        }
    },
    {
        icon: require("@images/new/home/ic_booking.png"),
        text: "ĐẶT LỊCH\nKHÁM",
        onPress: () => {
            if (this.props.userApp.isLogin)
                if (this.props.userApp.currentUser.bookingStatus != false || this.props.userApp.currentUser.bookingStatus == undefined)
                    this.props.navigation.navigate("addBooking1");
                else
                    snackbar.show("Tính năng đang phát triển", "");

            else
                this.props.navigation.navigate("login", {
                    nextScreen: { screen: "addBooking1", param: {} }
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
                    // autoPlay={true} inteval={5000}
                    dataArray={this.state.ads} renderItemPager={(item, index) => {
                        return <View style={{ width: width, height: height }} >
                            <Image source={{ uri: (item.images ? item.images.absoluteUrl() : "") }} style={{ width: width, height: height }} resizeMode="stretch" />
                        </View>
                    }} />
                <View style={styles.actions}>
                    {
                        this.actions.map((item, index) => {
                            return <View key={index} style={{ marginHorizontal: 2 }}>
                                <Card style={[{ width: itemWidth }]}>
                                    <TouchableOpacity onPress={item.onPress} style={styles.action_item}>
                                        <View style={styles.view_image_action}>
                                            <ScaledImage source={item.icon} height={30} width={30} />
                                        </View>
                                        <Text style={styles.action_text} numberOfLines={2}>{(item.text || "").toUpperCase()}</Text>
                                    </TouchableOpacity>
                                </Card>
                            </View>
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
        backgroundColor: '#fff'
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
    view_image_action: {
        width: 35, height: 30,
        justifyContent: 'center',
        alignItems: 'center',
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
