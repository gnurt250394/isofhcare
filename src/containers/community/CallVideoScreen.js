import React, { Component } from "react";
import { AppRegistry } from "react-native";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
    Alert,
    PermissionsAndroid,
    BackHandler,
    AppState,
    DeviceEventEmitter,
    Vibration
} from "react-native";
import { each } from "underscore";
import firebase from 'react-native-firebase'
import { StringeeCall, StringeeVideoView } from "stringee-react-native";
import { connect } from "react-redux";
import RNCallKeep from 'react-native-callkeep'
var height = Dimensions.get("screen").height;
var width = Dimensions.get("window").width;
import StringUtils from 'mainam-react-native-string-utils'
import uuid from "uuid";
import { request, check, PERMISSIONS, PermissionStatus } from 'react-native-permissions';
import RNCallKeepManager from '@components/RNCallKeepManager'
import LaunchApplication from 'react-native-launch-application';
import constants from '@resources/strings'
import KeepAwake from 'react-native-keep-awake';
import InCallManager from 'react-native-incall-manager';
import Timer from "./Timer";
import soundUtils from "@utils/sound-utils";
const muteImg = require("@images/new/videoCall/mute.png");
const muteImg_selected = require("@images/new/videoCall/mute_selected.png");

const speakerImg = require("@images/new/videoCall/speaker.png");
const speakerImg_selected = require("@images/new/videoCall/speaker_selected.png");

const videoDisableImg = require("@images/new/videoCall/video_disable.png");
const videoEnableImg = require("@images/new/videoCall/video_enable.png");

const checkAndroidPermissions = () =>
    new Promise((resolve, reject) => {
        PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ])
            .then(result => {
                const permissionsError = {};
                permissionsError.permissionsDenied = [];
                each(result, (permissionValue, permissionType) => {
                    if (permissionValue === "denied") {
                        permissionsError.permissionsDenied.push(permissionType);
                        permissionsError.type = "Permissions error";
                    }
                });
                if (permissionsError.permissionsDenied.length > 0) {
                    reject(permissionsError);
                } else {
                    resolve();
                }
            })
            .catch(error => {
                reject(error);
            });
    });

