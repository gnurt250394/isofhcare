import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import bookingProvider from "@data-access/booking-provider";
import { connect } from "react-redux";
import ActivityPanel from "@components/ActivityPanel";
import dateUtils from "mainam-react-native-date-utils";

class PatientHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      loadMore: false,
      finish: false,
      loading: false,
      page: 1,
      size: 10,
      data: []
    };
  }
  componentDidMount() {
    this.onRefresh();
  }
  onRefresh = () => {
    if (!this.state.loading)
      this.setState(
        { refreshing: true, page: 1, finish: false, loading: true },
        () => {
          this.onLoad();
        }
      );
  };

  // onGetList = () => {
  //   const { page, size } = this.state;

  //   this.setState(
  //     {
  //       loading: true,
  //       refreshing: page == 1,
  //       loadMore: page != 1
  //     },
  //     () => {
  //       const id = -1;
  //       bookingProvider
  //         .getPatientHistory(id)
  //         .then(res => {
  //           this.setState({
  //             refreshing: false
  //           });
  //           console.log(res, "lich su tra ve");
  //         })
  //         .catch(err => {
  //           this.setState({
  //             refreshing: false
  //           });
  //         });
  //     }
  //   );
  // };
  onLoad() {
    const { page, size } = this.state;
    const toDate = new Date().format("yyyy-MM-dd HH:mm:ss");
    this.setState({
      loading: true,
      refreshing: page == 1,
      loadMore: page != 1
    });
    bookingProvider
      .getPatientHistory(page, size)
      .then(s => {
        this.setState({
          loading: false,
          refreshing: false,
          loadMore: false
        });
        if (s && s.code == 0) {
          var finish = false;
          if (s.data.bookings.length == 0) {
            finish = true;
            this.setState({
              finish: finish
            });
          }
          else {
            console.log(s.data.bookings);
            this.setState({
              data: s.data.bookings,
              finish: finish
            });
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
  onClickItem = (item) => {
    this.props.navigation.navigate("DetailsHistoryScreen", {
      id: item.item.booking.id,
      name: item.item.author.name,
      image: item.item.author.avatar,
      service: item.item.service.name,
      location: item.item.hospital.name,
      address: item.item.hospital.address,
      date: item.item.booking.bookingTime,
      info: item.item.specialist.name,
      price: item.item.service.price,
      statusPay: item.item.booking.statusPay,
      codeBooking: item.item.booking.codeBooking,
      note: item.item.booking.note,
      imgNote: item.item.booking.image,
      status: item.item.booking.status
    });
  };
  renderItem = item => {
    return (
      <TouchableOpacity style={styles.listBtn} onPress={() => this.onClickItem(item)}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{ fontSize: 40, fontWeight: "bold", color: "#C6C6C9" }}
            >
              {item.item.booking.bookingTime
                ? item.item.booking.bookingTime.toDateObject("-").format("dd")
                : ""}
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              {item.item.booking.bookingTime
                ? item.item.booking.bookingTime
                  .toDateObject("-")
                  .format("MM/yyyy")
                : ""}
            </Text>
            <Text>
              {" "}
              {item.item.booking.bookingTime
                ? item.item.booking.bookingTime
                  .toDateObject("-")
                  .format("HH:mm")
                : ""}
            </Text>
          </View>
          <View
            style={{
              width: "75%",
              borderLeftColor: "#E5E5E5",
              borderLeftWidth: 1,
              padding: 10
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.item.service.name ? item.item.service.name : ''}</Text>
            <Text>{item.item.author.name ? item.item.author.name : ''}</Text>
            <Text>{item.item.hospital.name ? item.item.hospital.name : item.item.hospital.name}</Text>
            {item.item.booking.status ? this.renderStatus(item.item.booking.status) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderStatus = status => {
    switch (status) {
      case 0:
        return (
          <View style={styles.statusTx}>
            <Text style={{ color: "#fff" }}>Chờ phục vụ</Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.statusReject}>
            <Text style={{ color: 'rgb(208,2,27)' }}>Đã huỷ ( không đến )</Text>
          </View>

        )
      case 2: return (
        <View style={styles.statusReject}>
          <Text style={{ color: 'rgb(208,2,27)' }}>Thanh toán thất bại</Text>
        </View>
      )
      case 3: return (
        <View style={styles.statusTx}>
          <Text style={{ color: "#fff" }}>Đã thanh toán</Text>
        </View>
      )
      case 4: return (
        <View style={[styles.statusTx, { width: 120 }]}>
          <Text style={{ color: "#fff" }}>Thanh toán sau</Text>
        </View>
      )
      case 5: return (
        <View style={styles.statusTx}>
          <Text style={{ color: "#fff" }}>Chờ thanh toán</Text>
        </View>
      )
      case 6: return (
        <View style={styles.statusTx}>
          <Text style={{ color: "#fff" }}>Đã xác nhận</Text>
        </View>
      )
      case 7: return (
        <View style={styles.statusTx}>
          <Text style={{ color: "#fff" }}>Đã có hồ sơ</Text>
        </View>
      )
      case 8: return (
        <View style={styles.statusReject}>
          <Text style={{ color: 'rgb(208,2,27)' }}>Đã huỷ ( không phục vụ )</Text>
        </View>
      )


    }
  };
  render() {
    return (
      <ActivityPanel
        style={{ flex: 1, backgroundColor: "#f7f9fb" }}
        title="Lịch sử đặt lịch"
        titleStyle={{ marginLeft: 40 }}
        containerStyle={{
          backgroundColor: "#f7f9fb"
        }}
        actionbarStyle={{
          marginLeft: 10
        }}
      >
        <FlatList
          data={this.state.data}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          extraData={this.state}
          // onEndReached={this.onLoadMore.bind(this)}
          // onEndReachedThreshold={1}
          ListFooterComponent={() => <View style={{ height: 10 }} />}
          renderItem={this.renderItem}
          ListHeaderComponent={() =>
            !this.state.refreshing &&
              (!this.state.data || this.state.data.length == 0) ? (
                <View style={{ alignItems: "center", marginTop: 50 }}>
                  <Text style={{ fontStyle: "italic" }}>Không có dữ liệu</Text>
                </View>
              ) : null
          }
          keyExtractor={(item, index) => index.toString()}
        />
        {this.state.loadMore ? (
          <View
            style={{
              alignItems: "center",
              padding: 10,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <ActivityIndicator size={"small"} color={"gray"} />
          </View>
        ) : null}
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  listBtn: {
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E5E5E5"
  },
  statusTx: {
    marginVertical: 5,
    backgroundColor: "rgb(2,195,154)",
    borderRadius: 10,
    padding: 2,
    width: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  statusReject: {
    marginVertical: 5,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 10,
    width: 200,
    justifyContent: "center",
    alignItems: "center"
  }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp,
    booking: state.booking
  };
}
export default connect(mapStateToProps)(PatientHistoryScreen);
