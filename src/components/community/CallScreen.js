import React from 'react';
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc'
import io from 'socket.io-client';

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
import { connect } from 'react-redux';
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
import stringUtils from 'mainam-react-native-string-utils'
const { width, height } = Dimensions.get('screen');

const ONE_SECOND_IN_MS = 1000;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  3 * ONE_SECOND_IN_MS,
];
const HOST = process.env.HOST || 'http://35.197.134.160:3333'
const isFront = true // Use Front camera?
const DEFAULT_ICE = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
    {
      urls: 'turn:35.197.145.195:3478',
      username: 'mainam',
      credential: '123456',
    },
  ]
}

class CallScreen extends React.Component {

  constructor(props) {
    super(props)

    this.on_ICE_Connection_State_Change = this.on_ICE_Connection_State_Change.bind(this)
    this.on_Add_Stream = this.on_Add_Stream.bind(this)
    this.on_ICE_Candiate = this.on_ICE_Candiate.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.on_Offer_Received = this.on_Offer_Received.bind(this)
    this.on_Answer_Received = this.on_Answer_Received.bind(this)
    this.setupWebRTC = this.setupWebRTC.bind(this)
    this.handleAnswer = this.handleAnswer.bind(this)

    this.state = {
      connected: false,
      ice_connection_state: '',
      pendingCandidates: [],
      isCamFront: true,
      isVisible: false,
      callId: '',
      isAnswerSuccess: false,
      makeCall: false,
      isSpeak: true
    }
  }

