import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity, FlatList, } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import notificationProvider from '@data-access/notification-provider';
import dateUtils from 'mainam-react-native-date-utils';
import questionProvider from '@data-access/question-provider';
import snackbar from '@utils/snackbar-utils';


class NotificationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            finish: false,
            loading: false,
        }
    }
    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
                this.onLoad();
            });
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
        })
        notificationProvider.search(page, size).then(s => {
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
                        }
                        else {
                            list = s.data;
                        }
                        this.setState({
                            data: [...list],
                            finish: finish
                        });
                        break;
                }
            }
        }).catch(e => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
            });
        });
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState({ loadMore: true, refreshing: false, loading: true, page: this.state.page + 1 }, () => {
                this.onLoad(this.state.page)
            });
    }

    viewNotification(item) {
        var data = JSON.parse(item.notification.value);
        this.openQuestion(data.id);
    }
    openQuestion(id) {
        questionProvider.detail(id).then(s => {
            if (s && s.data) {
                this.props.navigation.navigate("detailQuestion", { post: s.data })
            }
            else {
                snackbar.show("Lỗi, bài viết không tồn tại", "danger");
            }
        }).catch(e => {
            snackbar.show("Lỗi, vui lòng thử lại", "danger");
        });
    }

    menuCreate() {
        return <View>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                this.setState({ isLoading: true })
                notificationProvider.deleteAll().then(s=>{
                    this.setState({isLoading:false});
                    this.onRefresh();
                }).catch(e=>{
                    this.setState({isLoading:false});
                    this.onRefresh();
                });

            }}><Text>Xóa</Text></TouchableOpacity>
        </View >
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Thông báo" showFullScreen={true}
                menuButton={this.menuCreate()}
                isLoading={this.state.isLoading}
            >
                <FlatList
                    onRefresh={this.onRefresh.bind(this)}
                    refreshing={this.state.refreshing}
                    onEndReached={this.onLoadMore.bind(this)}
                    onEndReachedThreshold={1}
                    style={{ flex: 1, marginTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.data}
                    ListHeaderComponent={() => !this.state.refreshing && (!this.state.data || this.state.data.length == 0) ?
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ fontStyle: 'italic' }}>Hiện tại chưa có thông tin</Text>
                        </View> : null
                    }
                    ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                    renderItem={({ item, index }) => <TouchableOpacity style={{ backgroundColor: 'rgb(238,248,247)', marginTop: 10 }} onPress={this.viewNotification.bind(this, item)}>
                        <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                            <ScaleImage source={require("@images/doctor.png")} width={47} />
                            <View style={{ paddingTop: 4, marginLeft: 19 }}>
                                <Text style={{ fontSize: 14 }}>Tư vấn - đặt câu hỏi</Text>
                                <Text style={{ fontSize: 14 }}>{item.notification.title}</Text>
                                <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>{item.notification.createdDate.toDateObject().getPostTime()}</Text>
                            </View>
                        </View>
                        <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                    </TouchableOpacity>}
                />

                {/* <TouchableOpacity style={{ backgroundColor: 'rgb(238,248,247)' }}>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Test</Text> Dữ liệu demo 17/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'rgb(238,248,247)' }}>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Test</Text> Dữ liệu demo 17/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Test</Text> Dữ liệu demo 17/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Test</Text> Dữ liệu demo 17/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Test</Text> Dữ liệu demo 17/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Test</Text> Dữ liệu demo 17/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Test</Text> Dữ liệu demo 17/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Test</Text> Dữ liệu demo 17/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity> */}
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(NotificationScreen);