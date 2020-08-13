import React from 'react';
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
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [value, setValue] = useState();
  const [value2, setValue2] = useState();
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
        snackbar.show('Tạo ' + label + ' thành công', 'success');
      }
    } catch (error) {
      console.log('error: ', error);
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
        snackbar.show('Tạo ' + label + ' thành công', 'success');
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };
  const createBloodPressure = async () => {
    try {
      let res = await monitoringProvider.createBloodPressure(
        date,
        value,
        value2,
      );
      if (res) {
        onCreateSuccess(res);
        onnHideModal();
        snackbar.show('Tạo ' + label + ' thành công', 'success');
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };
  const onCreate = () => {
    if (!date) {
      snackbar.show('Vui lòng chọn ngày', 'danger');
      return;
    }
    if (!value && type != 'TEMP') {
      snackbar.show('Vui lòng nhập ' + label2, 'danger');
      return;
    }
    if (!value2) {
      snackbar.show('Vui lòng nhập ' + label3, 'danger');
      return;
    }
    console.log('type: ', type);
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
            <Text style={styles.txtSubLabel}>Nhập chỉ số hiện tại của bạn</Text>
            <View>
              <Text style={styles.txtLabel2}>Ngày đo</Text>
              <TouchableOpacity
                onPress={onShowDatePicker('date')}
                style={styles.buttonSelectTime}>
                <Text
                  style={{
                    color: !isNaN(date) ? '#000' : '#00000060',
                  }}>
                  {!isNaN(date) ? date.format('dd/MM/yyyy') : 'Chọn ngày'}
                </Text>
                <ScaledImage
                  source={require('@images/new/calendar.png')}
                  height={19}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingVertical: 14,
              }}>
              <Text style={styles.txtLabel2}>{label2}</Text>
              {type == 'TEMP' ? (
                <TouchableOpacity
                  onPress={onShowDatePicker('time')}
                  style={styles.buttonSelectTime}>
                  <Text
                    style={{
                      color: !isNaN(time) ? '#000' : '#00000060',
                    }}>
                    {!isNaN(time) ? time.format('HH:mm') : 'Chọn thời gian'}
                  </Text>
                  <ScaledImage
                    source={require('@images/new/calendar.png')}
                    height={19}
                  />
                </TouchableOpacity>
              ) : (
                <TextInput
                  keyboardType={type == 'BLOOD' ? 'number-pad' : 'numeric'}
                  style={styles.buttonSelectTime}
                  placeholder={
                    type == 'BLOOD'
                      ? 'Nhập chỉ số tâm thu'
                      : type == 'BMI'
                      ? 'Nhập chiều cao'
                      : type == 'TEMP'
                      ? 'Chọn thời gian'
                      : ''
                  }
                  value={value}
                  maxLength={3}
                  onChangeText={setValue}
                />
              )}
            </View>
            <View>
              <Text style={styles.txtLabel2}>{label3}</Text>
              <TextInput
                keyboardType={type == 'BLOOD' ? 'number-pad' : 'numeric'}
                style={styles.buttonSelectTime}
                placeholder={
                  type == 'BLOOD'
                    ? 'Nhập chỉ số tâm trương'
                    : type == 'BMI'
                    ? 'Nhập cân nặng'
                    : type == 'TEMP'
                    ? 'Nhập nhiệt độ'
                    : ''
                }
                maxLength={3}
                value={value2}
                onChangeText={setValue2}
              />
            </View>
            <TouchableOpacity onPress={onCreate} style={styles.buttonnAdd}>
              <Text style={styles.txtAdd}>THÊM CHỈ SỐ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <DateTimePicker
        mode={mode}
        isVisible={toggelDatePicker}
        onConfirm={confirmDate}
        onCancel={onCancelDate}
        cancelTextIOS={'Hủy bỏ'}
        titleIOS={'Chọn ngày'}
        confirmTextIOS={'Xác nhận'}
        locale={'vi'}
        date={date || new Date()}
      />
    </ModalComponent>
  );
};

export default AddMonitoringScreen;

const styles = StyleSheet.create({
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
