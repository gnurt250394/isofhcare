import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import ActivityPanel from "@components/ActivityPanel";
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from "mainam-react-native-image-loader";
import ProfileInfo from "@components/profile/ProfileInfo"
import Transaction from "@components/profile/Transaction"
import profileProvider from '@data-access/profile-provider'
import dateUtils from 'mainam-react-native-date-utils';

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            refresh: false,
            isLoading: false
        };
    }
    onSelectFeature = (value) => {
        this.setState({
            value: value
        })
    }
    renderContent = () => {
        switch (this.state.value) {
            case 1: return (
                <ProfileInfo></ProfileInfo>
            )
            case 2: return (<Transaction></Transaction>)
        }
    }
    componentDidMount() {
        this.props.navigation.state.params.data && this.setState({
            data: this.props.navigation.state.params.data
        })
    }
    render() {
        return (
            <ActivityPanel
                icBack={require('@images/new/left_arrow_white.png')}
                titleStyle={styles.txTitle}
                title={'PROFILE'}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#359A60"
                actionbarStyle={styles.actionbarStyle}
                style={styles.container}
                menuButton = {<ScaledImage height={20} source={require('@images/new/profile/ic_edit.png')}></ScaledImage>}

            >
                <ScrollView style={{ flex: 1 }} >
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
                    </View>
                    <View style={styles.btnFeature}>
                        <ScaledImage height={20} style={{ tintColor: '#fff' }} source={require('@images/new/profile/ic_account.png')}></ScaledImage>
                        <Text style={[styles.txFeature, this.state.value == 1 ? {} : {}]} >Thông tin cá nhân</Text>
                        <View style={{ width: 1 }}></View>
                    </View>
                    {/* <TouchableOpacity onPress={() => this.onSelectFeature(2)} style={[styles.btnFeature, this.state.value == 2 ? { backgroundColor: '#4BBA7B' } : { backgroundColor: '#fff' }]}>
                            <ScaledImage height={20} style={this.state.value == 2 ? { tintColor: '#fff' } : { tintColor: '#4BBA7B' }} source={require('@images/new/profile/ic_deal_write.png')}></ScaledImage>
                            <Text style={[styles.txFeature, this.state.value == 2 ? { color: '#FFF' } : {}]}>Giao dịch</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onSelectFeature(3)} style={[styles.btnFeature, this.state.value == 3 ? { backgroundColor: '#4BBA7B' } : { backgroundColor: '#fff' }]}>
                            <ScaledImage height={20} style={this.state.value == 3 ? { tintColor: '#fff' } : { tintColor: '#4BBA7B' }} source={require('@images/new/profile/ic_account.png')}></ScaledImage>
                            <Text style={[styles.txFeature, this.state.value == 3 ? { color: '#FFF' } : {}]}>Y bạ điện tử</Text>
                        </TouchableOpacity> */}
                    <View style={styles.containerInfo}>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Họ và tên: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.name}</Text></Text>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Ngày sinh: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.dob ? this.state.data.dob.toDateObject('-').format('dd/MM/yyyy') : ('')}</Text></Text>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>ID: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.profileNoID ?this.state.data.profileNoID : '' }</Text></Text>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Giới tính: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.gender ? (this.state.data.gender == 1 ? 'Nam' : 'Nữ') :'' }</Text></Text>
                        </View>
                        <View style={[styles.viewItem, {}]}>
                            <Text><Text style={styles.txLabel}>Chiều cao: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.height ? this.state.data.height : ''}</Text></Text>
                            <Text style={[styles.txLabel]}>Cân nặng: <Text style={{ color: '#000' }}>{this.state.data && this.state.data.weight ? this.state.data.weight : ''}</Text></Text>
                            <View style={{width:20}}></View>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Chỉ số BMI: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.bmi ? this.state.data.bmi : ''}</Text></Text>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Số điện thoại: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.phone ? this.state.data.phone : ''}</Text></Text>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Địa chỉ: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.address ? this.state.data.address:''}</Text></Text>
                        </View>
                    </View>
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
    btnFeature: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4BBA7B', justifyContent: 'space-around', borderRadius: 5, borderColor: '#4BBA7B', paddingHorizontal: 2, paddingVertical: 10, marginHorizontal: 10,marginTop:30 },
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
    containerInfo: {
        padding: 10,
        flex: 1,
    },
    viewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    txLabel: {
        color: '#4BBA7B'
    },
    txContent: {
        marginLeft: 5,
        color: '#000'
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

    txFeature: {
        textAlign: 'center',
        color: '#FFF'
    }
})