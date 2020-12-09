import React, {Component, PropTypes} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  Keyboard,
  Image,
  Dimensions,
} from 'react-native';
import {Card} from 'native-base';
import ActivityPanel from '@components/ActivityPanel';
import {connect} from 'react-redux';
import constants from '@resources/strings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Form from 'mainam-react-native-form-validate/Form';
import TextField from 'mainam-react-native-form-validate/TextField';
import dataCacheProvider from '@data-access/datacache-provider';
import Field from 'mainam-react-native-form-validate/Field';
import ImageLoad from 'mainam-react-native-image-loader';
import ScaledImage from 'mainam-react-native-scaleimage';
import connectionUtils from '@utils/connection-utils';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import snackbar from '@utils/snackbar-utils';
import questionProvider from '@data-access/question-provider';
import ModalConfirm from '@components/question/ModalConfirm';
import { logEventFB } from '@utils/facebook-utils';
import firebaseUtils from '@utils/firebase-utils';

const {width, height} = Dimensions.get('screen');
const padding = Platform.select({
  ios: 7,
  android: 2,
});
class CreateQuestionStep1Screen extends Component {
  constructor(props) {
    super(props);
    let post = this.props.navigation.getParam('post', null);
    let replace = this.props.navigation.getParam('replace', null);
    let state = this.props.navigation.getParam('state', null);
    console.log('state: ', state);
    if (post != null && post.post) {
      post = post.post;
    } else {
      post = null;
    }
    this.state = {
      imageUris: state?.imageUris ? state.imageUris : [],
      post: post,
      replace: state?.replace ? state.replace : replace,
      title: post ? post.title : '',
      content: state?.content ? state.content : '',
      isPrivate: post ? post.isPrivate == 1 : false,
      btnSend: post ? 'Lưu' : 'Gửi',
      gender: state?.gender ? state?.gender : 0,
      age: state?.age ? state?.age : '',
      checked: state?.checked ? state.checked : false,
      specialist: state?.specialist ? state?.specialist : [],
      isVisible: false,
    };
  }
  componentDidMount() {
    logEventFB("question")
    dataCacheProvider.read(
      this.props.userApp.currentUser.id,
      constants.key.storage.LASTEST_POSTS,
      (s, e) => {
        if (s && s.post) {
          this.setState({
            gender: s.post.gender ? 1 : 0,
            age: s.post.age && s.post.age != 0 ? s.post.age + '' : '',
            // ,content: s.post.content || ""
          });
        }
      },
    );
  }

