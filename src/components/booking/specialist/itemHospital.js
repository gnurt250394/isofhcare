import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, PixelRatio } from 'react-native';
import StarRating from 'react-native-star-rating';
import ScaleImage from "mainam-react-native-scaleimage";
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Button from '../doctor/Button';
import Modal from "@components/modal";
import objectUtils from '@utils/object-utils';

class ItemHospital extends Component {
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
        console.log(this.state.item, 'message')
    }
    onCallVideo = () => {
        console.log(this.state.item, 'message')

    }
    showModal = (item) => () => {
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
        const avatar = item && item.imagePath ? { uri: item.imagePath } : icSupport
        return (
            <View>
                <TouchableHighlight onPress={onPressDoctor} underlayColor={'#fff'} style={styles.containerItem}>
                    <View style={styles.groupProfile}>
                        <View style={{
                            paddingRight: 10
                        }}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={styles.boderImage}
                                borderRadius={10}
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
                                            width={70}
                                            style={styles.imgDefault}
                                        />
                                    );
                                }}
                            />

                        </View>
                        <View style={styles.paddingLeft5}>
                            <Text style={styles.txtNameDoctor}>{objectUtils.renderAcademic(item.academicDegree)}{item.name}</Text>
                            <Text numberOfLines={1} style={styles.txtHospitalName} >{item.contact.address}</Text>
                            <View style={styles.containerButton}>
                                {/* <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <ScaleImage source={require('@images/ic_location.png')} height={18} style={styles.icLocation} />
                                    <Text style={styles.txtLocation}>km</Text>
                                </View> */}
                                <Button textStyle={{ textAlign: 'center' }} label={`Đặt khám`} style={styles.txtBooking} onPress={onPressBooking} source={require("@images/ic_service.png")} />
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    txtLocation: {
        paddingLeft: 5,
        color: '#777'
    },
    icLocation: {
        tintColor: '#777'
    },
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
        color: '#999',
        paddingBottom: 5,
        paddingRight: 20,
        fontSize: PixelRatio.get() <= 2 ? 12 : 14
    },
    txtBooking: {
        backgroundColor: '#00CBA7',
        marginLeft: 10,
        flex: 0,
        paddingHorizontal: 20,
        paddingVertical:10
    },
    txtAdvisory: {
        backgroundColor: '#FF8A00',
    },
    containerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
    },
    txtPosition: {
        // backgroundColor: '#ffe6e9',
        color: '#3161AD',
        paddingRight: 3,
        fontStyle: 'italic',
        marginVertical: 5,
        fontSize: PixelRatio.get() <= 2 ? 12 : 14,
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
        fontWeight: 'bold'
    },
    paddingLeft5: {
        paddingLeft: 10,
        flex: 1,
        alignItems: 'flex-start',
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
        paddingBottom: 10,
        borderBottomWidth: 0.6,
        borderBottomColor: '#BBB',
    },
    boderImage: { borderRadius: 10, borderColor: '#BBB', borderWidth: 0.5 },
    avatar: { width: 70, height: 70, alignSelf: "flex-start", },
    imgPlaceHoder: {
        width: 70,
        height: 70,
        alignSelf: "center"
    },

});
export default ItemHospital;
