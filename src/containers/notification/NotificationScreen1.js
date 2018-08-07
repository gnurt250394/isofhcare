import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, WebView } from 'react-native';
import constants from '@resources/strings';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import notificationProvider from '@data-access/notification-provider';
import bookingProvider from '@data-access/booking-provider';
import dateUtils from 'mainam-react-native-date-utils';;
import client from '@utils/client-utils';
import snackbar from '@utils/snackbar-utils';
import stringUtils from 'mainam-react-native-string-utils';
import firebase from 'react-native-firebase';

let $this;
class DetailNotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                isLoading: false,
                listNotification: [],
                refreshing: false,
                size: 20,
                page: 1,
                finish: false,
                loading: false
            }

    }
    componentDidMount() {
        $this = this;
        this.onRefresh();
    }

    onRefresh = () => {
        if (!$this.state.loading)
            $this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
                $this.onLoad();
            });
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: true
        })
        notificationProvider.getByUser(this.props.userApp.currentUser.uid, page, size, (s, e) => {
            $this.setState({
                loading: false,
                refreshing: false,
            });
            if (s) {
                switch (s.code) {
                    case 0:
                        var list = [];
                        var finish = false;
                        if (s.data.data.length == 0) {
                            finish = true;
                        }
                        if (page != 1) {
                            list = this.state.listNotification;
                            list.push.apply(list, s.data.data);
                        }
                        else {
                            list = s.data.data;
                        }
                        $this.setState({
                            listNotification: [...list],
                            loading: false,
                            finish: finish
                        });
                        break;
                }
            }
        });
    }
    onLoadMore() {
        if (!$this.state.finish && !$this.state.loading)
            $this.setState({ refreshing: true, loading: true, page: $this.state.page + 1 }, () => {
                $this.onLoad($this.state.page)
            });
    }
    viewNotification(item, index) {
        item.isRead = 1;
        var item = this.state.listNotification[index];
        item.isRead = 1;
        this.setState({ listNotification: this.state.listNotification })
        notificationProvider.setRead(item.uid, function () { });
        switch (item.type) {
            case 10:
                $this.setState({
                    isLoading: true
                });
                bookingProvider.getDetail(item.detailId, function (s, e) {
                    $this.setState({
                        isLoading: false
                    }, () => {
                        try {
                            if (e) {
                                snackbar.show(constants.msg.booking.canot_view_detail_this_booking);
                            } else {
                                var data = JSON.parse(s.data.dataHis);
                                data.Profile.PatientHistoryId = s.data.dataBook.hisPatientHistoryId;
                                if (s && s.code == 0) {
                                    let booking = {
                                        profile: data.Profile,
                                        hasCheckin: true,
                                        data: data
                                    }
                                    $this.props.dispatch({ type: constants.action.action_view_booking_detail, value: booking });
                                    Actions.detailBooking();
                                }
                            }
                        } catch (error) {
                            snackbar.show(constants.msg.booking.canot_view_detail_this_booking);
                        }
                    })
                })
                break;
        }

        var count = --this.props.userApp.unReadNotificationCount;
        this.props.dispatch({ type: constants.action.action_change_notification_count, value: count })
        firebase.notifications().setBadge(count);
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Thông báo" isLoading={this.state.isLoading}>
                <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    onEndReached={this.onLoadMore}
                    onEndReachedThreshold={1}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.listNotification}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity onPress={() => this.viewNotification(item, index)}>
                            <View style={{ marginBottom: 2, backgroundColor: '#FFF', padding: 10, flexDirection: 'row', borderBottomColor: '#e5fafe', borderBottomWidth: 2 }}>
                                <View style={{ width: 60, height: 60, paddingTop: 5, paddingLeft: 5, position: 'relative' }}>
                                    {
                                        item.userAvatar ?
                                            <Image resizeMode='cover' source={{ uri: item.userAvatar.absoluteUrl() }} style={{ width: 55, height: 55, marginRight: 10, borderColor: '#6ae3f1', padding: 2, borderWidth: 1, borderRadius: 5 }} />
                                            :
                                            <Image resizeMode='cover' source={require("@images/ic_account_logo.png")} style={{ width: 55, height: 55, marginRight: 10, borderColor: '#6ae3f1', padding: 2, borderWidth: 1, borderRadius: 5 }} />
                                    }
                                    <View style={{ width: 15, height: 15, borderColor: '#999', borderWidth: 1, borderRadius: 7, backgroundColor: "#FFF", top: 0, left: 0, position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={item.isRead == 0 ? styles.unRead : styles.isRead}>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    {/* <WebView style={{ minHeight: 50, marginLeft: -9 }} html={'<div style="font-size: 13px;">' + (item.userDisplayName ? '<b style="margin-right: 5px">' + item.userDisplayName + '</b>' : '') + item.content + "</div>"} /> */}
                                    <Text style={[item.isRead == 0 ? styles.textUnRead : styles.textIsRead]}>
                                        {item.content}
                                    </Text>
                                    <Text style={{ color: '#999', fontSize: 12 }}>
                                        {item.createdDate.toDateObject().getPostTime()}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </ActivityPanel >
        )
    }
}
const styles = StyleSheet.create({
    isRead: { width: 8, height: 8, backgroundColor: "#999", borderRadius: 4 },
    unRead: { width: 8, height: 8, backgroundColor: "#2175ca", borderRadius: 4 },
    textUnRead: {
        color: '#2175ca'
    },
    textIsRead: {
        color: '#999'
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(DetailNotificationScreen);