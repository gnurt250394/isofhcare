import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from "mainam-react-native-scaleimage";
import * as Animatable from 'react-native-animatable';
import constants from "@resources/strings";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

class ListBookingScreens extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    id: 1,
                    icon: require("@images/new/home/ic_health_facilities.png"),
                    text: "Theo cơ sở y tế",
                    onPress: () => {
                        if (this.props.userApp.isLogin)
                            this.props.navigation.navigate("addBooking1");
                        else
                            this.props.navigation.navigate("login", {
                                nextScreen: { screen: "addBooking1", param: {} }
                            });
                    }
                },

                // {
                //     id: 5,
                //     empty: true
                // },
                {
                    id: 2,
                    icon: require("@images/new/home/ic_question.png"),
                    text: "Theo bác sỹ",
                    onPress: () => {
                        if (this.props.userApp.isLogin)
                            this.props.navigation.navigate("listDoctor");
                        else
                            this.props.navigation.navigate("login", {
                                nextScreen: { screen: "listDoctor", param: {} }
                            });
                    }
                },
                {
                    id: 3,
                    icon: require("@images/new/home/ic_specialist.png"),
                    text: "Theo chuyên khoa",
                    onPress: () => {
                        if (this.props.userApp.isLogin)
                            this.props.navigation.navigate("addBooking1");
                        else
                            this.props.navigation.navigate("login", {
                                nextScreen: { screen: "addBooking1", param: {} }
                            });
                    }
                },

                {
                    id: 4,
                    icon: require("@images/new/home/ic_symptom.png"),
                    text: "Theo triệu chứng",
                    onPress: () => {
                        if (this.props.userApp.isLogin)
                            this.props.navigation.navigate("ehealth");
                        else
                            this.props.navigation.navigate("login", {
                                nextScreen: { screen: 'ehealth' }
                            });
                    }
                }

            ]
        };
    }

    renderItem = ({ item, index }) => {
        return (
            <Animatable.View delay={100} animation={index % 2 == 0 && index < 4 ? "fadeInLeftBig" : "fadeInRightBig"} easing={"ease-in-out-back"} direction="alternate">
                {
                    item.empty ? <View style={[styles.viewEmpty]}
                    ></View> :
                        <TouchableOpacity
                            style={[styles.button]}
                            onPress={item.onPress}
                        >
                            <View style={styles.groupImageButton}>
                                <ScaledImage source={item.icon} height={60} />
                            </View>
                            <Text style={[styles.label]}>{item.text}</Text>
                        </TouchableOpacity>

                }
            </Animatable.View>
        );
    }
    keyExtractor = (item, index) => `${item.id || index}`
    render() {
        return (
            <ActivityPanel title={constants.title.list_booking}
                isLoading={this.state.isLoading}
            // menuButton={<TouchableOpacity style={styles.menu} onPress={() => snackbar.show(constants.msg.app.in_development)}><ScaleImage style={styles.img} height={20} source={require("@images/new/booking/ic_info.png")} /></TouchableOpacity>}
            >
                <View style={styles.container}>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.renderItem}
                        contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-between' }}
                        style={{ paddingVertical: 10 }}
                        numColumns={2}
                        keyExtractor={this.keyExtractor}
                    />
                </View>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    groupImageButton: {
        position: 'relative',
        padding: 5
    },
    button: {
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
        width: width / 2 - 30,
        padding: 20,
        borderColor: '#111',
        borderWidth: 1,
        margin: 20,
        borderRadius: 30,
        transform: [
            { rotateX: '30deg' },
            // { rotateZ: '15deg' },
            { rotateY: '10deg' }
        ],
        backgroundColor: "#fff",
        elevation: 3,
        shadowColor: '#333',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.7
    },
    viewEmpty: {
        // flex: 1,
        // marginLeft: 5,
        // alignItems: 'center',
        // height: 100,
        // width: width / 2 - 10,
    },
    container: {
        flex: 1,
        // backgroundColor: '#ccc',
    },
    label: {
        marginTop: 2,
        color: '#4A4A4A',
        fontSize: 15,
        fontWeight: 'bold',
        lineHeight: 20,
        textAlign: 'center'
    },

});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ListBookingScreens);