  // createQuestion() {
  //   if (!this.form.isValid()) {
  //     return;
  //   }
  //   this.props.navigation.navigate("createQuestionStep2", {
  //     post: {
  //       gender: this.state.gender,
  //       content: this.state.content,
  //       age: this.state.age || 0
  //     }
  //   });
  // }
  componentWillUnmount() {
    dataCacheProvider.save(
      this.props.userApp.currentUser.id,
      constants.key.storage.LASTEST_INFO,
      '',
    );
  }
  onValueChange = () => {
    this.setState({changed: true});
  };
  onChangeText = state => value => {
    this.setState({[state]: value});
  };
  onValidateAge = (valid, messages) => {
    if (valid) {
      this.setState({ageError: ''});
    } else {
      this.setState({ageError: messages});
    }
  };
  setGender = gender => () => {
    this.setState({gender, changed: true});
  };
  menuCreate() {
    return (
      <TouchableOpacity
        style={{marginRight: 20}}
        onPress={this.createQuestion.bind(this)}>
        <Text style={{color: '#FFF'}}>Đăng</Text>
      </TouchableOpacity>
    );
  }
  checkShareComment = () => {
    this.setState({checked: !this.state.checked});
  };
  onSelectSpecialist = () => {
    this.props.navigation.navigate('selectSpecialist', {
      onSelected: this.selectSpecialist.bind(this),
      listSelected: this.state.specialist,
    });
  };
  selectSpecialist(specialize) {
    console.log('specialize: ', specialize);
    this.setState({specialist: specialize});
  }
  removeImage(index) {
    var imageUris = this.state.imageUris;
    imageUris.splice(index, 1);
    this.setState({imageUris});
  }
  selectImage() {
    connectionUtils
      .isConnected()
      .then(s => {
        if (this.imagePicker) {
          this.imagePicker
            .show({
              multiple: true,
              mediaType: 'photo',
              maxFiles: 3,
              compressImageMaxWidth: 500,
              compressImageMaxHeight: 500,
            })
            .then(images => {
              let listImages = [];
              if (images.length) listImages = [...images];
              else listImages.push(images);
              let imageUris = this.state.imageUris;
              listImages.forEach(image => {
                if (imageUris.length >= 3) {
                  snackbar.show('Chỉ được chọn tối đa 3 ảnh', 'warning');
                  return;
                }
                let temp = null;
                imageUris.forEach(item => {
                  if (item.uri == image.path) temp = item;
                });
                if (!temp) {
                  imageUris.push({uri: image.path, loading: true});
                  imageProvider.upload(image.path, image.mime, (s, e) => {
                    console.log('s: ', s);
                    if (s.success) {
                      if (s.data && s.data.length > 0) {
                        let imageUris = this.state.imageUris;
                        imageUris.forEach(item => {
                          if (item.uri == s.uri) {
                            item.loading = false;
                            item.url = s.data[0].fileDownloadUri;
                            item.thumbnail = s.data[0].fileDownloadUri;
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
              });
              this.setState({imageUris: [...imageUris]});
            });
        }
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, 'danger');
      });
  }
  createQuestion() {
    if (!this.form.isValid()) {
      return;
    }

    for (var i = 0; i < this.state.imageUris.length; i++) {
      if (this.state.imageUris[i].loading) {
        snackbar.show(constants.msg.booking.image_loading, 'danger');
        return;
      }
      if (this.state.imageUris[i].error) {
        snackbar.show(constants.msg.booking.image_load_err, 'danger');
        return;
      }
    }

    if (!this.props.userApp.isLogin) {
      this.props.navigation.replace('login', {
        nextScreen: {
          screen: 'createQuestionStep',
          param: {
            fromlogin: true,
            state: this.state,
          },
        },
      });
      return;
    }

    connectionUtils
      .isConnected()
      .then(s => {
        this.setState({isLoading: true}, () => {
          let images = this.state.imageUris.map(item => {
            return item.url;
          });
          console.log('this.state.specialist: ', this.state.specialist);
          let specialist = this.state.specialist.map(e => ({
            specializationId: e.id,
            specializationName: e.name,
          }));
          questionProvider
            .create(
              this.state.content,
              this.state.gender,
              this.state.age,
              specialist,
              images,
            )
            .then(s => {
              this.setState({isLoading: false});
              if (s) {
                dataCacheProvider.save(
                  this.props.userApp.currentUser.id,
                  constants.key.storage.LASTEST_POSTS,
                  s,
                );
                snackbar.show(
                  constants.msg.question.create_question_success,
                  'success',
                );
                this.setState({isVisible: true});
                dataCacheProvider.save(
                  this.props.userApp.currentUser.id,
                  constants.key.storage.LASTEST_INFO,
                  '',
                );
                firebaseUtils.sendEvent('Question_Publish')
              } else {
                snackbar.show(
                  constants.msg.question.create_question_failed,
                  'danger',
                );
              }
            })
            .catch(e => {
              this.setState({isLoading: false});
              snackbar.show(
                constants.msg.question.create_question_failed,
                'danger',
              );
            });
        });
      })
      .catch(e => {
        snackbar.show(constants.msg.app.not_internet, 'danger');
      });
  }
  onSend = () => {
    if (this.state.replace) {
      this.props.navigation.goBack();
    } else {
      this.props.navigation.replace('listMyQuestion', {
        replace: true,
        reloadTime: new Date().getTime(),
      });
    }
    this.setState({isVisible: false});
  };

  render() {
    const icSupport = require('@images/new/user.png');
    const avatar = this.props?.userApp?.currentUser?.avatar
      ? {uri: this.props.userApp.currentUser.avatar.absoluteUrl()}
      : icSupport;

    return (
      <ActivityPanel
        style={{flex: 1}}
        title={'Đặt câu hỏi'}
        menuButton={this.menuCreate()}
        // showFullScreen={true}
        isLoading={this.state.isLoading}
        titleStyle={{
          color: '#FFF',
          paddingLeft: 70,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#F8F8F8',
          }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.scroll}
            keyboardShouldPersistTaps="handled"
            // keyboardDismissMode='on-drag'
          >
            <View style={styles.containerCard}>
              {/* <View style={styles.minus}></View> */}
              <Form
                ref={ref => (this.form = ref)}
                onValueChange={this.onValueChange}>
                <Field style={styles.fieldAge}>
                  <ImageLoad
                    resizeMode="cover"
                    imageStyle={styles.boderImage}
                    borderRadius={25}
                    customImagePlaceholderDefaultStyle={styles.imgPlaceHoder}
                    placeholderSource={icSupport}
                    style={styles.avatar}
                    loadingStyle={{size: 'small', color: 'gray'}}
                    source={avatar}
                    defaultImage={() => {
                      return (
                        <ScaledImage
                          resizeMode="cover"
                          source={icSupport}
                          width={90}
                          style={styles.imgDefault}
                        />
                      );
                    }}
                  />
                  <Field
                    style={{
                      paddingLeft: 10,
                    }}>
                    <Text style={[styles.label]}>
                      {constants.questions.age}
                    </Text>
                    <TextField
                      hideError={true}
                      validate={{
                        rules: {
                          min: 1,
                          max: 150,
                          number: true,
                          required: true,
                        },
                        messages: {
                          min: constants.msg.question.age_greater_than_1,
                          max: constants.msg.question.age_less_than_150,
                          number: constants.msg.question.invalid_age,
                          required: 'Vui lòng nhập tuổi',
                        },
                      }}
                      value={this.state.age}
                      style={{marginTop: 6}}
                      inputStyle={[
                        styles.textinput,
                        {paddingBottom: 8},
                        styles.inputAge,
                      ]}
                      onChangeText={this.onChangeText('age')}
                      onValidate={this.onValidateAge}
                      returnKeyType={'next'}
                      keyboardType="numeric"
                      errorStyle={styles.errorStyle}
                    />
                  </Field>
                  <View style={{marginLeft: 10}}>
                    <Text style={[styles.label]}>{constants.gender}</Text>
                    <View style={styles.row}>
                      <TouchableOpacity
                        onPress={this.setGender(1)}
                        style={styles.buttonGender}>
                        <View
                          style={[
                            styles.borderSelected,
                            this.state.gender == 1
                              ? {
                                  backgroundColor: '#02C39A',
                                }
                              : {
                                  borderColor: '#00000070',
                                  borderWidth: 1,
                                },
                          ]}>
                          {this.state.gender == 1 && (
                            <ScaledImage
                              source={require('@images/new/ic_checked.png')}
                              height={15}
                            />
                          )}
                        </View>
                        <Text style={{marginLeft: 5}}>
                          {constants.actionSheet.male}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={this.setGender(0)}
                        style={styles.buttonGender}>
                        <View
                          style={[
                            styles.borderSelected,
                            this.state.gender == 0
                              ? {
                                  backgroundColor: '#02C39A',
                                }
                              : {
                                  borderColor: '#00000070',
                                  borderWidth: 1,
                                },
                          ]}>
                          {this.state.gender == 0 && (
                            <ScaledImage
                              source={require('@images/new/ic_checked.png')}
                              height={15}
                            />
                          )
                          // <View style={styles.selected}></View>
                          }
                        </View>
                        <Text style={{marginLeft: 5}}>
                          {constants.actionSheet.female}
                        </Text>
                      </TouchableOpacity>
                    </View>
                   
                  </View>
                </Field>
                <TouchableOpacity
                  onPress={this.onSelectSpecialist}
                  style={styles.buttonSelectSpecialist}>
                  <View style={styles.containerSpecialist}>
                    <ScaledImage
                      style={styles.image}
                      height={13}
                      source={require('@images/new/booking/ic_specialist.png')}
                    />
                    <View style={styles.groupSpecialist}>
                      <Text>Chọn chuyên khoa</Text>
                      <Text numberOfLines={1}>
                        {this.state.specialist.length ? (
                          this.state.specialist.map((item, i) => {
                            return (
                              <Text style={styles.txtNameSpecialist}>
                                {i == 0 ? '' : ','} {item.name}
                              </Text>
                            );
                          })
                        ) : (
                          <Text
                            style={{
                              color: 'red',
                              fontStyle: 'italic',
                            }}>
                            Chưa chọn chuyên khoa
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>
                  <ScaledImage
                    source={require('@images/new/booking/ic_next.png')}
                    height={14}
                  />
                </TouchableOpacity>
                <TextField
                  validate={{
                    rules: {
                      required: true,
                      minlength: 1,
                      maxlength: 2000,
                    },
                    messages: {
                      required: constants.msg.question.please_input_content,
                      maxlength: constants.msg.question.not_allow_2000_keyword,
                    },
                  }}
                  placeholder={'Viết câu hỏi của bạn'}
                  inputStyle={[styles.textinput, styles.inputContent]}
                  errorStyle={styles.errorStyle}
                  onChangeText={this.onChangeText('content')}
                  value={this.state.content}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  // autoFocus={true}
                  multiline={true}
                  autoCorrect={false}
                />
              </Form>
              <View style={{}}>
                <Text style={[styles.errorStyle]}>{this.state.ageError}</Text>
                <View
                  onPress={this.checkShareComment}
                  style={[
                    styles.buttonGender,
                    {
                      paddingHorizontal: 10,
                    },
                  ]}>
                  {/* <View
                  style={[
                    styles.borderSelected,
                    this.state.checked
                      ? {
                          backgroundColor: '#02C39A',
                        }
                      : {
                          borderColor: '#00000070',
                          borderWidth: 1,
                        },
                  ]}>
                  {this.state.checked && (
                    <ScaledImage
                      source={require('@images/new/ic_checked.png')}
                      height={15}
                    />
                  )}
                </View> */}
                  <Text
                    style={{marginLeft: 5, paddingRight: 10, color: '#02C39A'}}>
                    * Câu hỏi của bạn sẽ được chia sẻ trên cộng đồng với chế độ
                    ẩn danh
                  </Text>
                </View>
                {/* <Text style={[styles.label, {marginTop: 20}]}>
                {constants.upload_image}
              </Text> */}
                <View style={styles.containerListImage}>
                  {this.state.imageUris.map((item, index) => (
                    <View key={index} style={styles.groupImagePicker}>
                      <View style={styles.groupImage}>
                        <Image
                          source={{uri: item.uri}}
                          resizeMode="cover"
                          style={styles.imagePicker}
                        />
                        {item.error ? (
                          <View style={styles.imageError}>
                            <ScaledImage
                              source={require('@images/ic_warning.png')}
                              width={40}
                            />
                          </View>
                        ) : item.loading ? (
                          <View style={styles.imageLoading}>
                            <ScaledImage
                              source={require('@images/loading.gif')}
                              width={40}
                            />
                          </View>
                        ) : null}
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
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
          {!this.state.imageUris || this.state.imageUris.length < 5 ? (
            <TouchableOpacity
              onPress={this.selectImage.bind(this)}
              style={styles.buttonSelectImage}>
              <ScaledImage
                width={20}
                source={require('@images/new/ic_image_green.png')}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  paddingLeft: 10,
                }}>
                Thêm ảnh liên quan
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <ImagePicker ref={ref => (this.imagePicker = ref)} />
        {Platform.OS == 'ios' && <KeyboardSpacer />}
        <ModalConfirm isVisible={this.state.isVisible} onSend={this.onSend} />
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  buttonSelectImage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    paddingBottom: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: '#00000020',
    borderWidth: 1,
  },
  buttonClose: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  imageLoading: {
    position: 'absolute',
    left: 20,
    top: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  imageError: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  imagePicker: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  groupImage: {
    marginTop: 8,
    width: 80,
    height: 80,
  },
  groupImagePicker: {
    margin: 2,
    width: 88,
    height: 88,
    position: 'relative',
  },
  containerListImage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  txtNameSpecialist: {
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  groupSpecialist: {
    flex: 1,
    paddingHorizontal: 10,
  },
  containerSpecialist: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonSelectSpecialist: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00000020',
    backgroundColor: '#FFF',
  },
  image: {
    marginTop: 4,
    tintColor: '#FC4A5F',
  },
  boderImage: {borderRadius: 25},
  avatar: {width: 50, height: 50, alignSelf: 'flex-start'},
  imgPlaceHoder: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },

  txtInfo: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonInfo: {
    width: 250,
    padding: 15,
    borderRadius: 6,
    alignSelf: 'center',
    margin: 36,
  },
  buttonGender: {
    padding: 10,
    flexDirection: 'row',
  },
  selected: {
    width: 12,
    height: 12,
    backgroundColor: '#02C39A',
    borderRadius: 6,
  },
  borderSelected: {
    width: 19,
    height: 19,
    // borderWidth: 2,
    backgroundColor: '#FFF',
    // borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {flexDirection: 'row', paddingTop: 10},
  inputAge: {
    width: 100,
    paddingTop: 10,
    paddingLeft: 17,
    paddingRight: 17,
    fontWeight: '600',
  },
  fieldAge: {
    flexDirection: 'row',
    padding: 15,
    flexWrap: 'wrap',
    backgroundColor: '#02C39A10',
    borderBottomColor: '#00000020',
    borderBottomWidth: 1,
  },
  inputContent: {
    lineHeight: 20,
    minHeight: height / 3,
    textAlignVertical: 'top',
    paddingTop: 13,
    paddingLeft: 15,
    paddingBottom: 13,
    paddingRight: 10,
    borderWidth: 0,
  },
  minus: {
    backgroundColor: '#02C39A',
    width: 20,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
  card: {padding: 22},
  containerCard: {
    // margin: 22,
    // marginTop: 10
  },
  backgroundHeader: {
    backgroundColor: '#02C39A',
    height: 130,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  scroll: {
    flex: 1,
    position: 'relative',
  },
  label: {
    color: '#000000',
    marginLeft: 9,
    fontWeight: 'bold',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    borderColor: '#cacaca',
    borderWidth: 1,
    padding: 7,
  },
  textinput: {
    borderColor: '#cacaca',
    backgroundColor: '#FFF',
    borderWidth: 1,
    paddingLeft: 7,
    padding: padding,
    borderRadius: 6,
    color: '#000',
  },
  errorStyle: {
    color: 'red',
    marginTop: 10,
    marginLeft: 15,
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
export default connect(mapStateToProps)(CreateQuestionStep1Screen);
