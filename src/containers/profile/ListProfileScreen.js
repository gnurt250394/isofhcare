import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from '@components/ActivityPanel';
import {Card} from 'native-base';
import {connect} from 'react-redux';
import constants from '@resources/strings';
import profileProvider from '@data-access/profile-provider';
import Modal from '@components/modal';
import NavigationService from '@navigators/NavigationService';
import ActionSheet from 'react-native-actionsheet';
import snackbar from '@utils/snackbar-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import dateUtils from 'mainam-react-native-date-utils';
import CustomMenu from '@components/CustomMenu';
import SelectRelation from '@components/profile/SelectRelation';

import {CheckBox} from 'native-base';
import objectUtils from '@utils/object-utils';
import ListInvite from '@components/profile/ListInvite';
class ListProfileScreen extends Component {
  constructor(props) {
    super(props);
    let isNoti = this.props.navigation.getParam('isNoti');
    this.state = {
      data: [],
      refreshing: false,
      size: 10,
      page: 1,
      isVisible: false,
      isVisibleRelation: false,
      listInvite: [],
      isShow: isNoti == true ? false : true,
      isLoading: true,
      isNoti,
    };
  }
  onShowOptions = item => {
    this.actionSheetOptions.show();
    this.setState({
      idProfile: item.id,
      // medicalRelatedId: item.medicalRecords.medicalRelatedId ? item.medicalRecords.medicalRelatedId : null,
      // permission: item.medicalRecords.permission,
      medicalRelatedId: '',
      permission: '',
      medicalName: item?.profileInfo?.personal?.fullName,
    });
  };

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.onLoad();
      },
    );
  };
  onSetOptions = index => {
    try {
      switch (index) {
        case 0:
          this.setState({
            isVisibleShare: true,
            ehealth:
              this.state.permission &&
              this.state.permission.indexOf('YBDT') >= 0
                ? true
                : false,
            permissionsOld: this.state.permission,
            id: this.state.idProfile,
            shareId: this.state.medicalRelatedId,
            reset: 2,
          });
          // NavigationService.navigate("shareDataProfile", {
          //     shareId: this.state.medicalRelatedId,
          //     id: this.state.idProfile,
          //     permission: this.state.permission
          // })
          return;
        case 1:
          this.setState({
            isVisible: true,
          });
          return;
      }
    } catch (error) {}
  };
  componentDidMount() {
    this.onFocus = this.props.navigation.addListener('didFocus', payload => {
      this.onLoad();
    });
  }
  componentWillUnmount = () => {
    if (this.onFocus) {
      this.onFocus.remove();
    }
  };
  updatePermission = () => {
    let id = this.state.id;
    let shareId = this.state.shareId;
    let permissions;
    if (!this.state.ehealth) {
      permissions = '';
    }
    if (this.state.ehealth) {
      permissions = 'YBDT';
    }
    let data = {
      recordId: id ? id : shareId,
      shareId: id ? shareId : null,
      permissions: permissions,
    };

    profileProvider
      .sharePermission(data)
      .then(res => {
        if (res.code == 0 && res.data) {
          snackbar.show(constants.msg.user.setting_share_success, 'success');
          this.onCloseModal();
          this.onLoad();
          // NavigationService.navigate('listProfileUser', { reset: this.state.reset + 1 })
        } else {
          snackbar.show(constants.msg.notification.error_retry, 'danger');
        }
      })
      .catch(err => {
        snackbar.show(constants.msg.notification.error_retry, 'danger');
      });
  };
  renderTitle = item => {
    if (item == 'ACTIVE') {
      return 'Thành viên gia đình';
    }
    if (item == 'WAIT_CONFIRM' || item == 'NEED_CONFIRM') {
      return 'Thành viên chờ xác nhận';
    }
  };
  onLoad = () => {
    profileProvider
      .getListProfile()
      .then(s => {
        this.setState(
          {
            refreshing: false,
            isLoading: false,
          },
          () => {
            if (s.length) {
              this.setState({
                data: s,
              });
            }
          },
        );
      })
      .catch(e => {
        this.setState({
          refreshing: false,
          isLoading: false,
        });
      });
  };
  onClickItem = item => () => {
    NavigationService.navigate('profile', {id: item.userProfileId});
  };
  onDeleteItem = item => {
    this.setState({
      idProfile: item?.medicalRecords?.id || null,
      medicalName: item?.medicalRecords?.name || null,
      isVisible: true,
    });
  };
  onClickDone = () => {
    this.state.idProfile &&
      profileProvider
        .deleteFamilyProfile(this.state.idProfile, this.state.userProfileId)
        .then(res => {
          this.setState({
            isVisible: false,
          });
          if (res) {
            this.onRefresh();
            snackbar.show(constants.msg.user.remove_success, 'success');
            return;
          }
          if (res.code == 4) {
            snackbar.show(constants.msg.user.profile_can_not_delete, 'danger');
            return;
          } else {
            snackbar.show(constants.msg.notification.error_retry, 'danger');
          }
        })
        .catch(err => {
          this.setState({
            isVisible: false,
          });

          if (typeof err?.response?.data?.message == 'string') {
            snackbar.show(err?.response?.data?.message, 'danger');
            return;
          }
          snackbar.show(constants.msg.notification.error_retry, 'danger');
        });
  };
  onCloseModal = () => {
    this.setState({
      isVisible: false,
      isVisibleShare: false,
      isVisibleRelation: false,
    });
  };
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.navigation.state.params &&
      nextProps.navigation.state.params.reset
    ) {
      this.onRefresh();
    }
  }
  onConfirm = (id, sharePermission, medicalRelatedId) => {
    this.setState(
      {
        disabled: true,
      },
      () => {
        profileProvider
          .confirm(id)
          .then(res => {
            if (res.code == 0) {
              NavigationService.navigate('shareDataProfile', {
                shareId: id,
                id: medicalRelatedId,
                sharePermission: sharePermission,
              });
              this.setState({
                disabled: false,
              });
              return;
            } else {
              this.setState({
                disabled: false,
              });
              snackbar.show(constants.msg.user.confirm_fail, 'danger');
            }
          })
          .catch(err => {
            this.setState({
              disabled: false,
            });
            snackbar.show(constants.msg.user.confirm_fail, 'danger');
          });
      },
    );
  };
  renderLabel = (item, index) => {
    if (index == 0 && item.medicalRecords.statusConfirm == 'WAIT_CONFIRM') {
      let b = [];
      //
      b.push(
        this.state.data.find(
          a => a.medicalRecords.statusConfirm == 'WAIT_CONFIRM',
        ),
      );
      return (
        <View style={{marginTop: 20}}>
          <Text>Thành viên chờ xác nhận ({b && b.length})</Text>
        </View>
      );
    } else if (item.medicalRecords.statusConfirm == 'ACTIVE') {
      let b = [];
      //
      b.push(
        this.state.data.find(a => a.medicalRecords.statusConfirm == 'ACTIVE'),
      );
      return (
        <View>
          <Text>Thành viên gia đình ({b && b.length})</Text>
        </View>
      );
    }
  };
  onSelectOptions = (options, item, index) => {
    switch (options.id) {
      case 1:
        {
          // this.setState({
          //     isVisibleShare: true,
          //     ehealth: item.medicalRecords.permission && item.medicalRecords.permission.indexOf('YBDT') >= 0 ? true : false,
          //     permissionsOld: item.medicalRecords.permission,
          //     id: item.medicalRecords.id,
          //     shareId: item.medicalRecords.medicalRelatedId ? item.medicalRecords.medicalRelatedId : null,
          //     reset: 2
          // })
        }
        break;
      case 2:
        {
          this.onEditProfile(item);
        }
        break;
      case 3:
        {
          this.setState({
            idProfile: item?.userProfileId,
            medicalName: item?.profileInfo?.personal?.fullName,
            isVisible: true,
            userProfileId: item?.userProfileId,
          });
        }
        break;
      case 4:
        {
          this.setState({
            idProfile: item?.userProfileId,
            profileInfo: item?.profileInfo,
            isVisibleRelation: true,
          });
        }
        break;
    }
  };
  renderItem = ({item, index}) => {
    let age = item?.profileInfo?.personal?.dateOfBirth
      ? new Date().getFullYear() -
        item?.profileInfo?.personal?.dateOfBirth
          ?.toDateObject('-')
          .getFullYear()
      : null;
    return (
      <Card style={styles.cardItem}>
        <TouchableOpacity
          onPress={this.onClickItem(item)}
          style={styles.viewProfileUser}>
          <View style={styles.viewActive}>
            <ImageLoad
              resizeMode="cover"
              imageStyle={styles.imageStyle}
              borderRadius={35}
              customImagePlaceholderDefaultStyle={[styles.avatar, styles.image]}
              placeholderSource={require('@images/new/user.png')}
              resizeMode="cover"
              loadingStyle={{size: 'small', color: 'gray'}}
              source={{
                uri: item?.profileInfo?.personal?.avatar?.absoluteUrl() || '',
              }}
              style={styles.imgLoad}
              defaultImage={() => {
                return (
                  <ScaleImage
                    resizeMode="cover"
                    source={require('@images/new/user.png')}
                    width={60}
                    height={60}
                  />
                );
              }}
            />
            <View style={styles.viewItemActive}>
              <Text textBreakStrategy="simple" style={styles.nameActive}>
                {item?.profileInfo?.personal?.fullName?.trim()}
              </Text>

              {item?.profileInfo?.personal?.mobileNumber && (
                <Text style={styles.phoneActive}>
                  SĐT {item?.profileInfo?.personal?.mobileNumber}
                </Text>
              )}
              <Text
                style={{color: '#3161AD', fontWeight: 'bold', fontSize: 15}}>
                {item.defaultProfile
                  ? 'Chủ tài khoản'
                  : objectUtils.renderTextRelations(item.relationshipType)}
              </Text>
            </View>
            <CustomMenu
              placement={'left'}
              textStyle={{color: '#ff0000'}}
              MenuSelectOption={
                <View style={styles.buttonMenu}>
                  <ScaledImage
                    source={require('@images/new/ic_more.png')}
                    height={12}
                    style={{resizeMode: 'contain'}}
                  />
                </View>
              }
              options={
                !item?.defaultProfile
                  ? this.props?.userApp?.currentUser.username != item.userId
                    ? [
                        {value: 'Cài đặt chia sẻ', id: 1},
                        {value: 'Sửa mối quan hệ', id: 4},
                        {value: 'Xoá thành viên', id: 3, color: '#ff0000'},
                      ]
                    : [
                        // {value: 'Cài đặt chia sẻ', id: 1},
                        {value: 'Sửa thông tin', id: 2},
                        {value: 'Sửa mối quan hệ', id: 4},
                        {value: 'Xoá thành viên', id: 3, color: '#ff0000'},
                      ]
                  : [{value: 'Sửa thông tin', id: 2}]
              }
              onSelected={options => this.onSelectOptions(options, item, index)}
            />
            {/* {item?.medicalRecords?.status !== 1 ? <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onShowOptions(item)}>
                                <ScaledImage height={20} width={20} source={require('@images/new/profile/ic_dots.png')}></ScaledImage>
                            </TouchableOpacity> : <View></View>} */}
          </View>
        </TouchableOpacity>
      </Card>
    );
  };
  buttonAddShow = true;
  keyExtractor = (item, index) => index.toString();
  footerComponent = () => <View style={{height: 50}} />;
  headerComponent = () => {
    return !this.state.refreshing &&
      (!this.state.data || (this.state.data && this.state.data.length == 0)) ? (
      <View style={styles.containerNotfound}>
        <Text style={styles.txtNotfound}>{constants.none_info}</Text>
      </View>
    ) : null;
  };
  shareEhealth = () => {
    this.setState({
      ehealth: !this.state.ehealth,
    });
  };
  onCreate = isCreate => {
    if (isCreate) {
      this.onLoad();
    }
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.userApp.currentUser) {
      this.onLoad();
    }
  }
  onEdit(isEdit) {
    if (isEdit) {
      this.onLoad();
    }
  }
  onEditProfile = item => {
    if (this.props.userApp.currentUser.accountSource == 'VENDOR') {
      this.props.navigation.replace('editProfileUsername', {
        dataOld: item,
        // onEdit: this.onEdit.bind(this)
      });
    } else
      this.props.navigation.navigate('editProfile', {
        dataOld: item,
        onEdit: this.onEdit.bind(this),
      });
  };
  createProfile = () => {
    NavigationService.navigate('createProfile', {
      onCreate: this.onCreate.bind(this),
    });
  };
  renderBtn = () => {
    return (
      <TouchableOpacity style={styles.btnAdd} onPress={this.createProfile}>
        <ScaledImage
          style={styles.iconEdit}
          height={25}
          source={require('@images/new/profile/ic_add_profile.png')}
        />
      </TouchableOpacity>
    );
  };
  onAddRelation = relation => {
    let id = this.state.idProfile;
    var data = {
      relationshipType: relation,
      profileInfo: this.state.profileInfo,
    };

    profileProvider
      .updateProfile(id, data)
      .then(res => {
        this.setState({
          isVisibleRelation: false,
        });
        this.onLoad();
        snackbar.show('Sửa mối quan hệ thành công', 'success');
      })
      .catch(err => {
        snackbar.show('Sửa mối quan hệ thất bại', 'danger');
      });
  };
  showAll = () => {
    this.setState({isShow: !this.state.isShow});
  };
  render() {
    return (
      <ActivityPanel
        title={'Thành viên gia đình'}
        style={styles.container}
        titleStyle={styles.titleStyle}
        isLoading={this.state.isLoading}
        containerStyle={styles.containerStyle}
        menuButton={this.renderBtn()}>
        <ScrollView>
          <TouchableOpacity
            onPress={this.showAll}
            style={styles.buttonShowAllProfile}>
            <Text style={styles.txtAllProfile}>
              Tất cả thành viên ({this.state.data?.length})
            </Text>
            <ScaledImage
              source={require('@images/new/profile/ic_dropdown.png')}
              height={16}
              width={16}
              style={{
                transform: [{rotate: !this.state.isShow ? '-180deg' : '0deg'}],
              }}
            />
          </TouchableOpacity>
          {this.state.isShow ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.data || []}
              extraData={this.state}
              keyExtractor={this.keyExtractor}
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshing}
              renderItem={this.renderItem}
              ListFooterComponent={this.footerComponent}
              ListHeaderComponent={this.headerComponent}
            />
          ) : null}

          <ListInvite
            navigation={this.props.navigation}
            onRefresh={this.onRefresh}
          />
        </ScrollView>
        <Modal
          isVisible={this.state.isVisible}
          onBackdropPress={this.onCloseModal}
          backdropOpacity={0.5}
          animationInTiming={500}
          animationOutTiming={500}
          style={styles.viewModal}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}>
          <View style={styles.viewPopup}>
            <Text
              style={styles.txNotifi}>{`Bạn có chắc chắn muốn xoá thành viên ${
              this.state.medicalName
            } ?`}</Text>
            <View style={styles.viewBtn}>
              <TouchableOpacity
                onPress={this.onCloseModal}
                style={styles.btnReject}>
                <Text style={styles.txReject}>
                  {constants.actionSheet.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.onClickDone}
                style={styles.btnDone}>
                <Text style={styles.txDone}>{'Xác nhận'}</Text>
              </TouchableOpacity>
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
          backdropTransitionOutTiming={1000}>
          <View style={styles.viewPopupShare}>
            <Text style={styles.txNotifi}>
              {constants.msg.user.select_data_need_share}
            </Text>
            <View style={styles.viewBtn}>
              {this.state.ehealth ? (
                <TouchableOpacity
                  onPress={this.shareEhealth}
                  style={{padding: 5}}>
                  <ScaledImage
                    source={require('@images/new/profile/ic_checked.png')}
                    height={20}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={this.shareEhealth}
                  style={{padding: 5}}>
                  <ScaledImage
                    source={require('@images/new/profile/ic_unCheck.png')}
                    height={20}
                  />
                </TouchableOpacity>
              )}
              <Text style={styles.txSelected}>
                {constants.ehealth.my_ehealth}
              </Text>
            </View>
            <TouchableOpacity
              onPress={this.updatePermission}
              style={styles.btnShare}>
              <Text style={styles.txDone}>{'Xác nhận'}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.isVisibleRelation}
          onBackdropPress={this.onCloseModal}
          backdropOpacity={0.5}
          animationInTiming={500}
          animationOutTiming={500}
          style={styles.modalRelation}
          avoidKeyboard={true}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}>
          <SelectRelation
            onSelectRelation={relation => this.onAddRelation(relation)}
          />
        </Modal>
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  txtAllProfile: {
    color: '#86899B',
    fontSize: 15,
    paddingRight: 10,
  },
  buttonShowAllProfile: {
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRelation: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  cardItem: {
    padding: 10,
    borderRadius: 6,
    margin: 5,
  },
  image: {width: 70, height: 70},
  imgLoad: {
    alignSelf: 'center',
    borderRadius: 35,
    width: 70,
    height: 70,
  },
  viewTittle: {backgroundColor: '#f8f8f8', flex: 1},
  header: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  imageStyle: {
    borderRadius: 35,
    borderWidth: 0.5,
    borderColor: '#27AE60',
  },
  iconEdit: {
    tintColor: '#fff',
    marginRight: 10,
  },
  containerButtonAdd: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  txSelected: {
    color: '#000',
    fontSize: 14,
    marginHorizontal: 10,
  },
  iconAdd: {color: '#FFF'},
  buttonAdd: {
    backgroundColor: '#02C39A',
    borderRadius: 30,
    width: 60,
    margin: -1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txReject: {color: '#000'},
  card: {
    backgroundColor: '#02C39A',
    borderRadius: 30,
  },
  txtNotfound: {fontStyle: 'italic'},
  containerNotfound: {
    alignItems: 'center',
    marginTop: 50,
  },
  txtRelationshipType: {
    color: '#02C293',
    fontSize: 14,
  },
  txtmedicalRecords: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
    marginHorizontal: 12,
    textAlign: 'center',
  },
  txtRelationShip: {
    color: '#868686',
    fontSize: 14,
  },
  container: {
    flex: 1,
  },
  txId: {
    color: '#000',
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#359A60',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginHorizontal: 10,
    marginLeft: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  txNotifi: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginHorizontal: 40,
  },

  viewPopup: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  viewPopupShare: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  viewModal: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  txBtn: {color: '#fff', fontSize: 16},
  cardView: {
    paddingHorizontal: 10,
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#01BF88',
    justifyContent: 'center',
  },
  txName: {color: '#02C39A', fontWeight: '500', fontSize: 15, maxWidth: 200},
  txDelelte: {color: '#C4C4C4', fontSize: 10},
  txLabel: {color: '#02C39A'},
  btnShare: {
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center',
    height: 42,
    width: 254,
    backgroundColor: '#00CBA7',
    borderRadius: 5,
  },
  btnDone: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 10,
    backgroundColor: '#00CBA7',
    borderRadius: 5,
  },
  btnReject: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 78,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#00000050',
    borderWidth: 1,
  },
  viewBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  txDone: {color: '#fff'},
  viewProfileUser: {
    // backgroundColor: '#01BE84',
    flex: 1,
    // alignItems:'center'
  },
  txProfileUser: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  viewProfileFamily: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  viewGradientUser: {
    flex: 1,
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    padding: 10,
    borderBottomLeftRadius: 10,
  },
  colorGray: {backgroundColor: '#F8F8F8'},
  viewItemWait: {flexDirection: 'row', alignItems: 'center'},
  viewContent: {marginLeft: 10, flex: 1},
  txNameWait: {fontSize: 16, color: '#000'},
  fontBold: {fontSize: 16, fontWeight: 'bold'},
  txPhoneWait: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00000050',
    marginVertical: 5,
  },
  viewBtnWait: {flexDirection: 'row', alignItems: 'center'},
  btnAcceptWait: {
    backgroundColor: '#BABABA',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txWait: {fontSize: 14, color: '#fff'},
  btnRejectWait: {
    backgroundColor: '#fff',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txRejectWait: {fontSize: 14, color: '#000'},
  viewNeedConfirm: {flexDirection: 'row', alignItems: 'center'},
  viewContentNeed: {marginLeft: 10, flex: 1},
  viewTxNeed: {fontSize: 16, color: '#000'},
  txPhoneNeed: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00000050',
    marginVertical: 5,
  },
  viewBtnNeed: {flexDirection: 'row', alignItems: 'center'},
  btnNeed: {
    backgroundColor: '#00CBA7',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txNeed: {fontSize: 14, color: '#fff'},
  btnRejectNeed: {
    backgroundColor: '#fff',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txDeleteNeed: {fontSize: 14, color: '#000'},
  viewActive: {flexDirection: 'row', alignItems: 'center'},
  viewItemActive: {
    marginLeft: 10,
    flex: 1,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  nameActive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    writingDirection: 'ltr',
  },
  phoneActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00000050',
    marginVertical: 5,
  },
  dobActive: {fontSize: 15, fontWeight: 'bold', color: '#00CBA7'},
  titleStyle: {marginLeft: 50},
  containerStyle: {paddingHorizontal: 10, backgroundColor: '#f8f8f8'},
  btnAdd: {
    padding: 5,
  },
  buttonMenu: {
    padding: 5,
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
export default connect(mapStateToProps)(ListProfileScreen);