class VideoCallScreen extends Component {
    isAnswerSuccess = false
    isAnswer = false
    constructor(props) {
        super(props);

        this.callEventHandlers = {
            onChangeSignalingState: this._callDidChangeSignalingState,
            onChangeMediaState: this._callDidChangeMediaState,
            onReceiveLocalStream: this._callDidReceiveLocalStream,
            onReceiveRemoteStream: this._callDidReceiveRemoteStream,
            onReceiveDtmfDigit: this._didReceiveDtmfDigit,
            onReceiveCallInfo: this._didReceiveCallInfo,
            onHandleOnAnotherDevice: this._didHandleOnAnotherDevice
        };

        RNCallKeep.addEventListener('answerCall', this.answerCallEvent);
        RNCallKeep.addEventListener('endCall', this.endCallEvent)
    }
    answerCallEvent = () => {
        if (AppState.currentState != 'active' && Platform.OS == 'android') {
            console.log(111111)
            LaunchApplication.open(constants.package_name)

        }
        if (!this.isAnswer) {
            this.isAnswer = true;
            this._onAcceptCallPress();
        }
    }
    endCallEvent = () => {
        if (this.isAnswer) {
            setTimeout(() => {
                new Promise(() => {
                    this.stringeeCall && this.stringeeCall.setSpeakerphoneOn(
                        this.state.callId,
                        true,
                        (status, code, message) => {
                            if (status) {
                                this.setState({ isSpeaker: true });
                            }
                        }
                    );
                })
            }, 1000)
        }
        if (!this.isAnswerSuccess) {
            debugger
            this._onDeclinePress()

        }
    }
    state = {
        userId: "",
        callState: "Đang kết nối...",

        isVideoCall: false,
        callId: "",

        isMute: false,
        isSpeaker: false,

        isOutgoingCall: true,
        isShowOptionView: true,
        isShowDeclineBt: false,
        isShowEndBt: false,
        isShowAcceptBt: false,

        isEnableVideo: true,
        hasReceivedLocalStream: false,
        hasReceivedRemoteStream: false,

        answered: false,
        mediaConnected: false,
        profile: this.props.navigation.getParam('profile', {})
    };
    requestAll = async () => {
        const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
        const contactsStatus = await request(PERMISSIONS.IOS.MICROPHONE);
        return { cameraStatus, contactsStatus };
    }
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState !== 'active' && this.isAnswerSuccess) {
            // const fbNotification = new firebase.notifications.Notification()
            //     .setNotificationId(StringUtils.guid())
            //     .setBody("Bạn có đang có 1 cuộc gọi")
            //     .setTitle('')
            //     .android.setChannelId("isofhcare-master")
            //     .android.setSmallIcon("ic_launcher")
            //     .android.setPriority(firebase.notifications.Android.Priority.High)
            //     .setSound("default")
            //     .setData({});
            //     console.log('fbNotification: ', fbNotification);
            // firebase.notifications().displayNotification(fbNotification)
        }
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        DeviceEventEmitter.addListener('hardwareBackPress', this.handleBackButton)
        if (Platform.OS === "android") {
            checkAndroidPermissions()
                .then(() => {
                    this.makeOrAnswerCall();
                })
                .catch(error => {
                    this._onCancelPress()
                    // alert("You must grant permissions to make a call " + error);
                });
        } else {
            this.requestAll().then(res => {
                if (res.cameraStatus == 'granted') {
                    this.makeOrAnswerCall();
                }
            }).catch(err => {
                this._onCancelPress()
            })

        }
    }

    makeOrAnswerCall() {
        const { userApp } = this.props
        const { params } = this.props.navigation.state;
        const isOutgoingCall = params ? params.isOutgoingCall : false;
        const from = userApp?.currentUser?.id || "";
        const to = params ? params.to : "";
        const isVideoCall = params ? params.isVideoCall : false;
        const profile = params ? params.profile : {};
        console.log('profile: ', profile);

        console.log("isVideoCall " + isVideoCall);

        if (isOutgoingCall) {
            const myObj = {
                from: from + "",
                to: to + "",
                isVideoCall,
                videoResolution: "HD",
                customData: JSON.stringify(profile)
            };

            const parameters = JSON.stringify(myObj);

            this.setState({
                isShowDeclineBt: false,
                isShowEndBt: true,
                isShowAcceptBt: false,
                isShowOptionView: true,
                isOutgoingCall: isOutgoingCall,
                userId: to,
                isVideoCall: isVideoCall
            });
            this.stringeeCall.makeCall(
                parameters,
                (status, code, message, callId, customDataFromYourServer) => {
                    debugger;
                    this.setState({ callId: callId });
                    // nó đang không nhảy vào đây
                    KeepAwake.activate();
                    this._onSpeakerPress()
                    soundUtils.play('call_phone.mp3')
                    console.log(
                        "status-" +
                        status +
                        " code-" +
                        code +
                        " message-" +
                        message +
                        " callId-" +
                        callId +
                        " customDataFromYourServer-" +
                        customDataFromYourServer
                    );
                }
            );
        } else {
            const callId = params ? params.callId : "";
            this.setState({
                isShowDeclineBt: true,
                isShowEndBt: false,
                isShowAcceptBt: true,
                isShowOptionView: false,
                isOutgoingCall: isOutgoingCall,
                userId: from,
                callState: "Đang kết nối...",
                isVideoCall: isVideoCall,
                callId: callId
            });
            if (this.stringeeCall && this.stringeeCall.initAnswer) {
                this.stringeeCall.initAnswer(callId, (status, code, message) => {
                    if (AppState.currentState == 'active') {
                        InCallManager.startRingtone('_BUNDLE_');
                        InCallManager.turnScreenOn()
                        Vibration.vibrate([0, 300, 200, 700, 200], true)

                    }
                    // console.log(message);
                });
            }

        }
    }

    handleBackButton() {
        return true;
    }
    componentWillUnmount() {
        KeepAwake.deactivate();
        if (this.timeout) clearTimeout(this.timeout)
        AppState.removeEventListener('change', this._handleAppStateChange);
        DeviceEventEmitter.removeAllListeners('hardwareBackPress')

        RNCallKeep.removeEventListener("answerCall", this.answerCallEvent);
        RNCallKeep.removeEventListener("endCall", this.endCallEvent);

    }
    // Signaling state
    _callDidChangeSignalingState = ({
        callId,
        code,
        reason,
        sipCode,
        sipReason
    }) => {
        console.log(
            "_callDidChangeSignalingState" +
            "callId-" +
            callId +
            "code-" +
            code +
            " reason-" +
            reason +
            " sipCode-" +
            sipCode +
            " sipReason-" +
            sipReason
        );
        switch (code) {
            case 0:
                this.setState({ callState: "Đang gọi" });
                break
            case 2:
                this.timeout = setTimeout(this._onEndCallPress, 1800000)
                this.setState({ answered: true });
                if (this.state.mediaConnected) {
                    this.setState({ callState: "Started" });
                }
                break;
            case 3:
                soundUtils.play('not_listen.mp3')
                // busy
                this.setState({ callState: 'Máy bận' })
                if (Platform.OS === "android") {
                    this.stringeeCall.hangup(
                        this.state.callId,
                        (status, code, message) => {
                            console.log(message);
                            this.endCallAndDismissView();
                        }
                    );
                } else {
                    this.endCallAndDismissView();
                }

                break;
            case 4:
                // end
                soundUtils.play('not_listen.mp3')
                this.setState({ callState: "Không trả lời" })
                if (Platform.OS === "android") {
                    this.stringeeCall.hangup(
                        this.state.callId,
                        (status, code, message) => {
                            console.log(message);
                            this.endCallAndDismissView();
                        }
                    );
                } else {
                    this.endCallAndDismissView();
                }

                break;
            default:
                break;
        }
    };

    // Media state
    _callDidChangeMediaState = ({ callId, code, description }) => {
        console.log(
            "_callDidChangeMediaState" + "callId-" + callId + "code-" + code + " description-" + description
        );
        switch (code) {
            case 0:
                // Connected
                this.setState({ mediaConnected: true });
                if (this.state.answered) {
                    this.setState({ callState: "Started" });
                }
                break;
            case 1:
                // Disconnected
                break;
            default:
                break;
        }
    };

    _callDidReceiveLocalStream = ({ callId }) => {
        console.log("_callDidReceiveLocalStream " + callId);
        this.setState({ hasReceivedLocalStream: true });
    };

    _callDidReceiveRemoteStream = ({ callId }) => {
        console.log("_callDidReceiveRemoteStream " + callId);
        this.setState({ hasReceivedRemoteStream: true });
    };

    _didReceiveDtmfDigit = ({ callId, dtmf }) => {
        console.log("_didReceiveDtmfDigit " + callId + "***" + dtmf);
    };

    _didReceiveCallInfo = ({ callId, data }) => {
        console.log("_didReceiveCallInfo " + callId + "***" + data);
    };

    _didHandleOnAnotherDevice = ({ callId, code, description }) => {
        console.log(
            "_didHandleOnAnotherDevice " + callId + "***" + code + "***" + description
        );
        if (code == 2 || code == 3 || code == 4) {
            // Answered || Busy || End
            soundUtils.play('not_listen.mp3')
            this.setState({ callState: 'Máy bận' })
            this.endCallAndDismissView();
        }
    };

    // Action
    _onDeclinePress = () => {
        console.log("_onDeclinePress");
        this.stringeeCall.reject(
            this.state.callId,
            (status, code, message) => {
                InCallManager.stopRingtone();
                soundUtils.stop()
                Vibration.cancel()
                if (!this.state.answered) {
                    this.props.navigation.navigate('home');
                }
            }
        );
    };

    _onEndCallPress = () => {
        console.log("_onEndCallPress" + this.callId);
        this.stringeeCall.hangup(
            this.state.callId,
            (status, code, message) => {
                RNCallKeepManager.endCall()
                soundUtils.play('not_listen.mp3')
                this.setState({ callState: 'Kết thúc cuộc gọi' })
                this.endCallAndDismissView();
            }
        );
    };

    _onAcceptCallPress = () => {
        console.log("_onAcceptCallPress");
        this.stringeeCall.answer(
            this.state.callId,
            (status, code, message) => {
                console.log(message);
                new Promise(() => {
                    this.stringeeCall && this.stringeeCall.setSpeakerphoneOn(
                        this.state.callId,
                        true,
                        (status, code, message) => {
                            if (status) {
                                this.setState({ isSpeaker: true });
                            }
                        }
                    );
                })

                Vibration.cancel()
                InCallManager.stopRingtone();

                this.isAnswerSuccess = true;
                // RNCallKeepManager.endCall()
                KeepAwake.activate();
                this.setState({
                    isShowOptionView: true,
                    isShowDeclineBt: false,
                    isShowEndBt: true,
                    isShowAcceptBt: false
                });
            }
        );
    };

    _onMutePress = () => {
        this.stringeeCall.mute(
            this.state.callId,
            !this.state.isMute,
            (status, code, message) => {
                console.log("_onMutePress" + message);
                if (status) {
                    this.setState({ isMute: !this.state.isMute });
                }
            }
        );
    };

    _onSpeakerPress = () => {
        this.stringeeCall.setSpeakerphoneOn(
            this.state.callId,
            !this.state.isSpeaker,
            (status, code, message) => {
                if (status) {
                    this.setState({ isSpeaker: !this.state.isSpeaker });
                }
            }
        );
    };
    static navigationOptions = {
        gesturesEnabled: false,
    };
    _onSwitchCameraPress = () => {
        this.stringeeCall.switchCamera(
            this.state.callId,
            (status, code, message) => { }
        );
    };

    _onVideoPress = () => {
        if (this.state.isVideoCall) {
            this.stringeeCall.enableVideo(
                this.state.callId,
                !this.state.isEnableVideo,
                (status, code, message) => {
                    if (status) {
                        this.setState({ isEnableVideo: !this.state.isEnableVideo });
                    }
                }
            );
        }
    };

    renderMuteImage = () => {
        var imgSource = this.state.isMute ? muteImg_selected : muteImg;
        return <Image style={styles.button} source={imgSource} />;
    };

    renderSpeakerImage = () => {
        var imgSource = this.state.isSpeaker ? speakerImg_selected : speakerImg;
        return <Image style={styles.button} source={imgSource} />;
    };

    renderVideoImage = () => {
        var imgSource = this.state.isEnableVideo ? videoEnableImg : videoDisableImg;
        return <Image style={styles.button} source={imgSource} />;
    };

    endCallAndDismissView = () => {
        InCallManager.stopRingtone();
        Vibration.cancel()
        setTimeout(() => {
            soundUtils.stop()
            this.props.navigation.navigate('home');

        }, 3000)

    };

    render() {
        return (
            <View style={styles.container}>
                {this.state.isVideoCall &&
                    this.state.callId !== "" &&
                    this.state.hasReceivedRemoteStream && (
                        <View style={styles.remoteView}>
                            <StringeeVideoView
                                style={styles.remoteView}
                                callId={this.state.callId}
                                local={false}
                            />
                        </View>
                    )}

                <View style={{
                    paddingTop: 15,
                    marginBottom: 20,
                    alignSelf: 'flex-end'
                }}>

                    {this.state.hasReceivedLocalStream &&
                        this.state.callId !== "" &&
                        this.state.isVideoCall && (
                            <StringeeVideoView
                                style={styles.localView}
                                callId={this.state.callId}
                                local={true}
                                overlay={true}
                            >

                            </StringeeVideoView>
                        )}
                    {this.state.isVideoCall && (
                        <TouchableOpacity
                            onPress={this._onSwitchCameraPress}
                            style={styles.camera}
                        >
                            <Image
                                source={require("@images/new/videoCall/camera_switch.png")}
                                style={{ width: 40, height: 40 }}
                            />
                        </TouchableOpacity>
                    )}

                </View>
                {/* <View style={{
                    flex: 1
                }}>
                    <Text style={styles.userId}>{this.state.profile?.doctor?.academicDegree ? this.renderAcademic(this.state.profile.doctor.academicDegree) : ""}{this.state.profile?.doctor?.name || ""}</Text>
                    {
                        this.state.callState == "Started" ?
                            <Text style={styles.callState}>{this.state.timer.minus} : {this.state.timer.secon}</Text>
                            :
                            <Text style={styles.callState}>{this.state.callState}</Text>
                    }
                    {
                        this.state.warn ?
                            <Text style={{
                                color: "#FFF",
                                fontSize: 20,
                                textAlign: 'center',
                                paddingHorizontal: 20
                            }}>Thời gian gọi còn lại của bạn còn {this.state.warn} phút</Text>
                            : null
                    }
                </View> */}
                <Timer data={{
                    profile: this.state.profile,
                    mediaConnected: this.state.mediaConnected,
                    callState: this.state.callState
                }} />
                {this.state.isShowOptionView ? (
                    <View style={styles.callOptionContainer}>
                        <TouchableOpacity onPress={this._onMutePress}>
                            {this.renderMuteImage()}
                        </TouchableOpacity>

                        {this.state.isVideoCall && (
                            <TouchableOpacity onPress={this._onVideoPress}>
                                {this.renderVideoImage()}
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={this._onSpeakerPress}>
                            {this.renderSpeakerImage()}
                        </TouchableOpacity>
                    </View>
                ) : null}

                {this.state.isShowEndBt && (
                    <View style={styles.callActionContainerEnd}>
                        {this.state.isShowDeclineBt ? (
                            <TouchableOpacity onPress={this._onDeclinePress}>
                                <Image
                                    source={require("@images/new/videoCall/end_call.png")}
                                    style={styles.button}
                                />
                            </TouchableOpacity>
                        ) : null}

                        {this.state.isShowEndBt ? (
                            <TouchableOpacity onPress={this._onEndCallPress}>
                                <Image
                                    source={require("@images/new/videoCall/end_call.png")}
                                    style={styles.button}
                                />
                            </TouchableOpacity>
                        ) : null}

                        {this.state.isShowAcceptBt ? (
                            <TouchableOpacity onPress={this._onAcceptCallPress}>
                                <Image
                                    source={require("@images/new/videoCall/accept_call.png")}
                                    style={styles.button}
                                />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                )}

                {!this.state.isShowEndBt && (
                    <View style={styles.callActionContainer}>
                        {this.state.isShowDeclineBt ? (
                            <TouchableOpacity onPress={this._onDeclinePress}>
                                <Image
                                    source={require("@images/new/videoCall/end_call.png")}
                                    style={styles.button}
                                />
                            </TouchableOpacity>
                        ) : null}

                        {this.state.isShowEndBt ? (
                            <TouchableOpacity onPress={this._onEndCallPress}>
                                <Image
                                    source={require("@images/new/videoCall/end_call.png")}
                                    style={styles.button}
                                />
                            </TouchableOpacity>
                        ) : null}

                        {this.state.isShowAcceptBt ? (
                            <TouchableOpacity onPress={this._onAcceptCallPress}>
                                <Image
                                    source={require("@images/new/videoCall/accept_call.png")}
                                    style={styles.button}
                                />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                )}

                <StringeeCall
                    ref={ref => this.stringeeCall = ref}
                    eventHandlers={this.callEventHandlers}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#00A6AD",
    },

    callOptionContainer: {
        width: width - 100,
        alignSelf: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
    },

    callActionContainer: {
        // height: 70,
        width: width - 100,
        alignSelf: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 20
    },

    callActionContainerEnd: {
        alignSelf: 'center',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 20

    },

    button: {
        width: 70,
        height: 70
    },

    userId: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
        textAlign: 'center'
    },

    callState: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 20,
        textAlign: 'center'

    },
    localView: {
        backgroundColor: "black",
        top: 20,
        right: 20,
        width: 150,
        height: 200,
        zIndex: 2,
    },
    remoteView: {
        backgroundColor: "black",
        position: "absolute",
        width: width,
        height: height,
        zIndex: 0
    },
    camera: {
        top: 190,
        right: 70,
        width: 40,
        height: 40,
        zIndex: 3,
        position: 'absolute',
    }
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(VideoCallScreen)