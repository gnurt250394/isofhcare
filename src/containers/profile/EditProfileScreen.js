import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import {connect} from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import medicalRecordProvider from '@data-access/medical-record-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
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
import userProvider from '@data-access/user-provider';
import connectionUtils from '@utils/connection-utils';
import dateUtils from 'mainam-react-native-date-utils';

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    let data = this.props.navigation.getParam('item', null);
    console.log('data: ', data);

    let dataProfile = data?.medicalRecords || {};
    let country = data?.country || {};
    let district = data?.district || {};
    let province = data?.province || {};
    let zone = data?.zone || {};
    let address =
      (zone?.name ? zone?.name + ', ' : '') +
      (district?.name ? district?.name + ', ' : '') +
      (province?.name ? province?.name + ', ' : '');
    this.state = {
      item: data,
      avatar:
        data && data.medicalRecords && data.medicalRecords.avatar
          ? {uri: data.medicalRecords.avatar.absoluteUrl()}
          : require('@images/new/user.png'),
      name: dataProfile && dataProfile.name ? dataProfile.name : '',
      date:
        dataProfile && dataProfile.dob
          ? dataProfile.dob.toDateObject('-').format('dd/MM/yyyy')
          : '',
      txGender: dataProfile && dataProfile.gender == 1 ? 'Nam' : 'Nữ',
      gender: dataProfile && dataProfile.gender ? dataProfile.gender : 0,
      dobOld: dataProfile && dataProfile.dob ? dataProfile.dob : '',
      height:
        dataProfile && dataProfile.height ? dataProfile.height.toString() : '',
      weight:
        dataProfile && dataProfile.weight ? dataProfile.weight.toString() : '',
      address: address,
      relationshipType:
        dataProfile && dataProfile.relationshipType
          ? dataProfile.relationshipType
          : '',
      profileNo:
        dataProfile && dataProfile.profileNo ? dataProfile.profileNo : '',
      id: dataProfile && dataProfile.id,
      dob:
        dataProfile && dataProfile.dob ? dataProfile.dob.toDateObject('-') : '',
      phone: dataProfile && dataProfile.phone,
      email: dataProfile && dataProfile.mail,
      data: dataProfile ? dataProfile : {},
      country,
      districts: district,
      provinces: province,
      zone,
      isReset: 1,
      isLoading: false,
      image: null,
      nation: dataProfile?.nation,
    };
  }
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
  renderRelation = () => {
    switch (this.state.relationshipType) {
      case 'DAD':
        this.setState({
          relationShip: {
            id: 1,
            name: 'Cha',
            type: 'DAD',
          },
        });
        break;
      case 'MOTHER':
        this.setState({
          relationShip: {
            id: 2,
            name: 'Mẹ',
            type: 'MOTHER',
          },
        });
        break;
      case 'BOY':
        this.setState({
          relationShip: {
            id: 3,
            name: 'Con trai',
            type: 'BOY',
          },
        });
        break;
      case 'DAUGHTER':
        this.setState({
          relationShip: {
            id: 4,
            name: 'Con gái',
            type: 'DAUGHTER',
          },
        });
        break;
      case 'GRANDSON':
        this.setState({
          relationShip: {
            id: 5,
            name: 'Cháu trai',
            type: 'GRANDSON',
          },
        });
        break;
      case 'NIECE':
        this.setState({
          relationShip: {
            id: 6,
            name: 'Cháu gái',
            type: 'NIECE',
          },
        });
        break;
      case 'GRANDFATHER':
        this.setState({
          relationShip: {
            id: 7,
            name: 'Ông',
            type: 'GRANDFATHER',
          },
        });
        break;
      case 'GRANDMOTHER':
        this.setState({
          relationShip: {
            id: 8,
            name: 'Bà',
            type: 'GRANDMOTHER',
          },
        });
        break;
      case 'WIFE':
        this.setState({
          relationShip: {
            id: 9,
            name: 'Vợ',
            type: 'WIFE',
          },
        });
        break;
      case 'HUSBAND':
        this.setState({
          relationShip: {
            id: 10,
            name: 'Chồng',
            type: 'HUSBAND',
          },
        });
        break;
      case 'OTHER':
        this.setState({
          relationShip: {
            id: 11,
            name: 'Khác',
            type: 'OTHER',
          },
        });
        break;
    }
  };
  getDetailUser = async () => {
    try {
      let res = await userProvider.getDetailsProfile(
        this.props.userApp?.currentUser?.id,
      );
      if (res) {
        this.setState({
          avatar: res.avatar
            ? {uri: res.avatar.absoluteUrl()}
            : require('@images/new/user.png'),
          name: res && res.name ? res.name : '',
          date:
            res && res.dob
              ? res.dob.toDateObject('-').format('dd/MM/yyyy')
              : '',
          txGender: res && res.gender == 1 ? 'Nam' : 'Nữ',
          gender: res && res.gender ? res.gender : 0,
          dobOld: res && res.dob ? res.dob : '',
          height: res && res.height ? res.height.toString() : '',
          weight: res && res.weight ? res.weight.toString() : '',
          address: res.address,
          relationshipType:
            res && res.relationshipType ? res.relationshipType : '',
          profileNo: res && res.profileNo ? res.profileNo : '',
          id: res && res.id,
          dob: res && res.dob ? res.dob.toDateObject('-') : '',
          phone: res && res.phone,
          email: res && res.mail,
          data: res ? res : {},
          nation: res?.nation,
          userPassport: res.passport,
        });
      }
      console.log('res: ', res);
    } catch (error) {
      console.log('error: ', error);
    }
  };
  componentDidMount = () => {
    this.renderRelation();
    this.getDetailUser();
  };

  onShowGender = () => {
    this.actionSheetGender.show();
  };
  onSetGender = index => {
    try {
      switch (index) {
        case 0:
          this.setState({
            valueGender: '1',
            txGender: 'Nam',
            relationShip: null,
          });
          return;
        case 1:
          this.setState({
            valueGender: '0',
            txGender: 'Nữ',
            relationShip: null,
          });
          return;
      }
    } catch (error) {}
  };
  onSelectRelationShip = () => {
    this.props.navigation.navigate('selectRelationship', {
      onSelected: this.selectRelationShip.bind(this),
      gender: this.state.gender,
      // id: this.state.relationShip.id
    });
  };
  onChangeText = type => text => {
    this.setState({[type]: text});
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
  selectImage = () => {
    if (this.imagePicker) {
      this.imagePicker.open(true, 200, 200, image => {
        this.setState({isLoading: true}, () => {
          imageProvider
            .upload(image.path, image.mime)
            .then(s => {
              this.setState({
                avatar: {
                  uri: s.data.data.images[0].thumbnail.absoluteUrl(),
                  isLoading: false,
                },
              });
              // this.setState({ isLoading: false }, () => {
              //     if (s && s.data.code == 0) {
              //         let user = objectUtils.clone(this.props.userApp.currentUser);
              //         user.avatar = s.data.data.images[0].thumbnail;
              //         this.setState({ isLoading: true }, () => {
              //             userProvider
              //                 .update(this.props.userApp.currentUser.id, user)
              //                 .then(s => {
              //                     this.setState({ isLoading: false }, () => { });
              //                     if (s.code == 0) {
              //                         var user = s.data.user;
              //                         let current = this.props.userApp.currentUser;
              //                         user.bookingNumberHospital = current.bookingNumberHospital;
              //                         user.bookingStatus = current.bookingStatus;
              //                         this.props.dispatch(redux.userLogin(user));
              //                     } else {
              //                         snackbar.show(
              //                             "Cập nhật ảnh đại diện không thành công",
              //                             "danger"
              //                         );
              //                     }
              //                 })
              //                 .catch(e => {
              //                     this.setState({ isLoading: false }, () => { });
              //                     snackbar.show(
              //                         "Cập nhật ảnh đại diện không thành công",
              //                         "danger"
              //                     );
              //                 });
              //         });
              //     }
              // });
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
    const {provinces, districts, zone, address} = this.state;
    this.props.navigation.navigate('selectAddress', {
      onSelected: this.selectprovinces.bind(this),
      provinces,
      districts,
      zone,
      address,
    });
  };
  selectprovinces({provinces, districts, zone, address}) {
    console.log('districts: ', districts);
    console.log('zone: ', zone);
    console.log('address: ', address);
    let addr =
      (address ? address + ', ' : '') +
      (zone?.name ? zone?.name + ', ' : '') +
      (districts?.name ? districts?.name + ', ' : '') +
      (provinces?.name ? provinces?.name : '');
    this.setState({provinces, districts, zone, address: addr});
  }
  selectCountry(country) {
    this.setState({country});
  }
  renderAddress = () => {
    const {provinces, districts, zone} = this.state;
    let value = '';
    let address = this.state.address ? this.state.address + ' - ' : '';
    if (provinces && districts && zone) {
      value =
        address +
        ' ' +
        zone.name +
        ' - ' +
        districts.name +
        ' - ' +
        provinces.countryCode;
    }
    return value;
  };
  selectNations = nation => {
    console.log('nation: ', nation);
    this.setState({nation});
  };
  onSelectCountry = () => {
    this.props.navigation.navigate('selectCountry', {
      onSelected: this.selectCountry.bind(this),
    });
  };
  onSelectNation = () => {
    this.props.navigation.navigate('selectNations', {
      onSelected: this.selectNations.bind(this),
    });
  };
  onCreateProfile = () => {
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

            let data = {
              name: this.state.name,
              dob: this.state.dob ? this.state.dob.format('yyyy-MM-dd') : null,
              gender: this.state.gender ? this.state.gender?.toString() : '0',
              passport: this.state.userPassport
                ? this.state.userPassport
                : null,
              height: this.state.height ? Number(this.state.height) : 0,
              weight: this.state.weight
                ? Number(parseFloat(this.state.weight).toFixed(1))
                : 0,
              phone: this.state.phone,
              provinceId: this.state.provinces?.id
                ? this.state.provinces.id.toString()
                : null,
              districtId: this.state.districts?.id
                ? this.state.districts.id.toString()
                : null,
              zoneId: this.state.zone?.id
                ? this.state.zone.id.toString()
                : null,
              village: this.state.address ? this.state.address : ' ',
              nationId: this.state.nation?.id ? this.state.nation?.id : ' ',
              countryId: this.state.country?.id ? this.state.country?.id : ' ',
              mail: this.state.email ? this.state.email : ' ',
              relationshipType:
                this.state.relationShip && this.state.relationShip.type
                  ? this.state.relationShip.type
                  : this.state.relationshipType || null,
            };
            profileProvider
              .updateProfile(id, data)
              .then(res => {
                this.setState({isLoading: false});
                switch (res.code) {
                  case 0:
                    this.props.navigation.pop();
                    snackbar.show('Cập nhật hồ sơ thành công', 'success');
                    break;
                  case 1:
                    snackbar.show(
                      'Bạn không có quyền chỉnh sửa hồ sơ này',
                      'danger',
                    );
                    break;
                  case 2:
                    snackbar.show(
                      'Bạn đang không đăng nhập với ứng dụng bệnh nhân',
                      'danger',
                    );
                    break;
                  default:
                    snackbar.show('Cập nhật hồ sơ thất bại', 'danger');
                    break;
                }
              })
              .catch(err => {
                snackbar.show('Cập nhật hồ sơ thất bại', 'danger');
                this.setState({isLoading: false});
              });
          },
        );
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, 'danger');
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
  render() {
    const {item, avatar, isLoading} = this.state;
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
        title={this.state.item ? 'Chỉnh sửa hồ sơ' : 'Thêm mới hồ sơ'}
        isLoading={isLoading}
        menuButton={
          <TouchableOpacity
            onPress={this.onCreateProfile}
            style={styles.buttonSave}>
            <Text style={styles.txtSave}>Lưu</Text>
          </TouchableOpacity>
        }
        containerStyle={{backgroundColor: '#f8f8f8'}}
        titleStyle={styles.titleStyle}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.groupTitle}>
              <Text style={styles.txtTitle1}>
                Vui lòng nhập thông tin chính xác!
              </Text>
              <Text style={styles.txtTitle2}>
                Hồ sơ được sử dụng để đặt khám do đó chỉ có thể sửa hồ sơ tại
                nơi khám.
              </Text>
            </View>
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
                placeholderSource={require('@images/new/user.png')}
                resizeMode="cover"
                loadingStyle={{size: 'small', color: 'gray'}}
                source={avatar}
                style={styles.image}
                defaultImage={this.defaultImage}
              />
              <ScaledImage
                source={require('@images/new/profile/ic_camera.png')}
                height={18}
                style={styles.icCamera}
              />
            </TouchableOpacity>
            {/* <View style={styles.containerScan}>
                                <View style={styles.groupScan}>
                                    <Text style={styles.txtScan}>QUÉT CMND </Text>
                                    <Text style={styles.txtOr}> hoặc </Text>
                                    <Text style={styles.txtScan}>QUÉT BẢO HIỂM Y TẾ</Text>
                                </View>
                                <Text style={styles.txtOr}>Để điền thông tin nhanh hơn!</Text>
                            </View> */}
            <Form ref={ref => (this.form = ref)}>
              {/** Văn bằng chuyên môn */}
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
                    placeholder={'Nhập họ và tên'}
                    multiline={true}
                    inputStyle={[styles.input]}
                    onChangeText={this.onChangeText('name')}
                    value={this.state.name}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    editable={this.state.status == 'ACTIVE' ? false : true}
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
                      this.setState({toggelDateTimePickerVisible: true});
                    }}
                    validate={{
                      rules: {
                        required: true,
                      },
                      messages: {
                        required: 'Ngày sinh không được để trống',
                      },
                    }}
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
                    editable={false}
                    inputStyle={[styles.input]}
                    placeholder="Chọn giới tính"
                    value={
                      !this.state.gender && this.state.gender !== 0
                        ? ''
                        : this.state.gender == 0
                        ? 'Nữ'
                        : 'Nam'
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
              <Field style={[styles.containerField]}>
                <Text style={styles.txLabel}>Email</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    errorStyle={[styles.err]}
                    validate={{
                      rules: {
                        required: true,
                        email: true,
                      },
                      messages: {
                        required: 'Email không được để trống',
                        email: 'Email không đúng định dạng',
                      },
                    }}
                    placeholder={'Nhập email'}
                    multiline={true}
                    inputStyle={[styles.input]}
                    onChangeText={this.onChangeText('email')}
                    value={this.state.email}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    editable={this.state.status == 'ACTIVE' ? false : true}
                  />
                </Field>
                <ScaledImage
                  height={10}
                  source={require('@images/new/account/ic_next.png')}
                />
              </Field>
              {/** Tỉnh thành phố */}
              <Field
                style={[
                  styles.containerField,
                  {
                    marginTop: 10,
                    borderTopColor: '#00000011',
                    borderTopWidth: 1,
                  },
                ]}>
                <Text style={styles.txLabel}>Địa chỉ</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    multiline={true}
                    errorStyle={styles.err}
                    validate={{
                      rules: {
                        required: true,
                      },
                      messages: {
                        required: 'Địa chỉ không được để trống',
                      },
                    }}
                    onPress={this.onSelectProvince}
                    editable={false}
                    value={this.state.address}
                    inputStyle={[styles.input]}
                    placeholder="Nhập địa chỉ"
                    autoCapitalize={'none'}
                    autoCorrect={false}
                  />
                </Field>
                <ScaledImage
                  height={10}
                  source={require('@images/new/account/ic_next.png')}
                />
              </Field>
              {/** Quận huyện */}
              <Field style={[styles.containerField]}>
                <Text style={styles.txLabel}>Dân tộc</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    multiline={true}
                    onPress={this.onSelectNation}
                    editable={false}
                    inputStyle={[styles.input]}
                    placeholder="Chọn dân tộc"
                    value={this.state.nation?.name}
                    autoCapitalize={'none'}
                    errorStyle={styles.err}
                    validate={{
                      rules: {
                        required: true,
                      },
                      messages: {
                        required: 'Dân tộc không được để trống',
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
              {/** Tỉnh thành phố */}
              <Field style={[styles.containerField]}>
                <Text style={styles.txLabel}>Quốc tịch</Text>
                <Field style={{flex: 1}}>
                  <TextField
                    multiline={true}
                    onPress={this.onSelectCountry}
                    editable={false}
                    inputStyle={[styles.input]}
                    placeholder="Chọn quốc tịch"
                    errorStyle={styles.err}
                    validate={{
                      rules: {
                        required: true,
                      },
                      messages: {
                        required: 'Quốc tịch không được để trống',
                      },
                    }}
                    value={
                      this.state.country && this.state.country
                        ? this.state.country.name
                        : ''
                    }
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

              {/** Địa chỉ */}
              {age && age < 14 ? (
                <Field>
                  <Field style={[styles.containerField, {marginTop: 10}]}>
                    <Text style={styles.txLabel}>Người bảo lãnh</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        multiline={true}
                        onChangeText={this.onChangeText('guardianName')}
                        inputStyle={[styles.input]}
                        placeholder="Nhập người bảo lãnh"
                        value={this.state.guardianName}
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
                    <Text style={styles.txLabel}>SDT người bảo lãnh</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        multiline={true}
                        onChangeText={this.onChangeText('guardianPhone')}
                        inputStyle={[styles.input]}
                        placeholder="Nhập SDT người bảo lãnh"
                        value={this.state.guardianPhone}
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
                    <Text style={styles.txLabel}>CMTND/HC người bảo lãnh</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        multiline={true}
                        onChangeText={this.onChangeText('guardianPassport')}
                        inputStyle={[styles.input]}
                        placeholder="Nhập CMTND/HC người bảo lãnh"
                        value={this.state.guardianPassport}
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
                </Field>
              ) : (
                <Field>
                  <Field style={[styles.containerField, {marginTop: 10}]}>
                    <Text style={styles.txLabel}>Số điện thoại</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        multiline={true}
                        onChangeText={this.onChangeText('phone')}
                        inputStyle={[styles.input]}
                        placeholder="Nhập số điện thoại"
                        value={this.state.phone}
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
                    <Text style={styles.txLabel}>Số CMND</Text>
                    <Field style={{flex: 1}}>
                      <TextField
                        multiline={true}
                        onChangeText={this.onChangeText('userPassport')}
                        inputStyle={[styles.input]}
                        placeholder="Nhập số CMND"
                        value={this.state.userPassport}
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
                </Field>
              )}
            </Form>
          </View>
        </ScrollView>
        <DateTimePicker
          isVisible={this.state.toggelDateTimePickerVisible}
          onConfirm={newDate => {
            this.setState(
              {
                dob: newDate,
                date: newDate.format('dd/MM/yyyy'),
                toggelDateTimePickerVisible: false,
              },
              () => {},
            );
          }}
          onCancel={() => {
            this.setState({toggelDateTimePickerVisible: false});
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
  },
  txtTitle1: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  groupTitle: {
    width: '100%',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    // borderBottomWidth: 0.6,
    // borderBottomColor:'#BBB',
    elevation: 1,
    shadowColor: '#BBB',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.7,
  },
  container: {
    flex: 1,
    paddingBottom: 40,
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
    bottom: 20,
    right: 4,
  },
  buttonAvatar: {
    paddingVertical: 20,
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
    position: 'absolute',
    left: 10,
    fontSize: 14,
  },
  buttonSave: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  err: {
    fontSize: 14,
    color: 'red',
    position: 'absolute',
    bottom: -5,
    right: 10,
    fontStyle: 'italic',
  },
  txtError: {
    color: 'red',
    paddingLeft: 10,
    paddingTop: 8,
    fontStyle: 'italic',
  },
  scaledImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  input: {
    minHeight: 40,
    textAlign: 'right',
    paddingRight: 10,
    color: '#000',
    fontWeight: 'bold',
    paddingLeft: 50,
    flex: 1,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  containerField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomColor: '#00000011',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    flex: 1,
    flexWrap: 'wrap',
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
});
