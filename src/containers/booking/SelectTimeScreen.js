import React, {Component, PropTypes} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
import scheduleProvider from '@data-access/schedule-provider';
import snackbar from '@utils/snackbar-utils';
import dateUtils from 'mainam-react-native-date-utils';
const DEVICE_WIDTH = Dimensions.get('window').width;
import {Calendar, LocaleConfig} from 'react-native-calendars';
import DateTimePicker from 'mainam-react-native-date-picker';
import constants from '@resources/strings';
import bookingDoctorProvider from '@data-access/booking-doctor-provider';
import firebaseUtils from '@utils/firebase-utils';

LocaleConfig.locales['en'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'Th 1',
    'Th 2',
    'Th 3',
    'Th 4',
    'Th 5',
    'Th 6',
    'Th 7',
    'Th 8',
    'Th 9',
    'Th 10',
    'Th 11',
    'Th 12',
  ],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'],
};

LocaleConfig.defaultLocale = 'en';

class SelectTimeScreen extends Component {
  constructor(props) {
    super(props);
    let service = this.props.navigation.state.params.service;

    let byHospital = service?.length ? service[0].byHospital : false;
    let hospital = this.props.navigation.state.params.hospital;
    let isNotHaveSchedule = this.props.navigation.state.params
      .isNotHaveSchedule;

    this.state = {
      service,
      listTime: [],
      isNotHaveSchedule,
      hospital,
      listSchedule: [],
      byHospital,
    };
  }
  getTime(yourDateString) {
    var yourDate = new Date(yourDateString);
    try {
      // yourDate.setMinutes(yourDate.getMinutes() + yourDate.getTimezoneOffset());
      yourDate.setMinutes(yourDate.getMinutes());
    } catch (error) {}
    return yourDate;
  }

  selectDay(day) {
    if (this.state.byHospital) {
      let data = this.state.schedules[day].schedules || [];
      let listTime = [];
      this.setState({
        allowBooking: false,
      });
      let date = new Date(new Date(day));
      let objDate = this.state.listSchedule.find(
        e => e.dayOfWeek == this.convertDayOfWeek(date.getDay()),
      );
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      date.setMinutes(
        date.getMinutes() + (objDate.startTime || objDate.startTime == 0)
          ? objDate.startTime
          : 8 * 60,
      );
      let endTime = this.getTimeDate(objDate.endTime - 30);

      while (true) {
        if (
          date.format('HH:mm') > endTime ||
          date.compareDate(new Date(day)) != 0
        )
          break;

        if (
          this.getTimeBooking(date.format('HH:mm')) <
            this.getTimeBooking(this.getTimeDate(objDate.lunchStartTime)) ||
          this.getTimeBooking(date.format('HH:mm')) >=
            this.getTimeBooking(this.getTimeDate(objDate.lunchEndTime))
        ) {
          listTime.push({
            key: date.getTime(),
            schedule: {},
            type: 3,
            date: date.format('yyyy-MM-dd'),
            time: date.format('HH:mm'),

            timeString: date.format('HH:mm:ss'),
          });
        }
        date.setMinutes(date.getMinutes() + 30);
      }
      this.setState({listTime});

      this.setState(
        {
          listTime: listTime.sort((a, b) => {
            return a.time - b.time;
          }),
          lunchStartTime: objDate.lunchStartTime
            ? this.getTimeDate(objDate.lunchStartTime)
            : null,
          lunchEndTime: objDate.lunchEndTime
            ? this.getTimeDate(objDate.lunchEndTime)
            : null,
        },
        () => {},
      );
    } else {
      let list = this.state.listSchedule.find(e => e.date == day);

      this.setState({
        listTime: list.value,
      });
    }
  }

