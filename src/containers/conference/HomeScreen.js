import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TouchableOpacity, ScrollView, Text, Image, FlatList, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import Header from '@components/Header';
import ScaleImage from 'mainam-react-native-scaleimage';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';
import conferenceProvider from '@data-access/conference-provider'
import keyValueProvider from '@data-access/keyvalue-provider'
import dateUtils from 'mainam-react-native-date-utils';
import constants from '@resources/strings';
import DialogBox from 'mainam-react-native-dialog-box';
import RNExitApp from 'react-native-exit-app';
import connectionUtils from '@utils/connection-utils';
import PushController from '@components/notification/PushController'
import DeviceInfo from 'react-native-device-info'
import redux from '@redux-store';
var dialogBroadcast;
import userProvider from '@data-access/user-provider';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listConference: [],
            isLoading: false,
            refreshing: false,
            size: 20,
            page: 1,
            finish: false,
            loading: false,
            locationEnabled: false
        }
        this.selectConference.bind(this);
    }


    componentDidMount() {
        this.onRefresh();
        if (!this.props.showPopupNewVersion) {
            this.props.dispatch({ type: constants.action.action_show_popup_notice_new_version });
            keyValueProvider.get(Platform.OS == "ios" ? constants.key.storage.ios_version : constants.key.storage.android_version, (s, e) => {
                if (s && s.code == 0 && s.data && s.data.keyValue) {
                    try {
                        let vs = s.data.keyValue.value;
                        if (vs != DeviceInfo.getBuildNumber()) {
                            let cur = parseInt(DeviceInfo.getBuildNumber());
                            let newcur = parseInt(vs);
                            if (newcur > cur)
                                this.showNeedUpdateApp();
                        }
                    } catch (error) {

                    }
                }
            });
        }
        connectionUtils.checkConnect(s => {
            if (!s) {
                this.showDialogExitApp();
            }
        })
        connectionUtils.addEventListener((s) => {
            if (s) {
                this.dialogbox.close();
            } else {
                this.showDialogExitApp();
            }
        })

        dialogBroadcast = this.dialogBroadcast;
        this.notification.getWrappedInstance().setBroadcastListener(this.showBroadcast);
    }


    showBroadcast(messaging) {
        try {
            console.log(messaging)
            if (messaging.type == 3) {
                Actions.detailNotification({ messaging: messaging })
            }
            else {
                var message = messaging.message;
                var viewMore = false;
                if (message.length > 200) {
                    viewMore = true;
                    message = message.substring(0, 200) + "...";
                }

                dialogBroadcast.tip({
                    title: [messaging.title],
                    content: [message],
                    btn: {
                        text: viewMore ? constants.detail : constants.exit,
                        style: {
                            color: 'red'
                        }
                    }
                }).then((event) => {
                    if (viewMore) {
                        Actions.detailNotification({ messaging: messaging })
                    }
                });
            }
        } catch (error) {

        }
    }



    showNeedUpdateApp() {
        this.dialogbox.confirm({
            content: [constants.msg.app.please_update_new_version],
            ok: {
                text: constants.update,
                style: {
                    color: 'red'
                },
                callback: () => {
                    if (Platform.OS == "ios") {
                        Linking.openURL('itms-apps://itunes.apple.com/us/app/id1400616503')
                    } else {
                        Linking.openURL('market://details?id=com.isofh.isofhcare')
                    }
                },
            },
            cancel: {
                text: constants.later,
                style: {
                    color: 'blue'
                },
                callback: () => {

                },
            }
        });
    }

    showDialogExitApp() {
        this.dialogbox.tip({
            title: constants.alert,
            content: [constants.msg.app.check_connection],
            btn: {
                text: constants.exit,
                style: {
                    color: 'red'
                },
                callback: () => {
                    RNExitApp.exitApp();
                },
            }
        }).then((event) => {
        });
    }

    onRefresh = () => {
        if (!this.state.loading)
            this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
                this.onLoad();
            });
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        })
        conferenceProvider.getByUser(this.props.userApp.currentUser.id, page, size, (s, e) => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
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
                            list = this.state.listConference;
                            list.push.apply(list, s.data.data);
                        }
                        else {
                            list = s.data.data;
                        }
                        this.setState({
                            listConference: [...list],
                            loading: false,
                            finish: finish
                        });
                        break;
                }
            }
        });
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState({ loadMore: true, refreshing: false, loading: true, page: this.state.page + 1 }, () => {
                this.onLoad(this.state.page)
            });
    }

    selectConference(item, userConference) {
        item.userConference = userConference
        this.props.dispatch(redux.selectConference(item, this.props.userApp.currentUser.id));
        Actions.detailConference();
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Trang chủ" hideActionbar={true} showFullScreen={true}>
                <Header title={"Trang chủ"} />
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center' }}>
                        <ScaleImage source={require("@images/logonhatminh.png")} width={174} style={{ marginTop: 20, marginBottom: 16 }} />
                        <View style={{ paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 17, paddingBottom: 17, backgroundColor: 'rgb(235,235,235)' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ marginBottom: 11, textAlign: 'right', fontSize: 20, fontWeight: '600' }}>{this.props.userApp.currentUser.degree} {this.props.userApp.currentUser.name}</Text>
                                <Text style={{ textAlign: 'right', fontSize: 14, color: '#00000050' }}>{userProvider.getFirstPosition(this.props.userApp.currentUser)}</Text>
                            </View>
                            <ImageProgress
                                indicator={Progress} resizeMode='cover' style={{ marginLeft: 13, width: 76, height: 76, }} imageStyle={{ width: 76, height: 76, borderRadius: 38 }} source={{ uri: this.props.userApp.currentUser.avatar ? this.props.userApp.currentUser.avatar.absoluteUrl() : "undefined" }}
                                defaultImage={() => {
                                    return <ScaleImage resizeMode='cover' source={require("@images/doctor.png")} width={76} style={{ marginLeft: 23, width: 76, height: 76, borderRadius: 38 }} />
                                }}
                            />
                        </View>
                        {
                            this.state.listConference && this.state.listConference.length > 0 ?
                                <Text style={{ marginTop: 26, marginBottom: 18, color: "rgb(192,33,38)", fontSize: 20 }}>Hội nghị sắp diễn ra</Text>
                                :
                                this.state.finish && (!this.state.listConference || this.state.listConference.length == 0)
                                    ?
                                    <Text style={{ textAlign: 'center', marginTop: 46, marginBottom: 18, color: "rgba(0,0,0,0.6)", fontSize: 15 }}>Không có hội nghị nào dành cho bạn vào lúc này</Text>
                                    :
                                    null
                        }
                    </View>
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                        onEndReached={this.onLoadMore.bind(this)}
                        onEndReachedThreshold={1}
                        // onScroll={e => this.setState({ marginTopHeader: e.nativeEvent.contentOffset.y })}
                        style={{ paddingTop: 5, flex: 1 }}
                        ref={ref => this.flatList = ref}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.listConference}
                        ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity onPress={() => this.selectConference(item.conference, item.userConference)}>
                                <View style={{
                                    elevation: 2,
                                    backgroundColor: 'white',
                                    paddingTop: 16, paddingBottom: 16,
                                    margin: 5,
                                    borderRadius: 4.7,
                                    padding: 10,
                                    flexDirection: 'row'
                                }} shadowColor='#000000' shadowOpacity={0.1} shadowOffset={{}}>
                                    <ImageProgress
                                        indicator={Progress} resizeMode='cover' style={{ borderRadius: 3.3, marginRight: 22, marginLeft: 27, width: 100, height: 70 }} imageStyle={{ width: 100, height: 70 }} source={{ uri: item.conference.logo ? item.conference.logo.absoluteUrl() : "undefined" }}
                                        defaultImage={() => {
                                            return <ScaleImage resizeMode='cover' source={require("@images/noimage.png")} width={100} style={{ borderRadius: 3.3, marginRight: 22, marginLeft: 27 }} />
                                        }}
                                    />
                                    <View style={{ flex: 1, marginTop: 8, marginRight: 20 }}>
                                        <Text style={{ fontWeight: "800", lineHeight: 21, fontSize: 16 }}>{item.conference.name}</Text>
                                        <Text style={{ color: '#00000060', marginTop: 11 }}>{new Date(item.conference.startTime).format('hh:mm dd/MM/yyyy')}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </View>
                {
                    this.state.loadMore ?
                        <View style={{ alignItems: 'center', padding: 10 }}>
                            <ScaleImage width={20} source={require("@images/loading2.gif")} />
                        </View> : null
                }
                <PushController ref={notification => { this.notification = notification }} />
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }} isOverlayClickClose={false} />
                <DialogBox ref={dialogBroadcast => { this.dialogBroadcast = dialogBroadcast }} isOverlayClickClose={false} />

            </ActivityPanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        showPopupNewVersion: state.showPopupNewVersion
    };
}
export default connect(mapStateToProps)(HomeScreen);