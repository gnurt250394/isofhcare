import React, {Component, PropTypes} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import notificationProvider from '@data-access/notification-provider';
import dateUtils from 'mainam-react-native-date-utils';
import questionProvider from '@data-access/question-provider';
import ticketProvider from '@data-access/ticket-provider';
import snackbar from '@utils/snackbar-utils';
import DialogBox from 'react-native-dialogbox';
import constants from '@resources/strings';
import firebase from 'react-native-firebase';
import redux from '@redux-store';
import ImageLoad from 'mainam-react-native-image-loader';
import bookingProvider from '@data-access/booking-provider';
import NavigationService from '@navigators/NavigationService';

import clientUtils from '@utils/client-utils';
import objectUtils from '@utils/object-utils';

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false,
      size: 10,
      page: 1,
      finish: false,
      loading: false,
    };
  }
  onRefresh() {
    if (!this.state.loading)
      this.setState(
        {refreshing: true, page: 1, finish: false, loading: true},
        () => {
          this.onLoad();
        },
      );
  }
  componentDidMount() {
    DeviceEventEmitter.addListener(
      'hardwareBackPress',
      this.handleHardwareBack.bind(this),
    );
    this.onFocus = this.props.navigation.addListener('didFocus', () => {
      this.props.dispatch(redux.getUnreadNotificationCount());
      this.onRefresh();
    });
  }
  componentWillUnmount = () => {
    DeviceEventEmitter.removeAllListeners('hardwareBackPress');
    if (this.onFocus) {
      console.log('this.onFocus: ', this.onFocus);
      this.onFocus.remove();
    }
  };

  handleHardwareBack = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.refreshNotification) {
      this.onRefresh();
    }
  }
  onLoad() {
    const {page, size} = this.state;
    // this.props.refreshNotification = false
    this.setState({
      loading: true,
      refreshing: page == 1,
      loadMore: page != 1,
    });
    notificationProvider
      .search(page, size)
      .then(s => {
        this.setState({
          loading: false,
          refreshing: false,
          loadMore: false,
        });
        if (s) {
          switch (s.code) {
            case 0:
              var list = [];
              var finish = false;
              if (s.data.length == 0) {
                finish = true;
              }
              if (page != 1) {
                list = this.state.data;
                list.push.apply(list, s.data);
              } else {
                list = s.data;
              }
              this.setState({
                data: [...list],
                finish: finish,
              });
              break;
          }
        }
      })
      .catch(e => {
        this.setState({
          loading: false,
          refreshing: false,
          loadMore: false,
        });
      });
  }
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
          this.onLoad(this.state.page);
        },
      );
  }
  renderLabel = item => {
    let title = '';
    if (
      item.notification.title.startsWith('{') &&
      item.notification.title.endsWith('}')
    ) {
      let obj = JSON.parse(item.notification.title);
      console.log('obj: ', obj);
      title =
        objectUtils.renderAcademic(obj.question.doctorInfo.academicDegree) +
        obj.question.doctorInfo.name +
        ' đã trả lời câu hỏi của bạn.';
    } else {
      title = item.notification.title;
    }
    return title;
  };
  viewNotification(item) {
    console.log('item: ', item);
    try {
      this.setState({isLoading: true}, () => {
        var data = JSON.parse(item.notification.value);
        notificationProvider
          .setRead(item.notification.id)
          .then(s => {
            firebase
              .notifications()
              .setBadge(
                this.props.userApp.unReadNotificationCount > 0
                  ? this.props.userApp.unReadNotificationCount - 1
                  : 0,
              );
            this.props.dispatch(redux.getUnreadNotificationCount());
            this.setState({isLoading: false});
          })
          .catch(e => {
            this.setState({isLoading: false});
          });
        let question = null;
        if (data.data) {
          let obj = JSON.parse(data.data);
          question = obj;
        }
        item.notification.watched = 1;
        this.setState({data: [...this.state.data]});
        switch (data?.type) {
          // case 1:
          //   this.openQuestion(data.id);
          //   break;
          // case 2:
          //   this.openQuestion(data.id);
          //   break;
          case 4:
            this.openBooking(data.id);
            break;
          case 5:
            this.openTicket(data.id);
            break;
          case 6:
            this.detailsEhealth(data, item.user);
            break;
          case 7:
            NavigationService.navigate('listProfileUser');
            break;
          case 10:
          case 12:
          case 13:
          case 14:
            this.openBooking(data.id);
            break;
          case 16:
          case 15:
            this.openQuestion(question?.question || question);
            break;

          case 'NEWS': {
            NavigationService.navigate('detailNewsHighlight', {item: data});
            break;
          }
          case 'MEDICAL_SERVICE': {
            NavigationService.navigate('listOfServices', {item: data});
            break;
          }
          case 'HOSPITAL': {
            NavigationService.navigate('profileHospital', {item: data});
            break;
          }
          case 'DOCTOR': {
            NavigationService.navigate('detailsDoctor', {item: data});
            break;
          }
          default:
            this.setState({isLoading: false});
        }
      });
    } catch (error) {
      this.setState({isLoading: false});
    }
  }
  detailsEhealth = (data, user) => {
    this.setState({isLoading: true}, () => {
      bookingProvider
        .detailPatientHistory(
          data.patientHistoryId,
          data.hospitalId,
          data.id,
          data.shareId,
        )
        .then(s => {
          switch (s.code) {
            case 0:
              notificationProvider
                .openEhealth(
                  data.patientHistoryId,
                  data.hospitalId,
                  data.id,
                  data.shareId,
                )
                .then(s => {
                  this.setState({isLoading: false}, () => {
                    let {hasResult, result, resultDetail, hospital, data} = s;
                    if (hasResult && data) {
                      if (hospital && result) {
                        this.props.dispatch({
                          type:
                            constants.action
                              .action_select_patient_group_ehealth,
                          value: data,
                        });
                        this.props.dispatch({
                          type: constants.action.action_select_hospital_ehealth,
                          value: hospital,
                        });
                        NavigationService.navigate('viewDetailEhealth', {
                          result,
                          resultDetail,
                        });
                      }
                    } else {
                      snackbar.show(
                        constants.msg.notification.file_not_result,
                        'danger',
                      );
                    }
                  });
                })
                .catch(e => {
                  this.setState(
                    {
                      isLoading: false,
                    },
                    () => {
                      console.log(e);
                      snackbar.show(
                        constants.msg.notification.error_retry,
                        'danger',
                      );
                    },
                  );
                });
              break;
            case 9:
              this.setState(
                {
                  isLoading: false,
                },
                () => {
                  snackbar.show(
                    constants.msg.notification.medical_records_not_found,
                    'danger',
                  );
                },
              );
            case 7:
              this.setState(
                {
                  isLoading: false,
                },
                () => {
                  snackbar.show(
                    constants.msg.notification.file_share_expired,
                    'danger',
                  );
                },
              );
          }
        })
        .catch(e => {
          this.setState(
            {
              isLoading: false,
            },
            () => {
              console.log(e);
              snackbar.show(constants.msg.notification.error_retry, 'danger');
            },
          );
        });
    });
  };
  openTicket(id) {
    this.setState({isLoading: true}, () => {
      ticketProvider
        .detail(id)
        .then(s => {
          this.setState({isLoading: false}, () => {
            switch (s.code) {
              case 0:
                if (s.data && s.data.numberHospital) {
                  NavigationService.navigate('getTicketFinish', s.data);
                }
            }
          });
        })
        .catch(e => {
          this.setState({isLoading: false}, () => {});
        });
    });
  }
  openQuestion = item => {
    if (!item) return;
    NavigationService.navigate('detailMessage', {item});
  };
  openBooking(id) {
    this.setState({isLoading: false}, () => {
      NavigationService.navigate('detailsHistory', {
        id,
      });
    });
  }
  removeNoti = () => {
    this.dialogbox.confirm({
      title: constants.alert,
      content: [constants.msg.notification.confirm_delete_all_notification],
      ok: {
        text: 'Đồng ý',
        style: {
          color: 'red',
        },
        callback: () => {
          this.setState({isLoading: true});
          notificationProvider
            .deleteAll()
            .then(s => {
              firebase.notifications().setBadge(0);
              this.props.dispatch(redux.getUnreadNotificationCount());
              this.setState({isLoading: false});
              this.onRefresh();
            })
            .catch(e => {
              this.setState({isLoading: false});
              this.onRefresh();
            });
        },
      },
      cancel: {
        text: 'Hủy',
        style: {
          color: 'blue',
        },
        callback: () => {},
      },
    });
  };
  menuCreate() {
    return (
      <View>
        <TouchableOpacity style={{padding: 10}} onPress={this.removeNoti}>
          <ScaleImage
            source={require('@images/new/ic_remove.png')}
            width={20}
            style={{tintColor: '#FFF'}}
          />
        </TouchableOpacity>
      </View>
    );
  }
  isToday(item) {
    return (
      item.notification.createdDate.toDateObject('-').ddmmyyyy() ==
      new Date().ddmmyyyy()
    );
  }
  getNotificationType(item) {
    console.log('item: ', item);
    try {
      if (item.notification) {
        let value = JSON.parse(item.notification.value);
        switch (value.type) {
          case 2:
            return constants.msg.notification.type.ask_requests;
          case 4:
            return constants.msg.notification.type.booking;
          case 5:
            return constants.msg.notification.type.get_quick_number;
          case 6:
            return constants.msg.notification.type.ehealth;
          case 10:
            return constants.msg.notification.type.transfer_payments;
          case 16:
            return constants.msg.notification.type.new_message;
        }
      }
    } catch (error) {}
    return 'Thông báo';
  }
  getDate = (item, index) => {
    let notiTime = item.notification.createdDate.toDateObject('-');
    if (index == 0) {
      let date = new Date();
      if (date.ddmmyyyy() == notiTime.ddmmyyyy())
        return <Text style={styles.txtDate}>Hôm nay</Text>;
      else
        return (
          <Text style={styles.txtDate}>
            Ngày {notiTime.format('dd/MM/yyyy')}
          </Text>
        );
    } else {
      let preNoti = this.state.data[index - 1];
      let preNotiDate = preNoti.notification.createdDate.toDateObject('-');
      if (preNotiDate.ddmmyyyy() != notiTime.ddmmyyyy())
        return (
          <Text style={styles.txtDate}>
            Ngày {notiTime.format('dd/MM/yyyy')}
          </Text>
        );
    }
    return null;
  };
  defaultImage = () => (
    <ScaleImage
      resizeMode="cover"
      source={require('@images/new/user.png')}
      width={50}
      height={50}
      style={styles.avatar}
    />
  );
  renderItem = ({item, index}) => {
    const source =
      item.user && item.user.avatar
        ? {uri: item.user.avatar.absoluteUrl()}
        : require('@images/new/user.png');

    return (
      <View
        style={[
          item.notification.watched == 1
            ? {backgroundColor: '#FFF'}
            : {backgroundColor: '#00CBA710'},
        ]}>
        {this.getDate(item, index)}

        <TouchableOpacity
          style={styles.buttonNoti}
          onPress={this.viewNotification.bind(this, item)}>
          <View style={styles.containerItem}>
            <ImageLoad
              resizeMode="cover"
              imageStyle={styles.boderImage}
              borderRadius={25}
              customImagePlaceholderDefaultStyle={[
                styles.avatar,
                styles.placeHoderImage,
              ]}
              placeholderSource={require('@images/new/user.png')}
              style={styles.avatar}
              resizeMode="cover"
              loadingStyle={{size: 'small', color: 'gray'}}
              source={source}
              defaultImage={this.defaultImage}
            />
            <View style={styles.containerTitle}>
              <Text
                style={[
                  styles.txtTitle,
                  item.notification.watched == 1
                    ? styles.title_watch
                    : styles.title,
                ]}>
                {this.getNotificationType(item)}
              </Text>
              <Text
                style={
                  item.notification.watched == 1
                    ? styles.title_watch
                    : styles.title
                }
                ellipsizeMode="tail">
                {this.renderLabel(item)}
              </Text>
              {this.isToday(item) && (
                <Text style={styles.txtTime}>
                  {item.notification.createdDate
                    .toDateObject('-')
                    .getPostTime()}{' '}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.end} />
        </TouchableOpacity>
      </View>
    );
  };
  keyExtractor = (item, index) => index.toString();
  listHeader = () => {
    return !this.state.refreshing &&
      (!this.state.data || this.state.data.length == 0) ? (
      <View style={{alignItems: 'center', marginTop: 50}}>
        <Text style={{fontStyle: 'italic'}}>{constants.none_info}</Text>
      </View>
    ) : null;
  };
  listFooter = () => <View style={{height: 10}} />;
  render() {
    if (!this.props.userApp.isLogin) return null;
    return (
      <ActivityPanel
        style={{flex: 1}}
        titleStyle={{marginRight: 0}}
        title={constants.msg.notification.notifi}
        showFullScreen={true}
        menuButton={this.menuCreate()}
        isLoading={this.state.isLoading}
        hideBackButton={true}>
        <FlatList
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.state.refreshing}
          onEndReached={this.onLoadMore.bind(this)}
          onEndReachedThreshold={1}
          style={{flex: 1}}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
          data={this.state.data}
          ListHeaderComponent={this.listHeader}
          ListFooterComponent={this.listFooter}
          renderItem={this.renderItem}
        />

        <DialogBox
          ref={dialogbox => {
            this.dialogbox = dialogbox;
          }}
        />
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  placeHoderImage: {width: 50, height: 50},
  txtDate: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  end: {
    height: 0.5,
    backgroundColor: 'rgb(204,204,204)',
  },
  txtTime: {
    fontSize: 12,
    color: '#00000060',
    marginTop: 8,
  },
  txtTitle: {fontSize: 14, fontWeight: 'bold'},
  containerTitle: {
    paddingTop: 4,
    marginLeft: 19,
    flex: 1,
  },
  boderImage: {
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: 'rgba(151, 151, 151, 0.29)',
  },
  containerItem: {
    flexDirection: 'row',
    padding: 11,
    paddingLeft: 13,
    paddingRight: 13,
  },
  buttonNoti: {
    marginLeft: 20,
    marginRight: 20,
  },
  title: {fontSize: 14, color: '#000000'},
  title_watch: {fontSize: 14, color: '#00000070'},
  avatar: {
    alignSelf: 'center',
    borderRadius: 25,
    width: 50,
    height: 50,
  },

  titleStyle: {
    color: '#fff',
    marginLeft: 65,
  },
});

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
  };
}
export default connect(mapStateToProps)(NotificationScreen);
