import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ActivityPanel from "@components/ActivityPanel";
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from "mainam-react-native-image-loader";
import ProfileInfo from "@components/profile/ProfileInfo"
import Transaction from "@components/profile/Transaction"

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1
        };
    }
    onSelectFeature = (value) => {
        this.setState({
            value: value
        })
    }
    renderContent = () => {
        console.log('renderrrrr');
        switch (this.state.value) {
            case 1: return (
                <ProfileInfo></ProfileInfo>
            )
            case 2: return (<Transaction></Transaction>)
        }
    }
    render() {
        return (
            <ActivityPanel
                icBack={require('@images/new/left_arrow_white.png')}
                titleStyle={styles.txTitle}
                title={'PROFILE CỦA TÔI'}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#359A60"
                actionbarStyle={styles.actionbarStyle}
                style={styles.container}
            >
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.viewBaner}>
                        <ImageLoad
                            // imageStyle={styles.imgBaner}
                            // customImagePlaceholderDefaultStyle={styles.customImagePlace}
                            // placeholderSource={{}}
                            style={styles.imgBaner}
                            resizeMode="cover"
                            loadingStyle={{ size: "small", color: "gray" }}
                            source={{ uri: 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg' }}
                            defaultImage={() => {
                                return (
                                    <ScaledImage
                                        resizeMode="cover"
                                        source={{ uri: 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg' }}
                                        width={70}
                                        style={styles.imgBaner}
                                    />
                                );
                            }}
                        />
                        <TouchableOpacity style={styles.scaledImage}>
                            <ScaledImage
                                source={require("@images/new/profile/ic_instagram.png")}
                                width={30}
                            />
                        </TouchableOpacity>
                        <View style={styles.avtBtn}>
                            <ImageLoad
                                imageStyle={styles.imageStyle}
                                borderRadius={60}
                                customImagePlaceholderDefaultStyle={styles.customImagePlace}
                                style={styles.styleImgLoad}
                                resizeMode="cover"
                                loadingStyle={{ size: "small", color: "gray" }}
                                source={{ uri: 'https://vcdn-giaitri.vnecdn.net/2019/03/17/ngoc-trinh-7-6846-1552530069-9335-1552791273.jpg' }}
                                defaultImage={() => {
                                    return (
                                        <ScaledImage
                                            resizeMode="cover"
                                            source={{ uri: 'https://vcdn-giaitri.vnecdn.net/2019/03/17/ngoc-trinh-7-6846-1552530069-9335-1552791273.jpg' }}
                                            width={120}
                                            style={styles.styleImgLoad}
                                        />
                                    );
                                }}
                            />
                            <TouchableOpacity style={styles.scaledImageAvt}
                            >
                                <ScaledImage
                                    source={require("@images/new/profile/instagram_logo_black.png")}
                                    width={30}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.txName}>Nguyễn Thị Ngọc Anh</Text>

                    </View>
                    <View style={styles.viewBtnFeature}>
                        <TouchableOpacity onPress={() => this.onSelectFeature(1)} style={[styles.btnFeature, { marginLeft: 0 }, this.state.value == 1 ? { backgroundColor: '#4BBA7B' } : { backgroundColor: '#fff' }]}>
                            <ScaledImage height={20} style={this.state.value == 1 ? { tintColor: '#fff' } : { tintColor: '#4BBA7B' }} source={require('@images/new/profile/ic_account.png')}></ScaledImage>
                            <Text style={[styles.txFeature, this.state.value == 1 ? { color: '#FFF' } : {}]} >Thông tin cá nhân</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onSelectFeature(2)} style={[styles.btnFeature, this.state.value == 2 ? { backgroundColor: '#4BBA7B' } : { backgroundColor: '#fff' }]}>
                            <ScaledImage height={20} style={this.state.value == 2 ? { tintColor: '#fff' } : { tintColor: '#4BBA7B' }} source={require('@images/new/profile/ic_deal_write.png')}></ScaledImage>
                            <Text style={[styles.txFeature, this.state.value == 2 ? { color: '#FFF' } : {}]}>Giao dịch</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onSelectFeature(3)} style={[styles.btnFeature, this.state.value == 3 ? { backgroundColor: '#4BBA7B' } : { backgroundColor: '#fff' }]}>
                            <ScaledImage height={20} style={this.state.value == 3 ? { tintColor: '#fff' } : { tintColor: '#4BBA7B' }} source={require('@images/new/profile/ic_account.png')}></ScaledImage>
                            <Text style={[styles.txFeature, this.state.value == 3 ? { color: '#FFF' } : {}]}>Y bạ điện tử</Text>
                        </TouchableOpacity>
                    </View>
                    {this.renderContent()}
                </ScrollView>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewBaner: {
        alignItems: 'center',
    },
    scaledImage: { position: "absolute", top: 5, right: 5 },
    btnFeature: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderWidth: 1, borderColor: '#4BBA7B', marginLeft: 2, paddingHorizontal: 5, paddingVertical: 10 },
    imageStyle: { borderRadius: 60, borderWidth: 2, borderColor: '#Fff' },
    customImagePlace: {
        width: 120,
        height: 120,
        alignSelf: "center"
    },
    styleImgLoad: { width: 120, height: 120, },
    avtBtn: {
        position: 'absolute', top: 50
    },
    scaledImageAvt: { position: "absolute", bottom: 0, right: 0 },
    txTitle: { color: '#fff', textAlign: 'left', marginHorizontal: 10, },
    actionbarStyle: {
        backgroundColor: '#22b060',
        borderBottomWidth: 0
    },
    imgBaner: {
        width: '100%',
        height: 150
    },
    avtBaner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#Fff',
        position: 'relative',
        marginTop: -70,
    },
    txName: {
        marginTop: 30,
        color: '#4BBA7B',
        fontWeight: '600',

    },
    viewBtnFeature: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'center',
        width: '100%',
        marginTop: 10
    },
    txFeature: {
        textAlign: 'center',
        marginLeft: 5,
        maxWidth: 60,
    }
})