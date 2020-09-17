import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  memo,
  useContext,
} from 'react';
import {
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Dimensions,
  StatusBar,
  Image,
  Modal,
  Vibration,
} from 'react-native';
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import constants from '@resources/strings';
import { WebSocketContext } from '@data-access/socket-provider';
import { useSelector } from 'react-redux';
import BandWidth from './BandWidth';
import VoipPushNotification from 'react-native-voip-push-notification';
import firebase from 'react-native-firebase';
import RNCallKeepManager from '@components/RNCallKeepManager';
import RNCallKeep from 'react-native-callkeep';
import Timer from '@containers/community/Timer';
import DeviceInfo from 'react-native-device-info';
import soundUtils from '@utils/sound-utils';
import BandwidthHandler from './BandwidthHandler';
const { width, height } = Dimensions.get('screen');

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
  const [state, _setState] = useState({
    statusCall: true,
    booking: {},
    id: '',
    isAnswerSuccess: false,
    makeCall: false,
    isVisible: false,
  });
  const [remoteStream, setRemoteStream] = useState();
  // const [localStream, setLocalStream] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeak, setIsSpeak] = useState(true);
  const [isCamFront, setIsCamFront] = useState(true);
  const context = useContext(WebSocketContext);
  const localStream = useRef();
  const callId = useRef();
  const timeout = useRef();
  const isCall = useRef(false);
  // const localStream = useRef();
  const socketId2 = useRef('');
  const tokenFirebase = useRef('');
  const localPC = useRef();
  const userApp = useSelector(state => state.auth.userApp);
  const ONE_SECOND_IN_MS = 1000;

  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS,
  ];
  const hideModal = () => {
    setState({ isVisible: false });
  };
  const showModal = () => {
    setState({ isVisible: true });
  };
  useImperativeHandle(
    ref,
    () => ({
      startCall: (booking, isOffer) => startCall(booking, isOffer),
    }),
    [],
  );
  const setState = (data = { id: '' }) => {
    _setState(state => {
      return { ...state, ...data };
    });
  };

  const onConnected = async data2 => {
    try {
      if (Platform.OS == 'ios') {
        RNCallKeepManager.setupCallKeep();
        VoipPushNotification.requestPermissions();
        VoipPushNotification.registerVoipToken();
        VoipPushNotification.addEventListener('register', token => {
          // send token to your apn provider server
          tokenFirebase.current = token;
          context.onSend(constants.socket_type.CONNECT, {
            token,
            id: userApp.currentUser.id,
            platform: 'ios',
            packageName: DeviceInfo.getBundleId(),
          });
        });
      } else {
        let token = await firebase.messaging().getToken();
        tokenFirebase.current = token;

        context.onSend(constants.socket_type.CONNECT, {
          token,
          id: userApp.currentUser.id,
          platform: 'android',
        });
      }
    } catch (error) { }
  };

  const onRNCallKitDidActivateAudioSession = data => {
    // AudioSession đã được active, có thể phát nhạc chờ nếu là outgoing call, answer call nếu là incoming call.
    createAnswer();
  };
  const answerCallEvent = () => {
    setState({ isAnswerSuccess: true });
  };
  const endCallEvent = ({ callUUid }) => {
    if (!state.isAnswerSuccess) rejectCall();
  };
  const addEventCallKeep = () => {
    RNCallKeep.addEventListener('answerCall', answerCallEvent);
    RNCallKeep.addEventListener('endCall', endCallEvent);
    RNCallKeep.addEventListener(
      'didActivateAudioSession',
      onRNCallKitDidActivateAudioSession,
    );
  };
  const removeEvent = () => {
    RNCallKeep.removeEventListener('answerCall', answerCallEvent);
    RNCallKeep.removeEventListener('endCall', endCallEvent);
    RNCallKeep.removeEventListener(
      'didActivateAudioSession',
      onRNCallKitDidActivateAudioSession,
    );
  };
  const startSound = () => {
    InCallManager.startRingtone('_BUNDLE_');
    Vibration.vibrate(PATTERN, true);
  };
  const stopSound = () => {
    InCallManager.stopRingtone();
    InCallManager.stop();
    Vibration.cancel();
  };
  const onOffer = async (data, callback) => {
    try {
      showModal();
      startSound();
      callId.current = data.UUID;
      socketId2.current = data.from;
      setState({ data2: data, booking: data.booking });
      if (!localPC.current) {
        await initCall(localStream.current);
      }

      data.sdp.sdp = BandwidthHandler.getSdp(data.sdp.sdp);

      await localPC.current.setRemoteDescription(
        new RTCSessionDescription(data.sdp),
      );
    } catch (error) { }
  };

  const onTimeOut = () => {
    timeout.current = setTimeout(() => {
      rejectCall();
    }, 30 * 60 * 1000);
  };

  useEffect(() => {
    const didmount = async () => {
      try {
        await startLocalStream(true);
        await context.connectSocket(userApp.loginToken);
        context.listen('connect', onConnected);
        context.listen(constants.socket_type.OFFER, onOffer);
        context.listen(constants.socket_type.ANSWER, async data => {
          setState({ isAnswerSuccess: true });
          onTimeOut();
          soundUtils.stop();
          data.sdp.sdp = BandwidthHandler.getSdp(data.sdp.sdp);

          await localPC.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp),
          );
        });
        context.listen(constants.socket_type.LEAVE, data => {
          if (data.status && data.code == 1 && !state.isAnswerSuccess) {
            setState({ callStatus: 'Máy bận' });
            setTimeout(closeStreams, 1500);
          } else {
            setState({ callStatus: 'Kết thúc cuộc gọi' });
            closeStreams();
          }
          setState({ statusCall: true });
        });

        addEventCallKeep();
      } catch (error) { }
    };
    if (userApp.isLogin) {
      didmount();
    } else {
      context.onSend(
        constants.socket_type.DISCONNECT,
        { token: tokenFirebase.current, platform: Platform.OS },
        data => {
          context.socket.disconnect();
        },
      );
      removeEvent();
    }
    return () => {
      if (state.isAnswerSuccess || state.makeCall) {
        rejectCall();
      }
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [userApp.isLogin]);
  const handleGetUserMediaError = e => {
    let message = '';
    switch (e.name) {
      case 'NotFoundError':
        message = 'NotFoundError';
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        message = 'PermissionDeniedError';
        // Do nothing; this is the same as the user canceling the call.
        break;
      default:
        message = e.message;
        break;
    }
    context.onSend(constants.socket_type.ERROR, {
      callId: callId.current,
      userId: userApp?.currentUser?.id,
      error: message,
    });
  };
  const startLocalStream = async init => {
    return new Promise(async (resolve, reject) => {
      try {
        // isFront will determine if the initial camera should face user or environment
        const isFront = true;
        const devices = await mediaDevices.enumerateDevices();
        const facing = isFront ? 'front' : 'environment';
        const videoSourceId = devices.find(
          device => device.kind === 'videoinput' && device.facing === facing,
        );
        const facingMode = isFront ? 'user' : 'environment';
        const constraints = {
          audio: true,
          video: {
            mandatory: qvgaConstraints,
            facingMode,
            optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
          },
        };
        const newStream = await mediaDevices.getUserMedia(constraints);
        // localPC.current && localPC.current.addStream(newStream);
        resolve();
        localStream.current = newStream
        // setLocalStream(newStream);
        await initCall(newStream)
      } catch (error) {
        reject();
        handleGetUserMediaError(error);
      }
    });
  };

  const initCall = async newStream => {
    return new Promise(async (resolve, reject) => {
      try {
        // You'll most likely need to use a STUN server at least. Look into TURN and decide if that's necessary for your project
        const configuration = {
          "iceServers": [
            {
              urls: ['stun:stun.l.google.com:19302'],
            },
            {
              urls: 'turn:35.197.145.195:3478',
              username: 'mainam',
              credential: '123456',
            },
          ]
          // iceTransportPolicy: 'public',
        };
        localPC.current = new RTCPeerConnection(configuration);
        // could also use "addEventListener" for these callbacks, but you'd need to handle removing them as well
        localPC.current.onicecandidate = e => {
          try {
            if (e.candidate) {
              context.onSend(constants.socket_type.CANDIDATE, {
                to: socketId2.current,
                candidate: e.candidate,
              });
            }
          } catch (err) { }
        };
        localPC.current.onnegotiationneeded = e => {
          resolve();
          context.listen(constants.socket_type.CANDIDATE, async data => {
            try {
              if (data.candidate) {
                console.log('data.candidate: ', data.candidate);
                await localPC.current.addIceCandidate(new RTCIceCandidate(data.candidate));
              }
            } catch (error) {
              console.log('error: ', error);
            }

          });
        };
        localPC.current.onaddstream = e => {
          if (e.stream && remoteStream !== e.stream) {
            setRemoteStream(e.stream);
          }
        };

        // if (!localStream) {
        //   await startLocalStream();
        // } else {
        localPC.current.addStream(newStream);

        // }
        /**
         * On Ice Connection State Change
         */

        localPC.current.oniceconnectionstatechange = async event => {
          switch (event.target.iceConnectionState) {
            case 'completed':
              setState({ statusCall: true });
              break;
            case 'failed':
              if (localPC.current.restartIce) {
                localPC.current.restartIce();
              }
              // else {
              //   try {
              //     let offer = await localPC.current.createOffer({
              //       iceRestart: true,
              //     });
              //     onCreateOfferSuccess(offer);
              //   } catch (error) {}
              // }
              break;
            case 'connected':
              setState({ statusCall: true });
              break;
            case 'disconnected':
              setState({ statusCall: false });
              break;
            case 'closed':
              closeStreams();
              break;
            default:
              break;
          }
        };

      } catch (error) {
        reject(error);
      }
    });
  };

  const onCreateOfferSuccess = async (offer, booking) => {
    try {
      soundUtils.play('call_phone.mp3');
      context.onSend(
        constants.socket_type.OFFER,
        {
          booking,
          to: socketId2.current,
          from: userApp.currentUser.id,
          sdp: offer,
        },
        async res => {
          callId.current = res.callId;

          if (localPC.current) {
            await localPC.current.setLocalDescription(
              new RTCSessionDescription(offer),
            );
          }
        },
      );
    } catch (error) {
      handleGetUserMediaError(error);
    }
  };
  const startCall = async (booking, isOffer) => {
    try {
      if (!isCall.current) {
        console.log(111111);
        isCall.current = true;
        showModal();

        if (!localPC.current) {
          await initCall(localStream.current);
        }

        socketId2.current = booking?.doctor?.id;
        // if (isOffer) {
        InCallManager.start({ media: 'video' });
        setState({ makeCall: true, booking });
        const offer = await localPC.current.createOffer();
        onCreateOfferSuccess(offer, booking);
        // }
      }
    } catch (error) {
      console.log('error: ', error);
      handleGetUserMediaError(error);
    }
  };
  const createAnswer = async () => {
    try {
      InCallManager.stopRingtone();
      InCallManager.start({ media: 'video' });
      Vibration.cancel();
      const answer = await localPC.current.createAnswer();
      setState({ isAnswerSuccess: true });
      onTimeOut();
      context.onSend(
        constants.socket_type.ANSWER,
        {
          callId: callId.current,
          to: socketId2.current,
          from: userApp.currentUser.id,
          sdp: answer,
        },
        () => {
          localPC.current &&
            localPC.current.setLocalDescription(
              new RTCSessionDescription(answer),
            );
        },
      );
    } catch (error) {
      handleGetUserMediaError(error);
    }
  };
  const switchCamera = async () => {
    if (!localStream.current || localStream.current?.getVideoTracks?.().length == 0) {
      await startLocalStream();
    }

    localStream.current.getVideoTracks().forEach(track => track._switchCamera());
    setIsCamFront(isCam => !isCam);
  };

  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!localStream.current) return;
    localStream.current.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const closeStreams = () => {
    if (localPC.current) {
      // localPC.current.removeStream(remoteStream);
      // localPC.current.removeStream(localStream);
      localPC.current.close();
      localPC.current = null;
    }
    soundUtils.stop();
    stopSound();
    isCall.current = false;
    setState({
      isAnswerSuccess: false,
      makeCall: false,
      isVisible: false,
      callStatus: '',
    });
    if (timeout.current) clearTimeout(timeout.current);
    setIsSpeak(true);
    setIsMuted(false);
    if (callId.current) {
      RNCallKeep.reportEndCallWithUUID(callId.current, 2);
    }
  };
  const toggleSpeaker = () => {
    setIsSpeak(state => !state);
    InCallManager.setForceSpeakerphoneOn(!isSpeak);
  };
  const rejectCall = () => {
    let type =
      state.isAnswerSuccess || state.makeCall
        ? constants.socket_type.LEAVE
        : constants.socket_type.REJECT;
    context.onSend(constants.socket_type.LEAVE, {
      to: socketId2.current,
      callId: callId.current,
      type,
    });
    closeStreams();
  };
  return (
    <Modal
      animated={true}
      animationType="slide"
      transparent={false}
      visible={state.isVisible}>
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <View
          style={[
            styles.rtcview,
            { height, ...StyleSheet.absoluteFillObject, zIndex: 0 },
          ]}>
          {remoteStream ? (
            <RTCView
              style={styles.rtc}
              zOrder={-1}
              mirror={false}
              objectFit="cover"
              streamURL={remoteStream.toURL()}
            />
          ) : null}
        </View>

        {localPC.current ? <BandWidth localPc={localPC.current} /> : null}
        <View style={[styles.groupLocalSteam]}>
          {localStream.current && (
            <RTCView
              style={[styles.rtc]}
              zOrder={1}
              mirror={isCamFront}
              streamURL={localStream.current.toURL()}
            />
          )}
          <TouchableOpacity onPress={switchCamera} style={styles.buttonSwitch}>
            <Image
              source={require('@images/new/videoCall/camera_switch.png')}
              style={styles.iconSwitch}
            />
          </TouchableOpacity>
        </View>
        <Timer
          data={{
            booking: state.booking ? state.booking : state.data2,
            mediaConnected: state.isAnswerSuccess,
          }}
        />
        {state.callStatus && !state.isAnswerSuccess ? (
          <Text style={styles.statusCall}>{state.callStatus}</Text>
        ) : null}
        {!state.statusCall && remoteStream && state.isAnswerSuccess ? (
          <Text style={styles.textWarning}>
            Kết nối bị gián đoạn vui lòng di chuyển đến khu vực có tín hiệu tốt
            để có cuộc gọi ổn định
          </Text>
        ) : null}
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          {localStream.current && (state.isAnswerSuccess || state.makeCall) && (
            <View style={styles.toggleButtons}>
              <TouchableOpacity onPress={toggleMute} style={{ padding: 10 }}>
                {isMuted ? (
                  <Image
                    source={require('@images/new/videoCall/mute_selected.png')}
                    style={styles.icon}
                  />
                ) : (
                    <Image
                      source={require('@images/new/videoCall/mute.png')}
                      style={styles.icon}
                    />
                  )}
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSpeaker} style={{ padding: 10 }}>
                {isSpeak ? (
                  <Image
                    source={require('@images/new/videoCall/speaker_selected.png')}
                    style={styles.icon}
                  />
                ) : (
                    <Image
                      source={require('@images/new/videoCall/speaker.png')}
                      style={styles.icon}
                    />
                  )}
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.toggleButtons}>
            {!state.isAnswerSuccess && !state.makeCall ? (
              <TouchableOpacity onPress={createAnswer} style={{ padding: 10 }}>
                <Image
                  source={require('@images/new/videoCall/accept_call.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={() => rejectCall(constants.socket_type.LEAVE)}
              style={{ padding: 10 }}>
              <Image
                source={require('@images/new/videoCall/end_call.png')}
                style={styles.icon}
              />
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
  statusCall: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 15,
    paddingTop: 10,
  },
  textWarning: {
    color: '#FFF',
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  groupLocalSteam: {
    height: '30%',
    width: '40%',
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginRight: 5,
    zIndex: 10,
  },
  icon: {
    height: 60,
    width: 60,
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
    flex: 1,
    paddingTop: 10,
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
