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
import {WebSocketContext} from '@data-access/socket-provider';
import {useSelector} from 'react-redux';
import BandWidth from './BandWidth';
import VoipPushNotification from 'react-native-voip-push-notification';
import firebase from 'react-native-firebase';
import RNCallKeepManager from '@components/RNCallKeepManager';
import RNCallKeep from 'react-native-callkeep';
import Timer from '@containers/community/Timer';
import DeviceInfo from 'react-native-device-info';
import soundUtils from '@utils/sound-utils';
import BandwidthHandler from './BandwidthHandler';
const {width, height} = Dimensions.get('screen');

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
function CallScreen({}, ref) {
  const [state, _setState] = useState({
    statusCall: true,
    booking: {},
    id: '',
    isAnswer: false,
    isAnswerSuccess: false,
    makeCall: false,
    isVisible: false,
  });
  const [remoteStream, setRemoteStream] = useState();
  const [localStream, setLocalStream] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeak, setIsSpeak] = useState(true);
  const [isCamFront, setIsCamFront] = useState(true);
  const context = useContext(WebSocketContext);
  const callId = useRef();
  const timeout = useRef();
  // const localStream = useRef();
  const socketId = useRef('');
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
    setState({isVisible: false});
  };
  const showModal = () => {
    setState({isVisible: true});
  };
  useImperativeHandle(
    ref,
    () => ({
      startCall: (booking, isOffer) => startCall(booking, isOffer),
    }),
    [],
  );
  const setState = (data = {id: '', isAnswer: false}) => {
    _setState(state => {
      return {...state, ...data};
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
        VoipPushNotification.addEventListener(
          'notification',
          notification => {},
        );
      } else {
        let token = await firebase.messaging().getToken();
        tokenFirebase.current = token;
        console.log('token: ', token);
        context.onSend(constants.socket_type.CONNECT, {
          token,
          id: userApp.currentUser.id,
          platform: 'android',
        });
      }
    } catch (error) {}
  };
  const onDidDisplayIncomingCall = ({
    error,
    callUUID,
    handle,
    localizedCallerName,
    hasVideo,
    fromPushKit,
    payload,
  }) => {};
  const onRNCallKitDidActivateAudioSession = data => {
    // AudioSession đã được active, có thể phát nhạc chờ nếu là outgoing call, answer call nếu là incoming call.
    console.log('DID ACTIVE AUDIO');
    createAnswer();
  };
  const answerCallEvent = () => {
    setState({isAnswerSuccess: true});
    // showModal();
  };
  const endCallEvent = ({callUUid}) => {
    if (!state.isAnswerSuccess) rejectCall();
  };
  const addEventCallKeep = () => {
    RNCallKeep.addEventListener('answerCall', answerCallEvent);
    RNCallKeep.addEventListener('endCall', endCallEvent);
    RNCallKeep.addEventListener(
      'didActivateAudioSession',
      onRNCallKitDidActivateAudioSession,
    );
    RNCallKeep.addEventListener(
      'didDisplayIncomingCall',
      onDidDisplayIncomingCall,
    );
  };
  const removeEvent = () => {
    RNCallKeep.removeEventListener('answerCall', answerCallEvent);
    RNCallKeep.removeEventListener('endCall', endCallEvent);
    RNCallKeep.removeEventListener(
      'didActivateAudioSession',
      onRNCallKitDidActivateAudioSession,
    );
    RNCallKeep.removeEventListener(
      'didDisplayIncomingCall',
      onDidDisplayIncomingCall,
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
    console.log('data: ', data);
    try {
      debugger;
      // if (Platform.OS == 'android') {
      // RNCallKeepManager.displayIncommingCall(data.UUID, data.name)
      showModal();
      startSound();
      // }
      callId.current = data.UUID;
      socketId2.current = data.from;
      setState({data2: data, isAnswer: true, booking: data.booking});
      if (!localPC.current) {
        await initCall(localStream);
      }

      data.sdp.sdp = BandwidthHandler.getSdp(data.sdp.sdp);

      await localPC.current.setRemoteDescription(
        new RTCSessionDescription(data.sdp),
      );
    } catch (error) {}
  };

  const onTimeOut = () => {
    timeout.current = setTimeout(() => {
      rejectCall();
    }, 30 * 60 * 1000);
  };

  useEffect(() => {
    const didmount = async () => {
      try {
        await initCall(true);
        await context.connectSocket(userApp.loginToken);
        context.listen('connect', onConnected);
        context.listen(constants.socket_type.OFFER, onOffer);
        context.listen(constants.socket_type.CHECKING, (data, callback) => {
          console.log('data: 112211', data);
          callback({status: state.isAnswerSuccess, id: context.context.id});
        });
        context.listen(constants.socket_type.ANSWER, async data => {
          debugger;
          console.log('localPC, setRemoteDescription');
          setState({isAnswerSuccess: true});
          onTimeOut();
          soundUtils.stop();
          data.sdp.sdp = BandwidthHandler.getSdp(data.sdp.sdp);

          await localPC.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp),
          );
        });
        context.listen(constants.socket_type.CANDIDATE, async data => {
          console.log('data: CANDIDATE', data);
          debugger;
          if (data.candidate) {
            if (!localPC.current) {
              await initCall(localStream);
            }

            localPC.current.addIceCandidate(
              new RTCIceCandidate(data.candidate),
            );
          }
        });
        context.listen(constants.socket_type.LEAVE, data => {
          if (data.status && data.code == 1 && !state.isAnswerSuccess) {
            setState({callStatus: 'Máy bận'});
            setTimeout(closeStreams, 1500);
          } else {
            setState({callStatus: 'Kết thúc cuộc gọi'});
            closeStreams();
          }
          setState({statusCall: true});
        });

        addEventCallKeep();
      } catch (error) {
        console.log('error: ', error);
      }
    };
    if (userApp.isLogin) {
      didmount();
    } else {
      context.onSend(
        constants.socket_type.DISCONNECT,
        {token: tokenFirebase.current, platform: Platform.OS},
        data => {
          console.log('data: ', data);
          socket.current.disconnect();
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
      removeEvent();
    };
  }, [userApp.isLogin]);
  const handleGetUserMediaError = e => {
    switch (e.name) {
      case 'NotFoundError':
        alert(
          'Unable to open your call because no camera and/or microphone' +
            'were found.',
        );
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        // Do nothing; this is the same as the user canceling the call.
        break;
      default:
        alert('Error opening your camera and/or microphone: ' + e.message);
        break;
    }

    closeStreams();
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
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        };
        const newStream = await mediaDevices.getUserMedia(constraints);
        localPC.current.addStream(newStream);

        resolve();
        setLocalStream(newStream);
      } catch (error) {
        reject();
        handleGetUserMediaError(error);
        console.log('error: ', error);
        debugger;
      }
    });
  };

  const initCall = async newStream => {
    return new Promise(async (resolve, reject) => {
      // You'll most likely need to use a STUN server at least. Look into TURN and decide if that's necessary for your project
      const configuration = {
        iceServers: [
          {
            url: 'turn:numb.viagenie.ca',
            username: 'gnurt250394@gmail.com',
            credential: 'trung123',
          },
          {
            url: 'turn:numb.viagenie.ca',
            username: 'trung.hv@isofhcare.com',
            credential: 'trung123',
          },
        ],
        iceTransportPolicy: 'public',
      };
      localPC.current = new RTCPeerConnection(configuration);
      // could also use "addEventListener" for these callbacks, but you'd need to handle removing them as well
      localPC.current.onicecandidate = e => {
        try {
          debugger;
          console.log('localPC icecandidate:', e.candidate);
          if (e.candidate) {
            context.onSend(constants.socket_type.CANDIDATE, {
              to: socketId2.current,
              candidate: e.candidate,
              type: 'local',
            });
          }
        } catch (err) {
          debugger;
          console.error(`Error adding remotePC iceCandidate: ${err}`);
        }
      };
      localPC.current.onaddstream = e => {
        console.log('remotePC tracking with ', e);
        debugger;
        if (e.stream && remoteStream !== e.stream) {
          console.log('RemotePC received the stream', e.stream);
          setRemoteStream(e.stream);
        }
      };

      if (!localStream) {
        console.log('localStream:1111 ', localStream);
        await startLocalStream();
      }
      /**
       * On Ice Connection State Change
       */

      localPC.current.oniceconnectionstatechange = async event => {
        console.log('event: oniceconnectionstatechange', event);
        console.log(
          'event: iceConnectionState',
          event.target.iceConnectionState,
        );
        switch (event.target.iceConnectionState) {
          case 'completed':
            setState({statusCall: true});
            break;
          case 'failed':
            // if (localPC.current.restartIce) {
            //   localPC.current.restartIce();
            // } else {
            //   try {
            //     let offer = await localPC.current.createOffer({
            //       iceRestart: true,
            //     });
            //     onCreateOfferSuccess(offer);
            //   } catch (error) {}
            // }
            break;
          case 'connected':
            setState({statusCall: true});
            break;
          case 'disconnected':
            setState({statusCall: false});
            break;
          case 'closed':
            closeStreams();
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
        debugger;
        //console.log('on remove stream', event.stream);
      };
      resolve();
    });
  };

  const onCreateOfferSuccess = async (offer, booking) => {
    try {
      console.log('Offer from localPC, setLocalDescription');
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
          console.log('res: ', res);
          console.log('callId: ', callId);
          callId.current = res.callId;
          console.log('localPC.current: ', localPC.current);
          if (localPC.current) {
            await localPC.current.setLocalDescription(
              new RTCSessionDescription(offer),
            );
          }
        },
      );
    } catch (error) {}
  };
  const startCall = async (booking, isOffer) => {
    try {
      showModal();
      console.log('localPC: ', localPC);
      if (!localPC.current) {
        await initCall(localStream);
      }

      socketId2.current = booking?.doctor?.id;
      if (isOffer) {
        InCallManager.start({media: 'video'});
        setState({makeCall: true, booking});
        const offer = await localPC.current.createOffer();
        onCreateOfferSuccess(offer, booking);
        console.log('offer: ', offer);
      }
    } catch (err) {
      debugger;
      console.log(err);
    }
  };
  const createAnswer = async () => {
    try {
      InCallManager.stopRingtone();
      InCallManager.start({media: 'video'});
      Vibration.cancel();
      const answer = await localPC.current.createAnswer();
      console.log(`Answer from remotePC: ${answer.sdp}`);

      setState({isAnswerSuccess: true});
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
      debugger;
      console.log('error: ', error);
    }
  };
  const switchCamera = async () => {
    console.log('localStream: ', localStream);
    if (!localStream || localStream?.getVideoTracks?.().length == 0) {
      await startLocalStream();
    }

    localStream.getVideoTracks().forEach(track => track._switchCamera());
    setIsCamFront(isCam => !isCam);
  };

  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(track => {
      console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const closeStreams = () => {
    if (localPC.current) {
      console.log('localPC.current: ', localPC.current);
      debugger;
      localPC.current.removeStream(remoteStream);
      // localPC.current.removeStream(localStream);
      localPC.current.close();
      localPC.current = null;
    }
    soundUtils.stop();
    stopSound();
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
    console.log('callId.current: ', callId.current);
    // RNCallKeepManager.endCall()
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
            {height, ...StyleSheet.absoluteFillObject, zIndex: 0},
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
          {localStream && (
            <RTCView
              style={[styles.rtc]}
              zOrder={1}
              mirror={isCamFront}
              streamURL={localStream.toURL()}
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
          {localStream && (state.isAnswerSuccess || state.makeCall) && (
            <View style={styles.toggleButtons}>
              <TouchableOpacity onPress={toggleMute} style={{padding: 10}}>
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
              <TouchableOpacity onPress={toggleSpeaker} style={{padding: 10}}>
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
              <TouchableOpacity onPress={createAnswer} style={{padding: 10}}>
                <Image
                  source={require('@images/new/videoCall/accept_call.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={() => rejectCall(constants.socket_type.LEAVE)}
              style={{padding: 10}}>
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