  render() {
    const { remoteStreamURL, callStatus, isAnswerSuccess, isVisible, makeCall, isCamFront, localStreamURL, isSpeak, offer_received, offer_answered, isMuted } = this.state
    return (
      <Modal
        animated={true}
        animationType="slide"
        transparent={false}
        visible={isVisible}>
        <View style={styles.container}>
          <StatusBar translucent={true} backgroundColor={'transparent'} />
          <View
            style={[
              styles.rtcview,
              { height, ...StyleSheet.absoluteFillObject, zIndex: 0 },
            ]}>
            {remoteStreamURL ? (
              <RTCView
                style={styles.rtc}
                zOrder={-1}
                mirror={false}
                objectFit="cover"
                streamURL={remoteStreamURL}
              />
            ) : null}
          </View>

          {/* {localPC.current ? <BandWidth localPc={localPC.current} /> : null} */}
          <View style={[styles.groupLocalSteam]}>
            {localStreamURL && (
              <RTCView
                style={[styles.rtc]}
                zOrder={1}
                mirror={isCamFront}
                streamURL={localStreamURL}
              />
            )}
            <TouchableOpacity onPress={this.switchCamera} style={styles.buttonSwitch}>
              <Image
                source={require('@images/new/videoCall/camera_switch.png')}
                style={styles.iconSwitch}
              />
            </TouchableOpacity>
          </View>
          <Timer
            data={{
              booking: this.state.data,
              mediaConnected: isAnswerSuccess,
            }}
          />
          {callStatus && !isAnswerSuccess ? (
            <Text style={styles.statusCall}>{callStatus}</Text>
          ) : null}
          {/* {!statusCall && remoteStream && state.isAnswerSuccess ? (
            <Text style={styles.textWarning}>
              Kết nối bị gián đoạn vui lòng di chuyển đến khu vực có tín hiệu tốt
              để có cuộc gọi ổn định
            </Text>
          ) : null} */}
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            {localStreamURL && (makeCall || isAnswerSuccess) && (
              <View style={styles.toggleButtons}>
                <TouchableOpacity onPress={this.toggleMute} style={{ padding: 10 }}>
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
                <TouchableOpacity onPress={this.toggleSpeaker} style={{ padding: 10 }}>
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
              {offer_received && !isAnswerSuccess ? (
                <TouchableOpacity onPress={this.handleAnswer} style={{ padding: 10 }}>
                  <Image
                    source={require('@images/new/videoCall/accept_call.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={this.rejectCall}
                style={{ padding: 10 }}>
                <Image
                  source={require('@images/new/videoCall/end_call.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  startSound = () => {
    InCallManager.startRingtone('_BUNDLE_');
    Vibration.vibrate(PATTERN, true);
  };
  stopSound = () => {
    InCallManager.stopRingtone();
    InCallManager.stop();
    Vibration.cancel();
  };
  async setupWebRTC() {
    await this.getMediaDevices()
    const peer = new RTCPeerConnection(DEFAULT_ICE)
    peer.oniceconnectionstatechange = this.on_ICE_Connection_State_Change
    peer.onaddstream = this.on_Add_Stream
    peer.onicecandidate = this.on_ICE_Candiate
    peer.onicegatheringstatechange = this.on_ICE_Grather_State_Change
    peer.addStream(this.localStream)
    this.peer = peer
  }
  on_ICE_Grather_State_Change = (ev) => {
    console.log('ev: ', this.peer.iceGatheringState);
    switch (this.peer.iceGatheringState) {
      case "gathering":
        if (!this.state.makeCall)
          this.setState({ callStatus: "Đang kết nối" })
        break;
      case "complete":
        if (this.state.pendingCandidates.length > 0) {
          this.sendMessage(this.state.offer_received ? constants.socket_type.ANSWER : constants.socket_type.OFFER, {
            to: this.state.userId,
            description: this.peer.localDescription,
            candidates: this.state.pendingCandidates,
            booking: this.state.data,
            callId: this.state.callId,
            sdp: this.offer,
            from: this.props.userApp.currentUser.id
          })
        } else {
        }
        break;

      default:
        break;
    }
  }
  startCall = async (e) => {
    try {
      this.setState({ callId: stringUtils.guid() })
      await this.setupWebRTC()
      InCallManager.start({ media: 'video' });
      soundUtils.play('call_phone.mp3');
      const { peer } = this
      // Create Offer
      const offer = await peer.createOffer()
      this.offer = offer
      await peer.setLocalDescription(offer)
      this.setState({ isVisible: true, userId: e.doctor.id, data: e, makeCall: true })
    } catch (e) {

    }
  }
  switchCamera = async () => {
    this.localStream.getVideoTracks().forEach(track => track._switchCamera());
    this.setState({ isCamFront: !this.state.isCamFront });
  };
  onTimeOut = () => {
    this.timeout = setTimeout(() => {
      this.rejectCall();
    }, 30 * 60 * 1000);
  };

  // Mutes the local's outgoing audio
  toggleMute = () => {
    if (!this.localStream) return;
    this.localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      this.setState({ isMuted: !track.enabled });
    });
  };
  toggleSpeaker = () => {
    this.setState({ isSpeak: !this.state.isSpeak });
    InCallManager.setForceSpeakerphoneOn(!this.state.isSpeak);
  };
  on_ICE_Connection_State_Change(e) {
    this.setState({
      ice_connection_state: e.target.iceConnectionState
    })
    switch (e.target.iceConnectionState) {
      case 'completed':
        break;
      case 'connected':
        this.onTimeOut()
        this.setState({ isAnswerSuccess: true })
        break;
      case 'closed':
      case 'disconnected':
        break;
      case 'failed':
        // this.rejectCall()
        break
    }
  }

  on_ICE_Candiate(e) {
    const { candidate } = e
    if (candidate) {
      let pendingRemoteIceCandidates = this.state.pendingCandidates
      if (Array.isArray(pendingRemoteIceCandidates)) {
        this.setState({
          pendingCandidates: [...pendingRemoteIceCandidates, candidate]
        })
      } else {
        this.setState({
          pendingCandidates: [candidate]
        })
      }
    }
  }



  on_Add_Stream(e) {

    this.setState({
      remoteStreamURL: e.stream.toURL()
    })
    this.remoteStream = e.stream
  }

  resetState = () => {
    this.localStream = null
    this.setState({
      offer_received: false,
      offer_answered: false,
      offer: null,
      isVisible: false,
      callId: null,
      userId: null,
      remoteStreamURL: null,
      pendingCandidates: [],
      data: null,
      localStreamURL: null,
      isSpeak: true,
      isMuted: false,
      isCamFront: true,
      callStatus: null,
      isAnswerSuccess: false,
      makeCall: false
    })
  }

  onRNCallKitDidActivateAudioSession = data => {
    // AudioSession đã được active, có thể phát nhạc chờ nếu là outgoing call, answer call nếu là incoming call.
    this.handleAnswer();
  };
  answerCallEvent = () => {
  };
  endCallEvent = ({ callUUid }) => {
    if (!this.state.isAnswerSuccess) this.rejectCall();
  };
  addEventCallKeep = () => {
    RNCallKeep.addEventListener('answerCall', this.answerCallEvent);
    RNCallKeep.addEventListener('endCall', this.endCallEvent);
    RNCallKeep.addEventListener('didActivateAudioSession', this.onRNCallKitDidActivateAudioSession);
  };
  removeEvent = () => {
    RNCallKeep.removeEventListener('answerCall', this.answerCallEvent);
    RNCallKeep.removeEventListener('endCall', this.endCallEvent);
    RNCallKeep.removeEventListener('didActivateAudioSession', this.onRNCallKitDidActivateAudioSession);
  };
  async on_Offer_Received(data) {
    await this.setupWebRTC()

    this.startSound();
    this.offer = data.description
    this.setState({
      offer_received: true,
      offer_answered: false,
      offer: data,
      isVisible: true,
      callId: data.callId,
      userId: data.from,
      data: data.booking
    })
  }

  async on_Answer_Received(data) {
    soundUtils.stop();
    const { description, candidates } = data
    description.sdp = BandwidthHandler.getSdp(description.sdp)
    await this.peer.setRemoteDescription(new RTCSessionDescription(description))
    candidates.forEach(c => this.peer.addIceCandidate(new RTCIceCandidate(c)))
    this.setState({
      answer_recevied: true
    })
  }

  handleReject = async () => {
    if (this.peer)
      this.peer.close()
    soundUtils.stop();
    this.stopSound()
    if (this.timeout) clearTimeout(this.timeout)
    if (this.state.callId) {
      RNCallKeep.reportEndCallWithUUID(this.state.callId, 2);
    }
    this.resetState()
  }
  async handleAnswer() {
    try {
      const { description, candidates } = this.state.offer

      const { peer } = this
      await peer.setRemoteDescription(new RTCSessionDescription(description))
      InCallManager.stopRingtone();
      InCallManager.start({ media: 'video' });
      Vibration.cancel();
      if (Array.isArray(candidates)) {
        candidates.forEach((c) => peer.addIceCandidate(new RTCIceCandidate(c)))
      }
      const answer = await peer.createAnswer()
      await peer.setLocalDescription(answer)
      this.setState({
        offer_answered: true
      })
    } catch (error) {


    }

  }

  sendMessage(type, msgObj) {
    if (this.socket) {
      this.socket.emit(type, msgObj, (data) => {


      })
    } else {
      const e = {
        code: 'websocket_error',
        message: 'WebSocket state:' + ws.readyState
      }
      throw e
    }
  }

  getMediaDevices = async () => {
    // Setup Camera & Audio
    try {
      const devices = await mediaDevices.enumerateDevices();
      const facing = isFront ? 'front' : 'environment';
      const videoSourceId = devices.find(
        device => device.kind === 'videoinput' && device.facing === facing,
      );
      const facingMode = isFront ? 'user' : 'environment';
      const constraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30
          },
          facingMode: (isFront ? "user" : "environment"),
          optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }
      };
      const newStream = await mediaDevices.getUserMedia(constraints);

      this.setState({
        localStreamURL: newStream.toURL()
      })
      this.localStream = newStream
    } catch (error) {


    }


  }
  rejectCall = () => {
    let type =
      this.state.isAnswerSuccess || this.state.makeCall
        ? constants.socket_type.LEAVE
        : constants.socket_type.REJECT;
    this.socket.emit(constants.socket_type.LEAVE, {
      to: this.state.userId,
      callId: this.state.callId,
      type,
    });
    this.handleReject();
  };
  componentWillUnmount() {
    this.removeEvent()
  }
  onConnected = async data2 => {
    try {
      if (Platform.OS == 'ios') {
        RNCallKeepManager.setupCallKeep();
        VoipPushNotification.requestPermissions();
        VoipPushNotification.registerVoipToken();
        VoipPushNotification.addEventListener('register', token => {
          // send token to your apn provider server
          this.setState({ token })
          this.socket.emit(constants.socket_type.CONNECT, {
            token,
            id: this.props.userApp.currentUser.id,
            platform: 'ios',
            packageName: DeviceInfo.getBundleId(),
            deviceId: DeviceInfo.getSystemVersion(),
          });
        });
      } else {
        let token = await firebase.messaging().getToken();
        this.setState({ token })

        this.socket.emit(constants.socket_type.CONNECT, {
          token,
          id: this.props.userApp.currentUser.id,
          platform: 'android',
          deviceId: DeviceInfo.getSystemVersion(),
          packageName: DeviceInfo.getBundleId(),
        });
      }
    } catch (error) { }
  };
  componentDidUpdate = (preProps, nextProps) => {
    if (!this.props.userApp.isLogin && preProps.userApp.isLogin != this.props.userApp.isLogin) {
      this.socket.emit(
        constants.socket_type.DISCONNECT,
        { token: this.state.token, platform: Platform.OS },
        data => {
          this.socket.disconnect();
        },
      );
    }
  }
  componentDidMount() {
    this.addEventCallKeep()
    this.socket = io.connect(HOST, {
      transports: ['websocket'],
      query: {
        token: this.props.userApp.loginToken,
      },
      upgrade: true,
      reconnection: true,
      autoConnect: true,
      timeout: 30000,
      rememberUpgrade: true,
    });

    this.socket.connect();
    this.socket.on('connect', this.onConnected);

    this.socket.on(constants.socket_type.OFFER, (msg) => {
      this.on_Offer_Received(msg)
    })
    this.socket.on(constants.socket_type.ANSWER, (msg) => {
      this.on_Answer_Received(msg)
    })
    this.socket.on(constants.socket_type.LEAVE, data => {
      if (data.status && data.code == 1 && !this.state.isAnswerSuccess) {
        this.setState({ callStatus: 'Máy bận' });
        setTimeout(this.handleReject, 1500);
      } else {
        this.setState({ callStatus: 'Kết thúc cuộc gọi' });
        this.handleReject();
      }
      this.setState({ statusCall: true });
    });
  }
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
const mapStateToProps = (state) => {
  return {
    userApp: state.auth.userApp
  }
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(CallScreen)