import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
import ProfileInfo from '@components/profile/ProfileInfo';
import Transaction from '@components/profile/Transaction';
import profileProvider from '@data-access/profile-provider';
import dateUtils from 'mainam-react-native-date-utils';
import imageProvider from '@data-access/image-provider';
import connectionUtils from '@utils/connection-utils';
import ImagePicker from 'mainam-react-native-select-image';
import snackbar from '@utils/snackbar-utils';
import constants, {hospital} from '@resources/strings';
import objectUtils from '@utils/object-utils';
import redux from '@redux-store';
import {connect} from 'react-redux';
import * as Animatable from 'react-native-animatable';
import {Card} from 'native-base';
import NavigationService from '@navigators/NavigationService';
import bookingDoctorProvider from '@data-access/booking-doctor-provider';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      location: '',
      hospital: {},
    };
  }

  componentDidMount() {
    let id =
      this.props.navigation.state.params &&
      this.props.navigation.state.params.id
        ? this.props.navigation.state.params.id
        : '';
    this.onGetDetail(id);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.navigation.state.params &&
      nextProps.navigation.state.params.id
    ) {
      let id =
        nextProps.navigation.state.params &&
        nextProps.navigation.state.params.id
          ? nextProps.navigation.state.params.id
          : '';

      this.onGetDetail(id);
    }
  }
  onGetDetail = id => {
    profileProvider
      .getDetailsMedical(id)
      .then(res => {
        if (res.code == 0) {
          this.setState(
            {
              imgAvtLocal: res.data.medicalRecords.avatar,
              data: res.data,
              loading: false,
            },
            () => {
              this.renderAddress();
            },
          );
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
      });
  };
  
  selectImageAvt = () => {
    if (
      this.state.data.medicalRecords.status == 2 &&
      this.state.data.medicalRecords.alreadyHaveAccount
    ) {
      snackbar.show(constants.msg.user.not_permission_edit_file, 'danger');
    } else {
      connectionUtils
        .isConnected()
        .then(s => {
          if (this.imagePicker) {
            this.imagePicker.open(true, 200, 200, image => {
              setTimeout(() => {
                Keyboard.dismiss();
              }, 500);
              this.setState({
                imageAvt: image,
              });

              imageProvider.upload(this.state.imageAvt.path, null, (s, e) => {
                if (s.success && s.data.code == 0) {
                  let images = s.data[0].fileDownloadUri;
                  this.setState({
                    imgAvtLocal: images,
                  });
                  this.onUpdateAvt2(images);
                }
                if (e) {
                  this.setState({
                    isLoading: false,
                  });
                }
              });
            });
          }
        })
        .catch(e => {
          snackbar.show(constants.msg.app.not_internet, 'danger');
        });
    }
  };
  // onUpdateAvt = () => {
  //     if (this.state.imageAvt)
  //         this.setState({ isLoading: true }, () => {
  //             imageProvider.upload(this.state.imageAvt.path, (s, e) => {
  //                 if (s.success && s.data.code == 0) {
  //                     let image = s.data[0].fileDownloadUri;
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
            isLoading: true,
          },
          () => {
            let data =
              this.state.data.medicalRecords.status == 1
                ? {
                    avatar: image,
                    type: 'FAMILY',
                  }
                : {
                    avatar: image,
                    type: 'ORIGINAL',
                  };

            let id = this.state.data.medicalRecords.id;
            profileProvider
              .updateAvatar(id, data)
              .then(res => {
                if (res.code == 0) {
                  if (this.state.data.medicalRecords.status == 1) {
                    let current = this.props.userApp.currentUser;
                    current.avatar = res.data.medicalRecords.avatar;
                    this.props.dispatch(redux.userLogin(current));
                  }
                  this.setState({
                    isLoading: false,
                    imgAvtLocal: res.data.medicalRecords.avatar,
                  });
                } else {
                  this.setState({
                    isLoading: false,
                  });
                }
              })
              .catch(err => {
                this.setState({
                  isLoading: false,
                });

                snackbar.show(constants.msg.app.err_try_again, 'danger');
              });
          },
        );
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, 'danger');
      });
  }
  onEdit = () => {
    if (
      this.state.data.medicalRecords.status == 2 &&
      this.state.data.medicalRecords.alreadyHaveAccount
    ) {
      snackbar.show(constants.msg.user.not_permission_edit_file, 'danger');
    } else {
      this.props.navigation.navigate('editProfile', {
        data: this.state.data,
      });
    }
  };
  renderAddress = () => {
    let dataLocaotion = this.state.data;
    let district = dataLocaotion.district ? dataLocaotion.district.name : null;
    let province = dataLocaotion.province
      ? dataLocaotion.province.countryCode
      : null;
    let zone = dataLocaotion.zone ? dataLocaotion.zone.name : '';
    let village =
      dataLocaotion.medicalRecords.village &&
      dataLocaotion.medicalRecords.village != ' '
        ? dataLocaotion.medicalRecords.village
        : null;

    if (district && province && zone && village) {
      this.setState({
        location: `${village}, ${zone}, ${district}, ${province}`,
      });
    } else if (district && province && zone) {
      this.setState({
        location: `${zone}, ${district}, ${province}`,
      });
    } else if (district && province && village) {
      this.setState({
        location: `${village}, ${district}, ${province}`,
      });
    } else if (district && province) {
      this.setState({
        location: `${district},${province},`,
      });
    } else if (province && village) {
      this.setState({
        location: `${village}, ${province}`,
      });
    } else if (province) {
      this.setState({
        location: `${province}`,
      });
    } else if (village) {
      this.setState({
        location: `${village}`,
      });
    } else if (!village && !district && !province && !zone) {
      this.setState({
        location: null,
      });
    }

    // return (<Text style={styles.txContent}>{dataLocaotion.address}</Text>)
    // let dataLocaotion = this.state.data && this.state.data.medicalRecords ? this.state.data.medicalRecords : {}
    // if (dataLocaotion) {
    //     if (dataLocaotion.address && dataLocaotion.village) {
    //         return (<Text style={styles.txContent}>{dataLocaotion.village + ', ' + dataLocaotion.address}</Text>)
    //     }

    //     if (dataLocaotion.address && !dataLocaotion.village) {
    //         return (<Text style={styles.txContent}>{dataLocaotion.address}</Text>)
    //     }
    //     if (!dataLocaotion.address && dataLocaotion.village) {
    //         return (<Text style={styles.txContent}>{dataLocaotion.village}</Text>)
    //     }
    // }
  };
  renderRelation = () => {
    if (
      this.state.data &&
      this.state.data.medicalRecords &&
      this.state.data.medicalRecords.relationshipType
    )
      switch (this.state.data.medicalRecords.relationshipType) {
        case 'DAD':
          return <Text style={styles.txContent}>Cha</Text>;
        case 'MOTHER':
          return <Text style={styles.txContent}>Mẹ</Text>;
        case 'BOY':
          return <Text style={styles.txContent}>Con trai</Text>;
        case 'DAUGHTER':
          return <Text style={styles.txContent}>Con gái</Text>;
        case 'GRANDSON':
          return <Text style={styles.txContent}>Cháu trai</Text>;
        case 'NIECE':
          return <Text style={styles.txContent}>Cháu gái</Text>;
        case 'GRANDFATHER':
          return <Text style={styles.txContent}>Ông</Text>;
        case 'GRANDMOTHER':
          return <Text style={styles.txContent}>Bà</Text>;
        case 'WIFE':
          return <Text style={styles.txContent}>Vợ</Text>;
        case 'HUSBAND':
          return <Text style={styles.txContent}>Chồng</Text>;
        case 'OTHER':
          return <Text style={styles.txContent}>Khác</Text>;

        default:
          return <Text style={styles.txContent} />;
      }
  };
  //render profile by statusConfirm
  renderProfile = details => {
    switch (details.statusConfirm) {
      case 'ACTIVE': {
        return (
          <View style={styles.flex}>
            <View style={styles.btnFeature}>
              <View>
                <ScaledImage
                  height={20}
                  style={styles.imageAccount}
                  source={require('@images/new/profile/ic_account.png')}
                />
              </View>
              <Text style={[styles.txFeature]}>
                {constants.account_screens.info}
              </Text>
              <View />
            </View>
            <View style={styles.containerInfo}>
              {details && details.name ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.fullname}: </Text>
                    <Text style={styles.txContent}>{details.name}</Text>
                  </Text>
                </View>
              ) : null}
              {details && details.dob ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.dob}: </Text>
                    <Text style={styles.txContent}>
                      {details.dob.toDateObject('-').format('dd/MM/yyyy')}
                    </Text>
                  </Text>
                </View>
              ) : null}
              {/* <View style={styles.viewItem}>
                    <Text><Text style={styles.txLabel}>ID: </Text><Text style={styles.txContent}>{details && details.profileNoID ? details.profileNoID : ''}</Text></Text>
                </View> */}
              {(details && details.gender) || details.gender == 0 ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.gender}: </Text>
                    <Text style={styles.txContent}>
                      {details.gender == 0 ? 'Nữ' : 'Nam'}
                    </Text>
                  </Text>
                </View>
              ) : null}
              {details.weight || details.height ? (
                <View style={[styles.viewItem, {}]}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.height}: </Text>
                    <Text style={styles.txContent}>
                      {details.height + 'cm'}{' '}
                    </Text>
                  </Text>
                  <Text style={[styles.txLabel]}>
                    {constants.weight}:{' '}
                    <Text style={styles.txContent}>
                      {details.weight + 'kg'}{' '}
                    </Text>
                  </Text>
                  <View style={{width: 20}} />
                </View>
              ) : null}
              {details && details.height && details.weight ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.BMI}: </Text>
                    <Text style={styles.txContent}>
                      {parseFloat(
                        details.weight / Math.pow(details.height / 100, 2),
                      ).toFixed(1)}
                    </Text>
                  </Text>
                </View>
              ) : null}
              {details && details.phone ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.phone}: </Text>
                    <Text style={styles.txContent}>
                      {details.phone.replace(
                        /(\d\d\d\d)(\d\d\d)(\d\d\d)/,
                        '$1.$2.$3',
                      )}
                    </Text>
                  </Text>
                </View>
              ) : null}
              {this.state.location ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.address}: </Text>
                    <Text style={{fontSize: 14, color: '#000'}}>
                      <Text style={styles.txContent}>
                        {this.state.location}
                      </Text>
                    </Text>
                  </Text>
                </View>
              ) : null}
              {details.status != 1 ? (
                details && details.relationshipType ? (
                  <View style={styles.viewItem}>
                    <Text>
                      <Text style={styles.txLabel}>
                        {constants.relationship}:{' '}
                      </Text>
                      {this.renderRelation()}
                    </Text>
                  </View>
                ) : null
              ) : null}
              {details?.hospitalName ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>Cơ sở y tế: </Text>
                    {details.hospitalName}
                  </Text>
                </View>
              ) : null}
              {details?.value ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>Mã bệnh nhân: </Text>
                    {details.value}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        );
      }

      case 'WAIT_CONFIRM': {
        return (
          <View style={{flex: 1}}>
            <View style={styles.btnFeature}>
              <View>
                <ScaledImage
                  height={20}
                  style={{tintColor: '#fff', marginLeft: -28}}
                  source={require('@images/new/profile/ic_account.png')}
                />
              </View>
              <Text style={[styles.txFeature]}>
                {constants.account_screens.info}
              </Text>
              <View />
            </View>
            <View style={styles.containerInfo}>
              {details && details.name ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.fullname}: </Text>
                    <Text style={styles.txContent}>{details.name}</Text>
                  </Text>
                </View>
              ) : null}
              {details && details.phone ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.phone}: </Text>
                    <Text style={styles.txContent}>
                      {details.phone.replace(
                        /(\d\d\d\d)(\d\d\d)(\d\d\d)/,
                        '$1.$2.$3',
                      )}
                    </Text>
                  </Text>
                </View>
              ) : null}
              {details.status != 1 ? (
                details && details.relationshipType ? (
                  <View style={styles.viewItem}>
                    <Text>
                      <Text style={styles.txLabel}>
                        {constants.relationship}:{' '}
                      </Text>
                      {this.renderRelation()}
                    </Text>
                  </View>
                ) : null
              ) : null}
            </View>
          </View>
        );
      }
      case 'NEED_CONFIRM': {
        return (
          <View style={{flex: 1}}>
            <View style={styles.btnFeature}>
              <View>
                <ScaledImage
                  height={20}
                  style={{tintColor: '#fff', marginLeft: -28}}
                  source={require('@images/new/profile/ic_account.png')}
                />
              </View>
              <Text style={[styles.txFeature]}>
                {constants.account_screens.info}
              </Text>
              <View />
            </View>
            <View style={styles.containerInfo}>
              {details && details.name ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.fullname}: </Text>
                    <Text style={styles.txContent}>{details.name}</Text>
                  </Text>
                </View>
              ) : null}
              {details && details.phone ? (
                <View style={styles.viewItem}>
                  <Text>
                    <Text style={styles.txLabel}>{constants.phone}: </Text>
                    <Text style={styles.txContent}>
                      {details.phone.replace(
                        /(\d\d\d\d)(\d\d\d)(\d\d\d)/,
                        '$1.$2.$3',
                      )}
                    </Text>
                  </Text>
                </View>
              ) : null}
              {details.status != 1 ? (
                <View style={styles.viewItem}>
                  {details && details.relationshipType ? (
                    <Text>
                      <Text style={styles.txLabel}>
                        {constants.relationship}:{' '}
                      </Text>
                      {this.renderRelation()}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>
        );
      }
    }
  };
  createProfile = () => NavigationService.navigate('createProfile');
  render() {
    const icSupport = require('@images/new/user.png');
    const details =
      this.state.data && this.state.data.medicalRecords
        ? this.state.data.medicalRecords
        : {};
    const sourceAvt = this.state.imgAvtLocal
      ? {uri: this.state.imgAvtLocal}
      : icSupport;
    return (
      <ActivityPanel
        titleStyle={styles.txTitle}
        title={'THÔNG TIN CÁ NHÂN'}
        iosBarStyle={'light-content'}
        actionbarStyle={styles.actionbarStyle}
        style={styles.container}
        menuButton={
          <TouchableOpacity onPress={this.onEdit}>
            <ScaledImage
              style={styles.iconEdit}
              height={20}
              source={require('@images/new/profile/ic_edit.png')}
            />
          </TouchableOpacity>
        }
        isLoading={this.state.loading}>
        {!this.state.loading ? (
          <ScrollView bounces={false}>
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
                  placeholderSource={icSupport}
                  loadingStyle={{size: 'small', color: 'gray'}}
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
                <TouchableOpacity
                  onPress={this.selectImageAvt}
                  style={styles.scaledImageAvt}>
                  <ScaledImage
                    source={require('@images/new/profile/instagram_logo_black.png')}
                    width={30}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {this.renderProfile(details)}
            <View style={{height: 50}} />
          </ScrollView>
        ) : null}
        <Animatable.View
          ref={ref => (this.buttonAdd = ref)}
          animation={'rotate'}
          style={styles.containerAdd}>
          <Card style={styles.card}>
            <TouchableOpacity
              onPress={this.createProfile}
              style={styles.buttonAdd}>
              <ScaledImage
                height={25}
                source={require('@images/new/profile/ic_add.png')}
              />
            </TouchableOpacity>
          </Card>
        </Animatable.View>
        <ImagePicker ref={ref => (this.imagePicker = ref)} />
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  buttonAdd: {
    backgroundColor: '#02C39A',
    borderRadius: 30,
    width: 60,
    margin: -1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#02C39A',
    borderRadius: 30,
  },
  containerAdd: {
    position: 'absolute',
    right: 10,
    bottom: 20,
  },
  iconEdit: {
    tintColor: '#fff',
    marginRight: 10,
  },
  imageAccount: {
    tintColor: '#fff',
    marginLeft: -28,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  viewBaner: {
    alignItems: 'center',
  },
  scaledImage: {position: 'absolute', top: 5, right: 5},
  btnFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#02C39A',
    justifyContent: 'space-around',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderColor: '#02C39A',
    paddingVertical: 10,
    marginLeft: 10,
    marginTop: 30,
    paddingHorizontal: 0,
    flex: 1,
  },
  imageStyle: {borderRadius: 60, borderWidth: 2, borderColor: '#Fff'},
  customImagePlace: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  styleImgLoad: {width: 120, height: 120},
  avtBtn: {
    position: 'absolute',
    top: 25,
  },
  scaledImageAvt: {position: 'absolute', bottom: 0, right: 0},
  txTitle: {color: '#fff', marginLeft: 50},
  actionbarStyle: {
    backgroundColor: '#02C39A',
    borderBottomWidth: 0,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#02C39A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginHorizontal: 10,
    marginLeft: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  containerInfo: {
    padding: 10,
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#01C295',
    margin: 10,
  },
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  txLabel: {
    color: '#01C295',
    fontSize: 14,
  },
  txContent: {
    marginLeft: 5,
    color: '#000',
    fontSize: 14,
  },
  imgBaner: {
    width: '100%',
    height: 150,
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
    color: '#02C39A',
    fontWeight: '600',
  },

  txFeature: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  txBtn: {color: '#fff'},
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
export default connect(mapStateToProps)(ProfileScreen);
