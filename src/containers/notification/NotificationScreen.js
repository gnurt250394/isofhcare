import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import ScaleImage from "mainam-react-native-scaleimage";
import notificationProvider from "@data-access/notification-provider";
import dateUtils from "mainam-react-native-date-utils";
import questionProvider from "@data-access/question-provider";
import snackbar from "@utils/snackbar-utils";
import DialogBox from "react-native-dialogbox";
import constants from "@resources/strings";
import firebase from 'react-native-firebase';
import redux from '@redux-store'
import ImageLoad from 'mainam-react-native-image-loader';

import clientUtils from '@utils/client-utils';

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false,
      size: 10,
      page: 1,
      finish: false,
      loading: false
    };
  }
  onRefresh() {
    if (!this.state.loading)
      this.setState(
        { refreshing: true, page: 1, finish: false, loading: true },
        () => {
          this.onLoad();
        }
      );
  }
  componentDidMount() {
    this.onRefresh();
  }
  onLoad() {
    const { page, size } = this.state;
    this.setState({
      loading: true,
      refreshing: page == 1,
      loadMore: page != 1
    });
    notificationProvider
      .search(page, size)
      .then(s => {
        this.setState({
          loading: false,
          refreshing: false,
          loadMore: false
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
                finish: finish
              });
              break;
          }
        }
      })
      .catch(e => {
        this.setState({
          loading: false,
          refreshing: false,
          loadMore: false
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
          page: this.state.page + 1
        },
        () => {
          this.onLoad(this.state.page);
        }
      );
  }

  viewNotification(item) {
    var data = JSON.parse(item.notification.value);
    this.openQuestion(data.id);
    notificationProvider.setRead(item.notification.id).then(s => {
      firebase.notifications().setBadge(this.props.userApp.unReadNotificationCount > 0 ? this.props.userApp.unReadNotificationCount - 1 : 0);
      this.props.dispatch(redux.getUnreadNotificationCount());
    });
    item.notification.watched = 1;
    this.setState({ data: [...this.state.data] });
  }
  openQuestion(id) {
    questionProvider
      .detail(id)
      .then(s => {
        if (s && s.data) {
          this.props.navigation.navigate("detailQuestion", { post: s.data });
        } else {
          snackbar.show("Lỗi, bài viết không tồn tại", "danger");
        }
      })
      .catch(e => {
        snackbar.show("Lỗi, vui lòng thử lại", "danger");
      });
  }

  menuCreate() {
    return (
      <View>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => {
            this.dialogbox.confirm({
              title: constants.alert,
              content: [
                constants.msg.notification.confirm_delete_all_notification
              ],
              ok: {
                text: "Đồng ý",
                style: {
                  color: "red"
                },
                callback: () => {
                  this.setState({ isLoading: true });
                  notificationProvider
                    .deleteAll()
                    .then(s => {
                      firebase.notifications().setBadge(0);
                      this.props.dispatch(redux.getUnreadNotificationCount());
                      this.setState({ isLoading: false });
                      this.onRefresh();
                    })
                    .catch(e => {
                      this.setState({ isLoading: false });
                      this.onRefresh();
                    });
                }
              },
              cancel: {
                text: "Hủy",
                style: {
                  color: "blue"
                },
                callback: () => { }
              }
            });
          }}
        >
          <ScaleImage source={require("@images/new/ic_remove.png")} width={20} />
        </TouchableOpacity>
      </View>
    );
  }
  isToday(item) {
    return item.notification.createdDate.toDateObject('-').ddmmyyyy() == (new Date()).ddmmyyyy();
  }

  renderItem(item, index) {
    const source = item.user && item.user.avatar ? { uri: item.user.avatar.absoluteUrl() } : require("@images/new/user.png");

    return (
      <View>
        {
          ((item, index) => {
            let notiTime = item.notification.createdDate.toDateObject('-');
            if (index == 0) {
              let date = new Date();
              if (date.ddmmyyyy() == notiTime.ddmmyyyy())
                return <Text style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 20 }}>Hôm nay</Text>
              else
                return <Text style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 20 }}>Ngày {notiTime.format('dd/MM/yyyy')}</Text>
            }
            else {
              let preNoti = this.state.data[index - 1];
              let preNotiDate = preNoti.notification.createdDate.toDateObject('-');
              if (preNotiDate.ddmmyyyy() != notiTime.ddmmyyyy())
                return <Text style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 20 }}>Ngày {notiTime.format('dd/MM/yyyy')}</Text>
            }
            return null
          }).call(this, item, index)
        }

        <TouchableOpacity
          style={{
            marginLeft: 20, marginRight: 20
          }}
          onPress={this.viewNotification.bind(this, item)}
        >
          <View
            style={{
              flexDirection: "row",
              padding: 11,
              paddingLeft: 13,
              paddingRight: 13
            }}
          >
            <ImageLoad
              resizeMode="cover"
              imageStyle={{ borderRadius: 25, borderWidth: 1, borderColor: 'rgba(151, 151, 151, 0.29)'  }}
              borderRadius={25}
              customImagePlaceholderDefaultStyle={[styles.avatar, { width: 50, height: 50 }]}
              placeholderSource={require("@images/new/user.png")}
              style={styles.avatar}
              resizeMode="cover"
              loadingStyle={{ size: 'small', color: 'gray' }}
              source={source}
              defaultImage={() => {
                return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={50} height={50} style={styles.avatar} />
              }}
            />
            <View style={{ paddingTop: 4, marginLeft: 19, flex: 1 }}>
              <Text style={[{ fontSize: 14, fontWeight: 'bold' }, item.notification.watched == 1 ? styles.title_watch : styles.title]}>Tư vấn - đặt câu hỏi</Text>
              <Text
                style={item.notification.watched == 1 ? styles.title_watch : styles.title}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item.notification.title.trim()}
              </Text>
              {
                this.isToday(item) &&
                <Text
                  style={{ fontSize: 12, color: "#00000060", marginTop: 8 }}
                >
                  {
                    item.notification.createdDate.toDateObject('-').getPostTime()
                  }
                </Text>
              }
            </View>
          </View>
          <View
            style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <ActivityPanel
        style={{ flex: 1 }}
        titleStyle={{ marginRight: 0 }}
        title="Thông báo"
        showFullScreen={true}
        menuButton={this.menuCreate()}
        isLoading={this.state.isLoading}

      >
        <FlatList
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.state.refreshing}
          onEndReached={this.onLoadMore.bind(this)}
          onEndReachedThreshold={1}
          style={{ flex: 1 }}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
          data={this.state.data}
          ListHeaderComponent={() =>
            !this.state.refreshing &&
              (!this.state.data || this.state.data.length == 0) ? (
                <View style={{ alignItems: "center", marginTop: 50 }}>
                  <Text style={{ fontStyle: "italic" }}>
                    Hiện tại chưa có thông tin
                </Text>
                </View>
              ) : null
          }
          ListFooterComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item, index }) => this.renderItem(item, index)}
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
  title: { fontSize: 14, color: '#000000' },
  title_watch: { fontSize: 14, color: '#00000070' },
  avatar: {
    alignSelf: 'center',
    borderRadius: 25,
    width: 50,
    height: 50
  }
})

function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(NotificationScreen);
