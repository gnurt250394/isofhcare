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
import constants from '@resources/strings';
import BookingDoctorProvider from '@data-access/booking-doctor-provider';
import profileProvider from '@data-access/profile-provider'

class ListBookingHistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: true,
            page: 0,
            size: 10,
            data: []
        };
    }
    componentDidMount() {
        this.onFocus = this.props.navigation.addListener('didFocus', () => {
            this.setState({ page: 0 }, this.getListProfile)
        });
    }
    componentWillUnmount = () => {
        if (this.onFocus) {
            console.log('this.onFocus: ', this.onFocus);
            this.onFocus.remove()
        }
    }
    getListProfile = () => {
        profileProvider.getListProfile().then(s => {
            switch (s.code) {
                case 0:
                    if (s.data && s.data && s.data.length != 0) {

                        let data = s.data;
                        let phoneProfile = ''
                        let length = data.length
                        for (let i = 0; i < length - 1; i++) {
                            phoneProfile += data[i].medicalRecords.phone + ','

                        }
                        phoneProfile += data[length - 1].medicalRecords.phone
                        this.setState({
                            phoneProfile
                        }, () => {
                            this.getData()
                        })
                    } else {
                        this.setState({ isLoading: false })
                    }
                    break;
            }
        });
    }
    getData = () => {
        let { phoneProfile } = this.state
        BookingDoctorProvider.getListBooking(phoneProfile, this.props.userApp.currentUser.id, this.state.page, this.state.size).then(res => {
            this.setState({ isLoading: false, refreshing: false })
            if (res && res.length > 0) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        }).catch(err => {
            this.setState({ isLoading: false, refreshing: false })
            this.formatData([])
        })
    }
    formatData = (data) => {
        if (data.length == 0) {
            if (this.state.page == 0) {
                this.setState({ data: [] })
            }
        } else {
            if (this.state.page == 0) {
                this.setState({ data })
            } else {
                this.setState(preState => {
                    return {
                        data: [...preState.data, ...data]
                    }
                })
            }
        }
    }
    loadMore = () => {
        const { page, size, data } = this.state
        if (data.length >= ((page + 1) * size)) {
            this.setState(preState => {
                return {
                    page: preState.page + 1
                }
            }, this.getData)
        }
    }
    onRefress = () => {
        this.setState({ refreshing: true, page: 0 }, this.getData)
    }

    onClickItem = (item) => {
        this.props.navigation.navigate("detailsHistory", {
            id: item.id
        });
    };
    getTime = (time) => {
        return parseInt(time.replace(':', ''), 10)
    }
    getTimeOnline = (item) => {
        if (item.timeDiff < 0 && item.timeDiff > (-30 * 60 * 1000)) {
            return true
        } else {
            return false
        }
    }
    renderBookingOnline = (item) => {

        return <Text style={[styles.statusTx, styles.flexStart, styles.colorWhite,]}>Lịch gọi tư vấn</Text>
    }
    renderItem = ({ item }) => {
        let date = new Date(item.date)
        let isOnline = item.invoice.services.find(e => e.isOnline == true)
        return (
            <TouchableOpacity style={styles.listBtn} onPress={() => this.onClickItem(item)}>
                <View style={styles.row}>
                    <View
                        style={[styles.containerDate,
                        this.getTimeOnline(item)
                            && (item.status == 'ACCEPTED'
                                || item.status == 'CHECKIN') ? { backgroundColor: '#ffdab3' } : { backgroundColor: '#FFF' }
                        ]}
                    >
                        <View style={{ marginVertical: 10 }}>
                            <Text
                                style={styles.txtDate}
                            >
                                {!isNaN(date)
                                    ? date.format("dd")
                                    : ""}
                            </Text>
                            <Text style={styles.txtDate2}>
                                {!isNaN(date)
                                    ? date
                                        .format("MM/yyyy")
                                    : ""}
                            </Text>
                        </View>

                        <Text style={{ marginTop: 10 }}>
                            {item.time
                                ? item.time
                                : ""}
                        </Text>
                    </View>
                    <View
                        style={styles.containerBody}
                    >
                        <Text style={styles.txtServiceType}>{item.serviceType ? item.serviceType.name : ''}</Text>

                        <View style={{ marginVertical: 10 }}>
                            <Text style={styles.txtUserName}>{item.patient && item.patient.name ? item.patient.name : ''}</Text>
                            <Text style={styles.txtUserName}>{item.hospital && item.hospital.name ? item.hospital.name : ""}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            flexShrink: 1
                        }}>

                            {item ? this.renderStatus(item) : null}
                            {isOnline ? this.renderBookingOnline(item) : null}

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    renderStatus = item => {
        if (item.invoice.payment == constants.PAYMENT_METHOD.NONE
            || ((item.invoice.payment == constants.PAYMENT_METHOD.MOMO
                || item.invoice.payment == constants.PAYMENT_METHOD.ATM
                || item.invoice.payment == constants.PAYMENT_METHOD.VISA)
                && item.invoice.status == "NEW")) {
            return <Text style={[styles.statusReject, styles.flexStart, styles.colorRed]}>Chưa thanh toán</Text>
        } else {
            switch (item.status) {
                case 'NEW':
                    return (
                        <Text style={[styles.statusTx, styles.flexStart, styles.colorWhite]}>Chờ duyệt</Text>
                    );
                case 'ACCEPTED':
                    return (
                        <Text style={[styles.statusTx, styles.flexStart, styles.colorWhite]}>Đã duyệt</Text>
                    )
                case 'CHECKIN': return (
                    <Text style={[styles.statusTx, styles.flexStart, styles.colorWhite]}>Đã check-in</Text>
                )
                case 'CANCELED': return (
                    <Text style={[styles.statusReject, styles.flexStart, styles.colorRed]}>Đã hủy</Text>
                )
                case 'COMPLETED': return (
                    <Text style={[styles.statusTx, styles.flexStart, styles.colorWhite]}>Hoàn thành khám</Text>
                )
                case 'REJECTED': return (
                    <Text style={[styles.statusReject, styles.flexStart, styles.colorRed]}>Từ chối đặt khám</Text>
                )


            }
        }

    };
    listEmpty = () => {
        return (
            !this.state.isLoading ? (
                <View style={styles.containerNoneData}>
                    <Text style={{ fontStyle: "italic" }}>{constants.none_data}</Text>
                </View>
            ) : null
        )
    }
    render() {
        return (
            <ActivityPanel
                backButtonClick={() => this.props.navigation.goBack()}
                title={constants.title.patient_history_screen}
                isLoading={this.state.isLoading}
            >
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.data}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefress}
                        // extraData={this.state}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={1}
                        // ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                        renderItem={this.renderItem}
                        ListEmptyComponent={this.listEmpty}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                {
                    this.state.loadMore ?
                        <View style={styles.containerLoadMore}>
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
            return (
                <View style={styles.loadMore}>
                    <ActivityIndicator size={16} color={"#000"} />
                </View>
            )
        } else {
            return (<View style={styles.footer}>
            </View>)
        }
    }
}
const styles = StyleSheet.create({
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadMore: { alignItems: 'center', position: 'absolute' },
    containerLoadMore: {
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    containerNoneData: { alignItems: "center", marginTop: 50 },
    colorRed: {
        color: 'rgb(208,2,27)',
    },
    colorWhite: {
        color: '#FFF',
        overflow: 'hidden'
    },
    flexStart: {
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
    },
    txtUserName: { color: 'rgb(142,142,147)' },
    txtServiceType: { fontWeight: "bold", color: 'rgb(74,74,74)' },
    containerBody: {
        width: "75%",
        borderLeftColor: "#E5E5E5",
        borderLeftWidth: 1,
        padding: 10
    },
    txtDate2: {
        fontWeight: "bold",
        color: 'rgb(74,74,74)',
        marginTop: -5
    },
    txtDate: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#C6C6C9",
        textAlign: 'center'
    },
    containerDate: {
        width: "25%",
        alignItems: "center",

    },
    row: { flexDirection: "row" },
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

    },

    titleStyle: {
        color: '#FFF'
    }
});
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps)(ListBookingHistoryScreen);
