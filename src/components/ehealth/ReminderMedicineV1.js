import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import firebase from 'react-native-firebase';
import DateTimePicker from 'mainam-react-native-date-picker';
import constants from '@resources/strings';
import AsyncStorage from '@react-native-community/async-storage';
import snackbar from '@utils/snackbar-utils';

const ReminderMedicine = ({ result,
  resultDetail,
  hospitalName,
  currentIndex,
  dataHistory,
  user, listResult }) => {
  
  const [isEnabled, setIsEnabled] = useState(false);
  const [listTime, setListTime] = useState([]);
  const [date, setDate] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [
    toggelDateTimePickerVisible,
    setToggelDateTimePickerVisible,
  ] = useState(false);
  const getTime = async () => {
    try {
      if (resultDetail?.Profile?.PatientDocument) {
        let list = await AsyncStorage.getItem(resultDetail?.Profile?.PatientDocument.toString());
        if (list) {
          list = JSON.parse(list);
        }

        setListTime(list || []);
      }
    } catch (error) { }
  };
  useEffect(() => {
    getTime();
  }, []);
  const toggleSwitch = (item) => {

    try {
      let list = listTime.map(e => {
        if (e.fireDate == item.fireDate) {
          if (!e.isEnabled) {
            onAlarm(e.fireDate.toDateObject().getTime());
          } else {
            cancelScheduleNoti(e.fireDate.toDateObject().format('HH:mm'));
          }
          e.isEnabled = !e.isEnabled;
        }
        return e;
      });
      setListTime(list);
      AsyncStorage.setItem(resultDetail?.Profile?.PatientDocument.toString(), JSON.stringify(list));
    } catch (e) {


    }
  };
  const cancelScheduleNoti = async id => {
    try {
      const cancel = await firebase.notifications().cancelNotification(id);
    } catch (e) { }
  };
  const onAlarm = fire_date => {
    try {

      //   if (fire_date < new Date().getTime()) return;
      let data = {
        resultDetail: resultDetail,
        result: result,
        hospitalName: hospitalName,
        currentIndex: currentIndex,
        dataHistory: dataHistory,
        user: user,
        listResult: listResult
      }

      const notification = new firebase.notifications.Notification()
        .setNotificationId(fire_date.toDateObject().format('HH:mm'))
        .setBody('???? ?????n gi??? u???ng thu???c')
        .setTitle('B???nh vi???n ?????i h???c y H?? N???i')
        .android.setChannelId('isofh-care-channel')
        .android.setSmallIcon('ic_launcher')
        .setSound('default')
        .setData({
          id: 6,
          type: '-1',
          data
        });

      firebase.notifications().scheduleNotification(notification, {
        fireDate: fire_date,
        id: 'alarm_notification',
        push_type: 'alarm',
        large_icon: 'ic_launcher',
        repeat_interval: 'day',
        vibrate: 500,
        title: 'Hello',
        sub_text: 'sub text',
        priority: 'high',
        show_in_foreground: true,
        wake_screen: true,
        extra1: { a: 1 },
        extra2: 1,
      });
    } catch (e) {
      
    }
  };
  const onEdit = newDate => {
    if (resultDetail?.Profile?.PatientDocument) {
      let data = [];
      data = [...listTime];
      data.forEach(e => {
        if (
          e?.fireDate?.toDateObject().format('HH:mm') == date.format('HH:mm')
        ) {
          cancelScheduleNoti(date.format('HH:mm'));
          e.fireDate = newDate.toString();
          if (e.isEnabled) {
            onAlarm(e.fireDate.toDateObject().getTime());
          }
        }
      });
      setListTime(data);
      AsyncStorage.setItem(resultDetail?.Profile?.PatientDocument.toString(), JSON.stringify(data));
    }
    snackbar.show('S???a gi??? nh???c u???ng thu???c th??nh c??ng', 'success');
    setToggelDateTimePickerVisible(false);
  };
  const onConfirm = async newDate => {
    if (isEdit) {
      onEdit(newDate);
      return;
    }

    if (resultDetail?.Profile?.PatientDocument) {

      let data = [];
      data = await AsyncStorage.getItem(resultDetail?.Profile?.PatientDocument.toString());
      if (data != null) {
        data = JSON.parse(data);

        let obj = data.find(
          e =>
            e?.fireDate?.toDateObject().format('HH:mm') ==
            newDate.format('HH:mm'),
        );

        if (obj) {
          snackbar.show('???? t???n t???i gi??? nh???c u???ng thu???c', 'warning');
          return;
        }
      } else {
        data = [];
      }
      data.push({ fireDate: newDate.toString(), resultDetail, isEnabled: true });
      
      onAlarm(newDate.toString().toDateObject().getTime())
      setListTime(data);
      AsyncStorage.setItem(
        resultDetail?.Profile?.PatientDocument.toString(),
        JSON.stringify(data),
      );

    }
    snackbar.show('Th??m gi??? nh???c u???ng thu???c th??nh c??ng', 'success');
    setToggelDateTimePickerVisible(false);


  };
  const onEditTime = item => () => {
    setDate(item.fireDate.toDateObject());
    setToggelDateTimePickerVisible(true);
    setIsEdit(true);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.txtTitle}>Nh???c gi??? u???ng thu???c</Text>
      {listTime?.length


        ? listTime.map((e, i) => {
          return (
            <View key={i} style={styles.containerSwitch}>
              <TouchableOpacity
                onPress={onEditTime(e)}
                style={styles.containerButton}>
                <Text style={styles.txtTime}>
                  {e?.fireDate?.toDateObject().format('HH:mm')}
                </Text>
              </TouchableOpacity>
              <Switch
                trackColor={{ false: '#0291E130', true: '#0291E1' }}
                onValueChange={() => toggleSwitch(e)}
                value={e.isEnabled}
              />
            </View>
          );
        })
        : null}

      <TouchableOpacity
        onPress={() => {
          setIsEdit(false);
          setToggelDateTimePickerVisible(true);
        }}
        style={[styles.containerSwitch, { marginTop: 5 }]}>
        <Text style={styles.txtAddTime}>Th??m gi???</Text>

        <ScaledImage
          source={require('@images/new/ehealth/ic_add.png')}
          height={19}
          style={styles.iconTime}
        />
      </TouchableOpacity>
      <DateTimePicker
        mode={'time'}
        isVisible={toggelDateTimePickerVisible}
        onConfirm={onConfirm}
        onCancel={() => {
          setToggelDateTimePickerVisible(false);
        }}
        locale={'vi'}
        titleIOS={'Ch???n gi???'}
        cancelTextIOS={constants.actionSheet.cancel2}
        confirmTextIOS={constants.actionSheet.confirm}
        date={date || new Date()}
      />
    </View>
  );
};

export default ReminderMedicine;

const styles = StyleSheet.create({
  containerButton: {
    flex: 1,
  },
  container: {
    paddingBottom: 15,
    paddingHorizontal: 5,
  },
  iconTime: {
    tintColor: '#0291E1',
  },
  txtAddTime: {
    color: '#0291E1',
    fontSize: 15,
    fontWeight: 'bold',
  },
  txtTime: {
    fontSize: 17,
  },
  containerSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    borderBottomColor: '#00000060',
    borderBottomWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  txtTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingLeft: 10,
    paddingTop: 10,
  },
});
