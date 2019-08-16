import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import ActivityPanel from "@components/ActivityPanel";
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from "mainam-react-native-image-loader";
import ProfileInfo from "@components/profile/ProfileInfo"
import Transaction from "@components/profile/Transaction"
import profileProvider from '@data-access/profile-provider'
import dateUtils from 'mainam-react-native-date-utils';
import imageProvider from "@data-access/image-provider";
import connectionUtils from "@utils/connection-utils";
import ImagePicker from "mainam-react-native-select-image";
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';
import objectUtils from "@utils/object-utils";
import redux from "@redux-store";
import { connect } from "react-redux";

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        let data = (this.props.navigation.state.params && this.props.navigation.state.params.data) ? this.props.navigation.state.params.data.medicalRecords || {} : {}
        console.log(data)
        this.state = {
            value: 1,
            refresh: false,
            isLoading: false,
            data: data,
            imgAvtLocal: data.avatar || '',
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params && nextProps.navigation.state.params.data) {
            this.setState({
                data: nextProps.navigation.state.params.data.medicalRecords,
                // imgAvtLocal: this.props.navigation.state.params.data.avatar ? this.props.navigation.state.params.data.avatar.absoluteUrl() : '',
                // imgLocal: this.props.navigation.state.params.data.cover ? this.props.navigation.state.params.data.cover.absoluteUrl() : '',
            })
            this.props = nextProps
        }
    }
    selectImageAvt = () => {
        connectionUtils
            .isConnected()
            .then(s => {
                if (this.imagePicker) {
                    this.imagePicker.open(true, 200, 200, image => {
                        setTimeout(() => {
                            Keyboard.dismiss();
                        }, 500);
                        this.setState({
                            imageAvt: image
                        });
                        imageProvider.upload(this.state.imageAvt.path, (s, e) => {
                            if (s.success && s.data.code == 0) {
                                console.log(s, 'xoasd');
                                let images = s.data.data.images[0].thumbnail;
                                this.setState({
                                    imgAvtLocal: images
                                });
                                this.onUpdateAvt2(images)
                            }
                            if (e) {
                                this.setState({
                                    isLoading: false
                                });
                            }
                        });
                    });
                }
            })
            .catch(e => {
                snackbar.show(constants.msg.app.not_internet, "danger");
            });
    }
    // onUpdateAvt = () => {
    //     if (this.state.imageAvt)
    //         this.setState({ isLoading: true }, () => {
    //             imageProvider.upload(this.state.imageAvt.path, (s, e) => {
    //                 if (s.success && s.data.code == 0) {
    //                     let image = s.data.data.images[0].thumbnail;
    //                     this.onUpdateAvt2(image);
    //                 }
    //                 if (e) {
    //                     this.setState({
    //                         isLoading: false
    //                     });
    //                 }
    //             });
    //         });
    //     else this.onUpdateAvt2("");
    // };
    onUpdateAvt2(image) {
        connectionUtils
            .isConnected()
            .then(s => {
                this.setState(
                    {
                        isLoading: true
                    },
                    () => {
                        let data = {
                            avatar: image,
                            type: this.state.data.type,
                        }
                        let id = this.state.data.id
                        profileProvider
                            .updateAvatar(id, data)
                            .then(res => {
                                console.log(res,'upload')
                                if (res.code == 0) {
                                    if (this.state.data.status == 1) {
                                        let current = this.props.userApp.currentUser;
                                        current.avatar = res.data.medicalRecords.avatar
                                        this.props.dispatch(redux.userLogin(current));
                                        console.log(current, 'new user')
                                    }
                                    let data = this.state.data
                                    data.avatar = res.data.medicalRecords.avatar
                                    this.setState({
                                        isLoading: false,
                                        data : data
                                    });
                                }
                                else {
                                    this.setState({
                                        isLoading: false
                                    });
                                }
                            })
                            .catch(err => {
                                this.setState({
                                    isLoading: false
                                });
                                console.log(err, 'asdsd');
                                snackbar.show(constants.msg.app.err_try_again, "danger");
                            });
                    }
                )
            })
            .catch(e => {
                snackbar.show(constants.msg.app.not_internet, "danger");
            });
    }
    renderRelation = () => {
        switch (this.state.data.relationshipType) {
            case 'DAD':
                return <Text style={styles.txContent}>Cha</Text>
            case 'MOTHER':
                return <Text style={styles.txContent}>Mẹ</Text>
            case 'BOY':
                return <Text style={styles.txContent}>Con trai</Text>
            case 'DAUGHTER':
                return <Text style={styles.txContent}>Con gái</Text>
            case 'GRANDSON':
                return <Text style={styles.txContent}>Cháu trai</Text>
            case 'NIECE':
                return <Text style={styles.txContent}>Cháu gái</Text>
            case 'GRANDFATHER':
                return <Text style={styles.txContent}>Ông</Text>
            case 'GRANDMOTHER':
                return <Text style={styles.txContent}>Bà</Text>
            case 'WIFE':
                return <Text style={styles.txContent}>Vợ</Text>
            case 'HUSBAND':
                return <Text style={styles.txContent}>Chồng</Text>
            case 'OTHER':
                return <Text style={styles.txContent}>Khác</Text>

            default:
                return <Text style={styles.txContent}></Text>
        }
    }
    renderAddress = () => {
        let dataLocaotion = this.props.navigation.state.params && this.props.navigation.state.params.data ? this.props.navigation.state.params.data.medicalRecords : ''
        if (dataLocaotion) {
            if (this.state.data.address && this.state.data.village) {
                return (<Text style={styles.txContent}>{this.state.data.village + ', ' + this.state.data.address}</Text>)
            }

            if (this.state.data.address && !this.state.data.village) {
                return (<Text style={styles.txContent}>{this.state.data.address}</Text>)
            }
            if (!this.state.data.address && this.state.data.village) {
                return (<Text style={styles.txContent}>{this.state.data.village}</Text>)
            }
        }

    }
    onEdit = () => {
        let dataLocation = this.props.navigation.state.params && this.props.navigation.state.params.data ? this.props.navigation.state.params.data : ''
        if (dataLocation) {

            let country = dataLocation.country
            let district = dataLocation.district
            let province = dataLocation.province
            let zone = dataLocation.zone
            let relationshipType = this.state.data.relationshipType
            this.props.navigation.navigate('editProfile', {
                data: this.state.data,
                country: country, district: district, province: province, zone: zone, relationshipType: relationshipType
            })
        }
    }
    render() {
        const icSupport = require("@images/new/user.png");
        const sourceAvt = this.state.imgAvtLocal
            ? { uri: this.state.imgAvtLocal.absoluteUrl() }
            : icSupport
        return (
            <ActivityPanel
                icBack={require('@images/new/left_arrow_white.png')}
                titleStyle={styles.txTitle}
                title={'PROFILE'}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#359A60"
                actionbarStyle={styles.actionbarStyle}
                style={styles.container}
                menuButton={<TouchableOpacity onPress={this.onEdit}><ScaledImage style={{ tintColor: '#fff', marginRight: 10 }} height={20} source={require('@images/new/profile/ic_edit.png')}></ScaledImage></TouchableOpacity>}

            >
                <ScrollView  style={{ flex: 1 }} >
                    <View style={styles.viewBaner}>
                        <ScaledImage
                            // resizeMode="cover"
                            source={require('@images/new/profile/img_cover_profile.png')}
                            width={70}
                            style={styles.imgBaner}
                        />
                        {/* <TouchableOpacity onPress={this.selectImage} style={styles.scaledImage}>
                            <ScaledImage
                                source={require("@images/new/profile/ic_instagram.png")}
                                width={30}
                            />
                        </TouchableOpacity> */}
                        <View style={styles.avtBtn}>
                            <ImageLoad
                                source={sourceAvt}
                                imageStyle={styles.imageStyle}
                                borderRadius={60}
                                customImagePlaceholderDefaultStyle={styles.customImagePlace}
                                style={styles.styleImgLoad}
                                resizeMode="cover"
                                loadingStyle={{ size: "small", color: "gray" }}
                                defaultImage={() => {
                                    return (
                                        <ScaledImage
                                            resizeMode="cover"
                                            source={icSupport}
                                            width={120}
                                            style={styles.imageStyle}
                                        />
                                    );
                                }}
                            />
                            <TouchableOpacity onPress={this.selectImageAvt} style={styles.scaledImageAvt}
                            >
                                <ScaledImage
                                    source={require("@images/new/profile/instagram_logo_black.png")}
                                    width={30}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.btnFeature}>
                        <View><ScaledImage height={20} style={{ tintColor: '#fff', marginLeft: -28 }} source={require('@images/new/profile/ic_account.png')}></ScaledImage></View>
                        <Text style={[styles.txFeature]} >Thông tin cá nhân</Text>
                        <View></View>
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
                        {/* <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>ID: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.profileNoID ? this.state.data.profileNoID : ''}</Text></Text>
                        </View> */}
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Giới tính: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.gender || this.state.data.gender == 0 ? (this.state.data.gender == 0 ? 'Nữ' : 'Nam') : ''}</Text></Text>
                        </View>
                        <View style={[styles.viewItem, {}]}>
                            <Text><Text style={styles.txLabel}>Chiều cao: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.height ? this.state.data.height + 'cm' : ''} </Text></Text>
                            <Text style={[styles.txLabel]}>Cân nặng: <Text style={{ color: '#000',fontWeight:'normal' }}>{this.state.data && this.state.data.weight ? this.state.data.weight + 'kg' : ''} </Text></Text>
                            <View style={{ width: 20 }}></View>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Chỉ số BMI: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.height && this.state.data.weight ? parseFloat(this.state.data.weight / (Math.pow(this.state.data.height / 100, 2))).toFixed(1) : ''}</Text></Text>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Số điện thoại: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.phone ? this.state.data.phone.replace(/(\d\d\d\d)(\d\d\d)(\d\d\d)/, '$1.$2.$3') : ''}</Text></Text>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Địa chỉ: </Text><Text style ={{fontSize:14,color:'#000'}}>{this.state.data.address}</Text></Text>
                        </View>
                        {this.state.data.status != 1 ? (
                            <View style={styles.viewItem}>
                                <Text><Text style={styles.txLabel}>Quan hệ: </Text>{this.renderRelation()}</Text>
                            </View>
                        ) : (<View></View>)}

                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('createProfile')} style={styles.btn}><Text style={styles.txBtn}>Thêm thành viên</Text></TouchableOpacity>
                </ScrollView>
                <ImagePicker ref={ref => (this.imagePicker = ref)} />
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
    btnFeature: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4BBA7B', justifyContent: 'space-around', borderTopLeftRadius: 50, borderBottomLeftRadius: 50, borderColor: '#4BBA7B', paddingVertical: 10, marginLeft: 10, marginTop: 30, paddingHorizontal: 0,flex:1 },
    imageStyle: { borderRadius: 60, borderWidth: 2, borderColor: '#Fff' },
    customImagePlace: {
        width: 120,
        height: 120,
        alignSelf: "center"
    },
    styleImgLoad: { width: 120, height: 120, },
    avtBtn: {
        position: 'absolute', top: 50,
    },
    scaledImageAvt: { position: "absolute", bottom: 0, right: 0 },
    txTitle: { color: '#fff', textAlign: 'left', marginHorizontal: 10, },
    actionbarStyle: {
        backgroundColor: '#4BBA7B',
        borderBottomWidth: 0
    },
    btn: {
        paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#4BBA7B', borderRadius: 8, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginHorizontal: 10, marginLeft: 12, marginBottom: 20, marginTop: 10
    },
    containerInfo: {
        padding: 10,
        flex: 1,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#01C295',
        margin: 10
    },
    viewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    txLabel: {
        color: '#01C295',
        fontSize: 14,
        fontWeight:'bold'
    },
    txContent: {
        marginLeft: 5,
        color: '#000',
        fontSize: 14

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
        color: '#FFF',
        fontWeight:'bold',
        fontSize:16
    },
    txBtn: { color: '#fff' },

})
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ProfileScreen);