  getColor(item) {
    if (item.type == 0) return '#d0021b';
    if (item.type == 1) return '#ffa500';
    if (item.type == 2) return '#efd100';
    return '#02c39a';
  }
  getTimeDate = time => {
    let time1 = '21:00';
    if (time) {
      let hoursStart = time / 60;
      let rhoursStart = Math.floor(hoursStart);
      let minutesStart = (hoursStart - rhoursStart) * 60;
      let rminutesStart = Math.floor(minutesStart);
      if (rminutesStart < 10) {
        time1 = rhoursStart + ':' + '0' + rminutesStart;
      } else {
        time1 = rhoursStart + ':' + rminutesStart;
      }
    }
    return time1;
  };
  getListSchedule = async () => {
    this.setState({isLoading: true}, async () => {
      try {
        const {hospital} = this.state;
        let hospitalId = hospital && hospital.id ? hospital.id : '';
        let res = await bookingDoctorProvider.get_list_schedules(hospitalId);

        if (res) {
          this.setState(
            {
              listSchedule: res,
              isLoading: false,
            },
            () => {
              let dateNew = new Date();
              dateNew.setDate(dateNew.getDate() + 1);
              this.selectMonth(dateNew);
            },
          );
        }
      } catch (error) {
        this.setState({isLoading: false});
        let dateNew = new Date();
        dateNew.setDate(dateNew.getDate() + 1);
        this.selectMonth(dateNew);
      }
    });
  };
  getListServiceDoctor = () => {
    let data = this.state.service[0].timeSlots.map((item, index) => {
      return {
        dayOfWeek: this.convertDayOfWeek(item.date.toDateObject().getDay()),
        ...item,
      };
    });

    let res = data
      .map(item => item.date)
      .filter((item, i, ar) => ar.indexOf(item) === i)
      .map(item => {
        let new_list = data.filter(
          itm => itm.date == item && itm.status != 'MIN_CAPACITY',
        );
        return {date: item, value: new_list};
      });
    this.setState(
      {
        listSchedule: res,
        isLoading: false,
      },
      () => {
        let dateNew = new Date();
        dateNew.setDate(dateNew.getDate() + 1);
        this.selectMonth(dateNew);
      },
    );
  };
  componentDidMount() {
    if (this.state.service?.length) {
      let byHospital = this.state.service[0].byHospital;
      if (byHospital) {
        this.getListSchedule();
      } else {
        this.getListServiceDoctor();
      }
    }
  }
  convertDayOfWeek = day => {
    let date = {
      0: 7,
    };
    return date[day] || day;
  };
  generateSchedule(month) {
    let firstDay = month.getFirstDateOfMonth();
    let lastDay = month.getLastDateOfMonth();
    let obj = {};
    while (firstDay <= lastDay) {
      let key = firstDay.format('yyyy-MM-dd');
      obj[key] = {};
      if (
        new Date(key).compareDate(new Date()) <= 0
        // || firstDay.getDay() == 6
      ) {
        obj[key].disabled = true;
        obj[key].disableTouchEvent = true;
      } else {
        obj[key].noSchedule = true;
        obj[key].schedules = [];
        obj[key].marked = true;
        obj[key].color = 'green';
        obj[key].selectedColor = '#27ae60';
      }
      // return;
      firstDay.setDate(firstDay.getDate() + 1);
    }
    let selected = null;
    for (let key in obj) {
      let dateKey = new Date(key);
      if (obj[key].disabled) continue;

      let objDate;
      if (this.state.byHospital) {
        objDate = this.state.listSchedule.find(
          e => e.dayOfWeek == this.convertDayOfWeek(dateKey.getDay()),
        );
      } else {
        objDate = this.state.listSchedule.find(e => {
          return e.date == key && e.value.length;
        });
      }

      if (!objDate) {
        obj[key].disabled = true;
        obj[key].disableTouchEvent = true;
        obj[key].marked = false;
        continue;
      }
      let keyDate = new Date(key);
      if (keyDate > new Date() && (selected == null || keyDate < selected)) {
        selected = keyDate;
      }
    }
    if (selected) {
      (obj[selected.format('yyyy-MM-dd')] || {}).selected = true;
    }
    this.setState(
      {
        dateString: selected ? selected.format('yyyy-MM-dd') : null,
        bookingDate: selected,
        schedules: obj,
      },
      () => {
        if (this.state.dateString) this.selectDay(this.state.dateString);
      },
    );
    return obj;
  }
  groupSchedule(schedules) {
    let obj = {};
    schedules.forEach(item => {
      if (Object.keys(item).length) {
        let key = new Date(Object.keys(item)[0]);
        if (new Date(key) <= new Date()) return;
        let tgi = new Date(key).format('yyyy-MM-dd');
        if (!obj[tgi]) {
          obj[tgi] = {
            schedules: [],
            marked: true,
            color: 'green',
            selectedColor: '#27ae60',
          };
        } else {
          obj[tgi].schedules.push(item);
        }
      }
    });
    let selected = null;
    for (let key in obj) {
      let keyDate = new Date(key);
      if (keyDate > new Date() && (selected == null || keyDate < selected)) {
        selected = keyDate;
      }
    }
    if (selected) {
      (obj[selected.format('yyyy-MM-dd')] || {}).selected = true;
    }
    this.setState(
      {
        dateString: selected ? selected.format('yyyy-MM-dd') : null,
        bookingDate: selected,
        schedules: obj,
      },
      () => {
        if (this.state.dateString) this.selectDay(this.state.dateString);
      },
    );
    return obj;
  }

