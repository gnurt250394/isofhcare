import React, { Component, PropTypes } from 'react';
import ScaleImage from 'mainam-react-native-scaleimage';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import constants from '@resources/strings';
import redux from '@redux-store';

class Program extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDate: new Date(),
            listTopic: [],
            refreshing: false,
        }
        console.log(this.props.conference.listSessionFollow);
    }

    next() {
        var endTime = new Date(this.props.conference.conference.endTime);
        console.log(endTime);
        if (this.state.currentDate.compareDate(endTime) == -1) {
            var days = this.state.currentDate.getDate() + 1;
            this.state.currentDate.setDate(days);
            this.setState({ currentDate: this.state.currentDate }, () => {
                this.onRefresh();
            });
            console.log(this.state.currentDate);
        }
    }
    preview() {
        var startTime = new Date(this.props.conference.conference.startTime);
        var today = new Date();
        if (this.state.currentDate.compareDate(today) == 0) {
            return;
        }
        console.log(startTime);
        if (this.state.currentDate.compareDate(startTime) == 1) {
            var days = this.state.currentDate.getDate() - 1;
            this.state.currentDate.setDate(days);
            this.setState({ currentDate: this.state.currentDate }, () => {
                this.onRefresh();
            });
            console.log(this.state.currentDate);

        }
    }
    componentDidMount() {
        this.onRefresh();
    }
    onRefresh() {
        this.setState({ refreshing: true }, () => {
            this.onLoad();
        });
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            refreshing: true
        })
        if (this.props.loadDataListener) {
            this.props.loadDataListener(this.props.conference.conference.id, this.props.isMyProgram ? this.props.userApp.currentUser.id : "", this.state.currentDate.format("MM/dd/yyyy"), this.loadDataReturnCallback.bind(this));
        }
        else {
            this.setState({
                refreshing: false
            })
        }
    }
    loadDataReturnCallback(s, e) {
        this.setState({
            refreshing: false,
            listTopic: []
        });
        if (s && s.code == 0 && s.data.conferenceTopics) {
            this.setState({
                refreshing: false,
                listTopic: s.data.conferenceTopics
            });
        }
    }
    getStatusSessionColor(item) {
        var startDate = new Date(item.startTime);
        var endDate = new Date(item.endTime);
        var currentDate = new Date();
        if (currentDate >= startDate && endDate >= currentDate) {
            return "red";
        }
        if (currentDate < startDate)
            return "green";
        return "gray";
    }
    shouldComponentUpdate(newProps, newState) {
        if (this.state.listTopic != newState.listTopic)
            return true;
        if (this.props.conference.listSessionFollow != newProps.conference.listSessionFollow) {
            if (this.props.isMyProgram) {
                this.onRefresh();
            }
            else {
                this.setState(this.state);
            }
            return true;
        }
        return false;
    }
    follow(item) {
        this.props.dispatch(redux.followSession(this.props.userApp.currentUser.id, item.id, this.props.conference.listSessionFollow[item.id], (s, e) => {

        }));
    }
    openSession(topic, session) {
        Actions.detailProgram({
            session: session,
            topic: topic.conferenceTopic
        });
    }

    renderSession(parentData, { item, index }) {
        return (<TouchableOpacity onPress={this.openSession.bind(this, parentData, item)}>
            <View style={{
                elevation: 3,
                padding: 12,
                backgroundColor: 'white',
                borderRadius: 5.3,
                margin: 5,
                borderColor: 'rgb(204, 204, 204)',
                flexDirection: 'row'
            }} shadowColor='#000000' shadowOpacity={0.2} shadowOffset={{}}>
                <View>
                    <Text>{new Date(item.startTime).format("HH:mm")}</Text>
                    <Text>-</Text>
                    <Text>{new Date(item.endTime).format("HH:mm")}</Text>
                </View>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: this.getStatusSessionColor(item), marginTop: 12, marginLeft: 12 }}></View>
                <View style={{ marginLeft: 22, flex: 1 }}>
                    <Text style={{ flex: 1, fontWeight: '900' }}>{item.name}</Text>

                    <View style={{
                        flexDirection: 'row', alignItems: 'center'
                    }}>
                        <TouchableOpacity style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 5, alignItems: 'center' }} onPress={this.follow.bind(this, item)}>
                            {
                                this.props.conference.listSessionFollow[item.id] ?
                                    <ScaleImage source={require("@images/icquantampressed.png")} width={18} /> :
                                    <ScaleImage source={require("@images/ic_quantam.png")} width={18} />
                            }<Text style={{ marginLeft: 5, fontSize: 12, fontWeight: 'bold' }}>Quan tâm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 5, marginLeft: 20, alignItems: 'center' }} onPress={() => {
                            Actions.addQuestion({
                                topic: parentData.conferenceTopic,
                                session: item
                            });
                        }}>
                            <ScaleImage source={require("@images/btndatcauhoi.png")} width={18} /><Text style={{ marginLeft: 5, fontSize: 12, fontWeight: 'bold' }}>Đặt câu hỏi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>);
    }
    render() {
        return (
            <View style={{ backgroundColor: '#cacaca70', flex: 1, padding: 15 }} >
                <View style={{ flexDirection: 'row', backgroundColor: 'rgb(0,121,107)', height: 45, borderTopLeftRadius: 7, borderTopRightRadius: 7, alignItems: 'center' }}>
                    <TouchableOpacity style={{ padding: 11 }} onPress={this.preview.bind(this)}>
                        <ScaleImage source={require("@images/arrleft.png")} width={23} />
                    </TouchableOpacity>
                    <Text style={{ flex: 1, color: '#FFF', textAlign: 'center', fontWeight: '700' }}>{this.state.currentDate.format("thu, dd/MM/yyyy")}</Text>
                    <TouchableOpacity style={{ padding: 11 }} onPress={this.next.bind(this)}>
                        <ScaleImage source={require("@images/arrright.png")} width={23} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={{ flex: 1, backgroundColor: '#FFF', borderColor: 'rgb(204,204,204)', borderBottomLeftRadius: 7, borderBottomRightRadius: 7, padding: 7 }}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                    ref={ref => this.flatList = ref}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.listTopic}
                    ListHeaderComponent={() =>
                        !this.state.refreshing && (!this.state.listTopic || this.state.listTopic.length == 0) ?
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <Text style={{ fontStyle: 'italic' }}>Không tìm thấy phiên nào</Text>
                            </View>
                            : null
                    }
                    ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                    renderItem={({ item, index }) =>
                        <View>
                            <Text style={{ color: 'red', fontSize: 14, padding: 13, textAlign: 'center', paddingTop: 6 }}>{item.conferenceTopic.name}</Text>
                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                                data={item.conferenceSessions}
                                renderItem={this.renderSession.bind(this, item)}
                            />
                        </View>
                    }
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        conference: state.conference,
    };
}
export default connect(mapStateToProps, null, null, { withRef: true })(Program);