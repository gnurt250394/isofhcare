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
      data1: [],
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
  //         .getByAuthor(id)
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
    if (page == 1) {
      bookingProvider.getByAuthor()
        .then(s => {
          console.log(s.data.bookings.reverse(), 'data sever')
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
                finish: finish,
                data1: [],
              });
            }
            else {
              this.setState({
                data: s.data.bookings,
                finish: false,
                data1: s.data.bookings.filter((item, index) => {
                  return index < size
                })
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
        })
    } else {
      setTimeout(() => {
        this.setState({
          loading: true,
          refreshing: page == 1,
          loadMore: true
        });
        let data2 = this.state.data.filter((item, index) => {
          return index >= ((page - 1) * size) && index < (page * size);

        })
        if (!data2 && data2.length == 0) {
          this.setState({
            data1: [...this.state.data1, ...data2],
            loading: false,
            refreshing: false,
            loadMore: false,
            finish: true
          })
        } else {
          this.setState({
            data1: [...this.state.data1, ...data2],
            loading: false,
            refreshing: false,
            loadMore: false,
            finish: false
          })
        }
      }, 500)
    }
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
    console.log(item)
    this.props.navigation.navigate("detailsHistory", {
      id: item.item.booking.id
    });
  };
  renderItem = item => {
    return (
      <TouchableOpacity style={styles.listBtn} onPress={() => this.onClickItem(item)}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              alignItems: "center"
            }}
          >
            <View style={{ marginVertical: 10 }}>
              <Text
                style={{ fontSize: 40, fontWeight: "bold", color: "#C6C6C9" }}
              >
                {item.item.booking.bookingTime
                  ? item.item.booking.bookingTime.toDateObject("-").format("dd")
                  : ""}
              </Text>
              <Text style={{ fontWeight: "bold", color: 'rgb(74,74,74)', marginTop: -5 }}>
                {item.item.booking.bookingTime
                  ? item.item.booking.bookingTime
                    .toDateObject("-")
                    .format("MM/yyyy")
                  : ""}
              </Text>
            </View>

            <Text style={{ marginTop: 10 }}>
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
            <Text style={{ fontWeight: "bold", color: 'rgb(74,74,74)' }}>{item.item.service.name ? item.item.service.name : ''}</Text>
            <View style={{ marginVertical: 10 }}>
              <Text style={{ color: 'rgb(142,142,147)' }}>{item.item.medicalRecords.name ? item.item.medicalRecords.name : ''}</Text>
              <Text style={{ color: 'rgb(142,142,147)' }}>{item.item.hospital.name ? item.item.hospital.name : item.item.hospital.name}</Text>
            </View>
            {item.item.booking.status || item.item.booking.status == 0 ? this.renderStatus(item.item.booking.status) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderStatus = status => {
    switch (status) {
      case 0:
        return (
          <Text style={[styles.statusTx, {
            color: '#FFF', paddingHorizontal: 5,
            alignSelf: 'flex-start'
          }]}>Chờ phục vụ</Text>
        );
      case 1:
        return (
          <Text style={[styles.statusReject, {
            color: 'rgb(208,2,27)', paddingHorizontal: 5,
            alignSelf: 'flex-start'
          }]}>Đã huỷ (không đến)</Text>
        )
      case 2: return (
        <Text style={[styles.statusReject, {
          color: 'rgb(208,2,27)', paddingHorizontal: 5,
          alignSelf: 'flex-start'
        }]}>Thanh toán thất bại</Text>
      )
      case 3: return (
        <Text style={[styles.statusTx, {
          color: '#FFF', paddingHorizontal: 5,
          alignSelf: 'flex-start'
        }]}>Đã thanh toán</Text>
      )
      case 4: return (
        <Text style={[styles.statusTx, {
          color: '#FFF', paddingHorizontal: 5,
          alignSelf: 'flex-start'
        }]}>Thanh toán sau</Text>
      )
      case 5: return (
        <Text style={[styles.statusTx, {
          color: '#FFF', paddingHorizontal: 5,
          alignSelf: 'flex-start'
        }]}>Chờ thanh toán</Text>
      )
      case 6: return (
        <Text style={[styles.statusTx, {
          color: '#FFF', paddingHorizontal: 5,
          alignSelf: 'flex-start'
        }]}>Đã xác nhận</Text>
      )
      case 7: return (
        <Text style={[styles.statusTx, {
          color: '#FFF', paddingHorizontal: 5,
          alignSelf: 'flex-start'
        }]}>Đã có hồ sơ</Text>
      )
      case 8: return (
        <Text style={[styles.statusReject, {
          color: 'rgb(208,2,27)', paddingHorizontal: 5,
          alignSelf: 'flex-start'
        }]}>Đã huỷ (không phục vụ)</Text>
      )


    }
  };
  render() {
    return (
      <ActivityPanel
        style={{ flex: 1, backgroundColor: "#f7f9fb" }}
        title="Lịch sử đặt lịch"
        containerStyle={{
          backgroundColor: "#f7f9fb",

        }}
        actionbarStyle={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.06)'
        }}
      // actionbarStyle={{
      //   marginLeft: 10
      // }}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.data1}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            extraData={this.state}
            onEndReached={this.onLoadMore.bind(this)}
            onEndReachedThreshold={1}
            ListFooterComponent={() => <View style={{ height: 10 }}></View>}
            renderItem={this.renderItem}
            ListHeaderComponent={() =>
              !this.state.refreshing &&
                (!this.state.data1 || this.state.data1.length == 0) ? (
                  <View style={{ alignItems: "center", marginTop: 50 }}>
                    <Text style={{ fontStyle: "italic" }}>Không có dữ liệu</Text>
                  </View>
                ) : null
            }

            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        {
          this.state.loadMore ?
            <View style={{ alignItems: 'center', padding: 10, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <ActivityIndicator
                size={'small'}
                color={'gray'}
              />
            </View> : null
        }
      </ActivityPanel>
    );
  }

  renderFooter() {
    if (this.state.loadMore) {
      console.log('renderFooter')
      return (
        <View style={{ alignItems: 'center', position: 'absolute' }}>
          <ActivityIndicator size={16} color={"#000"} />
        </View>
      )
    } else {
      return (<View style={{
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      </View>)
    }
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

  },
  statusReject: {
    marginVertical: 5,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    width: 'auto',
    borderRadius: 10,
    padding: 1,

  }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp,
    booking: state.booking
  };
}
export default connect(mapStateToProps)(PatientHistoryScreen);