  selectMonth(date) {
    if (this.state.isNotHaveSchedule) {
      this.generateSchedule(date);
    }
    this.setState({
      allowBooking: false,
    });
  }
  daysBetween = (date1, date2) => {
    var one_day = 1000 * 60 * 60 * 24;

    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    var difference_ms = date2_ms - date1_ms;
    return Math.round(difference_ms / one_day);
  };
  selectTime = item => () => {
    switch (item.status) {
      case 'FULL':
        snackbar.show('Đã kín lịch trong khung giờ này', 'danger');
        return;
      case 'MIN_CAPACITY':
        snackbar.show(
          `Bạn chỉ được đặt lịch sau ${item.minimumCapacity} giờ`,
          'danger',
        );
        return;
      case 'MAX_CAPACITY':
        snackbar.show(
          `Bạn chỉ được đặt lịch trước ${item.maximumCapacity} ngày`,
          'danger',
        );
        return;
    }
    // if (item.type == 0) {
    //     snackbar.show("Đã kín lịch trong khung giờ này", "danger");
    //     return;
    // }
    let date = new Date(item.key);

    if (item.maximumCapacity < this.daysBetween(new Date(), date)) {
      snackbar.show(
        `Bạn chỉ được đặt lịch trước ${item.maximumCapacity} ngày`,
        'danger',
      );
      return;
    }

    if (item.type == 0) {
      snackbar.show(constants.msg.booking.full_slot_on_this_time, 'danger');
      return;
    }

    this.setState({schedule: item, allowBooking: true});
  };

