import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Card } from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import ImageLoad from 'mainam-react-native-image-loader';
const width = (Dimensions.get('window').width) / 2;
const spacing = 10;
import dateUtils from 'mainam-react-native-date-utils';
class HistoryTimeScreen extends Component {
    constructor(props) {
        super(props);
        let countTime = this.props.navigation.state.params && this.props.navigation.state.params.countTime ? this.props.navigation.state.params.countTime : ''
        let item = this.props.navigation.state.params && this.props.navigation.state.params.item || {};
        alert(JSON.stringify(item.history));

        this.state = {
            data: item.history || [],
            countTime: countTime
        };
    }

    renderImg = (item) => {
        switch (item.type) {
            case 1:
                return (<ScaledImage style={styles.img} style={{ borderRadius: 15 }} height={50} source={require('@images/new/ehealth/ic_peclinical.png')}></ScaledImage>)
            case 2:
                return (<ScaledImage style={styles.img} height={50} source={require('@images/new/ehealth/ic_ct_scan.png')}></ScaledImage>)
            case 4:
                return (<ScaledImage style={styles.img} height={50} source={require('@images/new/ehealth/ic_analysis.png')}></ScaledImage>)
            case 5:
                return (<ScaledImage style={styles.img} height={50} source={require('@images/new/ehealth/ic_magnetic.png')}></ScaledImage>)
            case 7:
                return (<ScaledImage style={styles.img} height={50} source={require('@images/new/ehealth/ic_endoscopic.png')}></ScaledImage>)
            default:
                return (<ScaledImage style={styles.img} style={{ borderRadius: 15 }} height={50} source={require('@images/new/ehealth/ic_peclinical.png')}></ScaledImage>)

        }
    }
    getTime(text) {
        try {
            if (text) {
                return text.toDateObject('-').format('dd/MM/yyyy');
            }
            return "";
        } catch (error) {
            return "";
        }
    }
    renderItem = ({ item }) => {
        return (
            <View style={styles.viewItem}>
                <Card style={styles.cardStyle}>
                    {this.renderImg(item)}
                    <View style={styles.viewDetails}>
                        <Text style={{ color: '#479AE3', marginVertical: 15, fontSize: 14 }}>{this.getTime(item.timeGoIn)}</Text>
                        <Text style={{ fontSize: 14, minHeight: 20 }}>{item.serViceType}</Text>
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
                title={<Text style={{ color: '#FFF' }}>{'Lịch sử y bạ '}<Text style={{ color: '#b61827' }}>({this.state.countTime} lần)</Text></Text>}
                icBack={require('@images/new/left_arrow_white.png')}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#4BBA7B"
                actionbarStyle={styles.actionbarStyle}
                titleStyle={styles.titleStyle}>
                <FlatList
                    data={this.state.data}
                    style={{ flex: 1 }}
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
        width: '100%',
        borderRadius: 5,
        alignItems: 'center',
        minHeight: 150,
        paddingVertical: 10,
        justifyContent: 'center',
    },
    viewItem: {
        width: width,
        padding: 5,
        paddingHorizontal: 10,

        // , padding: 5, flex: 1 / 2, height: 180, marginTop: 20, 
        justifyContent: 'center', alignItems: 'center',
        width: width
    },
    viewDetails: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        // top:-50

    },
    actionbarStyle: {
        backgroundColor: '#4BBA7B',
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