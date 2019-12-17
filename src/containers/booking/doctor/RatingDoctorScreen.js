import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import bookingDoctorProvider from '@data-access/booking-doctor-provider'
import StarRating from 'react-native-star-rating';
import { TouchableOpacity } from 'react-native-gesture-handler';

class RatingDoctorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 4
        };
    }

    changeStar = (rating) => {
        this.setState({ rating })
    }
    render() {
        return (
            <ActivityPanel
                title="Đánh giá bác sĩ"
                isLoading={this.state.isLoading}>
                <ScrollView>
                    <View style={styles.container}>
                        <Text style={styles.txtHeader}>BẠN VỪA HOÀN THÀNH LỊCH KHÁM</Text>
                        <Text style={styles.txtTitle}><Text style={styles.txtNameDoctor}>BS ABC</Text> vào ngày 18/09/2019</Text>

                        <Text style={styles.txtRatingStar}>Vui lòng đánh giá chất lượng dịch vụ!</Text>
                        <StarRating
                            disabled={false}
                            starSize={30}
                            halfStarEnabled={true}
                            containerStyle={styles.containerStar}
                            maxStars={5}
                            selectedStar={this.changeStar}
                            rating={this.state.rating}
                            starStyle={{ margin: 1, marginVertical: 7 }}
                            fullStarColor={"#FF8A00"}
                            halfStarColor={"#FF8A00"}
                            emptyStarColor={"#FF8A00"}
                        // fullStar={require("@images/ic_star.png")}
                        // emptyStar={require("@images/ic_empty_star.png")}
                        />
                        <TextInput
                            placeholder="Viết đánh giá"
                            multiline={true}
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.buttonSend}>
                            <Text style={styles.txtSend}>GỬI ĐÁNH GIÁ</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ActivityPanel>
        );
    }
}

export default RatingDoctorScreen;


const styles = StyleSheet.create({
    txtRatingStar: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 40
    },
    containerStar: {
        alignSelf: 'center',
        marginTop: 10
    },
    txtSend: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    buttonSend: {
        height: 45,
        backgroundColor: '#00CBA7',
        borderRadius: 7,
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },
    input: {
        borderColor: '#BBB',
        borderRadius: 5,
        borderWidth: 0.8,
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        height: 150,
        textAlignVertical: 'top'
    },
    txtNameDoctor: {
        color: '#00CBA7',
        fontWeight: 'bold'
    },
    txtTitle: {
        color: '#000',
        textAlign: 'center'
    },
    txtHeader: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000',
        fontSize: 15
    },
    container: {
        flex: 1,
        paddingTop: 20
    },
})