import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Animated, Easing, Platform, Image, ImageBackground, Keyboard } from 'react-native';
import { Fab, Container, Header } from 'native-base';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import Dimensions from 'Dimensions';
import ImageProgress from 'mainam-react-native-image-progress';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import Progress from 'react-native-progress/Pie';
import clientUtils from '@utils/client-utils';
import convertUtils from 'mainam-react-native-convert-utils';
import userProvider from '@data-access/user-provider';
import UserInput from '@components/UserInput';
import constants from '@resources/strings';
import ic_back from '@images/ic_back.png';
const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = Dimensions.get('window');
import ImageLoad from 'mainam-react-native-image-loader';
const bgImage = require("@images/bg.png")
const icSupport = require("@images/ichotro.png")
const icCamera = require("@images/photoCamera.png")
const icEdit = require("@images/edit1.png")
import redux from '@redux-store';

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: true,
            user: this.props.userApp.currentUser,
            userName: "",
            avatar: this.props.userApp.currentUser.avatar
        };
        this.onChange = this.onChange.bind(this)
        this.animatedValueBtn = new Animated.Value(54)
        this.selectAvatar = this.selectAvatar.bind(this)
        this.updateUsername = this.updateUsername.bind(this)
    }

    componentWillMount() {
        this.animatedValue = new Animated.Value(0);
        this.value = 0;
        this.animatedValue.addListener(({ value }) => {
            this.value = value;
        })
        this.frontInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
        })
        this.backInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg']
        })
        this.frontOpacity = this.animatedValue.interpolate({
            inputRange: [89, 90],
            outputRange: [1, 0]
        })
        this.backOpacity = this.animatedValue.interpolate({
            inputRange: [89, 90],
            outputRange: [0, 1]
        })
    }

    flipCard() {
        if (this.value >= 90) {
            Animated.spring(this.animatedValue, {
                toValue: 0,
                friction: 8,
                tension: 10
            }).start();
        } else {
            Animated.spring(this.animatedValue, {
                toValue: 180,
                friction: 8,
                tension: 10
            }).start();
        }
    }

    animate() {
        let value = 0
        this.state.view ? value = 300 : value = 54
        Animated.timing(
            this.animatedValueBtn, {
                toValue: value,
                duration: 250,
                easing: Easing.linear
            }
        ).start(() => { console.log("Animated ") })
    }

    onChange() {
        this.animate()
        this.flipCard()
        this.setState({ view: !this.state.view })
    }

    selectAvatar() {
        if (this.imagePicker) {
            this.imagePicker.open(true, 200, 200, image => {
                this.setState({ isLoading: true });
                imageProvider.upload(image.path, (s, e) => {
                    console.log(JSON.stringify(s))
                    if (s && s.data.code == 0) {
                        this.setState({ avatar: s.data.data.images[0].thumbnail }, () => {
                            this.state.user.avatar = s.data.data.images[0].thumbnail
                            this.props.dispatch(redux.userLogin(this.state.user));
                            this.setState({ isLoading: false });
                        });
                    } else {
                        this.setState({ isLoading: false });
                        snack
                    }
                })
            })
        }
    }

    updateUsername= (text) => {
        this.setState({
            userName:"adsad"
        })
    }

    senData() {
        alert("adasdsadsadsada")
    }

    render() {
        const animatedSizeFrom = { width: this.animatedValueBtn }
        const animatedSizeTo = { width: this.animatedValueBtn }
        const frontAnimatedStyle = {
            transform: [
                { rotateY: this.frontInterpolate }
            ]
        }
        const backAnimatedStyle = {
            transform: [
                { rotateY: this.backInterpolate }
            ]
        }
        const source = this.state.avatar ? { uri: this.state.avatar.absoluteUrl() } : icSupport;
        return (
            <ActivityPanel style={{ flex: 1 }} title="Thông tin cá nhân" showFullScreen={true} isLoading={this.state.isLoading}>
                <ImageBackground source={bgImage} style={{ width: '100%', height: '100%' }}>

                    <ScrollView style={styles.container} zIndex={2}>
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.boxAvatar} onPress={this.selectAvatar}>
                                <ImageLoad
                                    resizeMode="cover"
                                    imageStyle={{ borderRadius: 40 }}
                                    borderRadius={40}
                                    customImagePlaceholderDefaultStyle={[styles.avatar, { width: 70, height: 70 }]}
                                    placeholderSource={icSupport}
                                    style={styles.avatar}
                                    resizeMode="cover"
                                    loadingStyle={{ size: 'small', color: 'gray' }}
                                    source={source}
                                    defaultImage={() => {
                                        return <ScaleImage resizeMode='cover' source={icSupport} width={80} style={styles.avatar} />
                                    }}
                                />
                                <ScaleImage source={icCamera} width={20} style={styles.iconChangeAvatar} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.boxAnimatedcontent}>
                            <Animated.View style={[styles.flipCard, frontAnimatedStyle, Platform.OS == "android" ? { opacity: this.frontOpacity } : null]}>
                                <View>
                                    <Text style={styles.name}>{this.state.user.name.toUpperCase()}</Text>
                                    <View style={styles.content}>
                                        <View style={styles.item}>
                                            <Text style={styles.lable}>Số điện thoại:</Text>
                                            <Text style={styles.value}>{this.state.user.phone ? this.state.user.phone : 'Chưa Có Số Điện Thoại'}</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text style={styles.lable}>Email:</Text>
                                            <Text style={styles.value}>{this.state.user.email ? this.state.user.email : 'Chưa Có Email'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Animated.View>
                            <Animated.View style={[styles.flipCard2, styles.flipCardBack, backAnimatedStyle, Platform.OS == "android" ? { opacity: this.backOpacity } : null]}>
                                <TextInput
                                    placeholder={constants.input_username_or_email}
                                    value={this.state.userName}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    autoCorrect={false}
                                    onChangeText={(s) => this.setState({ userName: s })}
                                    underlineColorAndroid="transparent"
                                    onSubmitEditing={this.senData}
                                    style={styles.inputText}
                                />
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    placeholder={constants.input_username_or_email}
                                    value={this.state.user.email}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    autoCorrect={false}
                                    onTextChange={(s) => this.setState({ email: s })}
                                    style={styles.inputText}
                                />
                                <TextInput
                                    placeholder={constants.input_username_or_email}
                                    value={this.state.user.name}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    autoCorrect={false}
                                    onTextChange={(s) => this.setState({ email: s })}
                                    style={styles.inputText}
                                />

                                <Text style={{ color: "#000000", marginTop: 20 }}>
                                    <Text style={{ fontWeight: "bold", color: "#00977c" }}>Lưu ý</Text> : khi thay đổi email, quý khách cần đăng nhập email mới để kích hoạt lại tài khoản
                                </Text>

                            </Animated.View>
                            <View style={styles.actions}>
                                <Animated.View style={[styles.boxAnimate, this.state.view ? animatedSizeTo : animatedSizeFrom]}>
                                    <TouchableOpacity style={styles.fab} onPress={this.onChange} >
                                        {
                                            this.state.view ?
                                                <ScaleImage source={icEdit} width={24} style={{ position: 'absolute', left: 15, top: 15 }} />
                                                :
                                                <Text style={styles.btnUpdate}>CẬP NHẬT</Text>
                                        }
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </View>
                        <ImagePicker ref={ref => this.imagePicker = ref} />
                    </ScrollView>
                </ImageBackground>
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    header: {
        // backgroundColor: "white",
        paddingTop: 40,
        paddingLeft: 60,
        height: "100%",
        flex: 1
    },
    boxAvatar: {
        width: 84,
        height: 84,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 42,
        borderWidth: 2,
        borderColor: '#5fba7d',
        marginBottom: 18,
    },
    avatar: {
        alignSelf: 'center',
        borderRadius: 40,
        width: 80,
        height: 80
    },
    iconChangeAvatar: {
        position: 'absolute',
        zIndex: 1,
        bottom: 2,
        right: 2
    },
    boxAnimatedcontent: {
        alignItems: "center",
        justifyContent: "center",
    },
    flipCard: {
        width: 320,
        height: 350,
        // backgroundColor: 'blue',
        backgroundColor: '#edf4fa',
        borderRadius: 20,
        backfaceVisibility: 'hidden',
    },
    flipCard2: {
        width: 320,
        height: 350,
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
        padding: 20
    },
    flipCardBack: {
        // backgroundColor: "red",
        backgroundColor: '#edf4fa',
        borderRadius: 20,
        position: "absolute",
        top: 0,
        padding: 20
    },
    actions: {
        height: 74,
        width: 300,
        alignItems: 'flex-end',
    },
    name: {
        marginTop: 20,
        paddingLeft: 20,
        // marginBottom: 40,
        fontSize: 26,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#23429b",
        width: 190,
    },
    content: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#edf4fa',
        paddingBottom: 40
    },
    item: {
        paddingTop: 20,
        // color:'#3a4f60'
    },
    lable: {
        fontSize: 19,
        color: '#3a4f60'
    },
    value: {
        fontSize: 19,
        fontWeight: "bold",
        color: '#3a4f60'
    },
    boxAnimate: {
        marginTop: 20,
        width: 54,
    },
    fab: {
        width: "100%",
        height: 54,
        backgroundColor: '#00796b',
        borderRadius: 100
    },
    btnUpdate: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        paddingTop: 15,
        fontSize: 18,
        fontWeight: "bold",
        fontStyle: "normal",
        color: '#ffffff',
        letterSpacing: 0
    },
    inputText: {
        marginTop: 20,
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 6,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#3a4f60",
        height: 42,
        borderWidth: 1,
        borderColor: 'rgba(155,155,155,0.7)',
        paddingHorizontal: 5
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ProfileScreen);