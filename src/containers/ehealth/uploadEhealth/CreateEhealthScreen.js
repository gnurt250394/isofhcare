import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import clientUtils from '@utils/client-utils';
import bookingProvider from '@data-access/booking-provider';
import {connect} from 'react-redux';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';
import LinearGradient from 'react-native-linear-gradient';
import dateUtils from 'mainam-react-native-date-utils';
import hospitalProvider from '@data-access/hospital-provider';
import ehealthProvider from '@data-access/ehealth-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import {Card} from 'native-base';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import connectionUtils from '@utils/connection-utils';
import Form from 'mainam-react-native-form-validate/Form';
import Field from 'mainam-react-native-form-validate/Field';
import TextField from 'mainam-react-native-form-validate/TextField';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import profileProvider from '@data-access/profile-provider';
import DateTimePicker from 'mainam-react-native-date-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SelectDocument from '@components/SelectDocument';

class CreateEhealthScreen extends Component {
  constructor(props) {
    super(props);
    let dataOld = this.props.navigation.getParam('data', null);
    let profile = this.props.navigation.getParam('profile', {});

    this.state = {
      listHospital: [],
      isLongPress: false,
      index: '',
      refreshing: false,
      isSearch: false,
      size: 10000,
      page: 1,
      hospitalId: dataOld && dataOld.hospitalId ? dataOld.hospitalId : '',
      hospitalName: dataOld && dataOld.hospitalName ? dataOld.hospitalName : '',
      imageUris:
        dataOld && dataOld.images && dataOld.images.length
          ? dataOld.images
          : [],
      medicalRecordId:
        dataOld && dataOld.medicalRecord
          ? dataOld.medicalRecord.id
          : profile?.userProfileId,
      medicalRecordName:
        dataOld && dataOld.medicalRecord
          ? dataOld.medicalRecord.name
          : profile?.profileInfo?.personal?.fullName,
      medicalServiceName:
        dataOld && dataOld.medicalServiceName ? dataOld.medicalServiceName : '',
      result: dataOld && dataOld.result ? dataOld.result : '',
      dob:
        dataOld && dataOld.timeGoIn ? dataOld.timeGoIn.toDateObject('-') : '',
      date:
        dataOld && dataOld.timeGoIn
          ? dataOld.timeGoIn.toDateObject('-').format('dd-MM-yyyy')
          : '',
      currentId: dataOld && dataOld.id ? dataOld.id : null,
      isProfile: false,
      isSearch: false,
      // isSelect: true
    };
    this.data = [];
  }
  componentDidMount() {
    this.onRefresh();
    this.onLoadProfile();
  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {}

  _keyboardDidHide = () => {
    this.setState({
      isProfile: false,
      isSearch: false,
    });
  };

  onLoadMore() {
    if (!this.state.finish && !this.state.loading)
      this.setState(
        {
          loadMore: true,
          refreshing: false,
          loading: true,
          page: this.state.page + 1,
        },
        () => {
          this.onLoad();
        },
      );
  }
  onSelectDate = () =>
    this.setState({
      toggelDateTimePickerVisible: true,
      isProfile: false,
      isSearch: false,
    });
  onConfirmDate = newDate => {
    this.setState(
      {
        dob: newDate,
        date: newDate.format('dd/MM/yyyy'),
        toggelDateTimePickerVisible: false,
      },
      () => {
        setTimeout(() => {
          this.txtResult.focus();
        }, 500);
      },
    );
  };
  onCancelDate = () => {
    this.setState({toggelDateTimePickerVisible: false});
  };
  onSearch = s => {
    console.log('s: ', s);
    if (s) {
      var listSearch = this.data.filter(item => {
        return (
          s == null ||
          (item &&
            item.name &&
            item.name
              .trim()
              .toLowerCase()
              .unsignText()
              .indexOf(
                s
                  .trim()
                  .toLowerCase()
                  .unsignText(),
              ) != -1)
        );
      });
      // listSearch = listSearch.map(item => {
      //     item.checked = this.listServicesSelected.find(item2 => item2.id == item.id);
      //     return item;
      // })

      this.setState({data: listSearch});
    } else {
      this.setState({data: this.data});
    }
  };
  onLoad() {
    this.setState(
      {
        loading: true,
        refreshing: true,
      },
      () => {
        let promise = null;
        promise = hospitalProvider.getAllHospital();
        promise
          .then(s => {
            this.setState(
              {
                loading: false,
                refreshing: false,
                loadMore: false,
              },
              () => {
                if (s) {
                  this.data = s;
                  this.setState({
                    data: s,
                  });
                }
              },
            );
          })
          .catch(e => {
            this.setState({
              loading: false,
              refreshing: false,
              loadMore: false,
            });
          });
      },
    );
  }
  onRefresh = () => {
    if (!this.state.loading)
      this.setState(
        {refreshing: true, page: 1, finish: false, loading: true},
        () => {
          this.onLoad();
        },
      );
  };
  onPress = item => {
    this.props.dispatch({
      type: constants.action.action_select_hospital_ehealth,
      value: item,
    });
    this.props.navigation.navigate('listProfile');
  };
  onDisable = () => {
    snackbar.show(constants.msg.ehealth.not_examination_at_hospital, 'danger');
  };
  onAddEhealth = () => {
    connectionUtils
      .isConnected()
      .then(s => {
        this.props.navigation.navigate('selectHospital', {
          hospital: this.state.hospital,
          onSelected: hospital => {
            // alert(JSON.stringify(hospital))
            setTimeout(() => {
              this.props.navigation.navigate('addNewEhealth', {
                hospital: hospital,
              });
            }, 300);
          },
        });
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, 'danger');
      });
  };
  onBackClick = () => {
    this.props.navigation.pop();
  };
  keyExtractor = (item, index) => index.toString();
  headerComponent = () => {
    return !this.state.refreshing &&
      (!this.state.listHospital || this.state.listHospital.length == 0) ? (
      <View style={styles.viewTxNone}>
        <Text style={styles.viewTxTime}>
          {constants.ehealth.not_result_ehealth_location}
        </Text>
      </View>
    ) : (
      <View />
    );
  };
  onChangeText = () => {};
  onSelectHospital = item => {
    Keyboard.dismiss();
    this.setState(
      {
        isSearch: false,
      },
      () => {
        this.setState({
          hospitalId: item.id,
          hospitalName: item.name,
        });
      },
    );
  };
  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => this.onSelectHospital(item)}
        style={[styles.details, index == 0 ? {borderTopColor: '#fff'} : {}]}>
        <View style={styles.containerContent}>
          <View style={{flex: 1}}>
            <Text style={styles.bv} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.bv1} numberOfLines={2}>
              {item.contact && item.contact.address}
            </Text>
          </View>
          {item?.id == this.state.hospitalId ? (
            <ScaledImage
              source={require('@images/new/profile/ic_tick.png')}
              height={19}
              width={19}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  onSelectProfile = value => {
    this.setState({
      medicalRecordId: value.userProfileId,
      medicalRecordName: value.profileInfo?.personal?.fullName,
      isProfile: false,
    });
  };
  renderItemProfile = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => this.onSelectProfile(item)}
        style={[styles.details, index == 0 ? {borderTopColor: '#fff'} : {}]}>
        <View style={styles.containerContent}>
          <Text style={styles.bv} numberOfLines={1}>
            {item?.profileInfo?.personal?.fullName}
          </Text>
          {item?.userProfileId == this.state.medicalRecordId ? (
            <ScaledImage
              source={require('@images/new/profile/ic_tick.png')}
              height={19}
              width={19}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  search = text => {
    this.setState({
      hospitalName: text,
    });
    this.onSearch(text);
  };
  onLoadProfile = () => {
    profileProvider
      .getListProfile()
      .then(s => {
        if (s?.length) {
          this.setState({
            dataProfile: s,
          });
        }
      })
      .catch(e => {});
  };
  onShowProfile = () => {
    this.setState({
      isProfile: !this.state.isProfile,
      isSearch: false,
    });
  };
  selectImage = () => {
    this.setState({
      isSearch: false,
      isProfile: false,
    });
    if (this.state.imageUris && this.state.imageUris.length >= 10) {
      snackbar.show(constants.msg.booking.image_without_ten, 'danger');
      return;
    }
    connectionUtils
      .isConnected()
      .then(s => {
        if (this.imagePicker) {
          this.imagePicker
            .show({
              multiple: true,
              mediaType: 'photo',
              maxFiles: 10,
              compressImageMaxWidth: 1500,
              compressImageMaxHeight: 1500,
            })
            .then(images => {
              let listImages = [];
              if (images.length) listImages = [...images];
              else listImages.push(images);
              let imageUris = this.state.imageUris;
              listImages.forEach(image => {
                if (imageUris.length >= 10) {
                  snackbar.show('Chỉ được chọn tối đa 10 ảnh', 'danger');
                  return;
                }
                let temp = null;
                imageUris.forEach(item => {
                  if (item.uri == image.path) temp = item;
                });
                if (!temp) {
                  imageUris.push({uri: image.path, loading: true});
                  if (image.file) {
                    imageProvider.uploadFile(image.path, image.mime, (s, e) => {
                      if (s.success) {
                        if (s && s?.data?.data?.file) {
                          let imageUris = this.state.imageUris;
                          imageUris.forEach(item => {
                            if (item.uri == s.uri) {
                              item.loading = false;
                              item.url = s?.data?.data?.file;
                            }
                          });
                          this.setState({
                            imageUris,
                          });
                        }
                      } else {
                        imageUris.forEach(item => {
                          if (item.uri == s.uri) {
                            item.error = true;
                          }
                        });
                      }
                    });
                  } else {
                    imageProvider.upload(image.path, image.mime, (s, e) => {
                      if (s.success) {
                        if (s?.data?.data?.images?.length > 0) {
                          let imageUris = this.state.imageUris;
                          imageUris.forEach(item => {
                            if (item.uri == s.uri) {
                              item.loading = false;
                              item.url = s?.data?.data?.images[0].imageLink;
                            }
                          });
                          this.setState({
                            imageUris,
                          });
                        }
                      } else {
                        imageUris.forEach(item => {
                          if (item.uri == s.uri) {
                            item.error = true;
                          }
                        });
                      }
                    });
                  }
                }
              });
              this.setState({imageUris: [...imageUris]});
            });
        }
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, 'danger');
      });
  };
  removeImage(index) {
    var imageUris = this.state.imageUris;
    imageUris.splice(index, 1);
    this.setState({imageUris});
  }
  onCreate = () => {
    var images = [];

    for (let i = 0; i < this.state.imageUris.length; i++) {
      images.push(this.state.imageUris[i].url);
    }

    if (!this.form.isValid()) {
      return;
    }
    this.setState(
      {
        disabled: true,
      },
      () => {
        let params = {
          hospitalId: this.state.hospitalId,
          hospitalName: this.state.hospitalName,
          images: this.state.imageUris.length ? images : [],
          medicalRecordId: this.state.medicalRecordId,
          medicalServiceName: this.state.medicalServiceName,
          result: this.state.result ? this.state.result : '',
          timeGoIn: this.state.dob.format('yyyy-MM-dd'),
        };
        if (this.state.currentId) {
          ehealthProvider
            .updateEhealth(params, this.state.currentId)
            .then(res => {
              if (res && (res.code == 200 || res.code == 204)) {
                let callback = (
                  (this.props.navigation.state || {}).params || {}
                ).onSelected;
                if (callback) {
                  callback(res.data);
                  this.props.navigation.pop();
                }
                this.setState({
                  disabled: false,
                });
              } else {
                snackbar.show(res.message, 'danger');
                this.setState({
                  disabled: false,
                });
              }
            })
            .catch(err => {
              this.setState({
                disabled: false,
              });
            });
        } else {
          ehealthProvider
            .uploadEhealth(params)
            .then(res => {
              if (res && (res.code == 200 || res.code == 204)) {
                this.props.navigation.replace('listEhealthUpload');
                this.setState({
                  disabled: false,
                });
              } else {
                snackbar.show(res.message, 'danger');
                this.setState({
                  disabled: false,
                });
              }
            })
            .catch(err => {
              this.setState({
                disabled: false,
              });
            });
        }
      },
    );
  };
  onFocus = () => {
    this.setState({
      isSearch: true,
      isProfile: false,
    });
  };
  getImage = link => {
    let ext = link ? /[^\.]*$/.exec(link)[0] : 'txt';

    let source = '';
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'png':
        source = {uri: link};
        break;

      case 'doc':
      case 'docx':
        source = require('@images/new/ehealth/ic_word.png');
        break;
      case 'pdf':
        source = require('@images/new/ehealth/ic_pdf.png');
        break;
      case 'csv':
      case 'xlsx':
      case 'xlsm':
      case 'xlsb':
      case 'xltx':
      case 'xltm':
      case 'xls':
      case 'xml':
      case 'xlt':
      case 'xla':
      case 'xlw':
      case 'xlr':
        source = require('@images/new/ehealth/ic_excel.png');
        break;

      default:
        source = '';
        break;
    }
    return source;
  };
  renderImage = () => {
    return (
      <View style={styles.list_image}>
        {this.state.imageUris && this.state.imageUris.length
          ? this.state.imageUris.map((item, index) => {
              return (
                <View key={index} style={styles.containerImagePicker}>
                  <View style={styles.groupImagePicker}>
                    <Image
                      source={this.getImage(item.url)}
                      resizeMode="cover"
                      style={styles.imagePicker}
                    />
                    {item.error ? (
                      <View style={styles.groupImageError}>
                        <ScaledImage
                          source={require('@images/ic_warning.png')}
                          width={40}
                        />
                      </View>
                    ) : item.loading ? (
                      <View style={styles.groupImageLoading}>
                        <ScaledImage
                          source={require('@images/loading.gif')}
                          width={40}
                        />
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={this.removeImage.bind(this, index)}
                    style={styles.buttonClose}>
                    <ScaledImage
                      source={require('@images/new/ic_close.png')}
                      width={16}
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          : null}
      </View>
    );
  };
  // onTouchStart = () => {
  //     if (this.state.isProfile && this.state.isSelect) {

  //         this.setState({
  //             isProfile: false
  //         })
  //     }
  // }
  onHidden = () => {
    Keyboard.dismiss();
    this.setState({isProfile: false, isSearch: false});
  };
  hiddenList = () => {
    this.setState({isProfile: false, isSearch: false});
  };

  render() {
    return (
      <ActivityPanel
        title={
          this.props.navigation.getParam('data', null)
            ? 'SỬA KẾT QUẢ KHÁM'
            : 'NHẬP KẾT QUẢ KHÁM'
        }
        style={styles.container}>
        <KeyboardAwareScrollView
          // onTouchStart={this.onTouchStart}
          nestedScrollEnabled
          style={styles.viewContent}
          bounces={false}
          keyboardShouldPersistTaps={'always'}>
          <TouchableWithoutFeedback onPress={this.onHidden}>
            <View>
              <Text style={styles.txTitle}>
                Vui lòng nhập các thông tin sau
              </Text>
              <Form
                ref={ref => {
                  this.form = ref;
                }}>
                <Field style={styles.viewInput}>
                  <Text style={styles.title}>CSYT đã khám (*)</Text>
                  <Field style={styles.viewDrop}>
                    <TextField
                      onFocus={this.onFocus}
                      placeHolderTextColor={'#00000060'}
                      onChangeText={text => this.search(text)}
                      value={this.state.hospitalName}
                      placeholder={'Nhập CSYT đã khám'}
                      errorStyle={[styles.errorStyle]}
                      inputStyle={[styles.inputStyleDrop]}
                      underlineColorAndroid={'#fff'}
                      returnKeyType="done"
                      maxLength={100}
                      validate={{
                        rules: {
                          maxlength: 100,
                          required: true,
                        },
                        messages: {
                          maxlength: 'Không được nhập quá 100 ký tự',
                          required: 'Tên CSYT không được bỏ trống',
                        },
                      }}
                      autoCapitalize={'none'}
                    />

                    <Field style={styles.iconDrop}>
                      <ScaledImage
                        source={require('@images/new/ehealth/ic_down.png')}
                        height={12}
                      />
                    </Field>
                  </Field>
                  {this.state.isSearch ? (
                    <Card style={styles.card}>
                      <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                        onRefresh={this.onRefresh.bind(this)}
                        keyboardShouldPersistTaps={'handled'}
                        refreshing={this.state.refreshing}
                        nestedScrollEnabled
                        scrollEnabled
                        style={{height: 250}}
                      />
                    </Card>
                  ) : (
                    <View />
                  )}
                  <Text style={styles.title}>Người được khám (*)</Text>
                  <Field style={styles.viewDrop}>
                    <TextField
                      value={this.state.medicalRecordName}
                      placeholder={'Chọn tên người được khám'}
                      errorStyle={styles.errorStyle}
                      inputStyle={styles.inputStyleDrop}
                      underlineColorAndroid={'#fff'}
                      editable={false}
                      onPress={this.onShowProfile}
                      placeHolderTextColor={'#00000060'}
                      validate={{
                        rules: {
                          required: true,
                        },
                        messages: {
                          required: 'Chưa chọn người được khám',
                        },
                      }}
                      autoCapitalize={'none'}
                    />
                    <Field style={styles.iconDrop}>
                      <ScaledImage
                        source={require('@images/new/ehealth/ic_down.png')}
                        height={12}
                      />
                    </Field>
                  </Field>

                  {this.state.isProfile ? (
                    <Card style={styles.card}>
                      <FlatList
                        data={this.state.dataProfile}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItemProfile}
                        nestedScrollEnabled={true}
                      />
                    </Card>
                  ) : (
                    <View />
                  )}
                  <Text style={styles.title}>Dịch vụ khám (*)</Text>
                  <TextField
                    onChangeText={text =>
                      this.setState({medicalServiceName: text})
                    }
                    value={this.state.medicalServiceName}
                    placeholder={'Nhập dịch vụ khám'}
                    errorStyle={styles.errorStyle}
                    inputStyle={styles.inputStyle}
                    underlineColorAndroid={'#fff'}
                    placeHolderTextColor={'#00000060'}
                    onFocus={this.hiddenList}
                    validate={{
                      rules: {
                        required: true,
                        maxlength: 100,
                      },
                      messages: {
                        required: 'Dịch vụ khám không được bỏ trống',
                        maxlength: 'Không được nhập quá 100 ký tự',
                      },
                    }}
                    autoCapitalize={'none'}
                  />
                  <Text style={styles.title}>Thời gian khám (*)</Text>
                  <TextField
                    value={this.state.date}
                    editable={false}
                    onPress={this.onSelectDate}
                    placeholder={'Chọn thời gian khám'}
                    errorStyle={styles.errorStyle}
                    inputStyle={styles.inputStyle}
                    underlineColorAndroid={'#fff'}
                    placeHolderTextColor={'#00000060'}
                    validate={{
                      rules: {
                        required: true,
                      },
                      messages: {
                        required: 'Chưa chọn thời gian khám',
                      },
                    }}
                    autoCapitalize={'none'}
                  />
                  <Text style={styles.title}>Kết quả khám</Text>
                  <TextField
                    onRef={ref => (this.txtResult = ref)}
                    onChangeText={text => this.setState({result: text})}
                    value={this.state.result}
                    // autoFocus={true}
                    placeholder={'Nhập kết quả khám'}
                    errorStyle={styles.errorStyle}
                    placeHolderTextColor={'#00000060'}
                    inputStyle={[
                      styles.inputResult,
                      {minHeight: 81, maxHeight: 300, textAlignVertical: 'top'},
                    ]}
                    underlineColorAndroid={'#fff'}
                    onFocus={this.hiddenList}
                    validate={{
                      rules: {
                        maxlength: 2000,
                      },
                      messages: {
                        maxlength: 'Không được nhập quá 2000 ký tự',
                      },
                    }}
                    multiline={true}
                    autoCapitalize={'none'}
                  />
                </Field>
              </Form>
              <View style={styles.viewUploadImg}>
                <View>
                  <Text style={styles.title}>Hoặc tải lên hình ảnh, file</Text>
                  <Text style={[styles.title, {fontSize: 14}]}>
                    (.jpg, .png, .gif, .docx, .xlsx, .pdf...)
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={this.selectImage}
                  style={{alignSelf: 'flex-end'}}>
                  <ScaledImage
                    source={require('@images/new/booking/ic_image.png')}
                    height={30}
                  />
                </TouchableOpacity>
              </View>
              {this.renderImage()}
              <TouchableOpacity
                disabled={this.state.disabled}
                onPress={this.onCreate}
                style={styles.btnUploadEhealth}>
                {this.state.disabled ? (
                  <ActivityIndicator size={'small'} color={'#fff'} />
                ) : (
                  <Text style={styles.txAddEhealth}>{'Hoàn thành'}</Text>
                )}
              </TouchableOpacity>
              <View style={{height: 50}} />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
        <DateTimePicker
          isVisible={this.state.toggelDateTimePickerVisible}
          onConfirm={this.onConfirmDate}
          onCancel={this.onCancelDate}
          date={new Date()}
          maximumDate={new Date()}
          cancelTextIOS={constants.actionSheet.cancel2}
          confirmTextIOS={constants.actionSheet.confirm}
          date={this.state.dob || new Date()}
          titleIOS={'Chọn ngày'}
          locale={'vi'}
        />
        <SelectDocument ref={ref => (this.imagePicker = ref)} />
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  img: {},
  card: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    padding: 5,
  },
  buttonClose: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  viewUploadImg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  list_image: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: 20,
  },
  txCamera: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  groupImageLoading: {
    position: 'absolute',
    left: 20,
    top: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  groupImageError: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  imagePicker: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  groupImagePicker: {
    marginTop: 8,
    width: 80,
    height: 80,
  },
  containerImagePicker: {
    margin: 2,
    width: 88,
    height: 88,
    position: 'relative',
  },
  txTitle: {
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
    marginTop: 20,
  },
  viewContent: {
    paddingHorizontal: 10,
  },
  viewInput: {
    margin: 10,
  },
  title: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    width: '92%',
    height: '100%',
    padding: 10,
    color: '#000',
  },
  inputStyle: {
    height: 51,
    borderRadius: 6,
    backgroundColor: '#ededed',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    color: '#000',
  },
  viewDrop: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 6,
    marginTop: 10,
  },
  inputStyleDrop: {
    color: '#000',
    fontWeight: '300',
    height: 51,
    marginLeft: 0,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    fontSize: 14,
    paddingLeft: 15,
    paddingRight: 45,
    backgroundColor: '#ededed',
  },
  iconDrop: {
    position: 'absolute',
    right: 10,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewField: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#ededed',
  },
  inputResult: {
    borderRadius: 6,
    backgroundColor: '#ededed',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
  },
  errorStyle: {
    color: 'red',
  },
  details: {
    flexDirection: 'row',
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 0.7,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
  },
  containerContent: {
    flex: 1,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bv: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
    color: '#000000',
  },
  bv1: {
    fontSize: 13,
    color: '#00000050',
    marginTop: 9,
  },
  btnUploadEhealth: {
    borderRadius: 5,
    backgroundColor: '#3161AD',
    justifyContent: 'center',
    alignItems: 'center',
    height: 58,
    marginTop: 10,
    marginHorizontal: 60,
    borderRadius: 10,
  },
  txAddEhealth: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    booking: state.booking,
  };
}
export default connect(mapStateToProps)(CreateEhealthScreen);
