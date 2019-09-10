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
                        <LinearGradient
                            colors={['#FFB800', '#FF8A00']}
                            locations={[0,  1]}
                            style={styles.linear}>
                            <TouchableOpacity
                                style={styles.buttonBooking}
                                onPress={onPress}
                            >
                                <Text style={styles.txtbooking}>ĐẶT KHÁM</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    <Text style={styles.detailDoctor} onPress={onPressDoctor}>XEM THÔNG TIN BS</Text>
                    <View style={styles.between} />
                    {/** view 2 */}
                    <View
                        style={[styles.groupProfile, { paddingRight: 10 }]}
                    >
                        <Text style={styles.Specialist}>Chuyên khoa</Text>
                        <View style={{ flex: 1 }}>
                            {item.position && item.position.length > 0 ?
                                item.position.map((e, i) => {
                                    
                                    return (
                                        <Text key={i}>{e}</Text>
                                    )
                                }) :
                                null
                            }
                        </View>

                    </View>
                    <View style={styles.between} />
                    <View style={[styles.groupProfile, { paddingRight: 10 }]} >
                        <Text style={styles.Specialist}>Địa điểm làm việc</Text>
                        <View style={{ flex: 1 }}>
                            {item.address && item.address.length > 0 ?
                                item.address.map((e, i) => {
                                    return (
                                        <Text key={i}>{e}</Text>
                                    )
                                }) :
                                null
                            }
                        </View>
                    </View>
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
        paddingLeft: 30,
        paddingTop: 7,
        textDecorationLine: 'underline',
        fontStyle: 'italic',
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
        fontSize: 16,
        fontWeight: 'bold'
    },
    paddingLeft5: {
        paddingLeft: 5
    },
    groupImgProfile: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    groupProfile: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    card: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#FEFDE9'
    },
    containerItem: {
        flex: 1,
        padding: 5
    },
    customImagePlace: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    styleImgLoad: {
        width: 50,
        height: 50,
        paddingRight: 5,
    },

});
export default ItemDoctor;
