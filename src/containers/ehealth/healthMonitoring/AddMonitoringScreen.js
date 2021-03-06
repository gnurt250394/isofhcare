import React, {useRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import ModalComponent from '@components/modal';
import ScaledImage from 'mainam-react-native-scaleimage';
const {width, height} = Dimensions.get('screen');
import DateTimePicker from 'mainam-react-native-date-picker';
import {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import monitoringProvider from '@data-access/monitoring-provider';
import snackbar from '@utils/snackbar-utils';

import Form from 'mainam-react-native-form-validate/Form';
import Field from 'mainam-react-native-form-validate/Field';
import TextField from 'mainam-react-native-form-validate/TextField';

const AddMonitoringScreen = ({
  isVisible,
  onBackdropPress,
  label,
  label2,
  label3,
  type, // "TEMP"|"BLOOD"|"BMI",
  onCreateSuccess,
}) => {
  const [toggelDatePicker, setToggelDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [errorValue, setErrorValue] = useState({});
  const [errorTime, setErrorTime] = useState('');
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [value, setValue] = useState();
  const [value2, setValue2] = useState();
  const form = useRef();
  const onnHideModal = () => {
    onBackdropPress();
    setDate(new Date());
    setTime(new Date());
    setValue();
    setValue2();
  };
  const confirmDate = newDate => {
    if (mode == 'date') {
      setDate(newDate);
    } else {
      setTime(newDate);
    }
    setToggelDatePicker(false);
  };
  const onCancelDate = () => {
    setToggelDatePicker(false);
  };
  const onShowDatePicker = mode => () => {
    setMode(mode);
    setToggelDatePicker(true);
  };
  const createHeightWeight = async () => {
    try {
      let res = await monitoringProvider.createHeightWeight(
        date,
        value,
        value2,
      );
      if (res) {
        onCreateSuccess(res);
        onnHideModal();
        snackbar.show('T???o ' + label + ' th??nh c??ng', 'success');
      }
    } catch (error) {
      snackbar.show('T???o ' + label + ' th???t b???i', 'danger');
    }
  };
  const createBodyTemperature = async () => {
    try {
      let day = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
      );
      day.setHours(day.getHours() + 7);

      let res = await monitoringProvider.createBodyTemperature(day, value2);
      if (res) {
        onCreateSuccess(res);
        onnHideModal();
        snackbar.show('T???o ' + label + ' th??nh c??ng', 'success');
      }
    } catch (error) {
      snackbar.show('T???o ' + label + ' th???t b???i', 'danger');
    }
  };
  const createBloodPressure = async () => {
    try {
      let res = await monitoringProvider.createBloodPressure(
        date,
        value2,
        value,
      );
      if (res) {
        onCreateSuccess(res);
        onnHideModal();
        snackbar.show('T???o ' + label + ' th??nh c??ng', 'success');
      }
    } catch (error) {
      snackbar.show('T???o ' + label + ' th???t b???i', 'danger');
    }
  };
  const onCreate = () => {
    if (!form.current.isValid()) {
      return;
    }
    switch (type) {
      case 'TEMP':
        createBodyTemperature();
        break;
      case 'BLOOD':
        createBloodPressure();
        break;
      case 'BMI':
        createHeightWeight();
        break;

      default:
        break;
    }
  };
  return (
    <ModalComponent
      isVisible={isVisible}
      onBackdropPress={onnHideModal}
      backdropOpacity={0.5}
      animationInTiming={500}
      animationOutTiming={500}
      style={{
        marginHorizontal: 0,
      }}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}>
      <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View style={styles.lineTop} />
          <View style={styles.flex}>
            <View style={styles.containerLabel}>
              <Text style={styles.txtLabel}>{label}</Text>
              <TouchableOpacity onPress={onnHideModal} hitSlop={styles.hitslop}>
                <ScaledImage
                  source={require('@images/new/ehealth/ic_close.png')}
                  height={18}
                  style={{
                    tintColor: '#bbb',
                  }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.txtSubLabel}>Nh???p ch??? s??? hi???n t???i c???a b???n</Text>
            <Form ref={form}>
              <Field>
                <Field>
                  <Text style={styles.txtLabel2}>Ng??y ??o</Text>
                  <TextField
                    getComponent={value => {
                      return (
                        <TouchableOpacity
                          onPress={onShowDatePicker('date')}
                          style={styles.buttonSelectTime}>
                          <Text
                            style={{
                              color: !isNaN(date) ? '#000' : '#00000060',
                            }}>
                            {!isNaN(date)
                              ? date.format('dd/MM/yyyy')
                              : 'Ch???n ng??y'}
                          </Text>
                          <ScaledImage
                            source={require('@images/new/calendar.png')}
                            height={19}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </Field>
                <Field
                  style={{
                    paddingVertical: 14,
                  }}>
                  <Text style={styles.txtLabel2}>{label2}</Text>
                  {type == 'TEMP' ? (
                    <TextField
                      getComponent={() => {
                        return (
                          <TouchableOpacity
                            onPress={onShowDatePicker('time')}
                            style={styles.buttonSelectTime}>
                            <Text
                              style={{
                                color: !isNaN(time) ? '#000' : '#00000060',
                              }}>
                              {!isNaN(time)
                                ? time.format('HH:mm')
                                : 'Ch???n th???i gian'}
                            </Text>
                            <ScaledImage
                              source={require('@images/new/calendar.png')}
                              height={19}
                            />
                          </TouchableOpacity>
                        );
                      }}
                      hideError={true}
                      validate={{
                        rules: {
                          required: true,
                          checkDate: value => {
                            let now = new Date();
                            console.log('date.compareDate(now): ', date.compareDate(now));
                            if (
                              date.compareDate(now) == 0 &&
                              value.replace(':', '') >
                                now.format('HH:mm').replace(':', '')
                            ) {
                              return false;
                            }
                            return true;
                          },
                        },
                        messages: {
                          required: 'Vui l??ng ch???n th???i gian',
                          checkDate:
                            'Gi??? ??o kh??ng ???????c l???n h??n th???i gian hi???n t???i.',
                        },
                      }}
                      onValidate={(valid, messages) => {
                        console.log('messages: ', messages);
                        console.log('valid: ', valid);
                        if (valid) {
                          setErrorTime('');
                        } else {
                          setErrorTime(messages);
                        }
                      }}
                      value={time.format('HH:mm')}
                    />
                  ) : (
                    <TextField
                      hideError={true}
                      validate={{
                        rules: {
                          required: true,
                          checkLength: value => {
                            let max = 0,
                              min = 0;
                            if (type == 'BMI') {
                              max = 250;
                              min = 0;
                            } else if (type == 'BLOOD') {
                              max = 200;
                              min = 0;
                            }

                            if (value <= min || value > max) {
                              return false;
                            } else {
                              return true;
                            }
                          },
                        },
                        messages: {
                          required:
                            type == 'BLOOD'
                              ? 'Vui l??ng nh???p huy???t ??p t??m thu'
                              : type == 'BMI'
                              ? 'Vui l??ng nh???p chi???u cao'
                              : type == 'TEMP'
                              ? 'Vui l??ng nh???p th???i gian'
                              : '',
                          checkLength:
                            type == 'BLOOD'
                              ? 'Huy???t ??p t??m thu ch??? n???m trong kho???ng t??? 1 ?????n 200'
                              : type == 'BMI'
                              ? 'Chi???u cao ch??? n???m trong kho???ng t??? 1 ?????n 250'
                              : '',
                        },
                      }}
                      onValidate={(valid, messages) => {
                        if (valid) {
                          setErrorValue({...errorValue, value: ''});
                        } else {
                          setErrorValue({...errorValue, value: messages});
                        }
                      }}
                      keyboardType={type == 'BLOOD' ? 'number-pad' : 'numeric'}
                      inputStyle={styles.buttonSelectTime}
                      placeholder={
                        type == 'BLOOD'
                          ? 'Nh???p ch??? s??? t??m thu'
                          : type == 'BMI'
                          ? 'Nh???p chi???u cao'
                          : type == 'TEMP'
                          ? 'Ch???n th???i gian'
                          : ''
                      }
                      value={value}
                      maxLength={3}
                      onChangeText={setValue}
                    />
                  )}
                  <Field>
                    {errorTime || errorValue.value ? (
                      <Text style={styles.txtError}>
                        {errorTime || errorValue.value}
                      </Text>
                    ) : null}
                  </Field>
                </Field>
                <Field>
                  <Text style={styles.txtLabel2}>{label3}</Text>
                  <TextField
                    hideError={true}
                    validate={{
                      rules: {
                        required: true,
                        checkLength: value => {
                          let max = 0,
                            min = 0;
                          if (type == 'TEMP') {
                            max = 45;
                            min = 0;
                          } else if (type == 'BMI') {
                            max = 500;
                            min = 0;
                          } else if (type == 'BLOOD') {
                            max = 150;
                            min = 0;
                          }
                          if (value <= min || value > max) {
                            return false;
                          } else {
                            return true;
                          }
                        },
                      },
                      messages: {
                        required:
                          type == 'BLOOD'
                            ? 'Vui l??ng nh???p huy???t ??p t??m tr????ng'
                            : type == 'BMI'
                            ? 'Vui l??ng nh???p c??n n???ng'
                            : type == 'TEMP'
                            ? 'Vui l??ng nh???p nhi???t ?????'
                            : '',
                        checkLength:
                          type == 'BLOOD'
                            ? 'Huy???t ??p t??m tr????ng ch??? n???m trong kho???ng t??? 1 ?????n 150'
                            : type == 'BMI'
                            ? 'C??n n???ng ch??? n???m trong kho???ng t??? 1 ?????n 500'
                            : type == 'TEMP'
                            ? 'Nhi???t ????? ch??? trong kho???ng t??? 1 ?????n 45'
                            : '',
                      },
                    }}
                    onValidate={(valid, messages) => {
                      if (valid) {
                        setErrorValue({...errorValue, value2: ''});
                      } else {
                        setErrorValue({...errorValue, value2: messages});
                      }
                    }}
                    keyboardType={type == 'BLOOD' ? 'number-pad' : 'numeric'}
                    inputStyle={styles.buttonSelectTime}
                    placeholder={
                      type == 'BLOOD'
                        ? 'Nh???p ch??? s??? t??m tr????ng'
                        : type == 'BMI'
                        ? 'Nh???p c??n n???ng'
                        : type == 'TEMP'
                        ? 'Nh???p nhi???t ?????'
                        : ''
                    }
                    maxLength={type == 'BMI' ? 4 : 3}
                    value={value2}
                    onChangeText={setValue2}
                  />
                  <Field>
                    {errorValue.value2 ? (
                      <Text style={styles.txtError}>{errorValue.value2}</Text>
                    ) : null}
                  </Field>
                </Field>
              </Field>
            </Form>
            <TouchableOpacity onPress={onCreate} style={styles.buttonnAdd}>
              <Text style={styles.txtAdd}>TH??M CH??? S???</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <DateTimePicker
        mode={mode}
        isVisible={toggelDatePicker}
        onConfirm={confirmDate}
        maximumDate={new Date()}
        onCancel={onCancelDate}
        cancelTextIOS={'H???y b???'}
        titleIOS={'Ch???n ng??y'}
        confirmTextIOS={'X??c nh???n'}
        locale={'vi'}
        date={date || new Date()}
      />
    </ModalComponent>
  );
};

export default AddMonitoringScreen;

const styles = StyleSheet.create({
  txtError: {
    color: 'red',
    paddingLeft: 15,
  },
  txtAdd: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonnAdd: {
    backgroundColor: '#00CBA7',
    padding: 10,
    alignSelf: 'center',
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonSelectTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderColor: '#00000060',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 15,
  },
  txtLabel2: {
    paddingLeft: 17,
    paddingBottom: 5,
  },
  txtSubLabel: {
    textAlign: 'center',
    paddingTop: 6,
    paddingBottom: 15,
  },
  hitslop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  txtLabel: {
    flex: 1,
    textAlign: 'center',
    paddingLeft: 25,
    color: '#00BA99',
    fontWeight: 'bold',
    fontSize: 16,
  },
  containerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  flex: {flex: 1},
  lineTop: {
    backgroundColor: '#FFF',
    height: 6,
    width: 50,
    top: -25,
    alignSelf: 'center',
    borderRadius: 10,
  },
  container: {
    backgroundColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
});
