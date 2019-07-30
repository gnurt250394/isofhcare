import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, ActivityIndicator, Text, FlatList, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import specialistProvider from '@data-access/specialist-provider';
import * as Animatable from 'react-native-animatable';
import Dash from 'mainam-react-native-dash-view';
import { Card } from 'native-base';

class SpecialistScreen extends Component {
    constructor(props) {
        super(props)
        let keyword = this.props.navigation.getParam('keyword', '');
        if (keyword)
            keyword = keyword.trim();
        else
            keyword = "";

        let specialist = this.props.navigation.getParam('specialist', null);

        if (specialist) {
            keyword = "";
        }


        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            finish: false,
            loading: false,
            keyword,
            specialist
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
        const { page, size, keyword } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        })
        specialistProvider.searchFromApi(keyword, page, size, (s, e) => {
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
                            list = this.state.data;
                            list.push.apply(list, s.data.data);
                        }
                        else {
                            list = s.data.data;
                        }
                        this.setState({
                            data: [...list],
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

    menuButton() {
        return (<View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ padding: 10, paddingRight: 10 }} onPress={this.showSearchView.bind(this)}>
                <ScaledImage source={require("@images/ictimkiem.png")} width={20} />
            </TouchableOpacity>
        </View>);
    }
    showSearchView() {
        if (!this.state.showSearchView) {
            this.searchView.fadeInDown(200).then(() => {
                this.searchInput.focus();
            });
            this.setState({
                showSearchView: true,
                showMenu: false,
            });
        } else {
            Keyboard.dismiss();
            this.searchView.fadeOutUp(500).then(() => {
                this.setState({
                    showSearchView: false,
                    showMenu: false,
                    keyword: ""
                });
            });
        }
    }
    search() {
        try {
            this.onRefresh();
        } catch (error) {
            console(error);
        }
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} titleStyle={{ marginLeft: 40 }} title={"CHUYÊN KHOA"} showFullScreen={true} menuButton={this.menuButton()}>
                <Animatable.View ref={ref => this.searchView = ref} style={{ height: 50, display: this.state.showSearchView ? 'flex' : 'none', alignItems: 'center', flexDirection: 'row', paddingLeft: 10, paddingRight: 10, margin: 5, backgroundColor: '#FFF', shadowColor: '#000000', shadowOpacity: 0.2, shadowOffset: {}, elevation: 5 }} >
                    <TextInput ref={ref => this.searchInput = ref} placeholder={"Nhập nội dung tìm kiếm"} style={{ flexDirection: 'row', flex: 1 }} returnKeyType="search" underlineColorAndroid="transparent" onSubmitEditing={this.search.bind(this)} onChangeText={(x) => this.setState({ keyword: x })} value={this.state.keyword} />
                    {this.state.keyword ?
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => { this.setState({ keyword: "" }, this.search) }}>
                            <ScaledImage width={20} source={require("@images/icclose.png")} />
                        </TouchableOpacity> : null
                    }
                </Animatable.View>
                <View style={{ flex: 1, padding: 14 }}>
                    <FlatList
                        onRefresh={this.onRefresh.bind(this)}
                        refreshing={this.state.refreshing}
                        onEndReached={this.onLoadMore.bind(this)}
                        onEndReachedThreshold={1}
                        style={{ flex: 1 }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.data}
                        ListHeaderComponent={() => !this.state.refreshing && (!this.state.data || this.state.data.length == 0) ?
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <Text style={{ fontStyle: 'italic' }}>Không tìm chuyên khoa nào</Text>
                            </View> : null
                        }
                        ListFooterComponent={() => <View style={{ height: 20 }}></View>}
                        renderItem={({ item, index }) =>
                            // <TouchableOpacity>
                            <Card>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate("searchFacilityResult", { specialist: item }) }}>
                                    <Text style={{ padding: 15 }}>{item.specialist.name}</Text>
                                </TouchableOpacity>
                            </Card>
                            // </TouchableOpacity>
                        }
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
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(SpecialistScreen);