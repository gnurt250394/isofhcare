import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, FlatList, Linking, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import memberProvider from '@data-access/support-provider';
import dateUtils from 'mainam-react-native-date-utils'
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';

class ListSupportScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listMem: [],
            refreshing: false,
            size: 20,
            page: 1,
            finish: false,
            loading: false
        }

    }
    componentDidMount() {
        this.onRefresh();
    }

    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
                this.onLoad();
            });
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        })
        memberProvider.getByConference(this.props.conference.conference.id, page, size, (s, e) => {
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
                        if (s.data.data.length == 0) {
                            finish = true;
                        }
                        if (page != 1) {
                            list = this.state.listMem;
                            list.push.apply(list, s.data.data);
                        }
                        else {
                            list = s.data.data;
                        }
                        this.setState({
                            listMem: [...list],
                            finish: finish
                        });
                        break;
                }
            }
        });
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState({ loadMore: true, refreshing: false, loading: true, page: this.state.page + 1 }, () => {
                this.onLoad(this.state.page)
            });
    }

    getTime(item) {
        return new Date(item.support.createdDate).getPostTime()
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Hỗ trợ" showFullScreen={true}>
                <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                    onEndReached={this.onLoadMore.bind(this)}
                    onEndReachedThreshold={1}
                    style={{ flex: 1 }}
                    ref={ref => this.flatList = ref}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.listMem}
                    ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: 'rgb(204,204,204)', padding: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ImageProgress
                                    indicator={Progress} resizeMode='cover' style={{ width: 40, height: 40, }} imageStyle={{ width: 40, height: 40, borderRadius: 20, borderRadius: 20 }} source={{ uri: item.user.avatar ? item.user.avatar.absoluteUrl() : "undefined" }}
                                    defaultImage={() => {
                                        return <ScaleImage resizeMode='cover' source={require("@images/doctor.png")} width={40} style={{ width: 40, height: 40, borderRadius: 20 }} />
                                    }}
                                />
                                <View style={{ marginLeft: 16 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.user.name}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 6 }}>
                                        <ScaleImage source={require("@images/ictime.png")} width={12} />
                                        <Text style={{ marginLeft: 10, fontSize: 12, color: 'rgba(0, 0, 0, 0.6)', minWidth: 100 }} >{this.getTime(item)}</Text>
                                        <ScaleImage source={require("@images/icdtdaibieu.png")} width={12} />
                                        <TouchableOpacity onPress={() => Linking.openURL("tel:" + item.support.phone)}>
                                            <Text style={{ marginLeft: 10, fontSize: 12, color: 'rgba(255, 0, 0, 0.6)', minWidth: 100 }} >{item.support.phone}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <Text style={{ textAlign: 'justify', marginTop: 11, lineHeight: 21 }}>
                                {item.support.content}
                            </Text>
                        </TouchableOpacity>
                    }
                />
                {
                    this.state.loadMore ?
                        <View style={{ alignItems: 'center', padding: 10 }}>
                            <ScaleImage width={20} source={require("@images/loading2.gif")} />
                        </View> : null
                }
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        conference: state.conference
    };
}
export default connect(mapStateToProps)(ListSupportScreen);