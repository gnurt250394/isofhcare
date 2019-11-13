import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import StarRating from 'react-native-star-rating';
import ScaleImage from "mainam-react-native-scaleimage";
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Button from './Button';

class ItemDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    defaultImage = () => {
        const icSupport = require("@images/new/user.png");
        return (
            <ScaleImage source={icSupport} width={90} />
        );
    }

    render() {
        const icSupport = require("@images/new/user.png");
        const { item, onPressDoctor, onPressBooking, onPressAdvisory } = this.props
        const avatar = item && item.imagePath ? { uri: item.imagePath.absoluteUrl() } : icSupport
        return (
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
                            <Text style={styles.txtNameDoctor}>{item.academicDegree} {item.name}</Text>
                            <View style={styles.flexRow}>
                                {item.specializations && item.specializations.length > 0 ?
                                    item.specializations.slice(0, 3).map((e, i) => {
                                        return (
                                            <Text style={styles.txtPosition} key={i}>{e.name}{item.specializations.slice(0, 3).length - 1 == i ? ' ' : ','}</Text>
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
                                <Button label="Tư vấn" style={styles.txtAdvisory} onPress={onPressAdvisory} source={require("@images/new/booking/ic_chat.png")} />
                                <Button label="Đặt khám" style={styles.txtBooking} onPress={onPressBooking} source={require("@images/ic_service.png")} />
                            </View>
                        </View>
                    </View>
                </Card>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    txtHospitalName: {
        color: '#111'
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
        fontSize: 18,
        paddingTop: 8,
        paddingBottom: 4,
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
    boderImage: { borderRadius: 45, borderWidth: 2, borderColor: '#00CBA7' },
    avatar: { width: 90, height: 90, alignSelf: "flex-start", },
    imgPlaceHoder: {
        width: 90,
        height: 90,
        alignSelf: "center"
    },

});
export default ItemDoctor;
