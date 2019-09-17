import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import ActivityPanel from '@components/ActivityPanel';
import { StackActions, NavigationActions } from 'react-navigation';
import dataCache from '@data-access/datacache-provider';
import constants from '@resources/strings';
const slides = [
    {
        key: 'slide1',
        title: 'iSofH Care, sổ tay y bạ cho cả nhà',
        text: 'iSofH Care giúp bạn lưu trữ hồ sơ y tế và theo dõi sức khoẻ cho cả gia đình.',
        image: require('@images/intro/slide1.png'),
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
        text: 'Chọn bác sĩ, giờ khám, lấy số tiếp đón tại nhà nhanh chóng mà không cần vất vả tới xếp hàng, chờ đợi',
        image: require('@images/intro/slide4.png'),
    },
];
class IntroScreen extends Component {
    constructor(props) {
        super(props)
        this.Actions = this.props.navigation;
        this.skip = this.skip.bind(this);
    }

    skip() {
        dataCache.save("", constants.key.storage.INTRO_FINISHED, true);
        this.Actions.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "home" })],
        }));
    }

    render() {
        return (
            <ActivityPanel hideActionbar={true} hideStatusbar={true} showFullScreen={true}>
                <View style={styles.container}>
                    <View style={styles.containerSkip}>
                        <Image
                            style={styles.imageLogo}
                            source={require('@images/logotext.png')}
                            resizeMode='contain'
                        />
                        <TouchableOpacity style={styles.skip} onPress={this.skip}>
                            <Text>{constants.skip}</Text>
                        </TouchableOpacity>
                    </View>
                    <Swiper style={styles.wrapper}
                        dot={<View style={styles.dot} />}
                        activeDot={<View style={styles.activeDot} />}
                        paginationStyle={styles.pagination}
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
                                                <TouchableOpacity style={styles.startNow} onPress={this.skip}>
                                                    <Text style={styles.txtFirstApp}>{constants.begin_use_app}</Text>
                                                </TouchableOpacity>
                                                : null
                                        }

                                    </View>
                                )
                            })
                        }
                    </Swiper>
                </View>
            </ActivityPanel >
        )
    }

}



function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(IntroScreen);

const styles = StyleSheet.create({
    txtFirstApp: {
        color: 'rgb(74, 144, 226)',
        fontSize: 18
    },
    pagination: {
        bottom: 30
    },
    imageLogo: {
        width: 120,
        height: 45
    },
    containerSkip: {
        alignItems: 'center'
    },
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
    },
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: 'white'
    },
    skip: {
        width: 70,
        borderRadius: 50,
        position: 'absolute',
        right: 0,
        top: 10,
        paddingLeft: 20,
        paddingVertical: 3,
        borderStartWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 0,
        borderColor: 'rgba(155, 155, 155, 0.41)',
        borderBottomLeftRadius: 100,
        borderTopLeftRadius: 100,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
    image: {
        width: 300,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'rgb(74, 74, 74)',
        paddingTop: 30,
        paddingBottom: 15
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        width: '90%'
    },
    startNow: {
        marginTop: 30
    }
})