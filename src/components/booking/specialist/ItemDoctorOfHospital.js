import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScaleImage from "mainam-react-native-scaleimage";
import ImageLoad from "mainam-react-native-image-loader";
import StarRating from 'react-native-star-rating';
import Button from "@components/booking/doctor/Button";

class ItemDoctorOfHospital extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
    render() {
        const { item, onPress } = this.props
        const icSupport = require("@images/new/user.png");
        const source = item.imagePath
            ? { uri: item.imagePath }
            : icSupport;
        return (
            <View style={styles.containerItem}>
                <ImageLoad
                    resizeMode="cover"
                    imageStyle={styles.boderImage}
                    borderRadius={35}
                    customImagePlaceholderDefaultStyle={styles.imgPlaceHoder}
                    placeholderSource={icSupport}
                    style={styles.avatar}
                    loadingStyle={{ size: "small", color: "gray" }}
                    source={source}
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
                <View style={styles.containerProfile}>
                    <Text style={styles.txtName}>{item.name}</Text>
                    {/* <Text style={styles.txtSpecialist}>{item.specialist}</Text> */}
                    <View style={styles.containerSpecialist}>
                        {item.specializations && item.specializations.length > 0 ?
                            item.specializations.slice(0, 2).map((e, i) => {
                                return (
                                    <Text style={styles.txtSpecialist} numberOfLines={1} key={i}>{e.name}{this.renderDots(item, i)}</Text>
                                )
                            }) :
                            null
                        }
                    </View>
                    <View style={styles.containerRating}>
                        <StarRating
                            disabled={true}
                            starSize={11}
                            containerStyle={{ width: '30%' }}
                            maxStars={5}
                            rating={item.rating}
                            starStyle={{ margin: 1, marginVertical: 7 }}
                            fullStarColor={"#fbbd04"}
                            emptyStarColor={"#fbbd04"}
                            fullStar={require("@images/ic_star.png")}
                            emptyStar={require("@images/ic_empty_star.png")}
                        />
                        <Button label="Đặt khám"
                            style={styles.ButtonBooking}
                            onPress={onPress} />

                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    containerSpecialist: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    ButtonBooking: {
        backgroundColor: '#00CBA7',
        flex: 0,
        paddingHorizontal: 20,
        marginLeft: 20
    },
    containerRating: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    txtSpecialist: {
        color: '#3161AD',
        fontStyle: 'italic'
    },
    txtName: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16
    },
    containerProfile: {
        flex: 1,
        paddingLeft: 10
    },
    containerItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        paddingBottom: 20,
        borderTopColor: '#BBB',
        borderTopWidth: 0.7
    },
    imgDefault: { width: 70, height: 70, alignSelf: "center" },
    boderImage: { borderRadius: 35, borderWidth: 2, borderColor: '#00CBA7' },
    avatar: { width: 70, height: 70, alignSelf: "flex-start", },
    imgPlaceHoder: {
        width: 70,
        height: 70,
        alignSelf: "center"
    },
});
export default ItemDoctorOfHospital;