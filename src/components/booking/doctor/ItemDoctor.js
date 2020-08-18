import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, PixelRatio } from 'react-native';
import StarRating from 'react-native-star-rating';
import ScaleImage from "mainam-react-native-scaleimage";
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Button from './Button';
import Modal from "@components/modal";
import snackbar from '@utils/snackbar-utils';
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux';
import NavigationService from '@navigators/NavigationService'
import objectUtils from '@utils/object-utils';
class ItemDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            item: {}
        };
    }
    defaultImage = () => {
        const icSupport = require("@images/new/user.png");
        return (
            <ScaleImage source={icSupport} width={90} />
        );
    }

    onMessage = () => {
        this.setState({ isVisible: false }, () => {
            if (this.props.userApp.isLogin) {
                this.props.navigation.navigate('selectTimeDoctor', {
                    item: this.state.item,
                    isNotHaveSchedule: true,
                    schedules: this.state.item.schedules
                })
            }
            else {

                this.props.navigation.navigate("login", {
                    nextScreen: {
                        screen: 'selectTimeDoctor', param: {
                            item: this.state.item,
                            isNotHaveSchedule: true,
                            schedules: this.state.item.schedules
                        }
                    }
                });
            }

        })

    }
    onCallVideo = (item) => () => {
        if (!item.userId) {
            snackbar.show('Bác sĩ hiện tại không online vui lòng đặt lịch gọi khám vào thời gian khác')
            return
        }
        // this.setState({ isVisible: false }, () => {
        // if (this.props.userApp.isLogin) {
        NavigationService.navigate('selectTimeDoctor', {
            item: item,
            isNotHaveSchedule: true,
            isOnline: true

            // schedules: item.schedules
        })
        // }
        // else {

        //     NavigationService.navigate("login", {
        //         nextScreen: {
        //             screen: 'selectTimeDoctor', param: {
        //                 item: item,
        //                 isNotHaveSchedule: true,
        //                 isOnline: true

        //                 // schedules: item.schedules
        //             }
        //         }
        //     });
        // }

        // })


    }
    showModal = (item) => () => {
        // snackbar.show('Tính năng đang phát triển')
        // return
        this.setState({ isVisible: true, item })
    }
    renderDots = (item, i) => {
        if (item.specializations.slice(0, 2).length - 1 == i && item.specializations.length > 2) {
            return '...'
        } else if (item.specializations.slice(0, 2).length - 1 == i) {
            return ' '
        } else {
            return ', '
        }
    }
    renderAcademic = (academicDegree) => {
        switch (academicDegree) {
            case 'BS': return 'BS'
            case 'ThS': return 'ThS'
            case 'TS': return 'TS'
            case 'PGS': return 'PGS'
            case 'GS': return 'GS'
            case 'BSCKI': return 'BSCKI'
            case 'BSCKII': return 'BSCKII'
            case 'GSTS': return 'GS.TS'
            case 'PGSTS': return 'PGS.TS'
            case 'ThsBS': return 'ThS.BS'
            case 'ThsBSCKII': return 'ThS.BSCKII'
            case 'TSBS': return 'TS.BS'
            default: return ''
        }
    }
    onBackdropPress = () => { this.setState({ isVisible: false }) }
    render() {
        const icSupport = require("@images/new/user.png");
        const { item, onPressDoctor, onPressBooking, onPressAdvisory } = this.props
        const avatar = item && item.imagePath ? { uri: item.imagePath.absoluteUrl() } : icSupport
        return (
            <View>
                <TouchableHighlight onPress={onPressDoctor} underlayColor={'#fff'} style={styles.containerItem}>
                    <Card style={styles.card}>
                        <View style={styles.groupProfile}>
                            <View style={{
                                paddingRight: 10
                            }}>
                                <ImageLoad
                                    resizeMode="cover"
                                    imageStyle={styles.boderImage}
                                    borderRadius={45}
                                    customImagePlaceholderDefaultStyle={styles.imgPlaceHoder}
                                    placeholderSource={icSupport}
                                    style={styles.avatar}
                                    loadingStyle={{ size: "small", color: "gray" }}
                                    source={avatar}
                                    defaultImage={() => {
                                        return (
                                            <ScaleImage
                                                resizeMode="cover"
                                                source={icSupport}
                                                width={90}
                                                style={styles.imgDefault}
                                            />
                                        );
                                    }}
                                />
                                <Text style={{
                                    textAlign: 'center',
                                    paddingTop: 10,
                                }}>{item.appointments ? item.appointments + ' lượt ĐK' : ''} </Text>
                            </View>
                            <View style={styles.paddingLeft5}>
                                <Text style={styles.txtNameDoctor}>{objectUtils.renderAcademic(item.academicDegree)}{item.name}</Text>
                                <View style={styles.flexRow}>
                                    {item.specializations && item.specializations.length > 0 ?
                                        item.specializations.slice(0, 2).map((e, i) => {
                                            return (
                                                <Text style={styles.txtPosition} numberOfLines={1} key={i}>{e.name}{this.renderDots(item, i)}</Text>
                                            )
                                        }) :
                                        null
                                    }
                                </View>
                                <View style={styles.flex}>
                                    {item.hospital && item.hospital.name ?
                                        <Text style={styles.txtHospitalName} >{item.hospital.name}</Text>
                                        :
                                        null
                                    }
                                </View>
                                <View style={styles.containerButton}>
                                    <Button textStyle={{ textAlign: 'center' }} label={`Tư vấn\ntrực tuyến`} style={styles.txtAdvisory} onPress={this.onCallVideo(item)} source={require("@images/new/videoCall/ic_call.png")} />
                                    <Button textStyle={{ textAlign: 'center' }} label={`Đặt khám\ntại CSYT`} style={styles.txtBooking} onPress={onPressBooking} source={require("@images/ic_service.png")} />
                                </View>
                            </View>
                        </View>
                    </Card>
                </TouchableHighlight>
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={this.onBackdropPress}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={styles.modal}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <View style={styles.containerModal}>
                        <View >
                            <TouchableOpacity
                                onPress={this.onMessage}
                                style={[styles.buttonMessage, { backgroundColor: '#e6fffa', }]}>
                                <ScaleImage source={require('@images/new/booking/ic_message.png')} height={50} />
                                <Text style={styles.txtPrice}>50k/ Phiên</Text>
                                <Text style={styles.txtname}>Tư vấn qua tin nhắn</Text>
                            </TouchableOpacity>
                            <Text style={styles.txtDetail}>Xem chi tiết</Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={this.onCallVideo}
                                style={[styles.buttonMessage,]}>
                                <ScaleImage source={require('@images/new/booking/ic_video_call.png')} height={50} />
                                <Text style={styles.txtPrice}>35k/ Phiên</Text>
                                <Text style={styles.txtname}>Tư vấn qua video call</Text>
                            </TouchableOpacity>
                            <Text style={[styles.txtDetail]}>Xem chi tiết</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    containerModal: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtDetail: {
        textDecorationLine: 'underline',
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 10
    },
    txtname: {
        color: '#000',
        fontWeight: 'bold'
    },
    txtPrice: {
        color: '#3161AD',
        paddingVertical: 5,
        fontWeight: '700'
    },
    buttonMessage: {
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtHospitalName: {
        color: '#111',
        fontSize: PixelRatio.get() <= 2 ? 13 : 14
    },
    txtBooking: {
        backgroundColor: '#00CBA7',
        marginLeft: 6
    },
    txtAdvisory: {
        backgroundColor: '#FF8A00',
    },
    containerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginTop: 10,
        marginBottom: 10
    },
    txtPosition: {
        // backgroundColor: '#ffe6e9',
        color: '#3161AD',
        paddingRight: 3,
        fontStyle: 'italic',
        marginVertical: 5,
        fontSize: PixelRatio.get() <= 2 ? 13 : 14,
        fontWeight: 'bold'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    Specialist: {
        fontSize: 15,
        fontWeight: '800',
        color: '#111111',
        width: '40%'
    },
    between: {
        backgroundColor: '#02c39a',
        height: 1,
        marginVertical: 9,
        width: '100%',
        alignSelf: 'center'
    },
    detailDoctor: {
        color: '#02c39a',
        paddingTop: 7,
        textDecorationLine: 'underline',
        fontStyle: 'italic',
        textAlign: 'center'
    },
    txtbooking: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    buttonBooking: {
        paddingHorizontal: 15,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    linear: {
        height: 40,
        marginTop: 10,
        borderRadius: 7,
        elevation: 3,
        shadowColor: 'black',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 0.6
    },
    viewDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#02c39a'
    },
    txtRating: {
        paddingHorizontal: 7
    },
    containerRating: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtQuantity: {
        fontStyle: 'italic'
    },
    txtNameDoctor: {
        color: '#000000',
        fontSize: PixelRatio.get() <= 2 ? 16 : 18,
        paddingTop: 8,
        fontWeight: 'bold'
    },
    paddingLeft5: {
        paddingLeft: 5,
        flex: 1
    },
    groupImgProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    groupProfile: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
    },
    card: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#FFF'
    },
    containerItem: {
        flex: 1,
        padding: 10,
        paddingBottom: 0
    },
    boderImage: { borderRadius: 45, },
    avatar: { width: 90, height: 90, alignSelf: "flex-start" },
    imgPlaceHoder: {
        width: 90,
        height: 90,
        alignSelf: "center"
    },

});
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        navigation: state.navigation

    };
}
export default connect(mapStateToProps)(withNavigation(ItemDoctor));
