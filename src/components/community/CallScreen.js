import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, memo } from 'react';
import { View, SafeAreaView, Platform, StyleSheet, FlatList, TouchableOpacity, Text, Dimensions, StatusBar, Image, Modal } from 'react-native';
import { RTCPeerConnection, RTCView, mediaDevices, RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import constants from '@resources/strings'
import socketProvider from '@data-access/socket-provider'
import { useSelector } from 'react-redux'
import BandWidth from './BandWidth';
import VoipPushNotification from 'react-native-voip-push-notification';
import firebase from 'react-native-firebase'
import RNCallKeepManager from '@components/RNCallKeepManager'
import RNCallKeep from 'react-native-callkeep'
import Timer from '@containers/community/Timer';
import DeviceInfo from 'react-native-device-info'
import soundUtils from '@utils/sound-utils';
const { width, height } = Dimensions.get('screen')

var qvgaConstraints = {
    maxWidth: 320,
    maxHeight: 180,
    minFrameRate: 30,
};

var vgaConstraints = {
    maxWidth: 640,
    maxHeight: 360,
    minFrameRate: 30,
};

var hdConstraints = {
    minWidth: 1280,
    minHeight: 720,
    minFrameRate: 30,
};
function CallScreen({ }, ref) {
    // const [localStream, setLocalStream] = useState();
    const [state, _setState] = useState({ statusCall: true, booking: {}, id: '', isAnswer: false, isAnswerSuccess: false, makeCall: false, isVisible: false });
    const [remoteStream, setRemoteStream] = useState();
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeak, setIsSpeak] = useState(true);
    const socket = useRef()
    const UUID = useRef()
    const localStream = useRef()
    const socketId = useRef("")
    const socketId2 = useRef("")
    const localPC = useRef()
    const userApp = useSelector(state => state.auth.userApp)
    console.log('userApp: 111', userApp);
    const hideModal = () => {
        setState({ isVisible: false });
    };

    const showModal = () => {
        setState({ isVisible: true });
    };
    useImperativeHandle(ref, () => ({
        startCall: (id, isOffer) => startCall(id, isOffer),
        showModal: () => showModal(),
        hideModal: () => hideModal(),
    }), [])
    const setState = (data = { id: '', isAnswer: false }) => {
        _setState(state => {
            return { ...state, ...data }

        })
    }

    const onSend = (type, data = {}, callback) => {
        socket.current.emit(type, data, callback)
    }
    const onConnected = async (data2) => {
        try {
            RNCallKeepManager.setupCallKeep()
            if (Platform.OS == 'ios') {
                VoipPushNotification.requestPermissions();
                VoipPushNotification.registerVoipToken();
                VoipPushNotification.addEventListener("register", token => {
                    // send token to your apn provider server
                    onSend('connectFirebase', { token, id: userApp.currentUser.id, platform: "ios", packageName: DeviceInfo.getBundleId() })
                });
                VoipPushNotification.addEventListener('notification', (notification) => {
                });

            } else {
                let token = await firebase.messaging().getToken()
                console.log('token: ', token);
                onSend('connectFirebase', { token, id: userApp.currentUser.id, platform: "android" })

            }
        } catch (error) {

        }

    }
    const onDidDisplayIncomingCall = ({ error, callUUID, handle, localizedCallerName, hasVideo, fromPushKit, payload }) => {
        console.log('payload: ', payload);
        // RNCallKeep.updateDisplay(callUUID, state.profile?.doctor ? renderAcademic(state.profile?.doctor) : "Bác sĩ iSofhCare master", "")
        // if (isAnswerSuccess) {
        //     RNCallKeep.reportEndCallWithUUID(callUUID, 1)
        // }
        showModal();

    }
    const onRNCallKitDidActivateAudioSession = (data) => {
        // AudioSession đã được active, có thể phát nhạc chờ nếu là outgoing call, answer call nếu là incoming call.
        console.log("DID ACTIVE AUDIO");
        createAnswer()
    }
    const answerCallEvent = () => {
        if (Platform.OS == "android" && !state.makeCall)
            RNCallKeep.reportEndCallWithUUID(UUID.current, 1)
        RNCallKeep.backToForeground()
    }
    const endCallEvent = ({ callUUid }) => {
        rejectCall()
    }
    const addEventCallKeep = () => {
        RNCallKeep.addEventListener('answerCall', answerCallEvent);
        RNCallKeep.addEventListener('endCall', endCallEvent);
        RNCallKeep.addEventListener("didActivateAudioSession", onRNCallKitDidActivateAudioSession);
        RNCallKeep.addEventListener('didDisplayIncomingCall', onDidDisplayIncomingCall);
    }
    const removeEvent = () => {

        RNCallKeep.removeEventListener("answerCall", answerCallEvent);
        RNCallKeep.removeEventListener("endCall", endCallEvent);
        RNCallKeep.removeEventListener("didActivateAudioSession", onRNCallKitDidActivateAudioSession);
        RNCallKeep.removeEventListener('didDisplayIncomingCall', onDidDisplayIncomingCall);
    }
    const onOffer = async (data) => {
        console.log('data: ', data);
        debugger
        if (Platform.OS == 'android') {
            RNCallKeepManager.displayIncommingCall(data.UUID, data.name)
            showModal()
        }
        UUID.current = data.UUID
        socketId2.current = data.from
        setState({ data2: data, isAnswer: true, booking: data.booking })
        if (!localPC.current) {
            await initCall(localStream.current)
        }
        await localPC.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
    }

    function updateBandwidthRestriction(sdp, bandwidth) {
        let modifier = 'AS';
        if (sdp.indexOf('b=' + modifier + ':') === -1) {
            // insert b= after c= line.
            sdp = sdp.replace(/c=IN (.*)\r\n/, 'c=IN $1\r\nb=' + modifier + ':' + bandwidth + '\r\n');
        } else {
            sdp = sdp.replace(new RegExp('b=' + modifier + ':.*\r\n'), 'b=' + modifier + ':' + bandwidth + '\r\n');
        }
        return sdp;
    }

    function removeBandwidthRestriction(sdp) {
        return sdp.replace(/b=AS:.*\r\n/, '').replace(/b=TIAS:.*\r\n/, '');
    }

    useEffect(() => {
        const didmount = async () => {
            try {
                socket.current = await socketProvider.connectSocket(userApp.loginToken)
                console.log('socket.current: ', socket.current);
                socket.current.on('connect', onConnected);
                setState({ id: userApp.currentUser.id })
                socket.current.on(constants.socket_type.OFFER, onOffer)
                socket.current.on(constants.socket_type.ANSWER, async (data) => {
                    debugger
                    console.log('localPC, setRemoteDescription');
                    setState({ isAnswerSuccess: true })
                    soundUtils.stop()
                    await localPC.current.setRemoteDescription({
                        type: data.sdp.type,
                        sdp: updateBandwidthRestriction(data.sdp.sdp, 0)
                    })
                    console.log('updateBandwidthRestriction(data.sdp.sdp, 0): ', updateBandwidthRestriction(data.sdp.sdp, 0));
                });
                socket.current.on(constants.socket_type.CANDIDATE, data => {
                    debugger
                    if (data.candidate)
                        localPC.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                });
                socket.current.on(constants.socket_type.LEAVE, socketId => {
                    closeStreams(socketId);
                });
                socket.current.on(constants.socket_type.REJECT, socketId => {
                    closeStreams(socketId);
                });
                socket.current.on(constants.socket_type.DELINE, socketId => {
                    closeStreams(socketId);
                });
                startLocalStream(true)
                // debugger;
                addEventCallKeep()

            } catch (error) {
                console.log('error: ', error);

            }
        }
        didmount()
        return () => {
            socket.current.disconnect();
            removeEvent()
        }
    }, [])
    const startLocalStream = async (init) => {
        console.log(11221122)

        debugger
        try {
            // isFront will determine if the initial camera should face user or environment
            const isFront = true;
            const devices = await mediaDevices.enumerateDevices();

            const facing = isFront ? 'front' : 'environment';
            const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
            const facingMode = isFront ? 'user' : 'environment';
            const constraints = {
                audio: true,
                // audio: {
                //     echoCancellation: true,
                //     noiseSuppression: true,
                //     autoGainControl: true,
                //     googEchoCancellation: true,
                //     // googAutoGainControl: true,
                //     googNoiseSuppression: true,
                //     // googHighpassFilter: true,
                //     // googTypingNoiseDetection: true,
                //     googNoiseReduction: true,
                //     volume: 0.9,
                // },
                video: {
                    mandatory: qvgaConstraints,
                    facingMode,
                    optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
                },
            };
            const newStream = await mediaDevices.getUserMedia(constraints);
            if (init) {
                initCall(newStream)
            }
            localStream.current = newStream
            // setLocalStream(newStream);
        } catch (error) {
            console.log('error: ', error);
            debugger

        }

    };
    const getStats = () => {
        const pc = localPC.current;
        if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
            const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
            let callback = report => console.log('getStats report', report);

            //console.log('track', track);

            pc.getStats(track).then(callback).catch((err) => {

            });
        }
    };
    const initCall = async (newStream) => {
        debugger

        // You'll most likely need to use a STUN server at least. Look into TURN and decide if that's necessary for your project
        const configuration = {
            iceServers: [
                // { url: 'stun:stun.l.google.com:19302' },
                // { url: 'stun:stun1.l.google.com:19302' },
                // { url: 'stun:stun2.l.google.com:19302' },
                // { url: 'stun:stun3.l.google.com:19302' },
                // { url: 'stun:stun4.l.google.com:19302' },
                {
                    url: 'turn:numb.viagenie.ca',
                    username: 'gnurt250394@gmail.com',
                    credential: 'trung123'
                },
            ],
            iceTransportPolicy: 'public',
        };
        localPC.current = new RTCPeerConnection(configuration);
        // could also use "addEventListener" for these callbacks, but you'd need to handle removing them as well
        localPC.current.onnegotiationneeded = e => {

        }
        localPC.current.onicecandidate = e => {
            try {
                debugger
                console.log('localPC icecandidate:', e.candidate);
                if (e.candidate) {
                    onSend(constants.socket_type.CANDIDATE, { to: socketId2.current, candidate: e.candidate, type: 'local' })
                }
            } catch (err) {
                debugger
                console.error(`Error adding remotePC iceCandidate: ${err}`);
            }
        };
        localPC.current.onaddstream = e => {
            console.log('remotePC tracking with ', e);
            debugger
            if (e.stream && remoteStream !== e.stream) {
                console.log('RemotePC received the stream', e.stream);
                setRemoteStream(e.stream);
            }
        };

        localPC.current.addStream(newStream);
        /**
                * On Ice Connection State Change
                */

        localPC.current.oniceconnectionstatechange = async (event) => {
            console.log('event: oniceconnectionstatechange', event);
            console.log('event: iceConnectionState', event.target.iceConnectionState);
            switch (event.target.iceConnectionState) {
                case 'completed':
                    setState({ statusCall: true })
                    break;
                case 'failed':
                    if (localPC.current.restartIce) {
                        localPC.current.restartIce();
                    } else {
                        try {
                            if (state.makeCall == true) {
                                let offer = await localPC.current.createOffer({ iceRestart: true })
                                onCreateOfferSuccess(offer)
                            }
                        } catch (error) {

                        }

                    }
                    break;
                case 'connected':
                    setState({ statusCall: true })
                    break;
                case 'disconnected':
                    setState({ statusCall: false })
                    break;
                case 'closed':
                    closeStreams()
                    break;
                default:
                    break;
            }


        };

        /**
         * On Signaling State Change
         */
        localPC.current.onsignalingstatechange = event => {
            console.log('on signaling state change', event.target.signalingState);
        };

        /**
         * On Remove Stream
         */
        localPC.current.onremovestream = event => {
            debugger
            //console.log('on remove stream', event.stream);
        };
    };

    function setBandwidth(sdp) {
        const audioBandwidth = 50;
        const videoBandwidth = 256;
        sdp = sdp.replace(/a=mid:audio\r\n/g, 'a=mid:audio\r\nb=AS:' + audioBandwidth + '\r\n');
        sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:' + videoBandwidth + '\r\n');
        return sdp;
    }
    function handle_offer_sdp(offer) {
        let sdp = offer.sdp.split('\r\n');//convert to an concatenable array
        let new_sdp = '';
        let position = null;
        sdp = sdp.slice(0, -1); //remove the last comma ','
        for (let i = 0; i < sdp.length; i++) {//look if exists already a b=AS:XXX line
            if (sdp[i].match(/b=AS:/)) {
                position = i; //mark the position
            }
        }
        if (position) {
            sdp.splice(position, 1);//remove if exists
        }
        for (let i = 0; i < sdp.length; i++) {
            if (sdp[i].match(/m=video/)) {//modify and add the new lines for video
                new_sdp += sdp[i] + '\r\n' + 'b=AS:' + '128' + '\r\n';
            }
            else {
                if (sdp[i].match(/m=audio/)) { //modify and add the new lines for audio
                    new_sdp += sdp[i] + '\r\n' + 'b=AS:' + 64 + '\r\n';
                }
                else {
                    new_sdp += sdp[i] + '\r\n';
                }
            }
        }
        return new_sdp; //return the new sdp
    }
    const onCreateOfferSuccess = async (offer, booking) => {
        console.log('Offer from localPC, setLocalDescription');
        await localPC.current.setLocalDescription(offer);
        console.log('remotePC, setRemoteDescription');
        soundUtils.play('call_phone.mp3');
        onSend(constants.socket_type.OFFER, { booking, to: socketId2.current, from: socketId.current, sdp: localPC.current.localDescription }, (res) => {
            debugger
        })
    }
    const startCall = async (booking, isOffer) => {
        debugger
        try {
            debugger
            showModal()
            if (!localPC.current) {
                await initCall(localStream.current)
            }
            socketId2.current = booking?.doctor?.id
            if (isOffer) {
                InCallManager.start({ media: "video" });
                setState({ makeCall: true, booking })
                const offer = await localPC.current.createOffer();
                // offer.sdp = handle_offer_sdp(offer)
                // offer.sdp = BandwidthHandler.setOpusAttributes(offer.sdp, {
                //     'stereo': 0, // to disable stereo (to force mono audio)
                //     'sprop-stereo': 1,
                //     'maxaveragebitrate': 500 * 1024 * 8, // 500 kbits
                //     'maxplaybackrate': 500 * 1024 * 8, // 500 kbits
                //     'cbr': 0, // disable cbr
                //     'useinbandfec': 1, // use inband fec
                //     'usedtx': 1, // use dtx
                //     'maxptime': 3
                // });
                onCreateOfferSuccess(offer, booking)
                // console.log('Offer from localPC, setLocalDescription');
                // await localPC.current.setLocalDescription(offer);
                // console.log('remotePC, setRemoteDescription');
                // onSend(constants.socket_type.OFFER, { booking, to: booking?.doctor?.id, from: socketId.current, sdp: localPC.current.localDescription }, (res) => {
                //     debugger
                // })
            }
        } catch (err) {
            debugger
            console.log(err);
        }

    }
    const createAnswer = async () => {
        try {
            const { data2 } = state
            console.log('data21111: ', data2);
            debugger
            InCallManager.start({ media: "video" });
            const answer = await localPC.current.createAnswer();
            console.log(`Answer from remotePC: ${answer.sdp}`);
            answerCallEvent()
            // answer.sdp = handle_offer_sdp(answer)

            // answer.sdp = BandwidthHandler.setOpusAttributes(answer.sdp, {
            //     'stereo': 0, // to disable stereo (to force mono audio)
            //     'sprop-stereo': 1,
            //     'maxaveragebitrate': 500 * 1024 * 8, // 500 kbits
            //     'maxplaybackrate': 500 * 1024 * 8, // 500 kbits
            //     'cbr': 0, // disable cbr
            //     'useinbandfec': 1, // use inband fec
            //     'usedtx': 1, // use dtx
            //     'maxptime': 3
            // });
            await localPC.current.setLocalDescription(answer);
            setState({ isAnswerSuccess: true })
            onSend(constants.socket_type.ANSWER, { to: socketId2.current, from: userApp.currentUser.id, sdp: localPC.current.localDescription })
            console.log('socketId2.current: ', socketId2.current);
        } catch (error) {
            debugger
            console.log('error: ', error);

        }

    }
    const switchCamera = () => {
        debugger
        localStream.current.getVideoTracks().forEach(track => track._switchCamera());
    };

    // Mutes the local's outgoing audio
    const toggleMute = () => {
        debugger
        // if (!remoteStream) return;
        localStream.current.getAudioTracks().forEach(track => {
            console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
            track.enabled = !track.enabled;
            setIsMuted(!track.enabled);
        });
    };

    const closeStreams = () => {
        if (localPC.current) {
            debugger
            // localPC.current.removeStream(localStream);
            localPC.current.close();
            localPC.current = null
        }
        soundUtils.stop();
        InCallManager.stop();
        setState({ isAnswerSuccess: false, makeCall: false, isVisible: false })
        setIsSpeak(true)
        setIsMuted(false)
        if (UUID.current) {
            RNCallKeep.reportEndCallWithUUID(UUID.current, 1)
        }

        // setRemoteStream();


    };
    const toggleSpeaker = () => {
        setIsSpeak(state => ({ isSpeak: !state.isSpeak }))
        InCallManager.setForceSpeakerphoneOn(!isSpeak);

    }
    const rejectCall = () => {
        RNCallKeepManager.endCall()
        let type = state.isAnswerSuccess || state.makeCall ? constants.socket_type.LEAVE : constants.socket_type.REJECT
        onSend(constants.socket_type.LEAVE, { to: socketId2.current, type })
        closeStreams()
    }
    return (
        <Modal
            animated={true}
            animationType="slide"
            transparent={false}
            visible={state.isVisible}>
            <View style={styles.container}>
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                <View style={[styles.rtcview, { height, ...StyleSheet.absoluteFillObject, zIndex: 0 }]}>
                    {remoteStream ?
                        <RTCView style={styles.rtc} zOrder={-1} objectFit="cover" streamURL={remoteStream.toURL()} />
                        : null
                    }
                </View>

                {localPC.current ?
                    <BandWidth localPc={localPC.current} />
                    : null
                }
                <View style={[styles.groupLocalSteam]}>
                    {localStream.current && <RTCView style={[styles.rtc]} zOrder={1} streamURL={localStream.current.toURL()} />}
                    <TouchableOpacity onPress={switchCamera} style={styles.buttonSwitch}>
                        <Image source={require('@images/new/videoCall/camera_switch.png')} style={styles.iconSwitch} />
                    </TouchableOpacity>
                </View>
                <Timer data={{
                    booking: state.booking ? state.booking : state.data2,
                    mediaConnected: state.isAnswerSuccess,
                }} />
                {!state.statusCall && remoteStream ?
                    <Text style={styles.textWarning}>Kết nối bị gián đoạn vui lòng di chuyển đến khu vực có tín hiệu tốt để có cuộc gọi ổn định</Text>
                    : null}
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end'
                }}>
                    {localStream.current && (state.isAnswerSuccess || state.makeCall) && (
                        <View style={styles.toggleButtons}>
                            <TouchableOpacity onPress={toggleMute} style={{ padding: 10 }}>
                                {isMuted ?
                                    <Image source={require('@images/new/videoCall/mute_selected.png')} style={styles.icon} />
                                    :
                                    <Image source={require('@images/new/videoCall/mute.png')} style={styles.icon} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleSpeaker} style={{ padding: 10 }}>
                                {isSpeak ?
                                    <Image source={require('@images/new/videoCall/speaker_selected.png')} style={styles.icon} />
                                    :
                                    <Image source={require('@images/new/videoCall/speaker.png')} style={styles.icon} />
                                }
                            </TouchableOpacity>

                        </View>
                    )}
                    <View style={styles.toggleButtons}>
                        {!state.isAnswerSuccess && !state.makeCall ?
                            <TouchableOpacity onPress={createAnswer} style={{ padding: 10 }}>
                                <Image source={require('@images/new/videoCall/accept_call.png')} style={styles.icon} />
                            </TouchableOpacity>
                            : null
                        }
                        <TouchableOpacity onPress={() => rejectCall(constants.socket_type.LEAVE)} style={{ padding: 10 }}>
                            <Image source={require('@images/new/videoCall/end_call.png')} style={styles.icon} />
                        </TouchableOpacity>

                    </View>
                </View>
                {/* {localPC.current ?
                    <BandWidth localPc={localPC.current} track />
                    : null
                } */}
            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    textWarning: {
        color: '#FFF',
        textAlign: 'center',
        flex: 1,
        paddingHorizontal: 10
    },
    groupLocalSteam: {
        height: '30%',
        width: '40%',
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginRight: 5,
        zIndex: 10
    },
    icon: {
        height: 60,
        width: 60
    },
    buttonSwitch: {
        padding: 10,
        position: 'absolute',
        bottom: 10,
        marginBottom: 10,
        alignSelf: 'center',
    },
    iconSwitch: {
        height: 40,
        width: 40,

    },
    container: {
        backgroundColor: '#313131',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        flex: 1
    },
    text: {
        fontSize: 30,
    },
    rtcview: {
        // backgroundColor: 'black',
    },
    rtc: {
        width: '100%',
        height: '100%',
    },
    toggleButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});


export default memo(forwardRef(CallScreen));