  confirm = () => {
    firebaseUtils.sendEvent('Doctor_ofline_confirm');
    if (!this.state.allowBooking) return;
    let error = false;

    if (this.state.schedule) {
      this.setState({scheduleError: ''});
    } else {
      this.setState({scheduleError: constants.msg.booking.schedule_not_null});
      error = true;
    }

    if (error) return;

    if (this.state.bookingDate && this.state.schedule) {
      let callback = ((this.props.navigation.state || {}).params || {})
        .onSelected;
      if (callback) {
        callback(this.state.bookingDate, this.state.schedule);
        this.props.navigation.pop();
      }
    } else {
      this.setState({
        scheduleError: constants.msg.booking.please_select_date_and_time,
      });
    }
  };
  getTimeBooking = date => {
    let [h, m] = date.split(':');
    let time = (parseInt(m) / 60 + parseInt(h)) * 60;
    return time;
  };
  renderTimePicker(fromHour, toHour, label) {
    return this.state.listTime.filter(
      item =>
        this.getTimeBooking(item.time) >= this.getTimeBooking(fromHour) &&
        this.getTimeBooking(item.time) <= this.getTimeBooking(toHour),
    ).length ? (
      <View style={{marginTop: 10}}>
        <Text style={styles.txtLabel}>{label}</Text>
        <View style={styles.containerListTime}>
          {this.state.listTime
            .filter(
              item =>
                this.getTimeBooking(item.time) >=
                  this.getTimeBooking(fromHour) &&
                this.getTimeBooking(item.time) <= this.getTimeBooking(toHour),
            )
            .map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={this.selectTime(item)}
                  key={index}
                  style={[
                    styles.buttonSelectDateTime,
                    {
                      borderColor: this.getColor(item),
                    },
                    this.state.schedule == item ? styles.item_selected : {},
                  ]}>
                  <Text
                    style={[
                      {color: this.getColor(item)},
                      styles.txtItemLabel,
                      this.state.schedule == item
                        ? styles.item_label_selected
                        : {},
                    ]}>
                    {item.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    ) : null;
  }
  onSelectDay = day => {
    let schedules = JSON.parse(JSON.stringify(this.state.schedules));
    if (schedules.hasOwnProperty(day.dateString)) {
      if (this.state.dateString) {
        delete schedules[this.state.dateString].selected;
      }
      schedules[day.dateString].selected = true;
      schedules[day.dateString].selectedColor = '#27ae60';
      this.setState(
        {
          dateString: day.dateString,
          bookingDate: day.dateString.toDateObject(),
          schedules: schedules,
        },
        () => {
          this.selectDay(this.state.dateString);
        },
      );
    }
    this.setState({allowBooking: false});
  };
  onChangeMonth = month => {
    this.setState({latestTime: new Date(month.dateString)}, () => {
      this.selectMonth(month.dateString.toDateObject());
    });
  };
  toggelDate = () => {
    this.setState({toggelMonthPicker: true});
  };
  confirmDate = newDate => {
    this.setState({latestTime: newDate, toggelMonthPicker: false}, () => {
      this.selectMonth(newDate);
    });
  };
  onCancelDate = () => {
    this.setState({toggelMonthPicker: false});
  };
  render() {
    let dateNew = new Date();
    dateNew.setDate(dateNew.getDate() + 1);
    return (
      <ActivityPanel
        isLoading={this.state.isLoading}
        title={constants.title.select_time}>
        <View style={styles.flex}>
          <View style={styles.container}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag">
              <Text style={styles.txtSelectColor}>
                {constants.booking.select_date_color_green}
              </Text>
              <View style={styles.containerCalendar}>
                <Calendar
                  style={styles.calendar}
                  markedDates={this.state.schedules}
                  current={(this.state.latestTime || dateNew).format(
                    'yyyy-MM-dd',
                  )}
                  onDayPress={this.onSelectDay}
                  monthFormat={'MMMM - yyyy'}
                  onMonthChange={this.onChangeMonth}
                  // hideArrows={true}
                  hideExtraDays={true}
                  firstDay={1}
                />
                <TouchableOpacity
                  onPress={this.toggelDate}
                  style={styles.buttonToggelDate}
                />
              </View>
              {this.state.dateString ? (
                this.state.listTime && this.state.listTime.length ? (
                  <View style={{margin: 10}}>
                    <Text style={styles.txtSchedule}>
                      {constants.booking.schedule_booking}{' '}
                      {this.state.dateString
                        .toDateObject()
                        .format('thu, dd/MM/yyyy')
                        .toUpperCase()}
                    </Text>
                    {this.state.scheduleError ? (
                      <Text style={[styles.errorStyle]}>
                        {this.state.scheduleError}
                      </Text>
                    ) : (
                      <Text style={styles.txtPleaseSelectSchedule}>
                        {constants.msg.booking.please_select_schedule}
                      </Text>
                    )}

                    {this.renderTimePicker(
                      '0:0',
                      this.state.lunchStartTime || '11:30',
                      'Sáng',
                    )}
                    {this.renderTimePicker(
                      this.state.lunchEndTime || '12:00',
                      '24:00',
                      'Chiều',
                    )}
                  </View>
                ) : !this.state.isLoading ? (
                  <Text style={[styles.errorStyle]}>
                    {constants.msg.booking.date_not_schedule}
                  </Text>
                ) : null
              ) : this.state.listSchedule.length ? (
                <Text style={styles.txtPleaseSchedule}>
                  {constants.msg.booking.please_select_schedule}
                </Text>
              ) : (
                <Text style={styles.errorStyle}>
                  Cơ sở y tế không có lịch làm việc vào thời gian này
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.button,
                this.state.allowBooking ? {backgroundColor: '#02c39a'} : {},
              ]}
              onPress={this.confirm}>
              <Text style={styles.btntext}>
                {constants.actionSheet.confirm}
              </Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            mode={'date'}
            isVisible={this.state.toggelMonthPicker}
            onConfirm={this.confirmDate}
            onCancel={this.onCancelDate}
            cancelTextIOS={'Hủy bỏ'}
            confirmTextIOS={'Xác nhận'}
            date={this.state.latestTime || new Date()}
          />
        </View>
      </ActivityPanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
const styles = StyleSheet.create({
  txtPleaseSchedule: {
    fontStyle: 'italic',
    marginVertical: 20,
    textAlign: 'center',
  },
  txtPleaseSelectSchedule: {
    fontStyle: 'italic',
    marginVertical: 20,
    textAlign: 'center',
  },
  txtSchedule: {
    color: '#00c088',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonToggelDate: {
    position: 'absolute',
    top: 0,
    left: 70,
    right: 70,
    height: 60,
  },
  calendar: {width: '100%'},
  containerCalendar: {
    position: 'relative',
    left: 0,
    right: 0,
    width: DEVICE_WIDTH,
  },
  txtSelectColor: {
    color: '#00c088',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 10,
  },
  flex: {flex: 1},
  txtItemLabel: {
    fontWeight: 'bold',
    color: '#00c088',
    textAlign: 'center',
  },
  buttonSelectDateTime: {
    paddingHorizontal: 5,
    alignSelf: 'center',
    minWidth: 60,
    borderRadius: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#cacaca',
    margin: 5,
  },
  containerListTime: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  txtLabel: {
    color: '#00c088',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  name: {
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  imgName: {
    alignItems: 'center',
    padding: 10,
  },
  txtname: {
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
    flex: 1,
    marginLeft: 10,
  },
  img: {
    marginRight: 5,
  },
  article: {
    marginTop: 25,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  mucdichkham: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  mdk: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
  },

  border: {
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    marginLeft: 15,
  },
  imgIc: {
    marginLeft: 10,
    marginRight: 10,
  },
  imgmdk: {
    marginRight: 5,
  },

  datkham: {
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ffffff',
    padding: 15,
    paddingLeft: 100,
    paddingRight: 100,
  },
  txtchongiokham: {
    fontSize: 14,
    marginLeft: 20,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
  },
  chonGioKham: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
  },
  button: {
    borderRadius: 6,
    backgroundColor: '#cacaca',
    shadowColor: 'rgba(0, 0, 0, 0.21)',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    width: 250,
    marginVertical: 20,
    alignSelf: 'center',
  },
  btntext: {
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ffffff',
    padding: 15,
    textAlign: 'center',
  },
  slider: {
    marginLeft: 20,
    marginRight: 20,
  },
  circle: {
    padding: 5,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: 'rgba(151, 151, 151, 0.29)',
    marginLeft: 5,
  },
  errorStyle: {
    marginVertical: 20,
    color: 'red',
    textAlign: 'center',
  },

  titleStyle: {
    color: '#FFF',
  },
  item_label_selected: {
    color: '#FFF',
  },
  item_selected: {
    backgroundColor: '#00c088',
  },
});
export default connect(mapStateToProps)(SelectTimeScreen);
