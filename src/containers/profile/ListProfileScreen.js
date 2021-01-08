import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from "@components/ActivityPanel";
import { Card } from 'native-base';
import { connect } from "react-redux";
import constants from '@resources/strings';
import profileProvider from '@data-access/profile-provider'
import Modal from '@components/modal';
import NavigationService from "@navigators/NavigationService";
import ActionSheet from 'react-native-actionsheet'
import snackbar from "@utils/snackbar-utils";
import ImageLoad from 'mainam-react-native-image-loader';
import dateUtils from 'mainam-react-native-date-utils';
import CustomMenu from '@components/CustomMenu'

import { CheckBox } from 'native-base'
class ListProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            isVisible: false,
        };
    }
    onShowOptions = (item) => {
        this.actionSheetOptions.show();
        this.setState({
            idProfile: item.medicalRecords.id,
            medicalRelatedId: item.medicalRecords.medicalRelatedId ? item.medicalRecords.medicalRelatedId : null,
            permission: item.medicalRecords.permission,
            medicalName: item.medicalRecords.name
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

                    this.setState({
                        isVisibleShare: true,
                        ehealth: this.state.permission && this.state.permission.indexOf('YBDT') >= 0 ? true : false,
                        permissionsOld: this.state.permission,
                        id: this.state.idProfile,
                        shareId: this.state.medicalRelatedId,
                        reset: 2
                    })
                    // NavigationService.navigate("shareDataProfile", {
                    //     shareId: this.state.medicalRelatedId,
                    //     id: this.state.idProfile,
                    //     permission: this.state.permission
                    // })
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

    updatePermission = () => {
        let id = this.state.id
        let shareId = this.state.shareId
        let permissions
        if (!this.state.ehealth) {
            permissions = ''
        }
        if (this.state.ehealth) {
            permissions = 'YBDT'
        }
        let data = {
            "recordId": id ? id : shareId,
            "shareId": id ? shareId : null,
            "permissions": permissions
        }

        profileProvider.sharePermission(data).then(res => {
            if (res.code == 0 && res.data) {
                snackbar.show(constants.msg.user.setting_share_success, 'success')
                this.onCloseModal()
                this.onLoad()
                // NavigationService.navigate('listProfileUser', { reset: this.state.reset + 1 })
            } else {
                snackbar.show(constants.msg.notification.error_retry, 'danger')
            }
        }).catch(err => {
            snackbar.show(constants.msg.notification.error_retry, 'danger')

        })

    }
    renderTitle = (item) => {
        if (item == 'ACTIVE') {
            return ('Thành viên gia đình')
        }
        if (item == 'WAIT_CONFIRM' || item == 'NEED_CONFIRM') {
            return ('Thành viên chờ xác nhận')
        }
    }
    onLoad = () => {
        profileProvider.getListProfile().then(s => {
            this.setState({
                refreshing: false,
            }, () => {
                switch (s.code) {
                    case 0:
                        if (s.data && s.data.length) {
                            // s.data.sort((a, b) => b.medicalRecords.statusConfirm.localeCompare(a.medicalRecords.statusConfirm))
                            var group = s.data.map((item) => item.medicalRecords.statusConfirm).filter((item, i, ar) => ar.indexOf(item) === i).map(item => {
                                let new_list = s.data.filter(itm => itm.medicalRecords.statusConfirm == item);

                                return { title: this.renderTitle(item), data: new_list, status: item }
                            });
                            var indexNeed = group.findIndex(obj => obj.status === 'NEED_CONFIRM')
                            var indexWait = group.findIndex(obj => obj.status === 'WAIT_CONFIRM')
                            var indexActive = group.findIndex(obj => obj.status === 'ACTIVE')

                            var itemNeed = group[indexNeed]
                            var itemWait = group[indexWait]
                            var itemActive = group[indexActive]
                            if (itemActive) {
                                if (itemNeed && itemWait) {
                                    let dataWait = itemWait.data

                                    let dataNeed = itemNeed.data

                                    dataWait = dataWait.concat(dataNeed)

                                    itemWait.data = dataWait
                                    var newData = [
                                        itemWait, itemActive,
                                    ]

                                    let itemOwer = itemActive && itemActive.data.find(item => item.medicalRecords.status == 1)
                                    this.setState({
                                        data: [...newData],
                                        itemOwer
                                    });

                                } else if (!itemWait && itemNeed) {

                                    itemWait = itemNeed
                                    itemWait.status = 'WAIT_CONFIRM'
                                    var newData = [
                                        itemWait, itemActive,
                                    ]

                                    let itemOwer = itemActive && itemActive.data.find(item => item.medicalRecords.status == 1)

                                    this.setState({
                                        data: [...newData],
                                        itemOwer
                                    });

                                }
                                else if (itemWait && !itemNeed) {
                                    var newData = [
                                        itemWait, itemActive,
                                    ]
                                    let itemOwer = itemActive && itemActive.data.find(item => item.medicalRecords.status == 1)


                                    this.setState({
                                        data: [...newData],
                                        itemOwer
                                    });
                                }
                                else if (!itemWait && !itemNeed && itemActive) {
                                    var newData = [itemActive]

                                    let itemOwer = itemActive && itemActive.data.find(item => item.medicalRecords.status == 1)

                                    this.setState({
                                        data: [...newData],
                                        itemOwer
                                    });
                                }
                                else {
                                    this.setState({
                                        data: [],

                                    });
                                }
                            } else {
                                if (itemNeed && itemWait) {
                                    let dataWait = itemWait.data

                                    let dataNeed = itemNeed.data

                                    dataWait = dataWait.concat(dataNeed)

                                    itemWait.data = dataWait
                                    var newData = [
                                        itemWait,
                                    ]

                                    this.setState({
                                        data: [...newData],
                                    });

                                } else if (!itemWait && itemNeed) {

                                    itemWait = itemNeed
                                    itemWait.status = 'WAIT_CONFIRM'
                                    var newData = [
                                        itemWait,
                                    ]


                                    this.setState({
                                        data: [...newData],
                                    });

                                }
                                else if (itemWait && !itemNeed) {
                                    var newData = [
                                        itemWait,
                                    ]


                                    this.setState({
                                        data: [...newData],
                                    });
                                }
                                else {
                                    this.setState({
                                        data: [],

                                    });
                                }
                            }
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
    onClickItem = (item) => () => {
        NavigationService.navigate('profile', { id: item.medicalRecords.id })
    }
    onDeleteItem = (item) => {
        this.setState({
            idProfile: item?.medicalRecords?.id || null,
            medicalName: item?.medicalRecords?.name || null,
            isVisible: true
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
                    snackbar.show(constants.msg.user.remove_success, 'success')
                    return
                } if (res.code == 4) {
                    snackbar.show(constants.msg.user.profile_can_not_delete, 'danger')
                    return
                } else {
                    snackbar.show(constants.msg.notification.error_retry, 'danger')
                }

            }).catch(err => {
                this.setState({
                    isVisible: false
                })
                snackbar.show(constants.msg.notification.error_retry, 'danger')
            })
    }
    onCloseModal = () => {
        this.setState({
            isVisible: false,
            isVisibleShare: false
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
                        shareId: id,
                        id: medicalRelatedId,
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
                    snackbar.show(constants.msg.user.confirm_fail, 'danger')
                }
            }).catch(err => {
                this.setState({
                    disabled: false

                })
                snackbar.show(constants.msg.user.confirm_fail, 'danger')
            })
        })

    }
    renderRelation = (type) => {
        switch (type) {
            case 'DAD':
                return 'Cha'
            case 'MOTHER':
                return 'Mẹ'
            case 'BOY':
                return 'Con trai'
            case 'DAUGHTER':
                return 'Con gái'
            case 'GRANDSON':
                return 'Cháu trai'
            case 'NIECE':
                return 'Cháu gái'
            case 'GRANDFATHER':
                return 'Ông'
            case 'GRANDMOTHER':
                return 'Bà'
            case 'WIFE':
                return 'Vợ'
            case 'HUSBAND':
                return 'Chồng'
            case 'OTHER':
                return 'Khác'
            default:
                return ''
        }
    }
    renderLabel = (item, index) => {
        if (index == 0 && item.medicalRecords.statusConfirm == 'WAIT_CONFIRM') {
            let b = []
            // 
            b.push(this.state.data.find(a => a.medicalRecords.statusConfirm == 'WAIT_CONFIRM'))
            return (
                <View style={{ marginTop: 20 }}>
                    <Text>Thành viên chờ xác nhận ({b && b.length})</Text>
                </View>
            )

        } else if (item.medicalRecords.statusConfirm == 'ACTIVE') {
            let b = []
            // 
            b.push(this.state.data.find(a => a.medicalRecords.statusConfirm == 'ACTIVE'))
            return (
                <View>
                    <Text>Thành viên gia đình ({b && b.length})</Text>
                </View>
            )
        }
    }
    onSelectOptions = (options, item, index) => {
        switch (options.id) {
            case 1: {
                this.setState({
                    isVisibleShare: true,
                    ehealth: item.medicalRecords.permission && item.medicalRecords.permission.indexOf('YBDT') >= 0 ? true : false,
                    permissionsOld: item.medicalRecords.permission,
                    id: item.medicalRecords.id,
                    shareId: item.medicalRecords.medicalRelatedId ? item.medicalRecords.medicalRelatedId : null,
                    reset: 2
                })
            }
                break
            case 2: {
                this.onEditProfile(item)
            }
                break
            case 3: {
                this.setState(
                    {
                        idProfile: item.medicalRecords.id,
                        medicalName: item.medicalRecords.name,
                        isVisible: true,

                    });
            }
                break
        }
    }
    renderItem = ({ item, index }) => {
        let age = item?.medicalRecords?.dob ? new Date().getFullYear() - item?.medicalRecords?.dob?.toDateObject('-').getFullYear() : null

        switch (item.medicalRecords.statusConfirm) {

            case 'WAIT_CONFIRM': return (
                // <View>
                //     {
                //         this.renderLabel(item, index)
                //     }
                <View style={[styles.cardItem, styles.colorGray]}>
                    <View style={styles.viewProfileUser}>
                        <View style={styles.viewItemWait}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={styles.imageStyle}
                                borderRadius={35}
                                customImagePlaceholderDefaultStyle={[styles.avatar, styles.image]}
                                placeholderSource={require("@images/new/user.png")}
                                resizeMode="cover"
                                loadingStyle={{ size: 'small', color: 'gray' }}
                                source={{ uri: item?.medicalRecords?.avatar?.absoluteUrl() || '' }}
                                style={styles.imgLoad}
                                defaultImage={() => {
                                    return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={60} height={60} />
                                }}
                            />
                            <View style={styles.viewContent}>
                                <Text style={styles.txNameWait}><Text style={styles.fontBold}>{item.medicalRecords.name}</Text> bạn đã gửi yêu cầu xác nhận mối quan hệ</Text>
                                <Text style={styles.txPhoneWait}>SĐT {item?.medicalRecords?.phone}</Text>
                                <View style={styles.viewBtnWait}>
                                    <TouchableOpacity disabled onPress={() => this.onConfirm(item.medicalRecords.id, item.medicalRecords.sharePermission, item.medicalRecords.medicalRelatedId)} style={styles.btnAcceptWait}>
                                        <Text style={styles.txWait}>Chờ xác nhận</Text>
                                    </TouchableOpacity><TouchableOpacity onPress={() => this.onDeleteItem(item)} style={styles.btnRejectWait}>
                                        <Text style={styles.txRejectWait}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
                // <Card style={styles.cardItem}>

                //     <TouchableOpacity onPress={this.onClickItem(item)} style={viewProfileUser}>
                //         <View style={{flexDirection:'row',alignItems:'center',}}>

                //             <View>
                //                 <Text style={styles.txName}>{item.medicalRecords.name}</Text>
                //                 {
                //                     item.medicalRecords.relationshipType ?
                //                         <Text style={styles.txtRelationshipType}>Quan hệ: {this.renderRelation(item.medicalRecords.relationshipType)}</Text>
                //                         : <View></View>
                //                 }
                //             </View>

                //             <View style={{ flexDirection: 'row' }}>
                //                 {
                //                     item.medicalRecords.statusConfirm == "WAIT_CONFIRM" ?
                //                         (<Text>Chờ xác nhận</Text>) : (<View></View>)
                //                 }
                //                 <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onShowOptions(item.medicalRecords.id, item.medicalRecords.permission, item.medicalRecords.medicalRelatedId ? item.medicalRecords.medicalRelatedId : null)}>
                //                     <ScaledImage height={20} width={20} source={require('@images/new/profile/ic_three_dot.png')}></ScaledImage>
                //                 </TouchableOpacity>
                //             </View>
                //         </View>
                //     </TouchableOpacity>
                // </Card>
            )
            case 'NEED_CONFIRM': return (
                <View style={[styles.cardItem, { backgroundColor: '#F8F8F8' }]}>
                    <View style={styles.viewProfileUser}>
                        <View style={styles.viewNeedConfirm}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={styles.imageStyle}
                                borderRadius={35}
                                customImagePlaceholderDefaultStyle={[styles.avatar, styles.image]}
                                placeholderSource={require("@images/new/user.png")}
                                resizeMode="cover"
                                loadingStyle={{ size: 'small', color: 'gray' }}
                                source={{ uri: item?.medicalRecords?.avatar?.absoluteUrl() || '' }}
                                style={styles.imgLoad}
                                defaultImage={() => {
                                    return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={60} height={60} />
                                }}
                            />
                            <View style={styles.viewContentNeed}>
                                <Text style={styles.viewTxNeed}><Text style={styles.fontBold}>{item.medicalRecords.name}</Text> muốn xác nhận mối quan hệ với bạn</Text>
                                <Text style={styles.txPhoneNeed}>SĐT {item?.medicalRecords?.phone}</Text>
                                <View style={styles.viewBtnNeed}>
                                    <TouchableOpacity onPress={() => this.onConfirm(item.medicalRecords.id, item.medicalRecords.sharePermission, item.medicalRecords.medicalRelatedId)} style={styles.btnNeed}>
                                        <Text style={styles.txNeed}>Xác nhận</Text>
                                    </TouchableOpacity><TouchableOpacity onPress={() => this.onDeleteItem(item)} style={styles.btnRejectNeed}>
                                        <Text style={styles.txDeleteNeed}>Xóa</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                // <Card style={styles.cardItem}>

                //     <TouchableOpacity onPress={this.onClickItem(item)} style={viewProfileUser}>
                //         <View style={{flexDirection:'row',alignItems:'center',}}>

                //             <View>
                //                 <Text style={styles.txName}>{item.medicalRecords.name}</Text>
                //                 {
                //                     item.medicalRecords.relationshipType ?
                //                         <Text style={styles.txtRelationshipType}>Quan hệ: {this.renderRelation(item.medicalRecords.relationshipType)}</Text>
                //                         : <View></View>
                //                 }
                //             </View>

                //             <View style={{ flexDirection: 'row' }}>
                //                 {
                //                     item.medicalRecords.statusConfirm == "WAIT_CONFIRM" ?
                //                         (<Text>Chờ xác nhận</Text>) : (<View></View>)
                //                 }
                //                 <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onShowOptions(item.medicalRecords.id, item.medicalRecords.permission, item.medicalRecords.medicalRelatedId ? item.medicalRecords.medicalRelatedId : null)}>
                //                     <ScaledImage height={20} width={20} source={require('@images/new/profile/ic_three_dot.png')}></ScaledImage>
                //                 </TouchableOpacity>
                //             </View>
                //         </View>
                //     </TouchableOpacity>
                // </Card>
            )
            case 'ACTIVE': return (
                <Card style={styles.cardItem}>
                    <TouchableOpacity onPress={this.onClickItem(item)} style={styles.viewProfileUser}>
                        <View style={styles.viewActive}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={styles.imageStyle}
                                borderRadius={35}
                                customImagePlaceholderDefaultStyle={[styles.avatar, styles.image]}
                                placeholderSource={require("@images/new/user.png")}
                                resizeMode="cover"
                                loadingStyle={{ size: 'small', color: 'gray' }}
                                source={{ uri: item?.medicalRecords?.avatar?.absoluteUrl() || '' }}
                                style={styles.imgLoad}
                                defaultImage={() => {
                                    return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={60} height={60} />
                                }}
                            />
                            <View style={styles.viewItemActive}>
                                <Text style={styles.nameActive}>{item.medicalRecords.name}{item?.medicalRecords?.status == 1 ? ' (Chủ tài khoản)' : this.renderRelation(item.medicalRecords.relationshipType)}</Text>
                                {item?.medicalRecords?.phone && <Text style={styles.phoneActive}>SĐT {item.medicalRecords.phone}</Text>}
                                <Text style={styles.dobActive}>{item?.medicalRecords?.value && item?.medicalRecords?.hospitalName ? item?.medicalRecords?.hospitalName : ''}</Text>
                                {/* <Text style={styles.dobActive}>{'Mã bệnh nhân: '}{item?.medicalRecords?.value}</Text> */}

                            </View>
                            <CustomMenu
                                textStyle={{ color: '#ff0000' }}
                                MenuSelectOption={
                                    <View style={styles.buttonMenu}>
                                        <ScaledImage
                                            source={require('@images/new/ic_more.png')}
                                            height={12}
                                            style={{ resizeMode: 'contain' }}
                                        />
                                    </View>
                                }
                                options={[{ value: 'Cài đặt chia sẻ', id: 1 }, { value: 'Sửa thông tin', id: 2 }, { value: 'Xoá thành viên', id: 3, color: '#ff0000' }]}
                                onSelected={(options) => this.onSelectOptions(options, item, index)}
                            />
                            {/* {item?.medicalRecords?.status !== 1 ? <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onShowOptions(item)}>
                                <ScaledImage height={20} width={20} source={require('@images/new/profile/ic_dots.png')}></ScaledImage>
                            </TouchableOpacity> : <View></View>} */}
                        </View>

                    </TouchableOpacity>
                </Card>
            )
            default: return (
                <Card style={styles.cardItem}>
                    <TouchableOpacity onPress={this.onClickItem(item)} style={styles.viewProfileUser}>
                        <View style={styles.viewActive}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={styles.imageStyle}
                                borderRadius={35}
                                customImagePlaceholderDefaultStyle={[styles.avatar, styles.image]}
                                placeholderSource={require("@images/new/user.png")}
                                resizeMode="cover"
                                loadingStyle={{ size: 'small', color: 'gray' }}
                                source={{ uri: item?.medicalRecords?.avatar?.absoluteUrl() || '' }}
                                style={styles.imgLoad}
                                defaultImage={() => {
                                    return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={60} height={60} />
                                }}
                            />
                            <View style={styles.viewItemActive}>
                                <Text style={styles.nameActive}>{item.medicalRecords.name}{item?.medicalRecords?.status == 1 ? ' (Chủ tài khoản)' : this.renderRelation(item.medicalRecords.relationshipType)}</Text>
                                <Text style={styles.phoneActive}>SĐT {item?.medicalRecords?.phone}</Text>
                                <Text style={styles.dobActive}>{item?.medicalRecords?.dob?.toDateObject('-').format('dd/MM/yyyy') || ''} - {item?.medicalRecords?.dob ? new Date().getFullYear() - item?.medicalRecords?.dob?.toDateObject('-').getFullYear() + ' tuổi' : ''}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Card>
                // <Card style={styles.cardItem}>

                //     <TouchableOpacity onPress={this.onClickItem(item)} style={viewProfileUser}>
                //         <View style={{flexDirection:'row',alignItems:'center',}}>

                //             <View>
                //                 <Text style={styles.txName}>{item.medicalRecords.name}</Text>
                //                 {
                //                     item.medicalRecords.relationshipType ?
                //                         <Text style={styles.txtRelationshipType}>Quan hệ: {this.renderRelation(item.medicalRecords.relationshipType)}</Text>
                //                         : <View></View>
                //                 }
                //             </View>

                //             <View style={{ flexDirection: 'row' }}>
                //                 {
                //                     item.medicalRecords.statusConfirm == "WAIT_CONFIRM" ?
                //                         (<Text>Chờ xác nhận</Text>) : (<View></View>)
                //                 }
                //                 <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onShowOptions(item.medicalRecords.id, item.medicalRecords.permission, item.medicalRecords.medicalRelatedId ? item.medicalRecords.medicalRelatedId : null)}>
                //                     <ScaledImage height={20} width={20} source={require('@images/new/profile/ic_three_dot.png')}></ScaledImage>
                //                 </TouchableOpacity>
                //             </View>
                //         </View>
                //     </TouchableOpacity>
                // </Card>
            )
        }

    }
    buttonAddShow = true;
    keyExtractor = (item, index) => index.toString()
    footerComponent = () => <View style={{ height: 50 }}></View>
    headerComponent = () => {
        return (
            !this.state.refreshing &&
                (!this.state.data || this.state.data && this.state.data.length == 0) ? (
                    <View style={styles.containerNotfound}>
                        <Text style={styles.txtNotfound}>
                            {constants.none_info}
                        </Text>
                    </View>
                ) : null
        )
    }
    shareEhealth = () => {
        this.setState({
            ehealth: !this.state.ehealth
        })
    }
    onCreate = (isCreate) => {
        if (isCreate) {
            this.onLoad()
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.userApp.currentUser) {
            this.onLoad()
        }
    }
    onEdit(isEdit) {
        debugger
        if (isEdit) {
            this.onLoad()
        }
    }
    onEditProfile = (item) => {

        if (this.props.userApp.currentUser.accountSource == 'VENDOR') {
            this.props.navigation.replace('editProfileUsername', {
                dataOld: item,
                // onEdit: this.onEdit.bind(this)
            })
        }
        else
            this.props.navigation.navigate('createProfile', {
                dataOld: item,
                onEdit: this.onEdit.bind(this)
            })
    }
    createProfile = () => {
        let itemOwer = this.state.itemOwer ? this.state.itemOwer.medicalRecords : null
        let age = itemOwer.dob ? new Date().getFullYear() - itemOwer.dob.toDateObject('-').getFullYear() : null

        if (itemOwer && (age || age == 0) && (itemOwer.gender || itemOwer.gender == 0) && itemOwer.address && itemOwer.name && itemOwer.phone) {
            if (age < 14 && itemOwer.guardianPassport || age >= 14 && itemOwer.passport) {
                NavigationService.navigate('createProfile', {
                    onCreate: this.onCreate.bind(this)
                })
            } else {
                this.props.navigation.navigate('createProfile', {
                    dataOld: this.state.itemOwer,
                    onCreate: this.onCreate.bind(this),
                    badInfo: true
                })
            }
        } else {
            this.props.navigation.navigate('createProfile', {
                dataOld: this.state.itemOwer,
                onCreate: this.onCreate.bind(this),
                badInfo: true
            })
        }


    }
    renderBtn = () => {
        let accountSource = this.props.userApp.currentUser.accountSource
        if (accountSource !== "VENDOR") {
            return (
                <TouchableOpacity style={styles.btnAdd} onPress={this.createProfile}>
                    <ScaledImage style={styles.iconEdit} height={25} source={require('@images/new/profile/ic_add_profile.png')}></ScaledImage>
                </TouchableOpacity>
            )
        } else {
            return
        }
    }
    render() {
        return (
            <ActivityPanel
                title={'Thành viên gia đình'}
                style={styles.container}
                titleStyle={styles.titleStyle}
                containerStyle={styles.containerStyle}
                menuButton={this.renderBtn()}
            >
                <SectionList
                    showsVerticalScrollIndicator={false}
                    sections={this.state.data || []}
                    extraData={this.state}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    renderItem={this.renderItem}
                    ListFooterComponent={this.footerComponent}
                    renderSectionHeader={({ section: { title, data } }) => (
                        <View style={styles.viewTittle}>
                            <Text style={styles.header}>{title + ` (${data && data.length})`}</Text>
                        </View>
                    )}
                    ListHeaderComponent={this.headerComponent}
                ></SectionList>
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
                        <Text style={styles.txNotifi}>{`Bạn có chắc chắn muốn xoá thành viên ${this.state.medicalName} ?`}</Text>
                        <View style={styles.viewBtn}>
                            <TouchableOpacity onPress={this.onCloseModal} style={styles.btnReject}><Text style={styles.txReject}>{constants.actionSheet.cancel}</Text></TouchableOpacity>
                            <TouchableOpacity onPress={this.onClickDone} style={styles.btnDone}><Text style={styles.txDone}>{'Xác nhận'}</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.isVisibleShare}
                    onBackdropPress={this.onCloseModal}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={styles.viewModal}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <View style={styles.viewPopupShare}>
                        <Text style={styles.txNotifi}>{constants.msg.user.select_data_need_share}</Text>
                        <View style={styles.viewBtn}>
                            {this.state.ehealth ? <TouchableOpacity onPress={this.shareEhealth} style={{ padding: 5 }}>
                                <ScaledImage source={require('@images/new/profile/ic_checked.png')} height={20}></ScaledImage>
                            </TouchableOpacity> : <TouchableOpacity onPress={this.shareEhealth} style={{ padding: 5 }}>
                                    <ScaledImage source={require('@images/new/profile/ic_unCheck.png')} height={20}></ScaledImage>
                                </TouchableOpacity>}
                            <Text style={styles.txSelected}>{constants.ehealth.my_ehealth}</Text>
                        </View>
                        <TouchableOpacity onPress={this.updatePermission} style={styles.btnShare}><Text style={styles.txDone}>{'Xác nhận'}</Text></TouchableOpacity>

                    </View>
                </Modal>
                {/* <ActionSheet
                    ref={o => this.actionSheetOptions = o}
                    options={['Cài đặt chia sẻ', 'Xóa', 'Hủy']}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={1}
                    onPress={this.onSetOptions}
                /> */}
                {/* <Animatable.View ref={ref => this.buttonAdd = ref} animation={"rotate"} style={styles.containerButtonAdd}>
                    <Card style={styles.card}>
                        <TouchableOpacity onPress={this.createProfile} style={styles.buttonAdd}>
                            <ScaledImage height={25} source={require('@images/new/profile/ic_add.png')}></ScaledImage>
                        </TouchableOpacity>
                    </Card>
                </Animatable.View> */}
            </ActivityPanel>

        );
    }
}
const styles = StyleSheet.create({
    cardItem: {
        padding: 10,
        borderRadius: 6,
        margin: 5
    },
    image: { width: 70, height: 70 },
    imgLoad: {
        alignSelf: 'center',
        borderRadius: 35,
        width: 70,
        height: 70
    },
    viewTittle: { backgroundColor: '#f8f8f8', flex: 1 },
    header: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold'
    },
    imageStyle: {
        borderRadius: 35, borderWidth: 0.5, borderColor: '#27AE60',
    },
    iconEdit: {
        tintColor: '#fff',
        marginRight: 10
    },
    containerButtonAdd: {
        position: 'absolute',
        right: 20,
        bottom: 20
    },
    txSelected: {
        color: '#000',
        fontSize: 14,
        marginHorizontal: 10
    },
    iconAdd: { color: '#FFF' },
    buttonAdd: {
        backgroundColor: '#02C39A',
        borderRadius: 30,
        width: 60,
        margin: -1,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txReject: { color: '#000' },
    card: {
        backgroundColor: '#02C39A',
        borderRadius: 30
    },
    txtNotfound: { fontStyle: "italic" },
    containerNotfound: {
        alignItems: "center",
        marginTop: 50
    },
    txtRelationshipType: {
        color: '#02C293',
        fontSize: 14
    },
    txtmedicalRecords: {
        color: 'red',
        marginTop: 10,
        fontSize: 14,
        marginHorizontal: 12,
        textAlign: 'center'
    },
    txtRelationShip: {
        color: '#868686',
        fontSize: 14
    },
    container: {
        flex: 1,
    },
    txId: {
        color: '#000'
    },
    btn: {
        paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#359A60', borderRadius: 5, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginHorizontal: 10, marginLeft: 12, marginBottom: 20, marginTop: 10
    },
    txNotifi: { fontSize: 14, color: '#000', textAlign: 'center', marginHorizontal: 40 },

    viewPopup: { backgroundColor: '#fff', marginHorizontal: 20, paddingVertical: 10, borderRadius: 5 },
    viewPopupShare: { backgroundColor: '#fff', marginHorizontal: 20, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5 },

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
    btnShare: { justifyContent: 'center', marginTop: 30, alignItems: 'center', height: 42, width: 254, backgroundColor: '#00CBA7', borderRadius: 5, },
    btnDone: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, marginLeft: 10, backgroundColor: '#00CBA7', borderRadius: 5, },
    btnReject: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, width: 78, borderRadius: 5, backgroundColor: '#fff', borderColor: '#00000050', borderWidth: 1 },
    viewBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    txDone: { color: '#fff' },
    viewProfileUser: {
        // backgroundColor: '#01BE84',
        flex: 1,
        // alignItems:'center'
    },
    txProfileUser: {
        fontSize: 14,
        color: '#000',
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
    },
    colorGray: { backgroundColor: '#F8F8F8' },
    viewItemWait: { flexDirection: 'row', alignItems: 'center', },
    viewContent: { marginLeft: 10, flex: 1 },
    txNameWait: { fontSize: 16, color: '#000', },
    fontBold: { fontSize: 16, fontWeight: 'bold' },
    txPhoneWait: { fontSize: 14, fontWeight: 'bold', color: '#00000050', marginVertical: 5 },
    viewBtnWait: { flexDirection: 'row', alignItems: 'center' },
    btnAcceptWait: { backgroundColor: '#BABABA', borderRadius: 50, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'center', alignItems: 'center' },
    txWait: { fontSize: 14, color: '#fff' },
    btnRejectWait: { backgroundColor: '#fff', marginLeft: 10, borderWidth: 1, borderColor: '#000', borderRadius: 50, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'center', alignItems: 'center' },
    txRejectWait: { fontSize: 14, color: '#000' },
    viewNeedConfirm: { flexDirection: 'row', alignItems: 'center', },
    viewContentNeed: { marginLeft: 10, flex: 1 },
    viewTxNeed: { fontSize: 16, color: '#000', },
    txPhoneNeed: { fontSize: 14, fontWeight: 'bold', color: '#00000050', marginVertical: 5 },
    viewBtnNeed: { flexDirection: 'row', alignItems: 'center' },
    btnNeed: { backgroundColor: '#00CBA7', borderRadius: 50, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'center', alignItems: 'center' },
    txNeed: { fontSize: 14, color: '#fff' },
    btnRejectNeed: { backgroundColor: '#fff', marginLeft: 10, borderWidth: 1, borderColor: '#000', borderRadius: 50, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'center', alignItems: 'center' },
    txDeleteNeed: { fontSize: 14, color: '#000' },
    viewActive: { flexDirection: 'row', alignItems: 'center', },
    viewItemActive: { marginLeft: 10, flex: 1 },
    nameActive: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    phoneActive: { fontSize: 14, fontWeight: 'bold', color: '#00000050', marginVertical: 5 },
    dobActive: { fontSize: 15, fontWeight: 'bold', color: '#00CBA7' },
    titleStyle: { marginLeft: 50 },
    containerStyle: { paddingHorizontal: 10, backgroundColor: '#f8f8f8' },
    btnAdd: {
        padding: 5
    },
    buttonMenu: {
        padding: 5
    },
})
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(ListProfileScreen);