import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, Text, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
const { width, height } = Dimensions.get('window')
const slides = [
    {
        key: 'slide1',
        title: 'iSofH Care, sổ tay y bạ cho cả nhà',
        text: 'iSofH Care giúp bạn lưu trữ hồ sơ y tế và theo dõi sức khoẻ cho cả gia đình.',
        image: require('@images/intro/slide1.png'),
        colors: ['#63E2FF', '#B066FE'],
    },
    {
        key: 'slide2',
        title: 'Tìm kiếm và tra cứu chính xác',
        text: 'Dễ dàng tra cứu các thông tin như: tra cứu bệnh, tra cứu thuốc, tìm kiếm CSYT, nhà thuốc, bác sĩ...',
        image: require('@images/intro/slide2.png'),
    },
    {
        key: 'slide3',
        title: 'Nhận tư vấn dễ dàng',
        text: 'iSofH Care kết nối trực tuyến dễ dàng với các chuyên gia đầu ngành',
        image: require('@images/intro/slide3.png'),
    },
    {
        key: 'slide4',
        title: 'Đặt khám nhanh chóng',
        text: 'Chọn bác sĩ, giờ khám, lấy số khám tại nhà nhanh chóng mà không cần vất vả tới xếp hàng, chờ đợi',
        image: require('@images/intro/slide4.png'),
    },
];
class IntroScreen extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        style={{ width: 120, height: 45 }}
                        source={require('@images/logotext.png')}
                        resizeMode='contain'
                    />
                    <TouchableOpacity style={styles.skip}>
                        <Text>Skip</Text>
                    </TouchableOpacity>
                </View>
                <Swiper style={styles.wrapper}
                    dot={<View style={styles.dot} />}
                    activeDot={<View style={styles.activeDot} />}
                    paginationStyle={{
                        bottom: 30
                    }}
                    loop={false}>
                    {
                        slides.map((item, index) => {
                            return (
                                <View key={index} style={styles.slide}>
                                    <Image
                                        style={styles.image}
                                        source={item.image}
                                        resizeMode='contain'
                                    />
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.text}>{item.text}</Text>
                                    {
                                        index == 3 ?
                                            <TouchableOpacity >
                                                <Text>Bắt đầu sử dụng app</Text>
                                            </TouchableOpacity>
                                            : null
                                    }

                                </View>
                            )
                        })
                    }
                </Swiper>
            </View>
        )
    }

}


const styles = {
    wrapper: {
        // backgroundColor: '#f00'
    },
    dot: {
        backgroundColor: 'rgb(129, 182, 178)',
        width: 13,
        height: 13,
        borderRadius: 7,
        marginLeft: 7,
        marginRight: 7
    },
    activeDot: {
        backgroundColor: 'rgb(212, 61, 33)',
        width: 13,
        height: 13,
        borderRadius: 7,
        marginLeft: 7,
        marginRight: 7
    },
    slide: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'red' 
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    skip: {
        borderRadius: 50,
    },
    image: {
        width: 300,

        // height,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 30,
        paddingBottom: 15
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
    }
}


function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(IntroScreen);