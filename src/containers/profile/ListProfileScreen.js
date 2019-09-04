import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from "@components/ActivityPanel";
import { Card, Icon } from 'native-base';
import medicalRecordProvider from '@data-access/medical-record-provider';
import { connect } from "react-redux";
import constants from '@resources/strings';
import profileProvider from '@data-access/profile-provider'
import Modal from '@components/modal';
import NavigationService from "@navigators/NavigationService";
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet'
import snackbar from "@utils/snackbar-utils";
import * as Animatable from 'react-native-animatable';

class ListProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ name: 'ádasd' }, { name: 'ádasd' }, { name: 'ádasd' }],
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            isVisible: false,
        };
    }
    onShowOptions = (id, sharePermission, medicalRelatedId) => {
        this.actionSheetOptions.show();
        this.setState({
            idProfile: id,
            medicalRelatedId: medicalRelatedId ? medicalRelatedId : null,
            sharePermission: sharePermission
        })
    };
    onRefresh = () => {
        this.setState({
            refreshing: true,
        }, () => {
            this.onLoad();
        })
    }
    onSetOptions = index => {
        try {
            switch (index) {
                case 0:
                    NavigationService.navigate("shareDataProfile", {
                        medicalRelatedId: this.state.medicalRelatedId,
                        id: this.state.idProfile,
                        sharePermission: this.state.sharePermission
                    })
                    return;
                case 1:
                    this.setState(
                        {
                            isVisible: true,

                        });
                    return;
            }
        } catch (error) {

        }

    };
    componentDidMount() {
        this.onRefresh();
    }

    onLoad = () => {
        profileProvider.getListProfile().then(s => {
            this.setState({
                refreshing: false,
            }, () => {
                switch (s.code) {
                    case 0:
                        if (s.data) {
                            this.setState({
                                data: s.data,
                            });
                        }
                        break;
                }
            });
        }).catch(e => {
            this.setState({
                refreshing: false,
            });
        })
    }
    onClickItem = (item) => {
        NavigationService.navigate('profile', { id: item.medicalRecords.id })
    }
    onDeleteItem = (id) => {
        this.setState({

        })
    }
    onClickDone = () => {
        this.state.idProfile &&
            profileProvider.deleteFamilyProfile(this.state.idProfile).then(res => {
                this.setState({
                    isVisible: false
                })
                if (res.code == 0) {
                    this.onRefresh()
                    snackbar.show('Xóa thành công', 'success')
                    return
                } if (res.code == 4) {
                    snackbar.show('Hồ sơ không thể xóa do đã có đặt khám', 'danger')
                    return
                } else {
                    snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                }

            }).catch(err => {
                this.setState({
                    isVisible: false
                })
                snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
            })
    }
    onCloseModal = () => {
        this.setState({
            isVisible: false
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params && nextProps.navigation.state.params.reset) {
            this.onRefresh()
        }
    }
    onConfirm = (id, sharePermission, medicalRelatedId) => {
        this.setState({
            disabled: true
        }, () => {
            profileProvider.confirm(id).then(res => {
                if (res.code == 0) {
                    NavigationService.navigate("shareDataProfile", {
                        shareId: medicalRelatedId,
                        id: id,
                        sharePermission: sharePermission
                    })
                    this.setState({
                        disabled: false

                    })
                    return;
                } else {
                    this.setState({
                        disabled: false

                    })
                    snackbar.show('Xác nhận không thành công', 'danger')
                }
            }).catch(err => {
                this.setState({
                    disabled: false

                })
                snackbar.show('Xác nhận không thành công', 'danger')
            })
        })

    }
    renderRelation = (type) => {
        switch (type) {
            case 'DAD':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Cha</Text>
            case 'MOTHER':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Mẹ</Text>
            case 'BOY':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Con trai</Text>
            case 'DAUGHTER':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Con gái</Text>
            case 'GRANDSON':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Cháu trai</Text>
            case 'NIECE':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Cháu gái</Text>
            case 'GRANDFATHER':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Ông</Text>
            case 'GRANDMOTHER':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Bà</Text>
            case 'WIFE':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Vợ</Text>
            case 'HUSBAND':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Chồng</Text>
            case 'OTHER':
                return <Text style={{ color: '#868686', fontSize: 14 }}>Khác</Text>
            default:
                return <Text style={{ color: '#868686', fontSize: 14 }}></Text>
        }
    }
    renderItem = (item, index) => {
        return (
            item.medicalRecords.statusConfirm == "NEED_CONFIRM" ?
                (
                    <View>
                        <Text style={{ color: 'red', marginTop: 10, fontSize: 14, marginHorizontal: 12, textAlign: 'center' }}>Tài khoản {item.medicalRecords.name} có số điện thoại {item.medicalRecords.phone} muốn xác nhận mối quan hệ với bạn.</Text>
                        {item.medicalRecords.status == 1 ? (
                            <Card style={styles.viewProfileUser}>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onClickItem(item)}>
                                    <LinearGradient style={styles.viewGradientUser} colors={['#02C293', '#01bb72', '#01BF88']}>
                                        <Text style={styles.txProfileUser}>{item.medicalRecords.name}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Card>
                        ) : (<View style={{
                            marginHorizontal: 10,
                        }}>
                            <Card style={styles.cardView}>
                                <View style={styles.viewProfileFamily}>
                                    <TouchableOpacity onPress={() => this.onClickItem(item)} >
                                        <View>
                                            <Text style={styles.txName}>{item.medicalRecords.name}</Text>
                                            {
                                                item.medicalRecords.relationshipType ?
                                                    <Text style={{ color: '#02C293', fontSize: 14 }}>Quan hệ: {this.renderRelation(item.medicalRecords.relationshipType)}</Text>
                                                    : <View></View>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {
                                            item.medicalRecords.statusConfirm == "NEED_CONFIRM" ? (
                                                <TouchableOpacity disabled={this.state.disabled} onPress={() => this.onConfirm(item.medicalRecords.id, item.medicalRecords.sharePermission, item.medicalRecords.medicalRelatedId)} style={{ paddingHorizontal: 20, paddingVertical: 5, backgroundColor: '#FFAE00', borderRadius: 5 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>XÁC NHẬN</Text></TouchableOpacity>
                                            ) : (<View></View>)
                                        }
                                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onShowOptions(item.medicalRecords.id, item.medicalRecords.sharePermission, item.medicalRecords.medicalRelatedId ? item.medicalRecords.medicalRelatedId : null)}>
                                            <ScaledImage height={20} width={20} source={require('@images/new/profile/ic_three_dot.png')}></ScaledImage>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Card>
                        </View>)}
                    </View>
                ) : (
                    item.medicalRecords.status == 1 ? (
                        <Card style={styles.viewProfileUser}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onClickItem(item)}>
                                <LinearGradient style={styles.viewGradientUser} colors={['#02C293', '#01bb72', '#01BF88']}>
                                    <Text style={styles.txProfileUser}>{item.medicalRecords.name}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Card>
                    ) : (<View style={{
                        marginHorizontal: 10,
                    }}>
                        <Card style={styles.cardView}>
                            <View style={styles.viewProfileFamily}>
                                <TouchableOpacity onPress={() => this.onClickItem(item)} >
                                    <View>
                                        <Text style={styles.txName}>{item.medicalRecords.name}</Text>
                                        {
                                            item.medicalRecords.relationshipType ?
                                                <Text style={{ color: '#02C293', fontSize: 14 }}>Quan hệ: {this.renderRelation(item.medicalRecords.relationshipType)}</Text>
                                                : <View></View>
                                        }
                                    </View>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        item.medicalRecords.statusConfirm == "WAIT_CONFIRM" ?
                                            (<Text>Chờ xác nhận</Text>) : (<View></View>)
                                    }
                                    <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onShowOptions(item.medicalRecords.id, item.medicalRecords.sharePermission, item.medicalRecords.medicalRelatedId ? item.medicalRecords.medicalRelatedId : null)}>
                                        <ScaledImage height={20} width={20} source={require('@images/new/profile/ic_three_dot.png')}></ScaledImage>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                    </View>
                        )
                )
        )
    }
    buttonAddShow = true;
    render() {
        return (
            <ActivityPanel
                title={'THÀNH VIÊN GIA ĐÌNH'}
                style={styles.container}
            // isLoading={this.state.refreshing}
            >
                <FlatList
                    onScroll={(e) => {
                        if (e.nativeEvent.contentOffset.y > 0) {
                            if (this.top < e.nativeEvent.contentOffset.y) {
                                console.log('down');
                                if (this.buttonAddShow) {
                                    this.buttonAddShow = false;
                                    this.buttonAdd.slideInUp(2000);
                                }
                            } else {
                                console.log('up');
                                if (!this.buttonAddShow) {
                                    this.buttonAddShow = true;
                                    this.buttonAdd.slideOutDown(2000);
                                }
                            }
                        }
                        else {
                            console.log('up');
                            if (!this.buttonAddShow) {
                                this.buttonAddShow = true;
                                this.buttonAdd.fadeOutLeft(2000);
                            }
                        }
                        this.top = e.nativeEvent.contentOffset.y
                    }}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    renderItem={({ item, index }) => {
                        return this.renderItem(item, index)
                    }}
                    ListHeaderComponent={() =>
                        !this.state.refreshing &&
                            (!this.state.data || this.state.data.length == 0) ? (
                                <View style={{ alignItems: "center", marginTop: 50 }}>
                                    <Text style={{ fontStyle: "italic" }}>
                                        {constants.none_info}
                                    </Text>
                                </View>
                            ) : null
                    }
                ></FlatList>
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={this.onCloseModal}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={styles.viewModal}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <View style={styles.viewPopup}>
                        <Text style={styles.txNotifi}>{'Bạn có chắc chắn muốn xóa thành viên này?'}</Text>
                        <View style={styles.viewBtn}>
                            <TouchableOpacity onPress={this.onClickDone} style={styles.btnDone}><Text style={styles.txDone}>Đồng ý</Text></TouchableOpacity>
                            <TouchableOpacity onPress={this.onCloseModal} style={styles.btnReject}><Text style={styles.txDone}>Hủy</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <ActionSheet
                    ref={o => this.actionSheetOptions = o}
                    options={['Cài đặt chia sẻ', 'Xóa', 'Hủy']}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={1}
                    onPress={this.onSetOptions}
                />
                <Animatable.View ref={ref => this.buttonAdd = ref} animation={"rotate"} style={{ position: 'absolute', right: 20, bottom: 20 }}>
                    <Card style={{ backgroundColor: '#02C39A', borderRadius: 30 }}>
                        <TouchableOpacity onPress={() => NavigationService.navigate('createProfile')} style={{ backgroundColor: '#02C39A', borderRadius: 30, width: 60, margin: -1, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="add" style={{ color: '#FFF' }}></Icon>
                        </TouchableOpacity>
                    </Card>
                </Animatable.View >
            </ActivityPanel >

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    txId: {
        color: '#000'
    },
    btn: {
        paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#359A60', borderRadius: 5, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginHorizontal: 10, marginLeft: 12, marginBottom: 20, marginTop: 10
    },
    txNotifi: { fontSize: 18, color: '#000', textAlign: 'center', marginHorizontal: 40 },

    viewPopup: { backgroundColor: '#fff', marginHorizontal: 20, paddingVertical: 40, borderRadius: 5 },
    viewModal: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    txBtn: { color: '#fff', fontSize: 16 },
    cardView: {
        paddingHorizontal: 10,
        minHeight: 60,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#01BF88',
        justifyContent: 'center'
    },
    txName: { color: '#02C39A', fontWeight: '500', fontSize: 15, maxWidth: 200 },
    txDelelte: { color: '#C4C4C4', fontSize: 10 },
    txLabel: { color: '#02C39A' },
    btnDone: { justifyContent: 'center', alignItems: 'center', height: 30, width: 78, backgroundColor: '#359A60', borderRadius: 5, },
    btnReject: { justifyContent: 'center', alignItems: 'center', height: 30, width: 78, marginLeft: 10, borderRadius: 5, backgroundColor: '#FFB800', },
    viewBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    txDone: { color: '#fff' },
    viewProfileUser: {
        // backgroundColor: '#01BE84',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        // padding: 10,
        marginVertical: 20,
        marginLeft: 10,
        flex: 1,
        minHeight: 50,
        justifyContent: 'center'
    },
    txProfileUser: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
    viewProfileFamily: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    viewGradientUser: {
        flex: 1, justifyContent: 'center',
        borderTopLeftRadius: 10,
        padding: 10,
        borderBottomLeftRadius: 10,
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ListProfileScreen);