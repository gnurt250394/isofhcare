import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { IndicatorViewPager } from 'mainam-react-native-viewpager';
import AllProgram from '@components/program/AllProgram'
import MyProgram from '@components/program/MyProgram'
import ScaledImage from 'mainam-react-native-scaleimage';
import * as Animatable from 'react-native-animatable';


class ProgramScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            left: 0,
            right: 100,
            position: 0,
            keyword: ""
        }
    }

    onPageScroll(e) {
        console.log(e);
        var offset = e.offset * 100;
        var position = e.position;
        if (position == -1 || (position == 1 && offset > 0))
            return;
        this.setState({
            left: offset,
            right: 100 - offset,
            position: position
        })
    }
    selectPage(position) {
        this.viewPager.setPage(position);
    }
    showSearchView() {
        if (!this.state.showSearchView) {
            this.searchView.fadeInDown(200).then(() => {
                this.searchInput.focus();
            });
            this.setState({
                showSearchView: true
            });
        } else {
            Keyboard.dismiss();
            this.searchView.fadeOutUp(500).then(() => {
                this.setState({
                    showSearchView: false,
                    keyword: ""
                });
            });
        }
    }
    menuSearch() {
        return (<TouchableOpacity style={{ padding: 10, paddingRight: 20 }} onPress={this.showSearchView.bind(this)}>
            <ScaledImage source={require("@images/ictimkiem.png")} width={20} />
        </TouchableOpacity>);
    }

    search() {
        try {
            if (this.my) {
                this.my.getWrappedInstance().search(this.state.keyword);
            }
            if (this.all) {
                this.all.getWrappedInstance().search(this.state.keyword);
            }
        } catch (error) {
            console(error);
        }
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Chương trình" showFullScreen={true} menuButton={this.menuSearch()} titleStyle={{ marginLeft: 45 }}>
                <Animatable.View  ref={ref => this.searchView = ref} style={{ height: 50, display: this.state.showSearchView ? 'flex' : 'none', alignItems: 'center', flexDirection: 'row', paddingLeft: 10, paddingRight: 10, margin: 5, backgroundColor: '#FFF', shadowColor: '#000000', shadowOpacity: 0.2, shadowOffset: {}, elevation: 5 }} >
                    <TextInput ref={ref => this.searchInput = ref} placeholder={"Nhập nội dung tìm kiếm"} style={{ flexDirection: 'row', flex: 1 }} returnKeyType="search" underlineColorAndroid="transparent" onSubmitEditing={this.search.bind(this)} onChangeText={(x) => this.setState({ keyword: x })} value={this.state.keyword} />
                    {this.state.keyword ?
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => { this.setState({ keyword: "" }, this.search) }}>
                            <ScaledImage width={20} source={require("@images/icclose.png")} />
                        </TouchableOpacity> : null
                    }
                </Animatable.View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ flex: 1, position: 'relative' }} onPress={() => { this.selectPage(0) }}>
                        <Text style={{ textAlign: 'center', padding: 20, fontWeight: this.state.position == 0 ? '900' : '700' }}>LỊCH TOÀN THỂ</Text>
                        <View style={{ height: 2, backgroundColor: '#cacaca' }} />
                        {
                            (this.state.left == 0 && this.state.position == 0 || this.state.left != 0) ?
                                <View style={{ height: 2, backgroundColor: 'rgb(0,121,107)', position: 'absolute', bottom: 0, left: this.state.left + "%", right: 0 }} /> :
                                null
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, position: 'relative' }} onPress={() => { this.selectPage(1) }}>
                        <Text style={{ textAlign: 'center', padding: 20, fontWeight: this.state.position == 1 ? '900' : '700' }}>LỊCH CỦA TÔI</Text>
                        <View style={{ height: 2, backgroundColor: '#cacaca' }} />
                        {
                            (this.state.left == 0 && this.state.position == 1 || this.state.right != 0) ?
                                <View style={{ height: 2, backgroundColor: 'rgb(0,121,107)', position: 'absolute', bottom: 0, left: 0, right: this.state.left == 0 && this.state.position == 1 ? 0 : this.state.right + "%" }} /> :
                                null
                        }
                    </TouchableOpacity>
                </View>
                <IndicatorViewPager ref={(viewPager) => { this.viewPager = viewPager }} style={{ flex: 1 }} onPageScroll={this.onPageScroll.bind(this)}>
                    <View><AllProgram ref={ref => this.all = ref} /></View>
                    <View><MyProgram ref={ref => this.my = ref} /></View>
                </IndicatorViewPager>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ProgramScreen);