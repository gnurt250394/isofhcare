import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TouchableOpacity, Text, Platform, TextInput, ScrollView, FlatList, Linking } from 'react-native';
import { connect } from 'react-redux';
import Header from '@components/Header';
import ScaleImage from 'mainam-react-native-scaleimage';
import Dimensions from 'Dimensions';
const DEVICE_WIDTH = Dimensions.get('window').width;
import dateUtils from 'mainam-react-native-date-utils';
import clientUtils from '@utils/client-utils';
import convertUtils from 'mainam-react-native-convert-utils';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Bar';
import snackbar from '@utils/snackbar-utils';
import DialogBox from 'mainam-react-native-dialog-box';
import constants from '@resources/strings';
import conferenceProvider from '@data-access/conference-provider'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.conference.conference);
        var listFun = [];
        if (!this.props.conference || !this.props.conference.conference || !this.props.userApp.isLogin) {
            Actions.pop();
        }
        listFun.push({
            title: "Chương trình",
            icon: require("@images/icchuongtrinh.png"),
            action: Actions.program
        });
        if (this.props.userApp.currentUser.type == 1) {
            listFun.push({
                title: "Lịch trình",
                icon: require("@images/iclichtrinh.png"),
                action: Actions.schedule
            });
        } else {
            listFun.push({
                title: "Thành viên",
                icon: require("@images/icthanhvien.png"),
                action: Actions.member
            });
        }
        listFun.push({
            title: "Giới thiệu",
            icon: require("@images/icgioithieu.png"),
            action: Actions.aboutConference
        });
        if (this.props.userApp.currentUser.type == 1) {
            listFun.push({
                title: "Đặt câu hỏi",
                icon: require("@images/icdatcauhoi.png"),
                action: Actions.addQuestion
            });
        }
        else {
            listFun.push({
                title: "Câu hỏi",
                icon: require("@images/icdatcauhoi.png"),
                action: Actions.listQuestion
            });
        }
        listFun.push({
            title: "Nhà tài trợ",
            icon: require("@images/icnhataitro.png"),
            action: Actions.sponsor
        });
        listFun.push({
            title: "Hình ảnh",
            icon: require("@images/ichinhanh.png"),
            action: Actions.image
        });
        if (this.props.userApp.currentUser.type == 1) {
            listFun.push({
                title: "Hỗ trợ",
                icon: require("@images/ichotro.png"),
                action: Actions.support
            });
        } else {
            listFun.push({
                title: "Hỗ trợ",
                icon: require("@images/ichotro.png"),
                action: Actions.listSupport
            });
        }
        listFun.push({
            title: "Survey",
            icon: require("@images/icsurvey.png"),
            action: this.inDevelop//Actions.survey
        });
        listFun.push({
            title: "Hội nghị khác",
            icon: require("@images/ichoinghikhac.png"),
            action: Actions.home
        });
        if (listFun.length % 3 != 0)
            listFun.push({});
        if (listFun.length % 3 != 0)
            listFun.push({});
        this.state = {
            listFun: listFun
        }
    }
    inDevelop() {
        snackbar.show("Chức năng đang phát triển");
    }
    getBanner() {
        if (!this.props.conference || !this.props.conference.conference || !this.props.conference.conference.banner)
            return "";
        var title = convertUtils.toJsonArray(this.props.conference.conference.banner, []);
        if (!title.length)
            title = [];
        if (title.length > 0)
            return title[0].absoluteUrl();
        return "";

    }


    compareTwoLocation(a, b) {
        Promise.all([this.getPositionDetail(a.lat, a.lng), this.getPositionDetail(b.lat, b.lng)]).then(values => {
            try {
                var detail1 = values[0];
                var detail2 = values[1];
                var city1 = this.getCity(detail1);
                var city2 = this.getCity(detail2);
                if (city1 && city2) {
                    console.log(city1, city2);
                    if (city1 == city2) {
                        this.dialogbox.prompt({
                            title: "Xác nhận số người đi cùng bạn",
                            placeHolder: "Nhập số người đi kèm",
                            content: [this.props.conference.conference.userConference.attachment],
                            ok: {
                                text: constants.confirm,
                                style: {
                                    color: 'red'
                                },
                                callback: (result) => {
                                    let attachment = 0;
                                    try {
                                        attachment = parseInt(result);
                                    } catch (error) {

                                    }
                                    conferenceProvider.confirm(this.props.userApp.currentUser.id, this.props.conference.conference.id, attachment, (s, e) => {
                                        if (s && s.code == 0) {
                                            this.dialogbox.alert(constants.msg.app.user_confirm_attend.replace("{time}", new Date(this.props.conference.conference.startTime).format("\"hh:mm tt dd/MM/yyyy\"")));
                                        } else {
                                            snackbar.show(constants.msg.conference.confirm_at_city_failed);
                                        }
                                    });
                                },
                            },
                            cancel: {
                                text: constants.cancel,
                                style: {
                                    color: 'blue'
                                },
                                callback: () => {

                                },
                            }
                        });
                    } else {
                        this.dialogbox.alert(constants.msg.app.user_is_not_present_in_the_city + " " + city2);
                    }
                }
                else {
                    console.log(values); // [3, 1337, "foo"] 
                    snackbar.show(constants.msg.app.cannot_get_user_location);
                }
            } catch (error) {
                console.log(values); // [3, 1337, "foo"] 
                snackbar.show(constants.msg.app.cannot_get_user_location);
            }

        }).catch(e => snackbar.show(constants.msg.app.cannot_get_user_location));
    }

    getLocationFromGPS() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(position => {
                resolve(position);
            }, e => {
                reject(e);
            }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
        });
    }

    getLocationCallBack(resolve, reject) {
        if (Platform.OS == "ios") {
            this.getLocationFromGPS().then(p => { resolve(p) }).catch(e => { reject(e) });
        } else {
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                .then(data => {
                    setTimeout(() => {
                        this.getLocationFromGPS().then(p => { resolve(p) }).catch(e => { reject(e) });
                    }, 1500);
                });
        }
    }

    getLocation() {
        return new Promise(this.getLocationCallBack.bind(this));
    }
    showDialogConfirmOrCheckIn() {
        if (this.props.userApp.currentUser.type == 1) {
            if (this.props.conference.conference.userConference.checkin != 1) {
                var currentTime = new Date(new Date().format("MM/dd/yyyy"));
                var startTime = new Date(new Date(this.props.conference.conference.startTime).format("MM/dd/yyyy"));
                var endTime = new Date(new Date(this.props.conference.conference.endTime).format("MM/dd/yyyy"));
                if (currentTime < startTime) {
                    var t = startTime.getTime() - currentTime.getTime();
                    if (t < 1 * 60 * 60 * 1000) {
                        this.showDialogCheckin();
                    }
                    else {
                        if (t <= 24 * 60 * 60 * 1000 && this.props.conference.conference.userConference.confirmation == 0) {
                            this.showDialogConfirmAtCity();
                        }
                    }
                }
                else {
                    if (endTime < startTime) {
                        this.showDialogCheckin();
                    }
                }
            }
        }
    }
    showDialogCheckin() {
        this.getLocation().then(p => {
            var distance = this.getDistance({ lat: p.coords.latitude, lng: p.coords.longitude }, JSON.parse(this.props.conference.conference.map))
            console.log(distance);
            if (distance <= 500) {
                this.dialogbox.confirm({
                    content: [constants.msg.app.detect_near_conference_location.replace("{name}", "\"" + this.props.conference.conference.name + "\"")],
                    ok: {
                        text: constants.checkin,
                        style: {
                            color: 'red'
                        },
                        callback: () => {
                            this.setState({ isLoading: true });
                            conferenceProvider.checkin(this.props.userApp.currentUser.id, this.props.conference.conference.id, this.props.conference.conference.userConference.attachment, (s, e) => {
                                this.setState({ isLoading: false });
                                if (s && s.code == 0) {
                                    snackbar.show(constants.msg.conference.checkin_success);
                                    return;
                                }
                                snackbar.show(constants.msg.conference.checkin_failed);
                            })
                        },
                    },
                    cancel: {
                        text: constants.cancel,
                        style: {
                            color: 'blue'
                        },
                        callback: () => {

                        },
                    }
                });
            }
        }).catch(e => console.log(e));
    }
    getCity(result) {
        try {
            if (result.status === "OK") {
                if (result.results && result.results.length > 0) {
                    let t = result.results[0];
                    if (t.address_components && t.address_components.length > 2) {
                        return t.address_components[t.address_components.length - 2].long_name;
                    }
                }
            }
        } catch (error) {

        }
    }
    showDialogConfirmAtCity() {
        try {
            let map = JSON.parse(this.props.conference.conference.map);
            this.getPositionDetail(map.lat, map.lng).then(p => {
                let city = this.getCity(p);
                if (city) {
                    this.dialogbox.confirm({
                        content: [constants.msg.app.notice_checkin_in_city.replace("{time}", new Date(this.props.conference.conference.startTime).format("\"hh:mm tt dd/MM/yyyy\"")).replace("{city}", city)],
                        ok: {
                            text: constants.arrived,
                            style: {
                                color: 'red'
                            },
                            callback: () => {
                                this.getLocation().then(p =>
                                    this.compareTwoLocation({ lat: p.coords.latitude, lng: p.coords.longitude }, JSON.parse(this.props.conference.conference.map))
                                ).catch(e => snackbar.show(constants.msg.app.cannot_get_user_location));
                            },
                        },
                        cancel: {
                            text: constants.not_com_yet,
                            style: {
                                color: 'blue'
                            },
                            callback: () => {

                            },
                        }
                    });
                }
            });
        } catch (error) {

        }


    }
    getPositionDetail(lat, lon) {
        return new Promise((resolve, reject) => {
            var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&key=AIzaSyAvvczO0VScfZLr-_OYsCgktmsXmXQ8_68';
            clientUtils.requestFetch("get", url, {}, {}, (s, e) => {
                if (s) {
                    s.json().then(val => {
                        resolve(val);
                    }).catch(e => reject(e));
                } else {
                    reject(e);
                }
            })
        });
    }
    getRad(x) {
        return x * Math.PI / 180;
    }
    viewMap() {
        try {
            let map = JSON.parse(this.props.conference.conference.map);
            const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
            const latLng = map.lat + "," + map.lng;
            const label = this.props.conference.conference.name;
            const url = Platform.OS === 'ios' ? scheme + label + '@' + latLng :  scheme + label + '@' + latLng;
            Linking.openURL(url);

        } catch (error) {

        }
    }

    getDistance(p1, p2) {
        this.getPositionDetail(p1.lat, p1.lng);
        this.getPositionDetail(p2.lat, p2.lng);
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.getRad(p2.lat - p1.lat);
        var dLong = this.getRad(p2.lng - p1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.getRad(p1.lat)) * Math.cos(this.getRad(p2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    };

    componentDidMount() {
        this.showDialogConfirmOrCheckIn();
    }


    renderHeader() {
        return (<View>
            {/* <ScaleImage source={{ uri: this.getBanner() }} width={DEVICE_WIDTH} style={{ marginRight: 17 }} /> */}
            <ImageProgress
                indicator={Progress} resizeMode='cover' style={{ width: DEVICE_WIDTH, height: 150 }} imageStyle={{ width: DEVICE_WIDTH, height: 150 }} source={{ uri: this.getBanner() }}
            />
            <Text style={{ fontWeight: '700', fontSize: 16, marginTop: 17, textAlign: 'center', paddingLeft: 30, paddingRight: 30, lineHeight: 22 }}>{this.props.conference.conference.name}</Text>
            <TouchableOpacity onPress={() => { this.viewMap() }}>
                <View style={{
                    elevation: 5,
                    padding: 11,
                    marginTop: 14,
                    marginLeft: 18,
                    marginRight: 18,
                    backgroundColor: 'white',
                    borderRadius: 5.3,
                    marginBottom: 10,
                    borderColor: 'rgb(204, 204, 204)',
                    flexDirection: 'row'

                }} shadowColor='#000000' shadowOpacity={0.2} shadowOffset={{}}>
                    <ScaleImage source={require("@images/icmap.png")} width={30} style={{ marginRight: 17 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12 }}>{this.props.conference.conference.location}, {this.props.conference.conference.provinceName}</Text>
                        <Text style={{ marginTop: 8, fontWeight: 'bold', fontSize: 12 }}>{this.props.conference.conference.startTime.toDateObject().format("hh:mm dd/MM/yyyy")} - {this.props.conference.conference.endTime.toDateObject().format("hh:mm dd/MM/yyyy")}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>);
    }


    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} hideActionbar={true} showFullScreen={true}>
                <Header title={"Hội nghị"} />
                <FlatList
                    numColumns={3}
                    style={{ flex: 1, paddingBottom: 100 }}
                    ref={ref => this.flatList = ref}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.listFun}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                    renderItem={({ item, index }) =>
                        <View style={{ flex: 1 }}>
                            {
                                item.icon ?
                                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', padding: 5 }} onPress={() => { item.action() }}>
                                        <ScaleImage source={item.icon} width={67} />
                                        <Text style={{ marginTop: 8, fontWeight: '800', fontSize: 13, textAlign: 'center' }}>{item.title}</Text>
                                    </TouchableOpacity> :
                                    <View style={{ flex: 1 }} />
                            }
                        </View>
                    }
                />
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }} isOverlayClickClose={false} />

            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        conference: state.conference
    };
}
export default connect(mapStateToProps)(HomeScreen);