import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import {connect} from 'react-redux';
import redux from '@redux-store';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
import constants from '@resources/strings';
import profileProvider from '@data-access/profile-provider';
import DateTimePicker from 'mainam-react-native-date-picker';
import Form from 'mainam-react-native-form-validate/Form';
import Field from 'mainam-react-native-form-validate/Field';
import TextField from 'mainam-react-native-form-validate/TextField';
import ActionSheet from 'react-native-actionsheet';
import snackbar from '@utils/snackbar-utils';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import connectionUtils from '@utils/connection-utils';
import dateUtils from 'mainam-react-native-date-utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from '@components/modal';
import NavigationService from '@navigators/NavigationService';
import locationProvider from '@data-access/location-provider';
import objectUtils from '@utils/object-utils';
import SelectRelation from '@components/profile/SelectRelation';
class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReset: 1,
      isLoading: false,
      image: null,
      isVisible: false,
      isVisibleRelation: false,
      email: '',
      phone: '',
      nationality: '',
      job: '',
      nation: '',
    };
  }
  componentDidMount() {
    let dataOld = this.props.navigation.getParam('dataOld', null);

    if (dataOld) {
      let dataProfile = dataOld.profileInfo?.personal || {};
      let dataLocationOld = dataOld.profileInfo?.personal?.address;

      let badInfo = this.props.navigation.getParam('badInfo', false);
      let dataLocation = {
        districts: {name: dataLocationOld?.district || ''},
        provinces: {name: dataLocationOld?.province || ''},
        zone: {name: dataLocationOld?.street1 || ''},
        address: dataLocationOld?.street2 || '',
      };

      this.setState(
        {
          dataProfile,
          avatar: dataProfile && dataProfile.avatar ? dataProfile.avatar : null,
          imagePath:
            dataProfile && dataProfile.avatar ? dataProfile.avatar : '',
          name: dataProfile && dataProfile.fullName ? dataProfile.fullName : '',
          date:
            dataProfile && dataProfile.dateOfBirth
              ? dataProfile.dateOfBirth.toDateObject('-').format('dd/MM/yyyy')
              : '',
          txGender: dataProfile && dataProfile.gender == 'MALE' ? 'Nam' : 'N???',
          valueGender: dataProfile.gender,
          dobOld:
            dataProfile && dataProfile.dateOfBirth
              ? dataProfile.dateOfBirth
              : '',
          // height: dataProfile && dataProfile.height ? dataProfile.height.toString() : '',
          // weight: dataProfile && dataProfile.weight ? dataProfile.weight.toString() : '',
          relationshipType:
            dataProfile && dataProfile.relationshipType
              ? dataProfile.relationshipType
              : '',
          profileNo:
            dataProfile && dataProfile.profileNo ? dataProfile.profileNo : '',
          id: (dataOld && dataOld.userProfileId) || null,
          dob:
            dataProfile && dataProfile.dateOfBirth
              ? dataProfile.dateOfBirth.toDateObject('-')
              : '',
          phone: dataProfile && dataProfile.mobileNumber,
          guardianPassport: dataOld.profileInfo?.guardian?.idNumber || '',
          guardianName: dataOld.profileInfo?.guardian?.fullName || '',
          guardianPhone: dataOld.profileInfo?.guardian?.mobileNumber || '',
          userPassport: dataProfile?.idNumber || '',
          nation: {name: dataProfile?.nation || null},
          job: {name: dataProfile?.job || null},
          status: dataProfile?.status || 0,
          dataLocation,
          nationality: {name: dataProfile?.nationality},
          email: dataProfile.email,
          isEdit: true,
          badInfo,
          relation: dataOld?.relationshipType,
          defaultProfile: dataOld?.defaultProfile,
        },
        () => {
          this.renderAddress();
          this.onLoadDefault(
            dataProfile?.nation || null,
            dataProfile?.job || null,
            dataProfile?.nationality || null,
          );
        },
      );
    } else {
      this.onLoadDefault(null, null, null);
    }
  }
  onLoadDefault = (nations, jobs, nationality) => {
    if (!nations) {
      locationProvider
        .getAllNations()
        .then(res => {
          if (res && res?.length) {
            this.setState({
              nation: res[0],
            });
          }
        })
        .catch(err => {});
    }
    if (!jobs) {
      locationProvider
        .getAllJobs()
        .then(res => {
          if (res && res?.length) {
            this.setState({
              job: res[0],
            });
          }
        })
        .catch(err => {});
    }
    if (!nationality) {
      locationProvider
        .getAllCountry()
        .then(s => {
          if (s.code == 0 && s.data.countries?.length) {
            let dataDefault = s.data.countries.filter(obj => obj.code == 'Vi');

            if (dataDefault?.length) {
              this.setState({
                nationality: dataDefault[0],
              });
            }
          }
        })
        .catch(e => {
          this.setState({
            data: [],
          });
        });
    }
  };
  defaultImage = () => {
    return (
      <ScaleImage
        resizeMode="cover"
        source={require('@images/new/user.png')}
        width={40}
        height={40}
      />
    );
  };
  onSendConfirm = () => {
    profileProvider
      .sendConfirmProfile(this.state.id)
      .then(res => {
        this.setState({
          isVisible: false,
        });
        if (res.code == 0) {
          NavigationService.navigate('shareDataProfile', {
            id: res.data.shareRecord.id,
            shareId: res.data.record.id,
          });
        } else {
          this.setState({
            isVisible: false,
            id: null,
          });
          snackbar.show(constants.msg.notification.error_retry, 'danger');
        }
      })
      .catch(err => {
        this.setState({
          isVisible: false,
          id: null,
        });
        snackbar.show(constants.msg.notification.error_retry, 'danger');
      });
  };
  renderAddress = () => {
    let dataLocation = this.state.dataLocation;

    let district = dataLocation?.districts?.name || '';
    let province = dataLocation?.provinces?.name || '';
    let zone = dataLocation?.zone?.name || '';
    let address = dataLocation?.address || '';

    if (district || province || zone) {
      this.setState(
        {
          location: `${address}\n${zone}\n${district}\n${province}`,
        },
        () => {
          if (this.state.isSave) {
            this.form.isValid();
          }
        },
      );
    } else {
      this.setState(
        {
          location: null,
        },
        () => {
          if (this.state.isSave) {
            this.form.isValid();
          }
        },
      );
    }
  };
  // componentDidMount = () => {
  //     // this.renderRelation()
  // };

  onShowGender = () => {
    this.actionSheetGender.show();
  };
  onSetGender = index => {
    try {
      switch (index) {
        case 0:
          this.setState(
            {
              valueGender: 'MALE',
              txGender: 'Nam',
              relationShip: null,
            },
            () => {
              if (this.state.isSave) {
                this.form.isValid();
              }
            },
          );
          return;
        case 1:
          this.setState(
            {
              valueGender: 'FEMALE',
              txGender: 'N???',
              relationShip: null,
            },
            () => {
              if (this.state.isSave) {
                this.form.isValid();
              }
            },
          );
          return;
      }
    } catch (error) {}
  };
  onSelectRelationShip = () => {
    this.props.navigation.navigate('selectRelationship', {
      onSelected: this.selectRelationShip.bind(this),
      gender: this.state.valueGender,
      // id: this.state.relationShip.id
    });
  };
  onChangeText = type => text => {
    this.setState({[type]: text}, () => {
      if (this.state.isSave) {
        this.form.isValid();
      }
    });
  };
  selectRelationShip = relationShip => {
    let relationShipError = relationShip ? '' : this.state.relationShipError;
    if (
      !relationShip ||
      !this.state.relationShip ||
      relationShip.id != this.state.relationShip.id
    ) {
      this.setState({relationShip, relationShipError});
    } else {
      this.setState({relationShip, relationShipError});
    }
  };
  onCloseModal = () => {
    this.setState({
      isVisible: false,
      id: null,
      isVisibleRelation: false,
    });
  };
  selectImage = () => {
    if (this.imagePicker) {
      this.imagePicker.open(true, 200, 200, image => {
        this.setState({isLoading: true}, () => {
          imageProvider
            .upload(image.path, image.mime)
            .then(s => {
              this.setState({
                avatar: s.data.data.images[0].imageLink,
                isLoading: false,
                imagePath: s.data.data.images[0].image,
              });
              // if (s && s.data.code == 0) {
              // let user = objectUtils.clone(this.props.userApp.currentUser);
              // user.avatar = s.data.data.images[0].thumbnail;
              // this.setState({ isLoading: true }, () => {
              //     userProvider
              //         .update(this.props.userApp.currentUser.id, user)
              //         .then(s => {
              //             this.setState({ isLoading: false }, () => { });
              //             if (s.code == 0) {
              //                 var user = s.data.user;
              //                 let current = this.props.userApp.currentUser;
              //                 user.bookingNumberHospital = current.bookingNumberHospital;
              //                 user.bookingStatus = current.bookingStatus;
              //                 this.props.dispatch(redux.userLogin(user));
              //             } else {
              //                 snackbar.show(
              //                     "C???p nh???t ???nh ?????i di???n kh??ng th??nh c??ng",
              //                     "danger"
              //                 );
              //             }
              //         })
              //         .catch(e => {
              //             this.setState({ isLoading: false }, () => { });
              //             snackbar.show(
              //                 "C???p nh???t ???nh ?????i di???n kh??ng th??nh c??ng",
              //                 "danger"
              //             );
              //         });
              // });
              // }
            })
            .catch(e => {
              this.setState({isLoading: false}, () => {});
              snackbar.show('Upload ???nh kh??ng th??nh c??ng', 'danger');
            });
        });
      });
    }
  };
  onSelectProvince = () => {
    const {dataLocation} = this.state;
    this.props.navigation.navigate('selectAddress', {
      onSelected: this.selectProvinces.bind(this),
      dataLocation,
    });
  };
  selectProvinces(dataLocation) {
    this.setState({dataLocation}, () => {
      this.renderAddress();
    });
  }
  selectCountry(nationality) {
    this.setState({nationality}, () => {
      if (this.state.isSave) {
        this.form.isValid();
      }
    });
  }
  selectNations(nation) {
    this.setState({nation: nation}, () => {
      if (this.state.isSave) {
        this.form.isValid();
      }
    });
  }
  selectJobs(job) {
    this.setState({job: job}, () => {
      if (this.state.isSave) {
        this.form.isValid();
      }
    });
  }
  // renderAddress = () => {
  //     const { provinces, districts, zone } = this.state
  //     let value = ''
  //     let address = this.state.address ? this.state.address + ' - ' : ''
  //     if (provinces && districts && zone) {
  //         value = address + ' ' + zone.name + ' - ' + districts.name + ' - ' + provinces.countryCode
  //     }
  //     return value
  // }
  onSelectCountry = () => {
    this.props.navigation.navigate('selectCountry', {
      onSelected: this.selectCountry.bind(this),
      nationality: this.state.nationality,
    });
  };
  onCreateProfile = () => {
    this.setState({isSave: true}, () => {
      Keyboard.dismiss();
      if (!this.form.isValid()) {
        return;
      }
      connectionUtils
        .isConnected()
        .then(s => {
          this.setState(
            {
              isLoading: true,
            },
            () => {
              let id = this.state.id;
              let dataLocation = this.state.dataLocation;

              let district = dataLocation?.districts?.name || null;
              let province = dataLocation?.provinces?.name || null;
              let zone = dataLocation?.zone?.name || '';
              let village = dataLocation.address || null;
              let age = this.state.dob
                ? new Date().getFullYear() - this.state.dob.getFullYear()
                : null;
              if (age == 0 || age < 14) {
                var data = {
                  relationshipType: this.state.relation,
                  profileInfo: {
                    personal: {
                      avatar: this.state.imagePath,
                      email: this.state.email,
                      fullName: this.state.name,
                      dateOfBirth: this.state.dob
                        ? this.state.dob.format('yyyy-MM-dd')
                        : null,
                      gender: this.state.valueGender,
                      mobileNumber: this.state.phone,
                      nation: this.state.nation.name.trim(),
                      nationality: this.state.nationality?.name,
                      job: this.state.job ? this.state.job?.name : '',
                      idNumber: this.state.userPassport,

                      address: {
                        province: province ? province.toString() : null,
                        street1: zone ? zone.toString() : null,
                        district: district ? district.toString() : null,
                        street2: village ? village.toString() : null,
                      },
                    },
                    guardian: {
                      fullName: this.state.guardianName
                        ? this.state.guardianName
                        : '',
                      mobileNumber: this.state.guardianPhone
                        ? this.state.guardianPhone
                        : '',
                      idNumber: this.state.guardianPassport
                        ? this.state.guardianPassport
                        : '',
                    },
                  },
                };
              } else if (age >= 14) {
                var data = {
                  relationshipType: this.state.relation,
                  profileInfo: {
                    personal: {
                      avatar: this.state.imagePath,
                      fullName: this.state.name.trim(),
                      email: this.state.email,
                      dateOfBirth: this.state.dob
                        ? this.state.dob.format('yyyy-MM-dd')
                        : null,
                      gender: this.state.valueGender,
                      mobileNumber: this.state.phone,
                      address: {
                        province: province ? province.toString() : null,
                        street1: zone ? zone.toString() : null,
                        district: district ? district.toString() : null,
                        street2: village ? village.toString() : null,
                      },
                      idNumber: this.state.userPassport,
                      countryId: this.state.nationality?.id,
                      job: this.state.job ? this.state.job?.name : '',
                      nationality: this.state.nationality?.name,
                      nation: this.state.nation.name,
                    },
                  },
                };
              }

              profileProvider
                .updateProfile(id, data)
                .then(res => {
                  this.setState({
                    isLoading: false,
                  });
                  this.props.navigation.pop();
                  let onEdit = this.props.navigation.getParam('onEdit');
                  if (onEdit) onEdit();
                  snackbar.show('C???p nh???t h??? s?? th??nh c??ng', 'success');
                  if (res?.defaultProfile) {
                    let user = this.props.userApp.currentUser;
                    user.fullName = res?.profileInfo?.personal?.fullName;
                    user.mobileNumber =
                      res?.profileInfo?.personal?.mobileNumber;
                    user.avatar = res?.profileInfo?.personal?.avatar;
                    this.props.dispatch(redux.userLogin(user));
                  }
                })
                .catch(err => {
                  snackbar.show('C???p nh???t h??? s?? th???t b???i', 'danger');

                  this.setState({
                    isLoading: false,
                  });
                });
            },
          );
        })
        .catch(e => {
          snackbar.show(constants.msg.app.not_internet, 'danger');
        });
    });
  };
  renderDob = value => {
    if (value) {
      let dateParam = value.split(/[\s/:]/);
      let date = new Date(dateParam[2], dateParam[1], dateParam[0]);
      return value + `- ${date.getAge()} tu???i`;
    } else {
      return 'Ch???n ng??y sinh';
    }
  };
  onSelectNations = () => {
    this.props.navigation.navigate('selectNations', {
      onSelected: this.selectNations.bind(this),
      nations: this.state.nations,
    });
  };
  onSelectJobs = () => {
    this.props.navigation.navigate('getJobs', {
      onSelected: this.selectJobs.bind(this),
      jobs: this.state.jobs,
    });
  };
  _replaceSpace(str) {
    if (str) return str.replace(/\u0020/, '\u00a0');
  }
  onSelectRelation = () => {
    this.setState({
      isVisibleRelation: true,
    });
  };
  onAddRelation = relation => {
    this.setState({
      relation,
      isVisibleRelation: false,
    });
  };
  onBlur = type => {
    if (this.state.phone?.length == 10 && this.state.name) {
      let mobileNumber = this.state.phone.trim();
      let fullName = this.state.name.trim();
      profileProvider
        .getInfoProfile(mobileNumber, fullName)
        .then(s => {
          // switch (s.code) {
          //     case 0:
          //         NavigationService.navigate('verifyPhone', {
          //             phone: this.state.phone,
          //             verify: 2
          //         })
          //         break
          //     case 2:
          //         snackbar.show('S??? ??i???n tho???i ch??a ???????c ????ng k??', "danger");
          //         break
          //     case 6:
          //         NavigationService.navigate('verifyPhone', {
          //             phone: this.state.phone,
          //             verify: 2
          //         })
          //         break
          // }
        })
        .catch(err => {
          snackbar.show('C?? l???i x???y ra, xin vui l??ng th??? l???i.', 'danger');
        });
    }
  };
  onFinding = () => {
    this.setState({
      isFinding: true,
    });
  };
  render() {
    const {avatar, isLoading} = this.state;
    let age = this.state.dob
      ? new Date().getFullYear() - this.state.dob.getFullYear()
      : null;
    let maxDate = new Date();
    maxDate = new Date(
      maxDate.getFullYear(),
      maxDate.getMonth(),
      maxDate.getDate(),
    );
    let minDate = new Date();
    minDate = new Date(
      maxDate.getFullYear() - 150,
      maxDate.getMonth(),
      maxDate.getDate(),
    );

    return (
      <ActivityPanel
        title={'Ch???nh s???a h??? s??'}
        isLoading={isLoading}
        menuButton={
          <TouchableOpacity
            onPress={this.onCreateProfile}
            style={styles.buttonSave}>
            <Text style={styles.txtSave}>L??u</Text>
          </TouchableOpacity>
        }
        containerStyle={{backgroundColor: '#f8f8f8'}}
        titleStyle={styles.titleStyle}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={{paddingBottom: 10, paddingTop: 30}}>
              <TouchableOpacity
                onPress={this.selectImage}
                style={styles.buttonAvatar}>
                <ImageLoad
                  resizeMode="cover"
                  imageStyle={styles.borderImage}
                  borderRadius={40}
                  customImagePlaceholderDefaultStyle={[
                    styles.avatar,
                    styles.placeHolderImage,
                  ]}
                  placeholderSource={
                    avatar
                      ? {uri: avatar.absoluteUrl()}
                      : require('@images/new/user.png')
                  }
                  resizeMode="cover"
                  loadingStyle={{size: 'small', color: 'gray'}}
                  source={{uri: avatar ? avatar.absoluteUrl() : '' || ''}}
                  style={styles.image}
                  defaultImage={this.defaultImage}
                />
                <ScaledImage
                  source={require('@images/new/profile/ic_camera.png')}
                  height={18}
                  style={styles.icCamera}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={styles.containerScan}>
                                <View style={styles.groupScan}>
                                    <Text style={styles.txtScan}>QU??T CMND </Text>
                                    <Text style={styles.txtOr}> ho???c </Text>
                                    <Text style={styles.txtScan}>QU??T B???O HI???M Y T???</Text>
                                </View>
                                <Text style={styles.txtOr}>????? ??i???n th??ng tin nhanh h??n!</Text>
                            </View> */}
            <Form ref={ref => (this.form = ref)}>
              {/** V??n b???ng chuy??n m??n */}
              <Field
                style={[
                  styles.containerField,
                  {
                    borderTopColor: '#00000011',
                    borderTopWidth: 1,
                  },
                ]}>
                <Text style={styles.txLabel}>H??? v?? t??n</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    errorStyle={[styles.err]}
                    validate={{
                      rules: {
                        required: true,
                      },
                      messages: {
                        required: 'H??? v?? t??n kh??ng ???????c ????? tr???ng',
                      },
                    }}
                    // onBlur={this.onBlur}
                    placeholder={'Nh???p h??? v?? t??n'}
                    multiline={true}
                    inputStyle={[styles.input]}
                    onChangeText={this.onChangeText('name')}
                    value={this._replaceSpace(this.state.name)}
                    autoCapitalize={'none'}
                    // editable={false}
                    autoCorrect={false}
                  />
                </Field>
              </Field>

              <Field style={[styles.containerField]}>
                <Text style={styles.txLabel}>S??? ??i???n tho???i</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    multiline={true}
                    onChangeText={this.onChangeText('phone')}
                    inputStyle={[styles.input]}
                    placeholder="Nh???p s??? ??i???n tho???i"
                    value={this.state.phone}
                    errorStyle={styles.err}
                    editable={!this.state.dataProfile?.mobileNumber}
                    maxLength={10}
                    autoCapitalize={'none'}
                    onBlur={this.onBlur}
                    validate={{
                      rules: {
                        required: true,
                        phone: true,
                      },
                      messages: {
                        required: 'S??? ??i???n tho???i kh??ng ???????c ????? tr???ng',
                        phone: 'S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng',
                      },
                    }}
                    // underlineColorAndroid="transparent"
                    autoCorrect={false}
                    keyboardType={'numeric'}
                  />
                </Field>
              </Field>

              <Field
                style={[
                  styles.containerField,
                  {
                    borderTopColor: '#00000011',
                    borderTopWidth: 1,
                  },
                ]}>
                <Text style={styles.txLabel}>Email</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    errorStyle={[styles.err]}
                    validate={{
                      rules: {
                        email: true,
                      },
                      messages: {
                        email: 'Email kh??ng ????ng ?????nh d???ng',
                      },
                    }}
                    placeholder={'Nh???p email'}
                    multiline={true}
                    inputStyle={[styles.input]}
                    onChangeText={this.onChangeText('email')}
                    value={this._replaceSpace(this.state.email)}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                  />
                </Field>
                {(!this.state.id && (
                  <ScaledImage
                    height={10}
                    source={require('@images/new/account/ic_next.png')}
                  />
                )) || <Field />}
              </Field>

              {!this.state.defaultProfile ? (
                <Field style={[styles.containerField]}>
                  <Text style={styles.txLabel}>Quan h???</Text>
                  <Field style={{flex: 1}}>
                    <TextField
                      multiline={true}
                      onPress={this.onSelectRelation}
                      editable={false}
                      inputStyle={[styles.input, {textAlignVertical: 'top'}]}
                      placeholder="Ch???n quan h???"
                      value={objectUtils.renderTextRelations(
                        this.state.relation,
                      )}
                      autoCapitalize={'none'}
                      errorStyle={styles.err}
                      // validate={{
                      //     rules: {
                      //         required: true,
                      //     },
                      //     messages: {
                      //         required: "D??n t???c kh??ng ???????c ????? tr???ng",
                      //     }
                      // }}
                      // underlineColorAndroid="transparent"
                      autoCorrect={false}
                    />
                  </Field>
                  <ScaledImage
                    height={10}
                    source={require('@images/new/account/ic_next.png')}
                  />
                </Field>
              ) : (
                <Field />
              )}
              {/** H???c v??? */}
              <Field style={[styles.containerField]}>
                <Text style={styles.txLabel}>Ng??y sinh</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    multiline={true}
                    dateFormat={'dd/MM/yyyy'}
                    errorStyle={styles.err}
                    splitDate={'/'}
                    onPress={() => {
                      this.setState(
                        {toggleDateTimePickerVisible: true},
                        () => {},
                      );
                    }}
                    validate={{
                      rules: {
                        required: true,
                      },
                      messages: {
                        required: 'Ng??y sinh kh??ng ???????c ????? tr???ng',
                      },
                    }}
                    editable={false}
                    inputStyle={[styles.input]}
                    placeholder="Ch???n ng??y sinh"
                    value={this.state.date}
                    autoCapitalize={'none'}
                    // underlineColorAndroid="transparent"
                    autoCorrect={false}
                  />
                </Field>
                <ScaledImage
                  height={10}
                  source={require('@images/new/account/ic_next.png')}
                />
              </Field>

              <Field style={[styles.containerField]}>
                <Text style={styles.txLabel}>Gi???i t??nh</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    errorStyle={styles.err}
                    multiline={true}
                    onPress={this.onShowGender}
                    editable={false}
                    inputStyle={[styles.input]}
                    placeholder="Ch???n gi???i t??nh"
                    value={
                      this.state.valueGender == 'FEMALE'
                        ? 'N???'
                        : this.state.valueGender == 'MALE'
                        ? 'Nam'
                        : ''
                    }
                    autoCapitalize={'none'}
                    validate={{
                      rules: {
                        required: true,
                      },
                      messages: {
                        required: 'Gi???i t??nh kh??ng ???????c ????? tr???ng',
                      },
                    }}
                    // underlineColorAndroid="transparent"
                    autoCorrect={false}
                  />
                </Field>
                <ScaledImage
                  height={10}
                  source={require('@images/new/account/ic_next.png')}
                />
              </Field>
              <Field style={[styles.containerField]}>
                <Text style={styles.txLabel}>S??? CMND</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    multiline={true}
                    onChangeText={this.onChangeText('userPassport')}
                    inputStyle={[styles.input]}
                    placeholder="Nh???p s??? CMND"
                    value={this.state.userPassport}
                    errorStyle={[styles.err, {flexWrap: 'nowrap'}]}
                    autoCapitalize={'none'}
                    validate={{
                      rules: {
                        maxlength: 13,
                      },
                      messages: {
                        maxlength: 'S??? CMND kh??ng ???????c qu?? 13 k?? t???',
                      },
                    }}
                    // underlineColorAndroid="transparent"
                    autoCorrect={false}
                    keyboardType={'numeric'}
                  />
                </Field>
                <ScaledImage
                  height={10}
                  source={require('@images/new/account/ic_next.png')}
                />
              </Field>
              {/** T???nh th??nh ph??? */}
              <Field style={[styles.containerField, styles.containerFix]}>
                <Text style={styles.txLabel}>?????a ch???</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    multiline={true}
                    errorStyle={[styles.err]}
                    validate={{
                      rules: {
                        required: true,
                      },
                      messages: {
                        required: '?????a ch??? kh??ng ???????c ????? tr???ng',
                      },
                    }}
                    onPress={this.onSelectProvince}
                    editable={false}
                    inputStyle={[
                      styles.input,
                      this.state.location ? {marginTop: 0} : {},
                    ]}
                    placeholder="Nh???p ?????a ch???"
                    value={this.state.location ? this.state.location : ''}
                    autoCapitalize={'none'}
                    // underlineColorAndroid="transparent"
                    autoCorrect={false}
                  />
                </Field>
                <ScaledImage
                  height={10}
                  source={require('@images/new/account/ic_next.png')}
                />
              </Field>

              {/** Qu???n huy???n */}
              <Field style={[styles.containerField]}>
                <Text style={styles.txLabel}>D??n t???c</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    multiline={true}
                    onPress={this.onSelectNations}
                    editable={false}
                    inputStyle={[styles.input, {textAlignVertical: 'top'}]}
                    placeholder="Ch???n d??n t???c"
                    value={this.state.nation?.name}
                    autoCapitalize={'none'}
                    errorStyle={styles.err}
                    // validate={{
                    //     rules: {
                    //         required: true,
                    //     },
                    //     messages: {
                    //         required: "D??n t???c kh??ng ???????c ????? tr???ng",
                    //     }
                    // }}
                    // underlineColorAndroid="transparent"
                    autoCorrect={false}
                  />
                </Field>
                <ScaledImage
                  height={10}
                  source={require('@images/new/account/ic_next.png')}
                />
              </Field>
              {/** T???nh th??nh ph??? */}
              <Field style={[styles.containerField]}>
                <Text style={styles.txLabel}>Qu???c t???ch</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    multiline={true}
                    onPress={this.onSelectCountry}
                    editable={false}
                    inputStyle={[styles.input]}
                    placeholder="Ch???n qu???c t???ch"
                    errorStyle={styles.err}
                    value={this.state.nationality?.name}
                    autoCapitalize={'none'}
                    // underlineColorAndroid="transparent"
                    autoCorrect={false}
                  />
                </Field>
                <ScaledImage
                  height={10}
                  source={require('@images/new/account/ic_next.png')}
                />
              </Field>
              <Field style={[styles.containerField]}>
                <Text style={styles.txLabel}>Ngh??? nghi???p</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    multiline={true}
                    onPress={this.onSelectJobs}
                    editable={false}
                    inputStyle={[styles.input, {textAlignVertical: 'top'}]}
                    placeholder="Ch???n ngh??? nghi???p"
                    value={this.state.job?.name}
                    autoCapitalize={'none'}
                    errorStyle={styles.err}
                    // validate={{
                    //     rules: {
                    //         required: true,
                    //     },
                    //     messages: {
                    //         required: "D??n t???c kh??ng ???????c ????? tr???ng",
                    //     }
                    // }}
                    // underlineColorAndroid="transparent"
                    autoCorrect={false}
                  />
                </Field>
                <ScaledImage
                  height={10}
                  source={require('@images/new/account/ic_next.png')}
                />
              </Field>

              {/** ?????a ch??? */}
              {(age && age < 14) || age == 0 ? (
                <Field>
                  <Field style={[styles.containerField, {marginTop: 10}]}>
                    <Text style={styles.txLabel}>Ng?????i b???o l??nh</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        multiline={true}
                        onChangeText={this.onChangeText('guardianName')}
                        inputStyle={[styles.input]}
                        placeholder="Nh???p ng?????i b???o l??nh"
                        errorStyle={styles.err}
                        editable={true}
                        value={this._replaceSpace(this.state.guardianName)}
                        autoCapitalize={'none'}
                        // underlineColorAndroid="transparent"
                        autoCorrect={false}
                        validate={{
                          rules: {
                            required: true,
                          },
                          messages: {
                            required: 'Ng?????i b???o l??nh kh??ng ???????c ????? tr???ng',
                          },
                        }}
                      />
                    </Field>
                    <ScaledImage
                      height={10}
                      source={require('@images/new/account/ic_next.png')}
                    />
                  </Field>
                  <Field style={[styles.containerField]}>
                    <Text style={styles.txLabel}>S??T ng?????i b???o l??nh</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        multiline={true}
                        onChangeText={this.onChangeText('guardianPhone')}
                        inputStyle={[styles.input]}
                        placeholder="Nh???p S??T ng?????i b???o l??nh"
                        value={this.state.guardianPhone}
                        autoCapitalize={'none'}
                        keyboardType={'numeric'}
                        errorStyle={styles.err}
                        maxLength={10}
                        numberOfLines={1}
                        validate={{
                          rules: {
                            required: true,
                            phone: true,
                          },
                          messages: {
                            required: 'S??T ng?????i b???o l??nh kh??ng ???????c ????? tr???ng',
                          },
                        }}
                        // underlineColorAndroid="transparent"
                        autoCorrect={false}
                      />
                    </Field>
                    <ScaledImage
                      height={10}
                      source={require('@images/new/account/ic_next.png')}
                    />
                  </Field>
                  <Field style={[styles.containerField]}>
                    <Text
                      style={styles.txLabel}>{`CMTND/HC\nng?????i b???o l??nh`}</Text>
                    <Field
                      style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        flexWrap: 'nowrap',
                      }}>
                      <TextField
                        multiline={true}
                        onChangeText={this.onChangeText('guardianPassport')}
                        inputStyle={[
                          styles.input,
                          {flexWrap: 'nowrap', minWidth: '120%'},
                        ]}
                        placeholder={`Nh???p CMTND/HC ng?????i b???o l??nh`}
                        value={this.state.guardianPassport}
                        errorStyle={[styles.err]}
                        autoCapitalize={'none'}
                        validate={{
                          rules: {
                            maxlength: 13,
                            required: true,
                          },
                          messages: {
                            required:
                              'CMTND/HC ng?????i b???o l??nh kh??ng ???????c ????? tr???ng',
                            maxlength: 'S??? CMND kh??ng ???????c qu?? 13 k?? t???',
                          },
                        }}
                        numberOfLines={1}
                        // underlineColorAndroid="transparent"
                        autoCorrect={false}
                      />
                    </Field>
                    <ScaledImage
                      height={10}
                      source={require('@images/new/account/ic_next.png')}
                    />
                  </Field>
                </Field>
              ) : (
                <Field />
              )}
            </Form>
          </View>
        </KeyboardAwareScrollView>
        <DateTimePicker
          isVisible={this.state.toggleDateTimePickerVisible}
          onConfirm={newDate => {
            this.setState(
              {
                dob: newDate,
                date: newDate.format('dd/MM/yyyy'),
                toggleDateTimePickerVisible: false,
              },
              () => {
                if (this.state.isSave) {
                  this.form.isValid();
                }
              },
            );
          }}
          onCancel={() => {
            this.setState({toggleDateTimePickerVisible: false});
          }}
          date={new Date()}
          minimumDate={minDate}
          maximumDate={new Date()}
          cancelTextIOS={constants.actionSheet.cancel2}
          confirmTextIOS={constants.actionSheet.confirm}
          date={this.state.dob || new Date()}
        />
        <ActionSheet
          ref={o => (this.actionSheetGender = o)}
          options={[
            constants.actionSheet.male,
            constants.actionSheet.female,
            constants.actionSheet.cancel,
          ]}
          cancelButtonIndex={2}
          // destructiveButtonIndex={1}
          onPress={this.onSetGender}
        />
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
            <Text style={styles.txNumber}>
              HMUH Care ???? t??m th???y t??i kho???n s??? h???u s??? ??i???n tho???i{' '}
              {this.state.phone ? this.state.phone : ''} tr??n h??? th???ng.
            </Text>
            <Text style={styles.txDetails}>
              Vui l??ng <Text style={styles.txSend}>G???I</Text> v??{' '}
              <Text style={styles.txSend}>?????I X??C NH???N</Text> m???i quan h??? v???i
              ch??? t??i kho???n tr??n. M???i th??ng tin th??nh vi??n gia ????nh s??? l???y theo
              t??i kho???n s???n c??.
            </Text>
            <TouchableOpacity
              onPress={this.onSendConfirm}
              style={styles.btnConfirm}>
              <Text style={styles.txConfirm}>G???i x??c nh???n</Text>
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
        <ImagePicker ref={ref => (this.imagePicker = ref)} />
      </ActivityPanel>
    );
  }
}
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
export default connect(mapStateToProps)(EditProfileScreen);

