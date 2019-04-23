import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
    View, StyleSheet, Text, TouchableOpacity,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import { Card } from 'native-base';

class SelectProfileScreen extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            refreshing: false
        }
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

    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        });
        setTimeout(() => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false,
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
            });
            // if (s) {
            //     switch (s.code) {
            //         case 0:
            //             var list = [];
            //             var finish = false;
            //             if (s.data.length == 0) {
            //                 finish = true;
            //             }
            //             if (page != 1) {
            //                 list = this.state.data;
            //                 list.push.apply(list, s.data);
            //             } else {
            //                 list = s.data;
            //             }
            //             this.setState({
            //                 data: [...list],
            //                 finish: finish
            //             });
            //             break;
            //     }
            // }
        }, 5000);
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
    render() {
        return (
            <ActivityPanel style={styles.AcPanel} title="Tất cả hồ sơ" 
                containerStyle={{
                    backgroundColor: "#f7f9fb"
                }}
                actionbarStyle={{
                    backgroundColor: '#ffffff',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0, 0, 0, 0.06)'
                }}>

                <FlatList
                    onRefresh={this.onRefresh.bind(this)}
                    refreshing={this.state.refreshing}
                    onEndReached={this.onLoadMore.bind(this)}
                    onEndReachedThreshold={1}
                    style={styles.container}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.data}
                    ListHeaderComponent={() =>
                        !this.state.refreshing &&
                            (!this.state.data || this.state.data.length == 0) ? (
                                <View style={{ alignItems: "center", marginTop: 50 }}>
                                    <Text style={{ fontStyle: "italic" }}>
                                        Hiện tại chưa có thông tin
                </Text>
                                </View>
                            ) : null
                    }
                    ListFooterComponent={() => <View style={{ height: 10 }} />}
                    renderItem={({ item, index }) => {
                        return (<View style={styles.bn}>
                            <ScaleImage height={40} source={require("@images/new/profile/ic_home_addbooking.png")} />
                            <Text style={styles.bntext}>Lê Thị Hoàng</Text>
                            <ScaleImage style={styles.ckeck} height={18} source={require("@images/new/profile/ic_question_check_specialist.png")} />
                        </View>);
                    }}
                />

                <View style={styles.container}>
                    <TouchableOpacity>
                        <Text style={styles.btntext}>Thêm hồ sơ</Text>
                    </TouchableOpacity>
                </View>
            </ActivityPanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
const styles = StyleSheet.create({
    AcPanel: {
        flex: 1,
        backgroundColor: '#cacaca',
    },
    container: {
        flex: 1,
        paddingTop: 20
    },
    bn: {
        padding: 10,
        position: 'relative',
        backgroundColor: 'rgb(255, 255, 255)',
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.06)',
        flexDirection: 'row',
        alignItems: 'center',
    },
    bntext: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"
    },
    ckeck: {
        position: 'absolute',
        top: 17,
        right: 20,
    },
    btntext: {
        fontSize: 18,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a",
        textAlign: 'center',
        marginTop: 20,

    },
    btntext2: {
        fontSize: 18,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a",
        position: 'absolute',
        left: 240,
        top: 10

    }

})
export default connect(mapStateToProps)(SelectProfileScreen);