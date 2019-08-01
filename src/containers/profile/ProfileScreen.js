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
        let data = this.props.navigation.state.params && this.props.navigation.state.params.data ? this.props.navigation.state.params.data : ''
        let imgAvtLocal = this.props.navigation.state.params && this.props.navigation.state.params.data && this.props.navigation.state.params.data.avatar ? this.props.navigation.state.params.data.avatar.absoluteUrl() : ''
        let imgLocal = this.props.navigation.state.params && this.props.navigation.state.params.data && this.props.navigation.state.params.data.cover ? this.props.navigation.state.params.data.cover.absoluteUrl() : ''
        this.state = {
            value: 1,
            refresh: false,
            isLoading: false,
            data: data,
            imgAvtLocal: imgAvtLocal,
            imgLocal: imgLocal
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
                data: nextProps.navigation.state.params.data,
                // imgAvtLocal: this.props.navigation.state.params.data.avatar ? this.props.navigation.state.params.data.avatar.absoluteUrl() : '',
                // imgLocal: this.props.navigation.state.params.data.cover ? this.props.navigation.state.params.data.cover.absoluteUrl() : '',
            })
        }
    }
    selectImage = () => {
        connectionUtils
            .isConnected()
            .then(s => {
                if (this.imagePicker) {
                    this.imagePicker.open(true, 200, 200, image => {
                        setTimeout(() => {
                            Keyboard.dismiss();
                        }, 500);
                        this.setState({
                            image
                        });
                        imageProvider.upload(this.state.image.path, (s, e) => {
                            if (s.success && s.data.code == 0) {
                                let images = s.data.data.images[0].thumbnail;
                                this.setState({
                                    imgLocal: images
                                });
                                this.onUpdate()
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

    onUpdate = () => {
        if (this.state.image)
            this.setState({ isLoading: true }, () => {
                imageProvider.upload(this.state.image.path, (s, e) => {
                    if (s.success && s.data.code == 0) {
                        let image = s.data.data.images[0].thumbnail;
                        this.onUpdate2(image);
                    }
                    if (e) {
                        this.setState({
                            isLoading: false
                        });
                    }
                });
            });
        else this.onUpdate2("");
    };
    onUpdate2(image) {
        connectionUtils
            .isConnected()
            .then(s => {
                this.setState(
                    {
                        isLoading: true
                    },
                    () => {
                        let data = {
                            cover: image,
                            type: this.state.data.type,
                        }
                        let id = this.state.data.id
                        profileProvider
                            .updateCover(id, data)
                            .then(res => {
                                if (res.code == 0) {
                                    this.setState({
                                        isLoading: false
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
                                snackbar.show(constants.msg.app.err_try_again, "danger");
                            });
                    }
                )
            })
            .catch(e => {
                snackbar.show(constants.msg.app.not_internet, "danger");
            });
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
                                this.onUpdateAvt()
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
    onUpdateAvt = () => {
        if (this.state.imageAvt)
            this.setState({ isLoading: true }, () => {
                imageProvider.upload(this.state.imageAvt.path, (s, e) => {
                    if (s.success && s.data.code == 0) {
                        let image = s.data.data.images[0].thumbnail;
                        this.onUpdateAvt2(image);
                    }
                    if (e) {
                        this.setState({
                            isLoading: false
                        });
                    }
                });
            });
        else this.onUpdateAvt2("");
    };
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
                                console.log(res, 'fssdas')
                                if (res.code == 0) {
                                    if (this.state.data.type == 'ORIGINAL') {
                                        let user = res.data.user;
                                        let current = this.props.userApp.currentUser;
                                        user.bookingNumberHospital = current.bookingNumberHospital;
                                        user.bookingStatus = current.bookingStatus;
                                        this.props.dispatch(redux.userLogin(user));
                                    }

                                    this.setState({
                                        isLoading: false
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
    render() {
        const icSupport = require("@images/new/user.png");
        const source = this.state.imgLocal
            ? { uri: this.state.imgLocal.absoluteUrl() }
            : icSupport

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
                menuButton={<TouchableOpacity onPress={() => this.props.navigation.navigate('editProfile', { data: this.state.data })}><ScaledImage style={{ tintColor: '#fff', marginRight: 10 }} height={20} source={require('@images/new/profile/ic_edit.png')}></ScaledImage></TouchableOpacity>}

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
                            source={source}
                            defaultImage={() => {
                                return (
                                    <ScaledImage
                                        resizeMode="cover"
                                        source={icSupport}
                                        width={70}
                                        style={styles.imgBaner}
                                    />
                                );
                            }}
                        />
                        <TouchableOpacity onPress={this.selectImage} style={styles.scaledImage}>
                            <ScaledImage
                                source={require("@images/new/profile/ic_instagram.png")}
                                width={30}
                            />
                        </TouchableOpacity>
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
                        <View><ScaledImage height={20} style={{ tintColor: '#fff', }} source={require('@images/new/profile/ic_account.png')}></ScaledImage></View>
                        <Text style={[styles.txFeature]} >Thông tin cá nhân</Text>
                        <View style={{ width: 20 }}></View>
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
                            <Text><Text style={styles.txLabel}>Chiều cao: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.height ? this.state.data.height : ''} cm</Text></Text>
                            <Text style={[styles.txLabel]}>Cân nặng: <Text style={{ color: '#000' }}>{this.state.data && this.state.data.weight ? this.state.data.weight : ''} kg</Text></Text>
                            <View style={{ width: 20 }}></View>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Chỉ số BMI: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.height && this.state.data.weight ? parseFloat(this.state.data.weight / (Math.pow(this.state.data.height / 100, 2))).toFixed(1) : ''}</Text></Text>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Số điện thoại: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.phone ? this.state.data.phone.replace(/(\d\d\d\d)(\d\d\d)(\d\d\d)/, '$1.$2.$3') : ''}</Text></Text>
                        </View>
                        <View style={styles.viewItem}>
                            <Text><Text style={styles.txLabel}>Địa chỉ: </Text><Text style={styles.txContent}>{this.state.data && this.state.data.address ? this.state.data.address : ''}</Text></Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#4BBA7B' }}></View>
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
    btnFeature: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4BBA7B', justifyContent: 'space-around', borderRadius: 5, borderColor: '#4BBA7B', paddingVertical: 10, marginHorizontal: 10, marginTop: 30 },
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
        backgroundColor: '#22b060',
        borderBottomWidth: 0
    },
    btn: {
        paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#359A60', borderRadius: 5, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginHorizontal: 10, marginLeft: 12, marginBottom: 20, marginTop: 10
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
        color: '#4BBA7B',
        fontSize: 14
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
        textAlign: 'center',
        color: '#FFF',
        fontSize: 18
    },
    txBtn: { color: '#fff' },

})
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ProfileScreen);