const styles = StyleSheet.create({
  errorStyle: {
    color: 'red',
    marginLeft: 13,
  },
  fixMargin: {
    marginTop: -10,
  },
  containerFix: {
    marginTop: 10,
    borderTopColor: '#00000011',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  errFix: {
    bottom: -10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  groupScan: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerScan: {
    backgroundColor: '#FF8A00',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtTitle2: {
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    color: '#fff',
  },
  txtTitle1: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  groupTitle: {
    width: '100%',
    backgroundColor: '#2F61AD',
    paddingVertical: 15,
    // borderBottomWidth: 0.6,
    // borderBottomColor:'#BBB',
    // elevation: 1,
    // shadowColor: '#BBB',
    height: 124,
    // shadowOffset: {
    //     width: 1,
    //     height: 1
    // },
    marginBottom: 50,
    // shadowOpacity: 0.7,
    zIndex: 0,
  },
  container: {
    flex: 1,
    paddingBottom: 40,
    zIndex: 0,
  },
  containerAddress: {
    marginTop: 15,
    borderTopColor: '#BBB',
    borderTopWidth: 0.7,
  },
  txtValue: {
    paddingRight: 10,
    paddingVertical: 13,
    color: '#000',
    fontWeight: 'bold',
    paddingLeft: 20,
    textAlign: 'right',
  },

  txtLabel: {
    paddingRight: 10,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: '#BBB',
    backgroundColor: '#FFF',
  },
  txtOr: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  txtScan: {
    color: '#FFF',
    fontWeight: 'bold',
    paddingVertical: 7,
    textDecorationLine: 'underline',
  },
  icCamera: {
    position: 'absolute',
    bottom: 10,
    right: -6,
  },
  buttonAvatar: {
    // paddingVertical: 20,
    width: 80,
    alignSelf: 'center',
  },
  buttonSave: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  txtSave: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  titleStyle: {
    paddingLeft: 50,
    fontSize: 16,
  },
  placeHolderImage: {width: 80, height: 80},
  image: {
    alignSelf: 'center',
    borderRadius: 40,
    width: 80,
    height: 80,
  },
  borderImage: {
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: 'rgba(151, 151, 151, 0.29)',
  },
  txtSave: {
    color: '#FFF',
  },
  txLabel: {
    left: 10,
    fontSize: 14,
  },
  buttonSave: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  err: {
    fontSize: 12,
    color: 'red',
    fontStyle: 'italic',
    flexWrap: 'nowrap',
    textAlign: 'right',
  },
  txtError: {
    color: 'red',
    paddingLeft: 10,
    paddingTop: 8,
    fontStyle: 'italic',
    flexWrap: 'nowrap',
  },
  scaledImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  input: {
    minHeight: 35,
    textAlign: 'right',
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 10,
    color: '#000',
    fontWeight: 'bold',
    paddingLeft: 20,
    flex: 1 / 2,
    textAlignVertical: 'top',
    marginTop: 20,
    flexWrap: 'nowrap',
  },
  containerField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 1,
    borderBottomColor: '#00000011',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    flex: 1,
    flexWrap: 'nowrap',
    backgroundColor: '#fff',
    // borderTopColor: '#00000011',
    // borderTopWidth: 1
  },
  viewCurrentUser: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#00000011',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#00000011',
    paddingVertical: 20,
    paddingLeft: 25,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  txUserName: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewInfo: {
    flex: 1,
    marginLeft: 20,
  },
  txViewProfile: {
    color: 'gray',
    marginTop: 5,
  },
  btnImage: {
    position: 'relative',
  },
  imageStyle: {
    borderRadius: 35,
    borderWidth: 0.5,
    borderColor: 'rgba(151, 151, 151, 0.29)',
  },
  customImagePlace: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  styleImgLoad: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  viewPopup: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 5,
    alignItems: 'center',
  },
  txSend: {
    color: '#3161ad',
    fontSize: 14,
    fontWeight: 'bold',
  },
  txTitle: {color: '#fff', marginLeft: 50, fontSize: 16},
  btnConfirm: {
    padding: 10,
    backgroundColor: '#3161ad',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  txConfirm: {
    color: '#fff',
    fontSize: 14,
  },
  modalRelation: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  viewPhoneName: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#00CBA7',
  },
  btnCheck: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    alignSelf: 'center',
  },
  viewInfoName: {
    width: '85%',
  },
  txResult: {
    marginVertical: 10,
    color: '#86899B',
    textAlign: 'center',
  },
  txFind: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  imgCheck: {
    alignSelf: 'center',
  },
  viewBtnCheck: {
    width: '15%',
    justifyContent: 'center',
  },
});
