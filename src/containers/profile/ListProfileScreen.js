import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from "@components/ActivityPanel";
import { Card } from 'native-base';
import medicalRecordProvider from '@data-access/medical-record-provider';
import { connect } from "react-redux";
import constants from '@resources/strings';

class ListProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ name: 'ádasd' }, { name: 'ádasd' }, { name: 'ádasd' }],
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
        };
    }
    onRefresh() {
        if (!this.state.loading)
            this.setState(
                { refreshing: true, page: 1, finish: false, loading: true },
                () => {
                    this.onLoad();
                }
            );
    }
    componentDidMount() {
        this.onRefresh();
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
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        }, () => {
            medicalRecordProvider.getByUser(this.props.userApp.currentUser.id, page, size).then(s => {
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadMore: false
                }, () => {
                    switch (s.code) {
                        case 0:
                            if (s.data && s.data.data) {
                                var list = [];
                                var finish = false;
                                if (s.data.data.length == 0) {
                                    finish = true;
                                }
                                if (page != 1) {
                                    list = this.state.data;
                                    list.push.apply(list, s.data.data);
                                } else {
                                    list = s.data.data;
                                }
                                this.setState({
                                    data: [...list],
                                    finish: finish
                                });
                            }
                            break;
                    }
                });
            }).catch(e => {
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadMore: false
                });
            })
        });
    }
    onClickItem = (id) => {
        this.props.navigation.navigate('profile',{id:id})
    }
    renderItem = (item, index) => {
        return (
            <TouchableOpacity onPress = {() => this.onClickItem(item.medicalRecords.id)} style={{ paddingHorizontal: 10 }}>
                <Card style={styles.cardView}>
                    <View>
                        <Text style={styles.txName}>{item.medicalRecords.name}</Text>
                        <Text style={styles.txLabel}>ID: <Text style={styles.txId}>{item.medicalRecords.id}</Text></Text>
                    </View>
                    <View>
                        <ScaledImage height={20} source={require('@images/new/profile/ic_clear.png')}></ScaledImage>
                        <Text style={styles.txDelelte}>Xóa</Text>
                    </View>
                </Card>
                <View style={{ height: 0.5, width: '95%', backgroundColor: '#4BBA7B', marginVertical: 5, alignSelf: 'center' }}></View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <ActivityPanel
                icBack={require('@images/new/left_arrow_white.png')}
                titleStyle={styles.txTitle}
                title={'DANH SÁCH THÀNH VIÊN GIA ĐÌNH'}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#359A60"
                actionbarStyle={styles.actionbarStyle}
                style={styles.container}
            >
                <FlatList
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={this.onLoadMore.bind(this)}
                    onEndReachedThreshold={1}
                    renderItem={({ item, index }) => {
                        return this.renderItem(item, index)
                    }}
                    ListHeaderComponent={() =>
                        !this.state.refreshing &&
                            (!this.state.data || this.state.data.length == 0) ? (
                                <View style={{ alignItems: "center", marginTop: 50 }}>
                                    <Text style={{ fontStyle: "italic" }}>
                                        {constants.none_info}
                                    </Text>
                                </View>
                            ) : null
                    }
                    ListFooterComponent={() => <TouchableOpacity style = {styles.btn}><Text style={styles.txBtn}>Thêm thành viên</Text></TouchableOpacity>
}
                ></FlatList>
            </ActivityPanel>

        );
    }
}
const styles = StyleSheet.create({
    container: {
    },
    txId: {
        color: '#000'
    },
    txTitle: { color: '#fff', textAlign: 'left', marginHorizontal: 10, fontSize: 14 },
    actionbarStyle: {
        backgroundColor: '#22b060',
        borderBottomWidth: 0
    },
    btn:{
    paddingHorizontal:10,paddingVertical:5,backgroundColor:'#359A60',borderRadius:5,justifyContent:'center',alignItems:'center',alignSelf:'flex-start',marginHorizontal:10,marginLeft:12,marginBottom:20,marginTop:10
    },
    txBtn:{color:'#fff'},
    cardView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    txName: { color: '#4BBA7B', fontWeight: '500', fontSize: 15, maxWidth: 200 },
    txDelelte: { color: '#C4C4C4', fontSize: 10 },
    txLabel: { color: '#4BBA7B' }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ListProfileScreen);