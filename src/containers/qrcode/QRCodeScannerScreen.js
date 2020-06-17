'use strict';
import snackbar from '@utils/snackbar-utils';
import ActivityPanel from '@components/ActivityPanel';
import userProvider from '@data-access/user-provider';
import constants from '../../res/strings';
import redux from '@redux-store';
import { connect } from 'react-redux';
import ImagePicker from 'mainam-react-native-select-image';
// import jsQR from "jsqr";
// import RNFetchBlob from 'rn-fetch-blob'
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Linking,
    Platform
} from 'react-native';
// import QrcodeDecoder from 'qrcode-decoder';
import QRCodeScanner from 'mainam-react-native-qrcode-scanner';
import ScaledImage from 'mainam-react-native-scaleimage';
import { Icon } from 'native-base';
class QRCodeScannerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            title: this.props.navigation.state.params.title,
            textHelp: this.props.navigation.state.params.textHelp,
            isAuthorizationChecked: false
        }
    }

    onSuccess(e) {
        console.log('e: ', e);
        this.setState({ isLoading: true }, () => {
            if (this.props.navigation.state.params.onCheckData);
            this.props.navigation.state.params.onCheckData(e.data).then(s => {
                this.setState({
                    isLoading: false,
                }, () => {
                    this.props.navigation.pop();
                    if (this.props.navigation.state.params.onSuccess)
                        this.props.navigation.state.params.onSuccess(s)
                })
            }).catch(e => {
                if (this.props.navigation.state.params.onError)
                    this.props.navigation.state.params.onError(e)
                this.setState({
                    isLoading: false,
                });
                setTimeout(() => {
                    if (this.scanner)
                        this.scanner.reactivate();
                }, 3000);
            })
        });
    }
    componentWillMount() {
        // let permistion = Platform.OS == 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
        // check(permistion).then(response => {
        //     // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        //     // alert(response);
        // }).catch(err => {
        //     console.log('err: ', err);

        // })
    }
    onChangeCamreraType = () => {
        this.setState({
            front: !this.state.front,
            flashOn: false
        })
    }
    onTurnOnFlash = () => {
        if (!this.state.front)
            this.setState({
                flashOn: !this.state.flashOn
            })
        else {
            snackbar.show(constants.qr_code.flash_only_behind, "danger")
        }
    }
    onSelectImage = () => {
        // if (this.imagePicker) {
        //     this.imagePicker.open(false, 0, 0, image => {
        //         debugger;
        //         const context = this.canvas.getContext('2d');
        //         this.canvas.width = image.width;
        //         this.canvas.height = image.height;
        //         const imageCanvas = new CanvasImage(this.canvas);

        //         imageCanvas.addEventListener('load', () => {
        //             console.log('image is loaded');
        //             context.drawImage(imageCanvas, 0, 0, image.width, image.height);
        //             debugger
        //         });
        //         // imageCanvas.src = "https://ps.w.org/featured-image-from-url/assets/screenshot-4.jpg?rev=1694895";//image.path;
        //         imageCanvas.src = `https://www.qr-code-generator.com/wp-content/themes/qr/new_structure/generator/dist/generator/assets/images/websiteQRCode_noFrame.png`;// `${RNFS.MainBundlePath}/${image.path}`;//image.path;

        //         // imageCanvas.onload = () => {
        //         //     debugger;
        //         //     context.drawImage(imageCanvas, 0, 0, this.canvas.width, this.canvas.height);
        //         // };
        //         // context.drawImage(imageCanvas, 0, 0, this.canvas.width, this.canvas.height);
        //         // QRreader(image.path).then((data) => {
        //         //     debugger;
        //         //     this.setState({
        //         //         reader: {
        //         //             message: '识别成功',
        //         //             data: data
        //         //         }
        //         //     });
        //         //     // 十秒后自动清空
        //         //     setTimeout(() => {
        //         //         this.setState({
        //         //             reader: {
        //         //                 message: null,
        //         //                 data: null
        //         //             }
        //         //         })
        //         //     }, 10000);
        //         // }).catch((err) => {
        //         //     this.setState({
        //         //         reader: {
        //         //             message: '识别失败',
        //         //             data: null
        //         //         }
        //         //     });
        //         // });

        //         // var qr = new QrcodeDecoder();
        //         // const code = await qr.decodeFromImage(image.path);
        //         // console.log(code);
        //         // RNFS.readFile(image.path, 'base64').then(base64string => {
        //         //     // var BASE64_MARKER = ';base64,';
        //         //     // let convertDataURIToBinaryFF = (dataURI) => {
        //         //     //     // var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        //         //     //     var raw = window.atob(dataURI);
        //         //     //     var rawLength = raw.length;
        //         //     //     var array = new Uint8Array(new ArrayBuffer(rawLength));
        //         //     //     for (let i = 0; i < rawLength; i++) {
        //         //     //         array[i] = raw.charCodeAt(i);
        //         //     //     }
        //         //     //     return array;
        //         //     // };
        //         //     // debugger;
        //         //     // let arr = convertDataURIToBinaryFF(base64string);
        //         //     require('typedarray').MAX_ARRAY_LENGTH = 2000000000;
        //         //     var Uint8ClampedArray = require('typedarray').Uint8ClampedArray;
        //         //     const Buffer = require('buffer').Buffer;
        //         //     global.Buffer = Buffer; // very important
        //         //     // global.MAX_ARRAY_LENGTH = 20000000; // very important
        //         //     const jpeg = require('jpeg-js');


        //         //     const jpegData = Buffer.from(base64string, 'base64');
        //         //     var rawImageData = jpeg.decode(jpegData);

        //         //     var clampedArray = new Uint8ClampedArray(rawImageData.data.length);
        //         //     // manually fill Uint8ClampedArray, cause Uint8ClampedArray.from function is not available in react-native
        //         //     var i;
        //         //     for (i = 0; i < rawImageData.data.length; i++) {
        //         //         clampedArray[i] = rawImageData.data[i];
        //         //     }

        //         //     let code = jsQR(arr, image.width, image.height);
        //         // });
        //         // var base64Img = require('base64-img');
        //         // var data = base64Img.base64Sync(image.path);

        //         // RNFetchBlob.fs.readFile(image.path, { encoding: 'base64' }).then(s => {

        //         //     s.toString('base64');
        //         //     debugger;
        //         //     let x = new Buffer(s).toString('base64');
        //         //     debugger;
        //         // })
        //         // debugger;
        //         // RNFetchBlob.fs.readFile(image.path, 'base64').then(s => {
        //         //     debugger;
        //         //     let x = new Buffer(s).toString('base64');
        //         // let code = jsQR(`data:image/gif;base64,${s}`, image.width, image.height);
        //         // })
        //         // NativeModules.FileReaderModule.readAsDataURL(image.path).then(s=>{
        //         //     debugger;
        //         // })
        //         // debugger;
        //         // NativeModules.ReadImageData.readImage(image.path, image => {
        //         //     debugger;
        //         // });
        //         // debugger;
        //     })
        // }
    }
    render() {
        return (
            <ActivityPanel isLoading={this.state.isLoading} title={this.state.title || constants.title.scan_qr_code}
            >
                    <QRCodeScanner
                        // reactivate={true}
                        flashOn={this.state.flashOn}
                        ref={(node) => { this.scanner = node }}
                        showMarker={true}
                        checkAndroid6Permissions={true}
                        cameraType={this.state.front ? 'front' : 'back'}
                        onRead={this.onSuccess.bind(this)}
                        topContent={

                            <Text style={styles.centerText}>
                                {this.state.textHelp || constants.qr_code.move_camera}</Text>

                        }
                        bottomContent={
                            <View style={styles.containerBottom}>
                                {/* <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity onPress={this.onSelectImage} style={{ width: 50, height: 50, backgroundColor: '#00000030', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon type="MaterialIcons" name="image" style={{ color: '#FFF' }}></Icon>
                                </TouchableOpacity>
                            </View> */}
                                <View style={styles.containerFlash}>
                                    <TouchableOpacity onPress={this.onTurnOnFlash} style={styles.buttonFlash}>
                                        <Icon name="flashlight" style={{ color: this.state.flashOn ? '#FFF' : '#00000030' }}></Icon>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.containerFlash}>
                                    <TouchableOpacity onPress={this.onChangeCamreraType} style={styles.buttonFlash}>
                                        <Icon type="MaterialCommunityIcons" name="camera" style={{ color: this.state.front ? '#FFF' : '#00000030' }}></Icon>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    />
                <ImagePicker ref={ref => this.imagePicker = ref} />
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
    buttonFlash: {
        width: 50,
        height: 50,
        backgroundColor: '#00000030',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerFlash: {
        flex: 1,
        alignItems: 'center'
    },
    containerBottom: {
        flexDirection: 'row',
        marginBottom: 30
    },
    centerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});

export default QRCodeScannerScreen;