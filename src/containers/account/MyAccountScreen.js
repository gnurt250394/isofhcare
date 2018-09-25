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
import QRCode from 'react-native-qrcode';
import userProvider from '@data-access/user-provider';
import redux from '@redux-store';


const bgImage = require("@images/bg.png")
const icSupport = require("@images/ichotro.png")
const icCamera = require("@images/photoCamera.png")
const icEdit = require("@images/edit1.png")

class MyAccountScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: true
        };
        var user = this.props.user;
        this.onChange = this.onChange.bind(this)
        this.animatedValue = new Animated.Value(0)
    }

    logout() {
        this.props.dispatch(redux.userLogout());
        Actions.login();
    }

    onChange() {
        // alert("ádasdsada")
        this.animate()
        this.setState({ view: !this.state.view })
    }

    componentDidMount() {
        this.animate()
    }

    animate() {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start()
    }

    render() {
        const textSize = this.animatedValue.interpolate({
            inputRange: [0, 200, 400],
            outputRange: [54, 200, 54]
        })

        return (
            <ActivityPanel style={{ flex: 1 }} title="Thông tin cá nhân" showFullScreen={true}>
                <View style={{ position: 'relative', flex: 1 }}>
                    <ScaleImage source={bgImage} width={DEVICE_WIDTH} zIndex={0} />
                    <ScaleImage source={require("@images/rectangle.png")} zIndex={1} width={100} style={{ bottom: 0, left: 80, position: 'absolute' }} />
                    <ScrollView style={styles.container} zIndex={2}>
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.boxAvatar}>
                                <ScaleImage source={icSupport} width={80} style={styles.avatar} />
                                <ScaleImage source={icCamera} width={20} style={styles.iconChangeAvatar} />
                            </TouchableOpacity>
                        </View>
                        {this.state.view
                            ?
                            <View>
                                <Text style={styles.name}>NGUYỄN THU PHƯƠNG THẢO</Text>
                                <View style={styles.content}>

                                    <View style={styles.item}>
                                        <Text style={styles.lable}>Số điện thoại:</Text>
                                        <Text style={styles.value}>0123456789</Text>
                                    </View>
                                    <View style={styles.item}>
                                        <Text style={styles.lable}>Email:</Text>
                                        <Text style={styles.value}>diachiemail@gmail.com</Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <View>
                                <Text><Text>Lưu ý</Text>: khi thay đổi email, quý khách cần đăng nhập email mới để kích hoạt lại tài khoản</Text>
                            </View>
                        }
                    </ScrollView >

                    <View style={styles.actions} zIndex={3}>
                        <Animated.View
                            style={{
                                fontSize: textSize,
                            }} >
                            <TouchableOpacity style={styles.fab} onPress={this.onChange} >
                                <ScaleImage source={icEdit} width={24} style={{ position: 'absolute', left: 15, top: 15 }} />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </ActivityPanel >
        );
    }
}

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
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
        borderColor: '#5fba7d'
    },
    avatar: {
        alignSelf: 'center',
        borderRadius: 100
    },
    iconChangeAvatar: {
        position: 'absolute',
        zIndex: 1,
        bottom: 5,
        right: 5
    },
    name: {
        marginTop: 18,
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
        alignItems: 'flex-end'
    },
    fab: {
        width: 54,
        height: 54,
        marginRight: 40,
        backgroundColor: '#00796b',
        borderRadius: 100,

    }
})

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(MyAccountScreen);