import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScaleImage from "mainam-react-native-scaleimage";
import ImageLoad from "mainam-react-native-image-loader";
import StarRating from 'react-native-star-rating';
import Button from "@components/booking/doctor/Button";
import { connect } from 'react-redux';

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
    onCallVideo = (item) => () => {
        // this.setState({ isVisible: false }, () => {
        if (this.props.userApp.isLogin) {
            this.props.navigation.navigate('selectTimeDoctor', {
                item: item,
                isNotHaveSchedule: true,
                isOnline: true

                // schedules: item.schedules
            })
        }
        else {

            this.props.navigation.navigate("login", {
                nextScreen: {
                    screen: 'selectTimeDoctor', param: {
                        item: item,
                        isNotHaveSchedule: true,
                        isOnline: true

                        // schedules: item.schedules
                    }
                }
            });
        }

        // })


    }
    render() {
        const { item, onPress, onPressDoctor } = this.props
        const icSupport = require("@images/new/user.png");
        const source = item.imagePath
            ? { uri: item.imagePath.absoluteUrl() }
            : icSupport;
        return (
            <TouchableOpacity
                onPress={onPressDoctor}
                style={styles.containerItem}>
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
                    <Text style={styles.txtName}>{item.academicDegree} {item.name}</Text>
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
                            rating={5}
                            starStyle={{ margin: 1, marginVertical: 7 }}
                            fullStarColor={"#fbbd04"}
                            emptyStarColor={"#fbbd04"}
                            fullStar={require("@images/ic_star.png")}
                            emptyStar={require("@images/ic_empty_star.png")}
                        />
                        {!this.props.disableBooking ?
                            <View style={styles.containerButton}>
                                <Button label="Gọi khám" style={styles.txtAdvisory} onPress={this.onCallVideo(item)}  />
                                <Button label="Đặt khám"
                                    style={styles.ButtonBooking}
                                    onPress={onPress} />
                            </View>

                            : null
                        }

                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    containerSpecialist: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        flexWrap: 'wrap'
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
    ButtonBooking: {
        backgroundColor: '#00CBA7',
        // flex: 0,
        // paddingHorizontal: 20,
        // marginLeft: 20
        marginLeft: 6
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
    boderImage: { borderRadius: 35 },
    avatar: { width: 70, height: 70, alignSelf: "flex-start", },
    imgPlaceHoder: {
        width: 70,
        height: 70,
        alignSelf: "center"
    },
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation

    };
}
export default connect(mapStateToProps)(ItemDoctorOfHospital);
