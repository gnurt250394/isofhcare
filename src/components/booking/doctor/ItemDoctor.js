import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';
import ScaleImage from "mainam-react-native-scaleimage";
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'

class ItemDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    defaultImage = () => {
        const icSupport = require("@images/new/user.png");
        return (
            <ScaleImage source={icSupport} width={100} />
        );
    }

    render() {
        const icSupport = require("@images/new/user.png");
        const { item, onPressDoctor, onPress } = this.props
        return (
            <View style={styles.containerItem}>
                <Card style={styles.card}>
                    {/**view 1 */}
                    <View style={styles.groupProfile}>
                        <View style={styles.groupImgProfile}>
                            <ImageLoad
                                source={{ uri: item.avatar }}
                                imageStyle={styles.customImagePlace}
                                borderRadius={25}
                                customImagePlaceholderDefaultStyle={styles.customImagePlace}
                                style={styles.styleImgLoad}
                                resizeMode="cover"
                                placeholderSource={icSupport}
                                loadingStyle={{ size: "small", color: "gray" }}
                                defaultImage={this.defaultImage}
                            />
                            <View style={styles.paddingLeft5}>
                                <Text style={styles.txtNameDoctor}>BS {item.name}</Text>
                                <Text style={styles.txtQuantity}>{item.quantity} lượt đặt khám</Text>
                                <View style={styles.containerRating}>
                                    <StarRating
                                        disabled={true}
                                        starSize={12}
                                        maxStars={5}
                                        rating={item.rating}
                                        starStyle={{ margin: 1 }}
                                        fullStarColor={"#fbbd04"}
                                        emptyStarColor={"#fbbd04"}
                                    />
                                    <Text style={styles.txtRating}>{item.rating}</Text>
                                    <View style={styles.viewDot} />
                                </View>
                            </View>
                        </View>

                    </View>
                    <Text style={styles.detailDoctor} onPress={onPressDoctor}>XEM THÔNG TIN BS</Text>
                    <LinearGradient
                        colors={['#FFB800', '#FF8A00']}
                        locations={[0, 1]}
                        style={styles.linear}>
                        <TouchableOpacity
                            style={styles.buttonBooking}
                            onPress={onPress}
                        >
                            <Text style={styles.txtbooking}>ĐẶT KHÁM</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    {/** view 2 */}

                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        color: '#02c39a',
        fontSize: 18,
        paddingTop:8,
        paddingBottom:4,
        fontWeight: 'bold'
    },
    paddingLeft5: {
        paddingLeft: 5
    },
    groupImgProfile: {
        alignItems: 'center',
        width: '100%'
    },
    groupProfile: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    card: {
        padding: 10,
        height: '95%',
        borderRadius: 10,
        backgroundColor: '#FEFDE9'
    },
    containerItem: {
        flex: 1
    },
    customImagePlace: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    styleImgLoad: {
        width: 100,
        height: 100,
        paddingRight: 5,
    },

});
export default ItemDoctor;
