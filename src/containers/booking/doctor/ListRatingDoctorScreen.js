import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, } from 'react-native';
import { connect } from "react-redux";
import ScaleImage from "mainam-react-native-scaleimage";
import ImagePicker from "mainam-react-native-select-image";
import ImageLoad from "mainam-react-native-image-loader";
import connectionUtils from "@utils/connection-utils";
import dateUtils from "mainam-react-native-date-utils";
import StarRating from 'react-native-star-rating';
import userProvider from '@data-access/user-provider';
import questionProvider from '@data-access/question-provider';
import { Card } from 'native-base'
import Button from "@components/booking/doctor/Button";
import constants from '@resources/strings'
import bookingDoctorProvider from '@data-access/booking-doctor-provider'
import ActivityPanel from "@components/ActivityPanel";
import Modal from "@components/modal";
const dataRate = [
    { id: 1, name: 'Lê Hùng', rate: 4, message: 'Bác sĩ rất ...' },
    { id: 2, name: 'Lê Hùng', rate: 4.5, message: 'Bác sĩ rất ...' },
    { id: 3, name: 'Lê Hùng', rate: 3, message: 'Bác sĩ rất ...' },
    { id: 4, name: 'Lê Hùng', rate: 5, message: 'Bác sĩ rất ...' },
]
class ListRatingDoctorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    _renderItem = ({ item, index }) => {
        return (
            <View style={[styles.containerItem, { borderBottomWidth: index == dataRate.length - 1 ? 0 : 0.7 }]}>
                <Text style={styles.txtName}>{item.name}</Text>
                <StarRating
                    disabled={true}
                    starSize={11}
                    containerStyle={{ width: '20%' }}
                    maxStars={5}
                    rating={item.rate}
                    starStyle={{ margin: 1, marginVertical: 7 }}
                    fullStarColor={"#fbbd04"}
                    emptyStarColor={"#fbbd04"}
                    fullStar={require("@images/ic_star.png")}
                    emptyStar={require("@images/ic_empty_star.png")}
                />
                {/* <Text numberOfLines={2}>{item.message}</Text> */}
            </View>
        )
    }
    _keyExtractor = (item, index) => `${item.id || index}`
    render() {
        return (
            <ActivityPanel
                title="Danh sách lượt đánh giá"
            >
                <View style={{
                    borderRadius: 10,
                    padding: 10
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 5
                    }}>
                        <Text style={styles.txtRate}>ĐÁNH GIÁ</Text>
                        <Text style={{
                            fontStyle: 'italic'
                        }}>22 lượt đánh giá</Text>
                    </View>
                    <View style={styles.end} />
                    <FlatList
                        data={dataRate}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                    />
                </View>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    txtRate: {
        color: '#00CBA7',
        fontWeight: 'bold',
        fontSize: 16,
        paddingTop: 9,
        paddingBottom: 7,
    },
    end: {
        backgroundColor: '#ccc',
        height: 0.6,
        width: '100%'
    },
});
export default ListRatingDoctorScreen;
