import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, } from 'react-native';
import { Card } from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import ImageLoad from 'mainam-react-native-image-loader';

 class HistoryTimeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                date: '15/07/2019',
                type: 'Khám cận lâm sàng'
            }, {
                date: '15/07/2019',
                type: 'Khám cận lâm sàng'
            }, {
                date: '15/07/2019',
                type: 'Khám cận lâm sàng'
            }]
        };
    }
    renderItem = ({ item }) => {
        const source = this.props.userApp.currentUser.avatar ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() } : require("@images/new/user.png");

        return (
            <Card style={styles.cardStyle}>
                <ScaledImage style = {styles.img} height={100} uri={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBg5BBAZxlBkNfmhQIjNjek9PviIoskVFu3q6cgY-OXMrvL8r2ig'}></ScaledImage>
                <View style={styles.viewDetails}>
                    <Text style={{color:'#479AE3'}}>{item.date}</Text>
                    <Text>{item.type}</Text>
                </View>
            </Card>
        )
    }
    render() {
        const source = this.props.userApp.currentUser.avatar ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() } : require("@images/new/user.png");

        return (
            <ActivityPanel style={styles.container}
            // title="HỒ SƠ Y BẠ GIA ĐÌNH"
            title={<Text>{'Lịch sử y bạ('}<Text>16</Text>)lần</Text>}
            icBack={require('@images/new/left_arrow_white.png')}
            iosBarStyle={'light-content'}
            statusbarBackgroundColor="#22b060"
            actionbarStyle={styles.actionbarStyle}
            menuButton = {<TouchableOpacity style={styles.menu} >
            <ImageLoad
                        resizeMode="cover"
                        imageStyle={styles.imageStyle}
                        borderRadius={30}
                        customImagePlaceholderDefaultStyle={[styles.avatar, { width: 60, height: 60 }]}
                        placeholderSource={require("@images/new/user.png")}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={styles.imgLoad}
                        defaultImage={() => {
                            return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={60} height={60} />
                        }}
                    /></TouchableOpacity>}
            titleStyle={styles.titleStyle}>
            <View style={{justifyContent:'center',flex:1}}>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    numColumns={2}
                ></FlatList>
            </View>
            </ActivityPanel>

        );
    }
}
const styles = StyleSheet.create({
    containder: {
        flex: 1,
        justifyContent:'center'
    },
    cardStyle: {
        padding: 5,
        borderRadius: 5,
        marginHorizontal:10
    },
    viewDetails: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    img:{
        // position:'absolute',
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