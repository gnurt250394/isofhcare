import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Animated, Easing, Platform, Image, ImageBackground, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import Progress from 'react-native-progress/Pie';
import clientUtils from '@utils/client-utils';
import convertUtils from 'mainam-react-native-convert-utils';
import ImageLoad from 'mainam-react-native-image-loader';
const bgImage = require("@images/bg.png")
const icSupport = require("@images/user.png")
const icCamera = require("@images/photoCamera.png")
const icEdit = require("@images/edit1.png")
import redux from '@redux-store';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            user: this.props.userApp.currentUser,
            name: this.props.userApp.currentUser.name,
            phone: this.props.userApp.currentUser.phone,
            email: this.props.userApp.currentUser.email,
            avatar: this.props.userApp.currentUser.avatar
        };
        this.onChange = this.onChange.bind(this)
        this.animatedValueBtn = new Animated.Value(54)
        this.selectAvatar = this.selectAvatar.bind(this)
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
        !this.state.editMode ? value = 300 : value = 54
        Animated.timing(
            this.animatedValueBtn, {
            toValue: value,
            duration: 250,
            easing: Easing.linear
        }
        ).start(() => { console.log("Animated ") })
    }

    onChange() {
        snackbar.show(constants.msg.app.in_development);
        return;
        if (this.state.editMode) {
            if (!this.state.name || this.state.name.trim()) {
                snackbar.show("Vui l??ng nh???p h??? t??n", "danger");
                return;
            }
        }
        else {
            this.animate()
            this.flipCard()
            this.setState({ editMode: !this.state.editMode })
        }
    }

    selectAvatar() {
        return;
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

    senData() {
    }

    defaultImage = () => {
        return <ScaleImage resizeMode='cover' source={icSupport} width={80} style={styles.avatar} />
    }
    onChangeText = (state) => (value) => {
        this.setState({ [state]: value })
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
            <ActivityPanel style={styles.container} title={constants.account_screens.info} showFullScreen={true} isLoading={this.state.isLoading}>
                <ImageBackground source={bgImage} style={styles.imgBackground}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        style={styles.container} zIndex={2}>
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.boxAvatar} onPress={this.selectAvatar}>
                                <ImageLoad
                                    resizeMode="cover"
                                    imageStyle={styles.imgBorder}
                                    borderRadius={40}
                                    customImagePlaceholderDefaultStyle={[styles.avatar, styles.imgPlace]}
                                    placeholderSource={icSupport}
                                    style={styles.avatar}
                                    resizeMode="cover"
                                    loadingStyle={{ size: 'small', color: 'gray' }}
                                    source={source}
                                    defaultImage={this.defaultImage}
                                />
                                {/* <ScaleImage source={icCamera} width={20} style={styles.iconChangeAvatar} /> */}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.boxAnimatedcontent}>
                            <Animated.View style={[styles.flipCard, frontAnimatedStyle, Platform.OS == "android" ? { opacity: this.frontOpacity } : null]}>
                                <View>
                                    <Text style={styles.name}>{this.state.name.toUpperCase()}</Text>
                                    <View style={styles.content}>
                                        <View style={styles.item}>
                                            <Text style={styles.lable}>{constants.phone}:</Text>
                                            <Text style={styles.value}>{this.state.phone ? this.state.phone : constants.account_screens.not_phone}</Text>
                                        </View>
                                        <View style={styles.item}>
                                            <Text style={styles.lable}>{constants.email}:</Text>
                                            <Text style={styles.value}>{this.state.email ? this.state.email : constants.account_screens.not_email}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Animated.View>
                            <Animated.View style={[styles.flipCard2, styles.flipCardBack, backAnimatedStyle, Platform.OS == "android" ? { opacity: this.backOpacity } : null]}>
                                <TextInput
                                    editable={false}
                                    placeholder={constants.phone}
                                    value={this.state.phone}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    autoCorrect={false}
                                    onChangeText={this.onChangeText('phone')}
                                    underlineColorAndroid="transparent"
                                    onSubmitEditing={this.senData}
                                    style={[styles.inputText, { backgroundColor: '#cacaca' }]}
                                />
                                <TextInput
                                    editable={false}
                                    underlineColorAndroid="transparent"
                                    placeholder={constants.email}
                                    value={this.state.email}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    autoCorrect={false}
                                    onTextChange={this.onChangeText('email')}
                                    style={[styles.inputText, { backgroundColor: '#cacaca' }]}
                                />
                                <TextInput
                                    placeholder={constants.fullname}
                                    value={this.state.name}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    autoCorrect={false}
                                    onTextChange={this.onChangeText('name')}
                                    style={styles.inputText}
                                />

                                <Text style={styles.containerWarning}>
                                    <Text style={styles.warning}>L??u ??</Text> : {constants.account_screens.warning}
                                </Text>

                            </Animated.View>
                            <View style={styles.actions}>
                                <Animated.View style={[styles.boxAnimate, !this.state.editMode ? animatedSizeTo : animatedSizeFrom]}>
                                    <TouchableOpacity style={styles.fab} onPress={this.onChange} >
                                        {
                                            !this.state.editMode ?
                                                <ScaleImage source={icEdit} width={24} style={styles.imageUpdate} />
                                                :
                                                <Text style={styles.btnUpdate}>{constants.update_to_up_case}</Text>
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
    imageUpdate: { position: 'absolute', left: 15, top: 15 },
    warning: { fontWeight: "bold", color: "#00977c" },
    containerWarning: { color: "#000000", marginTop: 20 },
    imgBorder: { borderRadius: 40 },
    imgPlace: { width: 70, height: 70 },
    imgBackground: { width: '100%', height: '100%' },
    container: { flex: 1 },

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
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(ProfileScreen);