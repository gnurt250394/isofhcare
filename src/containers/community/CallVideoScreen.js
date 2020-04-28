import React, { Component } from "react";
import { AppRegistry, Vibration } from "react-native";
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
import InCallManager from 'react-native-incall-manager'
import { request, check, PERMISSIONS, checkMultiple, requestMultiple } from 'react-native-permissions';
import RNCallKeepManager from '@components/RNCallKeepManager'
import LaunchApplication from 'react-native-launch-application';
import constants from '@resources/strings'
import KeepAwake from 'react-native-keep-awake';
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
    backToForeground = false
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
        RNCallKeepManager.setIsAppForeGround(true)
        RNCallKeep.addEventListener('answerCall', this.answerCallEvent);
        RNCallKeep.addEventListener('endCall', this.endCallEvent)
    }
    answerCallEvent = () => {
        this._onAcceptCallPress();
    }
    endCallEvent = () => {
        RNCallKeepManager.isAnswerSuccess = false
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
        if (!this.isAnswerSuccess) {
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

    requestPermisstion = async () => {
        if (Platform.OS == "ios") {

            new Promise((resolve, reject) => {
                requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]).then((statuses) => {


                    if (statuses[PERMISSIONS.IOS.CAMERA] == 'granted' || statuses[PERMISSIONS.IOS.MICROPHONE] == "granted") {
                        resolve()
                    } else {
                        reject()
                    }
                }).catch((error) => {
                    reject(error)
                })
            })

        } else {
            return checkAndroidPermissions()
        }
    }
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        DeviceEventEmitter.addListener('hardwareBackPress', this.handleBackButton)
        checkAndroidPermissions()
            .then(() => {
                this.makeOrAnswerCall();
            })
            .catch(error => {
                this._onCancelPress()
                // alert("You must grant permissions to make a call " + error);
            });

    }
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState !== 'active' && this.isAnswerSuccess) {
            if (!this.backToForeground) {
                RNCallKeep.backToForeground()
                setTimeout(() => {
                    this.backToForeground = true
                }, 100)
            }
            // const fbNotification = new firebase.notifications.Notification()
            //     .setNotificationId(StringUtils.guid())
            //     .setBody("Bạn có đang có 1 cuộc gọi")
            //     .setTitle('')
            //     .android.setChannelId("isofhcare-master")
            //     .android.setSmallIcon("ic_launcher")
            //     .android.setPriority(firebase.notifications.Android.Priority.High)
            //     .setSound("default")
            //     .setData({});
            //     
            // firebase.notifications().displayNotification(fbNotification)
        }
    }
    componentWillUnmount() {
        soundUtils.stop()
        KeepAwake.deactivate();
        if (this.timeout) clearTimeout(this.timeout)
        AppState.removeEventListener('change', this._handleAppStateChange);
        DeviceEventEmitter.removeAllListeners('hardwareBackPress')

        RNCallKeep.removeEventListener("answerCall", this.answerCallEvent);
        RNCallKeep.removeEventListener("endCall", this.endCallEvent);

    }

    handleBackButton() {
        return true;
    }
    static navigationOptions = {
        gesturesEnabled: false,
    };
    makeOrAnswerCall() {
        const { userApp } = this.props
        const { params } = this.props?.navigation?.state || {};
        const isOutgoingCall = params ? params.isOutgoingCall : false;
        const from = userApp?.currentUser?.id || "";
        const to = params ? params.to : "";
        const isVideoCall = params ? params.isVideoCall : false;
        const profile = params ? params.profile : {};



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
                    this.setState({ callId: callId });
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
                    // this.startSound()
                });
            }

        }

    }

    startSound = () => {
        InCallManager.startRingtone()
        Vibration.vibrate([0, 200, 700, 300], true)
    }
    stopSound = () => {
        InCallManager.stopRingtone()
        Vibration.cancel()
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
                this.setState({ answered: true });
                soundUtils.stop()
                if (this.state.mediaConnected) {
                    this.setState({ callState: "Started" });
                }
                break;
            case 3:
                this.setState({ callState: 'Máy bận' })
                // busy
                if (Platform.OS === "android") {
                    this.stringeeCall && this.stringeeCall.hangup(
                        this.state.callId,
                        (status, code, message) => {
                            this.endCallAndDismissView();
                        }
                    );
                } else {
                    this.endCallAndDismissView();
                }
                break;
            case 4:
                // end
                this.setState({ callState: 'Kết thúc cuộc gọi', mediaConnected: false })
                if (Platform.OS === "android") {
                    this.stringeeCall && this.stringeeCall.hangup(
                        this.state.callId,
                        (status, code, message) => {
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
            "callId-" + callId + "code-" + code + " description-" + description
        );
        switch (code) {
            case 0:
                // Connected
                this.timeout = setTimeout(this._onEndCallPress, 1800000)

                this.setState({ mediaConnected: true });
                if (this.state.answered) {
                    soundUtils.stop()
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

        this.setState({ hasReceivedLocalStream: true });
    };

    _callDidReceiveRemoteStream = ({ callId }) => {

        this.setState({ hasReceivedRemoteStream: true });
    };

    _didReceiveDtmfDigit = ({ callId, dtmf }) => {

    };

    _didReceiveCallInfo = ({ callId, data }) => {

    };

    _didHandleOnAnotherDevice = ({ callId, code, description }) => {
        console.log(
            "_didHandleOnAnotherDevice " + callId + "***" + code + "***" + description
        );
        if (code == 2 || code == 3 || code == 4) {
            // Answered || Busy || End
            // this.setState({ callState: 'Máy bận' })
            this.endCallAndDismissView();
        }
    };

    // Action
    _onDeclinePress = () => {

        this.stringeeCall && this.stringeeCall.reject(
            this.state.callId,
            (status, code, message) => {
                // RNCallKeepManager.endCall()
                soundUtils.stop()
                RNCallKeepManager.isCallee = false
                if (!this.state.answered) {
                    this.props.navigation.navigate('home');
                }

            }
        );
    };
    _onCancelPress = () => {

        this.stringeeCall && this.stringeeCall.reject(
            this.state.callId,
            (status, code, message) => {

                this.endCallAndDismissView();

            }
        );
    };

    _onEndCallPress = () => {


        this.stringeeCall && this.stringeeCall.hangup(
            this.state.callId,
            (status, code, message) => {
                this.setState({ callState: 'Kết thúc cuộc gọi', mediaConnected: false })
                this.endCallAndDismissView();
            }
        );
    };

    _onAcceptCallPress = () => {
        this.stringeeCall && this.stringeeCall.answer(
            this.state.callId,
            (status, code, message) => {
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
                if (Platform.OS == 'android') {
                    if (!this.isAnswer) {
                        RNCallKeepManager.setAnswerCall()
                        this.isAnswer = true
                    }
                    // if(AppState.currentState !== 'active'){
                    //     setTimeout(() => {
                    //         LaunchApplication.open(constants.package_name)
                    //     }, 1000)

                    // }

                }
                RNCallKeepManager.isAnswerSuccess = true
                soundUtils.stop()
                this.isAnswerSuccess = true;
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
        this.stringeeCall && this.stringeeCall.mute(
            this.state.callId,
            !this.state.isMute,
            (status, code, message) => {
                if (status) {
                    this.setState({ isMute: !this.state.isMute });
                }
            }
        );
    };

    _onSpeakerPress = () => {
        this.stringeeCall && this.stringeeCall.setSpeakerphoneOn(
            this.state.callId,
            !this.state.isSpeaker,
            (status, code, message) => {
                if (status) {
                    this.setState({ isSpeaker: !this.state.isSpeaker });
                }
            }
        );
    };

    _onSwitchCameraPress = () => {
        this.stringeeCall && this.stringeeCall.switchCamera(
            this.state.callId,
            (status, code, message) => { }
        );
    };

    _onVideoPress = () => {
        if (this.state.isVideoCall) {
            this.stringeeCall && this.stringeeCall.enableVideo(
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
        // this.stopSound()
        RNCallKeepManager.isCallee = false
        setTimeout(() => {
            RNCallKeepManager.endCall()
            soundUtils.stop()
            this.props.navigation.navigate('home');

        }, 1000)
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

                {/* {
                    this.state.mediaConnected && */}
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
                            <TouchableOpacity onPress={this._onCancelPress}>
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
                            <TouchableOpacity onPress={this._onCancelPress}>
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
        position: 'relative',
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
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(VideoCallScreen)