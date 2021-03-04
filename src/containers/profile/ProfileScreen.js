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
import {connect} from 'react-redux';
import ImageLoad from 'mainam-react-native-image-loader';
import constants from '@resources/strings';
import profileProvider from '@data-access/profile-provider';
import Form from 'mainam-react-native-form-validate/Form';
import Field from 'mainam-react-native-form-validate/Field';
import TextField from 'mainam-react-native-form-validate/TextField';
import snackbar from '@utils/snackbar-utils';
import imageProvider from '@data-access/image-provider';
import connectionUtils from '@utils/connection-utils';
import dateUtils from 'mainam-react-native-date-utils';
import NavigationService from '@navigators/NavigationService';
import objectUtils from '@utils/object-utils';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    let id = this.props.navigation.getParam('id', null);
    this.state = {
      id,
      dataProfile: {},
    };
  }
  componentDidMount() {
    // this.onFocus = this.props.navigation.addListener('didFocus', payload => {
    this.onGetData();
    // });
  }
  componentWillUnmount = () => {
    if (this.onFocus) {
      this.onFocus.remove();
    }
  };
  onGetData = () => {
    let id = this.state.id;
    this.setState(
      {
        isLoading: true,
      },
      () => {
        if (id) {
          profileProvider
            .getDetailsMedical(id)
            .then(res => {
              if (res) {
                if (
                  res?.profileInfo?.personal?.hospitalName &&
                  res?.profileInfo?.personal?.value
                ) {
                  this.setState(
                    {
                      fromHis: true,
                      dataProfile: res,
                      isLoading: false,
                    },
                    () => {
                      this.renderAddress();
                    },
                  );
                } else {
                  this.setState(
                    {
                      fromHis: false,
                      dataProfile: res,
                      isLoading: false,
                    },
                    () => {
                      this.renderAddress();
                    },
                  );
                }
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
            });
        }
      },
    );
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
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.onGetData();
    }
  }

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

  renderDob = value => {
    if (value) {
      let dateParam = value.split(/[\s/:]/);
      let date = new Date(dateParam[2], dateParam[1], dateParam[0]);
      return value + `- ${date.getAge()} tuổi`;
    } else {
      return 'Chọn ngày sinh';
    }
  };
  renderAddress = () => {
    let dataLocation =
      this.state.dataProfile?.profileInfo?.personal?.address || {};

    let district = dataLocation.district ? dataLocation.district : '';
    let province = dataLocation.province ? dataLocation.province : '';
    let zone = dataLocation.street1 ? dataLocation.street1 : '';
    let village = dataLocation.street2 ? dataLocation.street2 : '';

    this.setState({
      location: `${village}\n${zone}\n${district}\n${province}`,
    });
  };
  onEdit(isEdit) {
    if (isEdit) {
      this.onGetData();
    }
  }
  onEditProfile = () => {
    //
    // if (this.props.userApp.currentUser.accountSource == 'VENDOR') {
    //   this.props.navigation.replace('editProfileUsername', {
    //     dataOld: this.state.dataProfile,
    //     // onEdit: this.onEdit.bind(this)
    //   });
    // } else
    this.props.navigation.navigate('editProfile', {
      dataOld: this.state.dataProfile,
      onEdit: this.onEdit.bind(this),
    });
  };
  renderEdit = () => {
    if (
      this.props?.userApp?.currentUser.username != this.state.dataProfile.userId
    )
      return null;
    return (
      <TouchableOpacity onPress={this.onEditProfile} style={styles.buttonSave}>
        <Text style={styles.txtSave}>Sửa</Text>
      </TouchableOpacity>
    );
    // }
  };
  render() {
    const {dataProfile, avatar, isLoading, location} = this.state;
    console.log('dataProfile: ', dataProfile);
    const guardian = dataProfile?.profileInfo?.guardian;
    const personal = dataProfile?.profileInfo?.personal || {};
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
    let age = personal?.dateOfBirth
      ? new Date().getFullYear() -
        personal?.dateOfBirth?.toDateObject('-').getFullYear()
      : null;
    let gender = personal?.gender == 'FEMALE' ? 'Nữ' : 'Nam';
    return (
      <ActivityPanel
        title={'Chi tiết hồ sơ'}
        isLoading={isLoading}
        menuButton={this.renderEdit()}
        containerStyle={{backgroundColor: '#f8f8f8'}}
        titleStyle={styles.titleStyle}>
        <ScrollView>
          <View style={styles.container}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                margin: 10,
                flex: 1,
              }}>
              <View
                // onPress={this.selectImage}
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
                    personal?.avatar
                      ? {uri: personal?.avatar}
                      : require('@images/new/user.png')
                  }
                  resizeMode="cover"
                  loadingStyle={{size: 'small', color: 'gray'}}
                  source={{
                    uri:
                      personal && personal.avatar
                        ? personal.avatar.absoluteUrl()
                        : '' || '',
                  }}
                  style={styles.image}
                  defaultImage={this.defaultImage}
                />
                {/* <ScaledImage source={require('@images/new/profile/ic_camera.png')} height={18} style={styles.icCamera} /> */}
              </View>
              <View
                style={{
                  paddingLeft: 20,
                  flex: 1,
                }}>
                <Text style={styles.txtFullName}>
                  {personal?.fullName || ''}
                </Text>
                <Text
                  style={{fontSize: 14, fontWeight: 'bold', color: '#075BB5'}}>
                  {personal.mobileNumber}
                </Text>
                <Text
                  style={{fontSize: 14, fontWeight: 'bold', color: '#075BB5'}}>
                  {personal.email}
                </Text>
              </View>
            </View>
            <View style={{flex: 1}}>
              {gender ? (
                <View style={[styles.containerField]}>
                  <Text style={styles.txLabel}>Giới tính</Text>
                  <Text style={styles.txtRight}>{gender}</Text>
                </View>
              ) : null}
              {personal?.dateOfBirth ? (
                <View style={[styles.containerField]}>
                  <Text style={styles.txLabel}>Ngày sinh</Text>
                  <Text style={styles.txtRight}>
                    {personal?.dateOfBirth
                      ?.toDateObject('-')
                      .format('dd/MM/yyyy') || ''}{' '}
                    - {age ? age + ' tuổi' : age == 0 ? '1 tuổi' : ''}
                  </Text>
                </View>
              ) : null}

              {location ? (
                <View
                  style={[
                    styles.containerField,
                    {
                      marginTop: 10,
                      borderTopColor: '#00000011',
                      borderTopWidth: 1,
                    },
                  ]}>
                  <Text style={styles.txLabel}>Địa chỉ</Text>
                  <Text style={styles.txtRight}>{location}</Text>
                </View>
              ) : (
                <View />
              )}
              <View>
                {personal.idNumber ? (
                  <View style={[styles.containerField]}>
                    <Text style={styles.txLabel}>Số CMND</Text>
                    <Text style={styles.txtRight}>{personal.idNumber}</Text>
                  </View>
                ) : (
                  <View />
                )}
              </View>
              <View>
                {personal.idNumber && !dataProfile?.defaultProfile ? (
                  <View style={[styles.containerField]}>
                    <Text style={styles.txLabel}>Mối quan hệ với CTK</Text>
                    <Text style={styles.txtRight}>
                      {objectUtils.renderTextRelations(
                        dataProfile.relationshipType,
                      )}
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
              </View>
              {personal?.nation ? (
                <Field style={[styles.containerField]}>
                  <Text style={styles.txLabel}>Dân tộc</Text>
                  <Text style={styles.txtRight}>{personal?.nation}</Text>
                </Field>
              ) : (
                <Field />
              )}
              {dataProfile && personal.nationality ? (
                <Field style={[styles.containerField]}>
                  <Text style={styles.txLabel}>Quốc tịch</Text>
                  <Text style={styles.txtRight}>{personal.nationality}</Text>
                </Field>
              ) : (
                <Field />
              )}
              {personal?.job ? (
                <View style={[styles.containerField]}>
                  <Text style={styles.txLabel}>Nghề nghiệp</Text>
                  <Text style={styles.txtRight}>{personal?.job}</Text>
                </View>
              ) : (
                <View />
              )}
              {personal?.hospitalName && this.state.fromHis ? (
                <View style={[styles.containerField]}>
                  <Text style={styles.txLabel}>Cơ sở y tế</Text>
                  <Text style={styles.txtRight}>{personal?.hospitalName}</Text>
                </View>
              ) : (
                <View />
              )}
              {personal?.value && this.state.fromHis ? (
                <View style={[styles.containerField]}>
                  <Text style={styles.txLabel}>Mã bệnh nhân</Text>
                  <Text style={styles.txtRight}>{personal?.value}</Text>
                </View>
              ) : (
                <Field />
              )}
              {guardian ? (
                <View>
                  {guardian.fullName ? (
                    <View
                      style={[
                        styles.containerField,
                        {
                          marginTop: 10,
                          borderTopColor: '#00000011',
                          borderTopWidth: 1,
                        },
                      ]}>
                      <Text style={styles.txLabel}>Người bảo lãnh</Text>
                      <Text style={styles.txtRight}>{guardian?.fullName}</Text>
                    </View>
                  ) : (
                    <Field />
                  )}
                  {guardian.mobileNumber ? (
                    <View style={[styles.containerField]}>
                      <Text style={styles.txLabel}>SĐT người bảo lãnh</Text>
                      <Text style={styles.txtRight}>
                        {guardian.mobileNumber}
                      </Text>
                    </View>
                  ) : (
                    <Field />
                  )}
                  {guardian.idNumber ? (
                    <View style={[styles.containerField]}>
                      <Text style={styles.txLabel}>
                        CMTND/ HC người bảo lãnh
                      </Text>
                      <Text style={styles.txtRight}>{guardian.idNumber}</Text>
                    </View>
                  ) : (
                    <Field />
                  )}
                </View>
              ) : null}
              {/** Địa chỉ */}
            </View>
          </View>
        </ScrollView>
      </ActivityPanel>
    );
  }
}
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
export default connect(mapStateToProps)(ProfileScreen);

const styles = StyleSheet.create({
  txtFullName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1,
  },
  txtRight: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
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
  input: {
    textAlign: 'right',
    color: '#000',
    fontWeight: 'bold',
    minHeight: 40,
    textAlign: 'right',
    paddingRight: 10,
    color: '#000',
    fontWeight: 'bold',
    paddingLeft: 60,
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
  placeHolderImage: {width: 80, height: 80, borderRadius: 40},
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
    fontSize: 14,
    paddingHorizontal: 10,
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
  containerField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomColor: '#00000011',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: '#fff',
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
    borderRadius: 40,
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
