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
    PermissionsAndroid
} from "react-native";
import { each } from "underscore";

import { StringeeCall, StringeeVideoView } from "stringee-react-native";
import { connect } from "react-redux";

var height = Dimensions.get("screen").height;
var width = Dimensions.get("window").width;

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
    }

    state = {
        userId: "",
        callState: "Outgoing call",

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
        timer: { minus: '00', secon: '00' },
        profile: this.props.navigation.getParam('profile', {})
    };

    componentWillMount() { }

    componentDidMount() {
        if (Platform.OS === "android") {
            checkAndroidPermissions()
                .then(() => {
                    this.makeOrAnswerCall();
                })
                .catch(error => {
                    alert("You must grant permissions to make a call " + error);
                });
        } else {
            this.makeOrAnswerCall();
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
                callState: "Incoming call",
                isVideoCall: isVideoCall,
                callId: callId
            });

            this.stringeeCall.initAnswer(callId, (status, code, message) => {
                console.log(message);
                //no kho ban vao day à
                // cái này để lắng nghe có cuộc gọi đến
            });
        }
    }
    countUpTimer = () => {
        var sec = 0;
        function pad(val) { return val > 9 ? val : "0" + val; }
        this.countUp = setInterval(() => {
            this.setState({
                timer: {
                    secon: pad(++sec % 60),
                    minus: pad(parseInt(sec / 60))
                }
            });
        }, 1000);
        this.timeout = setTimeout(this._onEndCallPress, 900000)
    }
    componentWillUnmount() {
        if (this.countUp) clearInterval(this.countUp)
        if (this.timeout) clearTimeout(this.timeout)
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
        this.setState({ callState: reason });
        switch (code) {
            case 2:
                this.countUpTimer()
                this.setState({ answered: true });
                if (this.state.mediaConnected) {
                    this.setState({ callState: "Started" });
                }
                break;
            case 3:
                // busy
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
            this.endCallAndDismissView();
        }
    };

    // Action
    _onDeclinePress = () => {
        console.log("_onDeclinePress");
        this.stringeeCall.reject(
            this.state.callId,
            (status, code, message) => {
                console.log(message);
                this.endCallAndDismissView();
            }
        );
    };

    _onEndCallPress = () => {
        console.log("_onEndCallPress" + this.callId);
        this.stringeeCall.hangup(
            this.state.callId,
            (status, code, message) => {
                console.log(message);
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
                if (status) {
                    this.setState({
                        isShowOptionView: true,
                        isShowDeclineBt: false,
                        isShowEndBt: true,
                        isShowAcceptBt: false
                    });
                } else {
                    this.endCallAndDismissView();
                }
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
        this.props.navigation.goBack();
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
                <View style={{
                    flex: 1
                }}>
                    <Text style={styles.userId}>{this.state.profile?.doctor?.academicDegree ? this.state.profile?.doctor?.academicDegree + '.' : ""} {this.state.profile?.doctor?.name || ""}</Text>
                    {
                        this.state.callState == "Started" ?
                            <Text style={styles.callState}>{this.state.timer.minus} : {this.state.timer.secon}</Text>
                            :
                            <Text style={styles.callState}>{this.state.callState}</Text>
                    }
                </View>
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