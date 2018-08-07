import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import Dash from 'mainam-react-native-dash-view';
import scheduleProvider from '@data-access/schedule-provider';
import dateUtils from 'mainam-react-native-date-utils';
import convertUtils from 'mainam-react-native-convert-utils';

class ScheduleScreen extends Component {
    constructor(props) {
        super(props)
        var user = this.props.user;
        if (!user)
            user = this.props.userApp.currentUser;
        if (!user || !this.props.userApp.isLogin)
            Actions.pop();
        this.state = {
            user,
            refreshing: false,
            listSchedule: [],
        }
    }
    componentDidMount() {
        this.onRefresh();
    }
    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, loading: true }, () => {
                this.onLoad();
            });
    }
    onLoad() {
        this.setState({
            loading: true,
            refreshing: true
        })
        scheduleProvider.getByUserConference(this.state.user.id, this.props.conference.conference.id, (s, e) => {
            this.setState({
                loading: false,
                refreshing: false,
                finish: true
            });
            if (s) {
                switch (s.code) {
                    case 0:
                        this.setState({
                            listSchedule: [...s.data.schedules],
                            finish: true
                        });
                        break;
                }
            }
        });
    }
    renderInfoSchedule(item) {
        let info = convertUtils.toJsonArray(item.info, []);
        if (!info.length)
            info = [];
        return info.map((item2, i) => {
            return (<Text style={{ marginTop: 6.7 }}><Text style={{ fontWeight: 'bold' }}>{item2.key}: </Text>{item2.value}</Text>);
        });
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Lịch trình" showFullScreen={true}>
                <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                    style={{ padding: 15 }}
                    ref={ref => this.flatList = ref}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.listSchedule}
                    ListHeaderComponent={() => {
                        if (!this.state.loading && this.state.finish && (!this.state.listSchedule || this.state.listSchedule.length == 0))
                            return (< View >
                                <Text style={{ textAlign: 'center', marginTop: 30 }}>Không tìm thấy lịch trình nào của đại biểu này</Text>
                            </View>);
                        return null;
                    }}
                    ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                    renderItem={({ item, index }) =>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginTop: 9 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{item.startTime.toDateObject().format("HHhMM")}</Text>
                                {item.endTime != 0 ?
                                    <View>
                                        <Text>-</Text>
                                        <Text style={{ fontSize: 14 }}>{item.endTime.toDateObject().format("HHhMM")}</Text>
                                    </View> : null
                                }
                            </View>
                            <View style={{ marginLeft: 10, flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {
                                        item.type == 1 ?
                                            <ScaleImage source={require("@images/icplane.png")} width={45} />
                                            :
                                            item.type == 2 ?
                                                <ScaleImage source={require("@images/icxeduadon.png")} width={45} />
                                                :
                                                item.type == 4 ?
                                                    <ScaleImage source={require("@images/ichotel.png")} width={45} />
                                                    :
                                                    item.type == 8 ?
                                                        <ScaleImage source={require("@images/icanuong.png")} width={45} />
                                                        :
                                                        item.type == 16 ?
                                                            <ScaleImage source={require("@images/icthamduhoinghi.png")} width={45} />
                                                            : null
                                    }
                                    <Text style={{ marginLeft: 2, fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flex: 1, position: 'relative' }}>
                                    <Dash style={{ width: 1, position: 'absolute', top: 0, bottom: 0, flexDirection: 'column', marginLeft: 20, marginRight: 25 }} dashStyle={{ backgroundColor: 'rgb(131,147,202)' }} />
                                    <View style={{ flex: 1, marginLeft: 50 }}>
                                        {
                                            this.renderInfoSchedule(item)
                                        }
                                        <View style={{ backgroundColor: 'rgb(225,225,225)', height: 1, flex: 1, marginTop: 12.5, marginBottom: 8 }} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                />
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
export default connect(mapStateToProps)(ScheduleScreen);