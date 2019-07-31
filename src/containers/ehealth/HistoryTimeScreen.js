import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Card } from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import ImageLoad from 'mainam-react-native-image-loader';
const width = (Dimensions.get('window').width - 4 * 10) / 2;
const spacing = 10;
class HistoryTimeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                date: '15/07/2019',
                name: 'Khám cận lâm sàng',
                type: 1
            }, {
                date: '15/07/2019',
                name: 'Khám cận lâm sàng',
                type: 2
            }, {
                date: '15/07/2019',
                name: 'Khám cận lâm sàng',
                type: 4
            }, {
                date: '15/07/2019',
                name: 'Khám cận lâm sàng',
                type: 5
            }, {
                date: '15/07/2019',
                name: 'Khám cận lâm sàng',
                type: 7
            }],
            countTime: ''
        };
    }
    componentWillMount() {
        let countTime = this.props.navigation.state.params && this.props.navigation.state.params.countTime ? this.props.navigation.state.params.countTime : ''
        this.setState({
            countTime: countTime
        })
    }
    renderImg = (item) => {
        switch (item.type) {
            case 1:
                return (<ScaledImage style={styles.img} style={{ borderRadius: 15 }} height={30} source={require('@images/new/ehealth/ic_peclinical.png')}></ScaledImage>)
            case 2:
                return (<ScaledImage style={styles.img} height={30} source={require('@images/new/ehealth/ic_ct_scan.png')}></ScaledImage>)
            case 4:
                return (<ScaledImage style={styles.img} height={30} source={require('@images/new/ehealth/ic_analysis.png')}></ScaledImage>)
            case 5:
                return (<ScaledImage style={styles.img} height={30} source={require('@images/new/ehealth/ic_magnetic.png')}></ScaledImage>)
            case 7:
                return (<ScaledImage style={styles.img} height={30} source={require('@images/new/ehealth/ic_endoscopic.png')}></ScaledImage>)
        }
    }
    renderItem = ({ item }) => {
        return (
            <View style={styles.viewItem}>
                <Card style={styles.cardStyle}>
                    {this.renderImg(item)}
                    <View style={styles.viewDetails}>
                        <Text style={{ color: '#479AE3', marginVertical: 20, fontSize: 14 }}>{item.date}</Text>
                        <Text style={{ fontSize: 14 }}>{item.name}</Text>
                    </View>
                </Card>
            </View>
        )
    }
    render() {
        const source = this.props.userApp.currentUser.avatar ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() } : require("@images/new/user.png");

        return (
            <ActivityPanel style={styles.container}
                // title="HỒ SƠ Y BẠ GIA ĐÌNH"
                title={<Text style={{ fontSize: 18 }}>{'Lịch sử y bạ ('}<Text style={{ color: 'red' }}>{this.state.countTime} lần</Text>)</Text>}
                icBack={require('@images/new/left_arrow_white.png')}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#22b060"
                actionbarStyle={styles.actionbarStyle}
                menuButton={<TouchableOpacity style={styles.menu} >
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={styles.imageStyle}
                        borderRadius={15}
                        customImagePlaceholderDefaultStyle={[styles.avatar, { width: 30, height: 30 }]}
                        placeholderSource={require("@images/new/user.png")}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={styles.imgLoad}
                        defaultImage={() => {
                            return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={30} height={30} />
                        }}
                    /></TouchableOpacity>}
                titleStyle={styles.titleStyle}>
                <FlatList
                    data={this.state.data}
                    style={{ flex: 1, }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    numColumns={2}
                    ListHeaderComponent={() => {
                        return (
                            <View style={{ height: 10 }}></View>
                        )
                    }}
                    ListFooterComponent={() => {
                        return (
                            <View style={{ height: 50 }}></View>
                        )
                    }}
                ></FlatList>
            </ActivityPanel>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB'
    },
    cardStyle: {
        width: width,
        borderRadius: 5,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',

    },
    viewItem: {
        // , padding: 5, flex: 1 / 2, height: 180, marginTop: 20, 
        justifyContent: 'center', alignItems: 'center',
        width: width,
        marginHorizontal: 10,
        marginVertical: 5,
        height: 180,

    },
    viewDetails: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        // top:-50

    },
    actionbarStyle: {
        borderBottomWidth: 0
    },
    imageStyle: { borderRadius: 30, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' },
    imgLoad: {
        alignSelf: 'center',
        borderRadius: 30,
        width: 60,
        height: 60
    },
    avatar: {
        alignSelf: 'center',
        borderRadius: 25,
        width: 45,
        height: 45
    },
})

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(HistoryTimeScreen);