import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Fab, Container, Header } from 'native-base';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import Dimensions from 'Dimensions';
import ImageProgress from 'mainam-react-native-image-progress';
import ImagePicker from 'mainam-react-native-select-image';
import Progress from 'react-native-progress/Pie';
import clientUtils from '@utils/client-utils';
import convertUtils from 'mainam-react-native-convert-utils';
import userProvider from '@data-access/user-provider';
import redux from '@redux-store';
import UserInput from '@components/UserInput';
import constants from '@resources/strings';

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = Dimensions.get('window');

const bgImage = require("@images/bg.png")
const icSupport = require("@images/user.png")
const icCamera = require("@images/photoCamera.png")
const icEdit = require("@images/edit1.png")

class MyAccountScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: true,
            user: this.props.userApp.currentUser
        };
        this.onChange = this.onChange.bind(this)
        this.animatedValue = new Animated.Value(54)
        this.selectAvatar = this.selectAvatar.bind(this)
    }

    logout() {
        this.props.dispatch(redux.userLogout());
        Actions.login();
    }

    onChange() {
        this.animate()
        this.setState({ view: !this.state.view })
    }

    componentDidMount() {
        // this.animate()
    }

    componentWillMount() {
        this.animatedValue1 = new Animated.Value(0);
        this.value = 0;
        this.animatedValue1.addListener(({ value }) => {
            this.value = value;
        })
        this.frontInterpolate = this.animatedValue1.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
        })
        this.backInterpolate = this.animatedValue1.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg']
        })
    }

    flipCard() {
        if (this.value >= 90) {
            Animated.spring(this.animatedValue1, {
                toValue: 0,
                friction: 8,
                tension: 10
            }).start();
        } else {
            Animated.spring(this.animatedValue1, {
                toValue: 180,
                friction: 8,
                tension: 10
            }).start();
        }

    }
    animate() {
        let value = 0
        this.state.view ? value = DEVICE_WIDTH - 90 : value = 54
        Animated.timing(
            this.animatedValue, {
                toValue: value,
                duration: 250,
                easing: Easing.linear
            }
        ).start(() => { console.log("Animated ") })
    }

    selectAvatar() {
    }

    render() {
        const animatedSizeFrom = { width: this.animatedValue }
        const animatedSizeTo = { width: this.animatedValue }

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

        return (
            <ActivityPanel style={{ flex: 1 }} title="Thông tin cá nhân" showFullScreen={true}>
                {/* <View style={{ position: 'relative', flex: 1 }}>
                    <ScaleImage source={bgImage} width={DEVICE_WIDTH} zIndex={0} />
                    <ScaleImage source={require("@images/rectangle.png")} zIndex={1} width={100} style={{ bottom: 0, left: 80, position: 'absolute' }} /> */}
                {/* <ScrollView keyboardShouldPersistTaps='handled' style={styles.container} zIndex={2}>
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.boxAvatar} onPress={this.selectAvatar}>
                                <ScaleImage source={icSupport} width={100} style={styles.avatar} />
                                <ScaleImage source={icCamera} width={20} style={styles.iconChangeAvatar} />
                            </TouchableOpacity>
                        </View>
                        {this.state.view
                            ?
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
                            :
                            <View style={{}}>
                                <UserInput onTextChange={(s) => this.setState({ email: s })}
                                    placeholder={constants.input_username_or_email}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    autoCorrect={false}
                                    value={this.state.user.name}
                                    style={{ paddingBottom: 20, color: "#3a4f60" }} />
                                <UserInput onTextChange={(s) => this.setState({ email: s })}
                                    placeholder={constants.input_username_or_email}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    autoCorrect={false}
                                    value={this.state.user.email}
                                    style={{ paddingBottom: 20, color: "#3a4f60" }} />
                                <UserInput onTextChange={(s) => this.setState({ email: s })}
                                    placeholder={constants.input_username_or_email}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    autoCorrect={false}
                                    style={{ paddingBottom: 20, color: "#3a4f60" }} />
                                <Text style={{ paddingLeft: 20, color: "#000000" }}>
                                    <Text style={{ fontWeight: "bold", color: "#00977c" }}>Lưu ý</Text> : khi thay đổi email, quý khách cần đăng nhập email mới để kích hoạt lại tài khoản
                                </Text>
                            </View>
                        }
                    </ScrollView > */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.container} zIndex={2}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container2}>
                        <View>
                            <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                                <Text style={styles.flipText}> This text is flipping on the front. </Text>
                            </Animated.View>
                            <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack]}>
                                <Text style={styles.flipText}> This text is flipping on the back. </Text>
                            </Animated.View>
                        </View>
                        <TouchableOpacity onPress={() => this.flipCard()}>
                            <Text>Flip!</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {/* <View style={styles.actions} zIndex={3}>
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
                </View> */}
            </ActivityPanel >
        );
    }
}



const styles = StyleSheet.create({

    container2: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    flipCard: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
        backfaceVisibility: 'hidden',
    },
    flipCardBack: {
        backgroundColor: "red",
        position: "absolute",
        top: 0,
    },
    flipText: {
        width: 90,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },

















    background: {
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT - 44,
        alignSelf: 'center',
        flex: 1
    },
    container: {
        padding: 40,
        paddingBottom: 0,
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    header: {
        paddingLeft: 20,
        height: "100%",
        flex: 1
    },
    boxAvatar: {
        width: 84,
        height: 84,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#5fba7d',
        marginBottom: 18,
    },
    avatar: {
        alignSelf: 'center',
        borderRadius: 50
    },
    iconChangeAvatar: {
        position: 'absolute',
        zIndex: 1,
        bottom: 5,
        right: 5
    },
    name: {

        marginBottom: 40,
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
        paddingBottom: 100
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
    actions: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        height: 74,
        width: DEVICE_WIDTH,
        alignItems: 'flex-end',
        paddingRight: 40
    },
    boxAnimate: {
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
    }
})

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(MyAccountScreen);