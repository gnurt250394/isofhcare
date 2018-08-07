import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import Dimensions from 'Dimensions';
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
import MemberItem from '@components/member/MemberItem';
import userProvider from '@data-access/user-provider';
import * as Animatable from 'react-native-animatable';

class MemberScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMenu: false,
            listMem: [],
            top: 0,
            left: DEVICE_WIDTH / 2 - 120,
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
        userProvider.getByConference(this.props.conference.conference.id, page, size, 1, (s, e) => {
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


    onItemLongPress(item, index, e, fx, fy, w, h, px, py) {
        if (DEVICE_HEIGHT - py < 200) {
            this.setState({
                showTop: true,
                showMenu: true,
                currentItem: item,
                menuAt: index,
                bottom: DEVICE_HEIGHT - py - 12
            });
        }
        else {
            this.setState({
                showTop: false,
                showMenu: true,
                currentItem: item,
                menuAt: index,
                top: py - 19
            });
        }
        if (this.menu) {
            this.menu.lightSpeedIn(500);
        }
    }
    schedule() {
        this.hideMenu();
        Actions.schedule({
            user: this.state.currentItem
        });
    }

    userDetail() {
        this.hideMenu();
        Actions.userProfile({
            user: this.state.currentItem
        });
    }
    hideMenu() {
        if (this.menu) {
            this.menu.lightSpeedOut(200).then(() => {
                this.setState({ showMenu: false })
            });
        }
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Thành viên" showFullScreen={true}>
                <View style={{ flex: 1, position: 'relative' }}>
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
                            <MemberItem onItemLongPress={this.onItemLongPress.bind(this)}
                                item={item}
                                index={index} />
                        }
                    />
                    {
                        this.state.showMenu ?
                            <TouchableOpacity onPress={this.hideMenu.bind(this)} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: this.state.showMenu ? 'flex' : 'none' }} />
                            : null
                    }
                    {
                        this.state.showMenu ?
                            <Animatable.View ref={ref => { this.menu = ref }} style={[{ position: 'absolute', left: this.state.left }, this.state.showTop ? { bottom: this.state.bottom } : { top: this.state.top }]}>
                                {
                                    !this.state.showTop ?
                                        <ScaleImage source={require("@images/ic_menu_arrow.png")} width={17} style={{
                                            marginBottom: -1, marginLeft: 34
                                        }} /> : null
                                }
                                <View style={{
                                    elevation: 5,
                                    backgroundColor: 'white',
                                    borderRadius: 5.3,
                                    borderColor: 'rgb(0,121,107)',
                                    borderWidth: 0.5,
                                    flexDirection: 'row'
                                }} shadowColor='#000000' shadowOpacity={0.2} shadowOffset={{}}>
                                    <TouchableOpacity style={{ marginTop: 18, alignItems: 'center', marginBottom: 21, marginLeft: 14, marginRight: 14 }} onPress={() => this.userDetail()}>
                                        <ScaleImage source={require("@images/icprofile.png")} height={25} />
                                        <Text style={{ color: 'rgba(0,0,0,0.6)', fontWeight: '900', marginTop: 11 }}>Thông tin cá nhân</Text>
                                    </TouchableOpacity>
                                    <View style={{ width: 0.5, backgroundColor: 'rgb(0,121,107)', height: '100%' }} />
                                    <TouchableOpacity style={{ marginTop: 18, alignItems: 'center', marginBottom: 21, marginLeft: 14, marginRight: 14 }} onPress={() => this.schedule()}>
                                        <ScaleImage source={require("@images/ic_fly.png")} height={25} />
                                        <Text style={{ color: 'rgba(0,0,0,0.6)', fontWeight: '900', marginTop: 11 }}>Lịch trình</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    this.state.showTop ?
                                        <ScaleImage source={require("@images/ic_menu_arrow.png")} width={17} style={{
                                            marginTop: -1, marginLeft: 34, transform: [{ rotate: '180deg' }]
                                        }} /> : null
                                }
                            </Animatable.View> : null
                    }
                </View>
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
export default connect(mapStateToProps)(MemberScreen);