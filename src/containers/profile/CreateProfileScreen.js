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
class CreateProfileScreen extends Component {
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
      name: '',
      disabled: false,
    };
  }
  componentDidMount() {
    // let dataOld = this.props.navigation.getParam('dataOld', null);
    // if (dataOld) {
    //   let dataProfile = dataOld.info || {};
    //   let dataLocationOld = dataOld.info.address;
    //   let country = dataLocationOld?.country || null;
    //   let badInfo = this.props.navigation.getParam('badInfo', false);
    //   let dataLocation = {
    //     districts: dataLocationOld?.district || {},
    //     provinces: dataLocationOld?.province || {},
    //     zone: dataLocationOld?.city || {},
    //     address: dataLocationOld?.village || '',
    //   };
    //   this.setState(
    //     {
    //       avatar: dataProfile && dataProfile.avatar ? dataProfile.avatar : null,
    //       imagePath:
    //         dataProfile && dataProfile.avatar ? dataProfile.avatar : '',
    //       name: dataProfile && dataProfile.fullName ? dataProfile.fullName : '',
    //       date:
    //         dataProfile && dataProfile.dateOfBirth
    //           ? dataProfile.dateOfBirth.toDateObject('-').format('dd/MM/yyyy')
    //           : '',
    //       txGender: dataProfile && dataProfile.gender == 'MALE' ? 'Nam' : 'Nữ',
    //       valueGender: dataProfile.gender,
    //       dobOld:
    //         dataProfile && dataProfile.dateOfBirth
    //           ? dataProfile.dateOfBirth
    //           : '',
    //       // height: dataProfile && dataProfile.height ? dataProfile.height.toString() : '',
    //       // weight: dataProfile && dataProfile.weight ? dataProfile.weight.toString() : '',
    //       // relationshipType: dataProfile && dataProfile.relationshipType ? dataProfile.relationshipType : '',
    //       profileNo:
    //         dataProfile && dataProfile.profileNo ? dataProfile.profileNo : '',
    //       id: (dataOld && dataOld.id) || null,
    //       dob:
    //         dataProfile && dataProfile.dateOfBirth
    //           ? dataProfile.dateOfBirth.toDateObject('-')
    //           : '',
    //       phone: dataProfile && dataProfile.mobileNumber,
    //       guardianPassport: dataProfile?.guardian?.idNumber || '',
    //       guardianName: dataProfile?.guardian?.fullName || '',
    //       guardianPhone: dataProfile?.guardian?.mobileNumber || '',
    //       userPassport: dataProfile?.idNumber || '',
    //       nations: dataProfile?.nation || null,
    //       jobs: dataProfile?.job || null,
    //       status: dataProfile?.status || 0,
    //       dataLocation,
    //       isEdit: true,
    //       badInfo,
    //     },
    //     () => {
    //       this.renderAddress();
    //       this.onLoadDefault(
    //         dataProfile?.nation || null,
    //         dataProfile?.job || null,
    //         dataOld?.country || null,
    //       );
    //     },
    //   );
    // } else {
    //   this.onLoadDefault(null, null, null);
    // }
  }
  onLoadDefault = (nations, jobs, country) => {
    if (!nations) {
      locationProvider
        .getAllNations()
        .then(res => {
          if (res && res.length) {
            this.setState({
              nations: res[0],
            });
          }
        })
        .catch(err => {});
    }
    if (!jobs) {
      locationProvider
        .getAllJobs()
        .then(res => {
          if (res && res.length) {
            this.setState({
              jobs: res[0],
            });
          }
        })
        .catch(err => {});
    }
    if (!country) {
      locationProvider
        .getAllCountry()
        .then(s => {
          if (s.code == 0 && s.data.countries.length) {
            let dataDefault = s.data.countries.filter(obj => obj.code == 'Vi');

            if (dataDefault.length) {
              this.setState({
                country: dataDefault[0],
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

    let district = dataLocation.districts ? dataLocation.districts.name : null;
    let province = dataLocation.provinces
      ? dataLocation.provinces.countryCode
      : null;
    let zone = dataLocation.zone ? dataLocation.zone.name : '';
    let village = dataLocation.address ? dataLocation.address : null;

    if (district && province && zone && village) {
      this.setState(
        {
          location: `${village}\n${zone}\n${district}\n${province}`,
        },
        () => {
          if (this.state.isSave) {
            this.form.isValid();
          }
        },
      );
    } else if (district && province && zone) {
      this.setState(
        {
          location: `${zone}\n${district}\n${province}`,
        },
        () => {
          if (this.state.isSave) {
            this.form.isValid();
          }
        },
      );
    } else if (district && province && village) {
      this.setState(
        {
          location: `${village}\n${district}\n${province}`,
        },
        () => {
          if (this.state.isSave) {
            this.form.isValid();
          }
        },
      );
    } else if (district && province) {
      this.setState(
        {
          location: `${district}\n${province}`,
        },
        () => {
          if (this.state.isSave) {
            this.form.isValid();
          }
        },
      );
    } else if (province && village) {
      this.setState(
        {
          location: `${village}\n${province}`,
        },
        () => {
          if (this.state.isSave) {
            this.form.isValid();
          }
        },
      );
    } else if (province) {
      this.setState(
        {
          location: `${province}`,
        },
        () => {
          if (this.state.isSave) {
            this.form.isValid();
          }
        },
      );
    } else if (village) {
      this.setState(
        {
          location: `${village}`,
        },
        () => {
          if (this.state.isSave) {
            this.form.isValid();
          }
        },
      );
    } else if (!village && !district && !province && !zone) {
      this.setState({
        location: null,
      });
    }
  };
  // componentDidMount = () => {
  //     // this.renderRelation()
  // };

  onShowGender = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      this.actionSheetGender.show();
    }, 250);
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
              txGender: 'Nữ',
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
  onScanQrCode = () => {
    this.props.navigation.navigate('qrcodeScanner', {
      title: 'Quét mã iSofHcare',
      textHelp: 'Di chuyển camera đến vùng chứa mã iSofHcare để quét',
      onCheckData: data => {
        return new Promise((resolve, reject) => {
          this.setState({isofhcareCode: data}, () => {
            resolve();
            this.onScan(data);
          });
        });
      },
    });
  };
  onScan = async data => {
    try {
      let s = await profileProvider.getInfoProfilewithQrcode(data);
      let dataProfile = s;
      if (dataProfile) {
        this.setState({
          isFinding: false,
          findFinish: true,
          userDoesNotExist: 2,
          dataProfile,
          disabled: true,
          phone: dataProfile?.personal?.mobileNumber,
          name: dataProfile?.personal?.fullName
            ? dataProfile?.personal.fullName
            : '',
          date: dataProfile?.personal?.dateOfBirth
            ? dataProfile.personal.dateOfBirth
                .toDateObject('-')
                .format('dd/MM/yyyy')
            : '',
          dob: dataProfile?.personal?.dateOfBirth
            ? dataProfile.personal.dateOfBirth.toDateObject('-')
            : '',
          valueGender: dataProfile?.personal?.gender,
          userPassport: dataProfile?.personal?.idNumber || '',
          guardianPassport: s?.guardian?.idNumber || '',
          guardianName: s?.guardian?.fullName || '',
          guardianPhone: s?.guardian?.mobileNumber || '',
        });
      }
    } catch (error) {
      console.log('error: ', error);
    }
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
              //                     "Cập nhật ảnh đại diện không thành công",
              //                     "danger"
              //                 );
              //             }
              //         })
              //         .catch(e => {
              //             this.setState({ isLoading: false }, () => { });
              //             snackbar.show(
              //                 "Cập nhật ảnh đại diện không thành công",
              //                 "danger"
              //             );
              //         });
              // });
              // }
            })
            .catch(e => {
              this.setState({isLoading: false}, () => {});
              snackbar.show('Upload ảnh không thành công', 'danger');
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
  selectCountry(country) {
    this.setState({country}, () => {
      if (this.state.isSave) {
        this.form.isValid();
      }
    });
  }
  selectNations(nations) {
    this.setState({nations}, () => {
      if (this.state.isSave) {
        this.form.isValid();
      }
    });
  }
  selectJobs(jobs) {
    this.setState({jobs}, () => {
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
      country: this.state.country,
    });
  };
  fixedEncodeURIComponent = str => {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };
  onCreateProfile = () => {
    this.setState({isSave: true}, () => {
      Keyboard.dismiss();
      if (!this.form.isValid()) {
        return;
      }
      if (!this.form2.isValid()) {
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

              let age = this.state.dob
                ? new Date().getFullYear() - this.state.dob.getFullYear()
                : null;
              let data = {};
              if (age == 0 || age < 14) {
                data = {
                  relationshipType: this.state.relation,
                  profileInfo: {
                    personal: {
                      avatar: this.state.imagePath,
                      fullName: this.state.name.trim(),
                      dob: this.state.dob
                        ? this.state.dob.format('yyyy-MM-dd')
                        : null,
                      gender: this.state.valueGender,
                      mobileNumber: this.state.phone,
                      idNumber: this.state.userPassport,
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
                  },
                };
              } else if (age >= 14) {
                data = {
                  relationshipType: this.state.relation,
                  profileInfo: {
                    personal: {
                      avatar: this.state.imagePath,
                      fullName: this.state.name.trim(),
                      dateOfBirth: this.state.dob
                        ? this.state.dob.format('yyyy-MM-dd')
                        : null,
                      gender: this.state.valueGender,
                      mobileNumber: this.state.phone,
                      idNumber: this.state.userPassport,
                      relationshipType: this.state.relation,
                    },
                  },
                };
              }

              profileProvider
                .createProfile(data)
                .then(res => {
                  console.log('res: ', res);
                  this.setState({
                    isLoading: false,
                  });

                  if (res?.profileRegistryId) {
                    NavigationService.navigate('verifyPhoneProfile', {
                      profileRegistryId: res.profileRegistryId,
                      phone: this.state.phone,
                    });
                  } else {
                    snackbar.show(
                      res?.defaultProfile
                        ? 'Đã gửi lời mời tới thành viên'
                        : 'Thêm thành viên thành công',
                      'success',
                    );
                    NavigationService.navigate('listProfileUser', {
                      reset: this.state.reset + 1,
                    });
                  }
                })
                .catch(err => {
                  this.setState({
                    isLoading: false,
                  });
                  if (err?.response?.status == 409) {
                    snackbar.show(
                      constants.msg.user.phone_exits_in_list_profile,
                      'danger',
                    );
                    return;
                  }
                  snackbar.show(constants.msg.user.add_member_fail, 'danger');
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
      return value + `- ${date.getAge()} tuổi`;
    } else {
      return 'Chọn ngày sinh';
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
    Keyboard.dismiss();
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
  onFinding = () => {
    if (!this.form2.isValid()) {
      return;
    }
    this.setState(
      {
        isFinding: true,
      },
      () => {
        // let encode = encodeURI(this.state.name)
        let data = {
          mobileNumber: this.state.phone,
          fullName: this.state.name.toString(),
        };
        profileProvider
          .getInfoProfile(data)
          .then(s => {
            if (s.resultMessage == 'FRIEND_CREATED_ALREADY_EXISTS') {
              this.setState({
                isFinding: false,
                findFinish: false,
                // userDoesNotExist: 1,
              });
              snackbar.show(
                'SĐT đã tồn tại trong danh sách hồ sơ của bạn',
                'danger',
              );
              return;
            }
            if (s?.resultMessage == 'PROFILE_INFO_ALREADY_EXISTS') {
              this.setState({
                isFinding: false,
                findFinish: false,
                // userDoesNotExist: 1,
              });
              snackbar.show(
                'Đã tồn tại thông tin thành viên trong danh sách',
                'danger',
              );
              return;
            }
            if (!s?.profileInfo?.guardian && !s?.profileInfo?.personal) {
              this.setState({
                isFinding: false,
                findFinish: true,
                userDoesNotExist: 1,
                disabled: false,
                dataProfile: {},
                date: null,
                dob: null,
                valueGender: null,
                userPassport: null,
                guardianPassport: null,
                guardianName: null,
                guardianPhone: null,
              });
            } else {
              let dataProfile = s.profileInfo || {};

              this.setState({
                isFinding: false,
                findFinish: true,
                userDoesNotExist: 2,
                dataProfile,
                disabled: true,
                name: dataProfile?.personal?.fullName
                  ? dataProfile?.personal.fullName
                  : '',
                date: dataProfile?.personal?.dateOfBirth
                  ? dataProfile.personal.dateOfBirth
                      .toDateObject('-')
                      .format('dd/MM/yyyy')
                  : '',
                dob: dataProfile?.personal?.dateOfBirth
                  ? dataProfile.personal.dateOfBirth.toDateObject('-')
                  : '',
                valueGender: dataProfile?.personal?.gender,
                userPassport: dataProfile?.personal?.idNumber || '',
                guardianPassport: s.profileInfo?.guardian?.idNumber || '',
                guardianName: s.profileInfo?.guardian?.fullName || '',
                guardianPhone: s.profileInfo?.guardian?.mobileNumber || '',
              });
            }
          })
          .catch(err => {
            this.setState({
              isFinding: false,
            });
            snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại.', 'danger');
          });
      },
    );
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
        title={
          this.state.isEdit
            ? this.state.badInfo
              ? 'Hoàn thành hồ sơ'
              : 'Chỉnh sửa hồ sơ'
            : 'Thêm mới hồ sơ'
        }
        isLoading={isLoading}
        menuButton={
          !this.state.findFinish ? null : (
            <TouchableOpacity
              onPress={this.onCreateProfile}
              style={styles.buttonSave}>
              <Text style={styles.txtSave}>Lưu</Text>
            </TouchableOpacity>
          )
        }
        containerStyle={{backgroundColor: '#f8f8f8'}}
        titleStyle={styles.titleStyle}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {this.state.badInfo ? (
              <View style={styles.groupTitle}>
                <Text style={[styles.txtTitle1, {fontSize: 14}]}>
                  Hoàn thiện hồ sơ trước khi thêm thành viên !
                </Text>
                {/* <Text style={styles.txtTitle2}>Hồ sơ được sử dụng để đặt khám do đó chỉ có thể sửa hồ sơ tại nơi khám.</Text> */}
              </View>
            ) : (
              <View />
            )}
            <View>
              <Text style={styles.txScanCode}>
                Quét Mã iSofHcare của thành viên để điền thông tin tự động
              </Text>
              <TouchableOpacity
                onPress={this.onScanQrCode}
                style={styles.btnQrCode}>
                <ScaledImage
                  source={require('@images/new/profile/ic_qr.png')}
                  height={23}
                />
                <Text style={styles.txScanQr}>QUÉT MÃ ISOFHCARE</Text>
              </TouchableOpacity>
              <Text style={styles.txOr}>Hoặc</Text>
              <Text style={styles.inputInfo}>NHẬP THÔNG TIN THÀNH VIÊN</Text>
            </View>
            <Form ref={ref => (this.form2 = ref)}>
              <Field style={styles.viewPhoneName}>
                <Field style={styles.viewInfoName}>
                  <Field
                    style={[
                      styles.containerField,
                      {
                        borderTopColor: '#00000011',
                        borderTopWidth: 1,
                      },
                    ]}>
                    <Text style={styles.txLabel}>Họ và tên</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        errorStyle={[styles.err]}
                        validate={{
                          rules: {
                            required: true,
                          },
                          messages: {
                            required: 'Họ và tên không được để trống',
                          },
                        }}
                        onBlur={this.onBlur}
                        placeholder={'Nhập họ và tên'}
                        multiline={true}
                        inputStyle={[styles.input]}
                        onChangeText={this.onChangeText('name')}
                        value={this._replaceSpace(this.state.name)}
                        autoCapitalize={'none'}
                        editable={!this.state.disabled}
                        autoCorrect={false}
                      />
                    </Field>
                    <Field />
                  </Field>

                  <Field style={[styles.containerField]}>
                    <Text style={styles.txLabel}>Số điện thoại</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        multiline={true}
                        onChangeText={this.onChangeText('phone')}
                        inputStyle={[styles.input]}
                        placeholder="Nhập số điện thoại"
                        value={this.state.phone}
                        errorStyle={styles.err}
                        editable={!this.state.disabled}
                        maxLength={10}
                        autoCapitalize={'none'}
                        onBlur={this.onBlur}
                        validate={{
                          rules: {
                            required: true,
                            phone: true,
                          },
                          messages: {
                            required: 'Số điện thoại không được để trống',
                          },
                        }}
                        // underlineColorAndroid="transparent"
                        autoCorrect={false}
                        keyboardType={'numeric'}
                      />
                    </Field>
                    <Field />
                  </Field>
                </Field>
                <View style={styles.viewBtnCheck}>
                  {this.state.isFinding ? (
                    <ActivityIndicator color={'#fff'} />
                  ) : (
                    <TouchableOpacity
                      onPress={this.onFinding}
                      style={styles.btnCheck}>
                      <ScaledImage
                        style={styles.imgCheck}
                        source={require('@images/new/profile/ic_check_info.png')}
                        height={23}
                      />
                      <Text style={styles.txFind}>Tìm</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Field>
            </Form>
            <Form ref={ref => (this.form = ref)}>
              {/** Văn bằng chuyên môn */}

              {this.state.userDoesNotExist == 2 ? (
                <Text style={styles.txResult}>
                  Tìm thấy thông tin thành viên
                </Text>
              ) : this.state.userDoesNotExist == 1 ? (
                <Text style={styles.txResult}>
                  Thành viên không tồn tại, vui lòng nhập thông tin!
                </Text>
              ) : (
                <Text style={styles.txResult} />
              )}

              {this.state.findFinish ? (
                <Field>
                  <Field style={[styles.containerField]}>
                    <Text style={styles.txLabel}>Quan hệ</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        multiline={true}
                        onPress={this.onSelectRelation}
                        editable={false}
                        inputStyle={[styles.input, {textAlignVertical: 'top'}]}
                        placeholder="Chọn quan hệ"
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
                        //         required: "Dân tộc không được để trống",
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
                  {/** Học vị */}
                  <Field style={[styles.containerField]}>
                    <Text style={styles.txLabel}>Ngày sinh</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        multiline={true}
                        dateFormat={'dd/MM/yyyy'}
                        errorStyle={styles.err}
                        splitDate={'/'}
                        onPress={() => {
                          Keyboard.dismiss();
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
                            required: 'Ngày sinh không được để trống',
                          },
                        }}
                        disabled={this.state.disabled}
                        editable={false}
                        inputStyle={[styles.input]}
                        placeholder="Chọn ngày sinh"
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
                    <Text style={styles.txLabel}>Giới tính</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        errorStyle={styles.err}
                        multiline={true}
                        onPress={this.onShowGender}
                        disabled={this.state.disabled}
                        editable={false}
                        inputStyle={[styles.input]}
                        placeholder="Chọn giới tính"
                        value={
                          this.state.valueGender == 'FEMALE'
                            ? 'Nữ'
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
                            required: 'Giới tính không được để trống',
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
                  <Field>
                    <Field style={[styles.containerField]}>
                      <Text style={styles.txLabel}>Số CMND</Text>
                      <Field style={{flex: 1}}>
                        <TextField
                          multiline={true}
                          onChangeText={this.onChangeText('userPassport')}
                          inputStyle={[styles.input]}
                          placeholder="Nhập số CMND"
                          value={this.state.userPassport}
                          errorStyle={[styles.err, {flexWrap: 'nowrap'}]}
                          autoCapitalize={'none'}
                          validate={{
                            rules: {
                              maxlength: 13,
                            },
                            messages: {
                              maxlength: 'Số CMND không được quá 13 ký tự',
                            },
                          }}
                          // underlineColorAndroid="transparent"
                          autoCorrect={false}
                          keyboardType={'numeric'}
                          editable={!this.state.disabled}
                        />
                      </Field>
                      <ScaledImage
                        height={10}
                        source={require('@images/new/account/ic_next.png')}
                      />
                    </Field>
                  </Field>
                  {/** Địa chỉ */}
                  {(age && age < 14) || age == 0 ? (
                    <Field>
                      <Field style={[styles.containerField, {marginTop: 10}]}>
                        <Text style={styles.txLabel}>Người bảo lãnh</Text>
                        <Field style={{flex: 1}}>
                          <TextField
                            multiline={true}
                            onChangeText={this.onChangeText('guardianName')}
                            inputStyle={[styles.input]}
                            placeholder="Nhập người bảo lãnh"
                            errorStyle={styles.err}
                            editable={!this.state.disabled}
                            value={this._replaceSpace(this.state.guardianName)}
                            autoCapitalize={'none'}
                            // underlineColorAndroid="transparent"
                            autoCorrect={false}
                            validate={{
                              rules: {
                                required: true,
                              },
                              messages: {
                                required: 'Người bảo lãnh không được để trống',
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
                        <Text style={styles.txLabel}>SĐT người bảo lãnh</Text>
                        <Field style={{flex: 1}}>
                          <TextField
                            multiline={true}
                            onChangeText={this.onChangeText('guardianPhone')}
                            inputStyle={[styles.input]}
                            placeholder="Nhập SĐT người bảo lãnh"
                            value={this.state.guardianPhone}
                            autoCapitalize={'none'}
                            editable={!this.state.disabled}
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
                                required:
                                  'SĐT người bảo lãnh không được để trống',
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
                          style={
                            styles.txLabel
                          }>{`CMTND/HC\nngười bảo lãnh`}</Text>
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
                            placeholder={`Nhập CMTND/HC người bảo lãnh`}
                            value={this.state.guardianPassport}
                            errorStyle={[styles.err]}
                            autoCapitalize={'none'}
                            editable={!this.state.disabled}
                            validate={{
                              rules: {
                                required: true,
                                maxlength: 13,
                              },
                              messages: {
                                required:
                                  'CMTND/HC người bảo lãnh không được để trống',
                                maxlength: 'Số CMND không được quá 13 ký tự',
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
              HMUH Care đã tìm thấy tài khoản sở hữu số điện thoại{' '}
              {this.state.phone ? this.state.phone : ''} trên hệ thống.
            </Text>
            <Text style={styles.txDetails}>
              Vui lòng <Text style={styles.txSend}>GỬI</Text> và{' '}
              <Text style={styles.txSend}>ĐỢI XÁC NHẬN</Text> mối quan hệ với
              chủ tài khoản trên. Mọi thông tin thành viên gia đình sẽ lấy theo
              tài khoản sẵn có.
            </Text>
            <TouchableOpacity
              onPress={this.onSendConfirm}
              style={styles.btnConfirm}>
              <Text style={styles.txConfirm}>Gửi xác nhận</Text>
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
export default connect(mapStateToProps)(CreateProfileScreen);

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
    position: 'absolute',
    top: 84,
    zIndex: 1000,
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
    paddingVertical: 3,
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
  btnQrCode: {
    width: '70%',
    backgroundColor: '#2f61ad',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 51,
    borderRadius: 6,
    marginVertical: 20,
  },
  txScanQr: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  txOr: {
    color: '#808080',
    textAlign: 'center',
  },
  inputInfo: {
    fontSize: 16,
    color: '#3161ad',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  txScanCode: {
    textAlign: 'center',
    fontSize: 16,
    color: '#808080',
    width: '70%',
    alignSelf: 'center',
    marginTop: 20,
  },
});
