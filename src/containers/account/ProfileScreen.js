import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Easing, Platform } from 'react-native';
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
const icSupport = require("@images/ichotro.png")
const icCamera = require("@images/photoCamera.png")
const icEdit = require("@images/edit1.png")

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: true,
            user: this.props.userApp.currentUser
        };
        // alert(JSON.stringify(Platform.OS))
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

    render() {
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
            <View style={styles.container}>
                <View>
                    <Animated.View style={[styles.flipCard, frontAnimatedStyle, Platform.OS == "android" ? { opacity: this.frontOpacity } : null]}>
                        {
                            Platform.OS == "android" ?
                                <Text style={styles.flipText}> Android Display </Text>
                                :
                                <Text style={styles.flipText}> IOS Display </Text>
                        }

                    </Animated.View>
                    <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle, Platform.OS == "android" ? { opacity: this.backOpacity } : null]}>
                        {
                            Platform.OS == "android" ?
                                <Text style={styles.flipText}> Android Edit </Text>
                                :
                                <Text style={styles.flipText}> IOS Edit </Text>
                        }
                    </Animated.View>
                </View>
                <TouchableOpacity onPress={() => this.flipCard()}>
                    <Text>Flip!</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
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
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ProfileScreen);