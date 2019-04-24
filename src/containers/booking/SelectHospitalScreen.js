import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
    View, StyleSheet, Text, TouchableOpacity,
    FlatList, ScrollView, TextInput
} from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import { Card } from 'native-base';
import hospitalProvider from '@data-access/hospital-provider';
import ImageLoad from 'mainam-react-native-image-loader';

import clientUtils from '@utils/client-utils';
class SelectHospitalScreen extends Component {
    constructor(props) {
        super(props);
        let profile = this.props.navigation.state.params.profile;
        let serviceType = this.props.navigation.state.params.serviceType;
        let specialist = this.props.navigation.state.params.specialist;

        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            profile,
            serviceType,
            specialist,
            keyword: ""
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
        }, () => {
            hospitalProvider.getByServiceType(this.state.serviceType.id, this.state.keyword).then(s => {
                debugger;
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
            <ActivityPanel style={styles.AcPanel} title="Địa điểm"
                backButton={<TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.props.navigation.pop()}><Text>Hủy</Text></TouchableOpacity>}
                titleStyle={{ marginLeft: 10 }}
                containerStyle={{
                    backgroundColor: "rgb(246, 249, 251)"
                }}
                actionbarStyle={{
                    backgroundColor: '#ffffff',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0, 0, 0, 0.06)'
                }}>

                <View style={styles.container}>
                    <View style={styles.search}>
                        <ScaleImage style={styles.aa} width={18} source={require("@images/new/hospital/ic_placeholder.png")} />
                        <Text style={styles.tkdiachi}>Tìm kiếm gần tôi</Text>
                    </View>
                    <View style={[styles.search, {
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0, 0, 0, 0.06)'
                    }]} >
                        <ScaleImage style={styles.aa} width={18} source={require("@images/new/hospital/ic_search.png")} />
                        <TextInput style={styles.tkdiachi1} placeholder={"Tìm kiếm…"} underlineColorAndroid={"transparent"} />
                    </View>
                    <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.06)', marginTop: 27 }}></View>
                    <FlatList
                        onRefresh={this.onRefresh.bind(this)}
                        refreshing={this.state.refreshing}
                        onEndReached={this.onLoadMore.bind(this)}
                        onEndReachedThreshold={1}
                        style={styles.sc}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.data}
                        ListHeaderComponent={() =>
                            !this.state.refreshing &&
                                (!this.state.data || this.state.data.length == 0) ? (
                                    <View style={{ alignItems: "center", marginTop: 50 }}>
                                        <Text style={{ fontStyle: "italic" }}>
                                            Hiện tại chưa có thông tin</Text>
                                    </View>
                                ) : null
                        }
                        ListFooterComponent={() => <View style={{ height: 10 }} />}
                        renderItem={({ item, index }) => {
                            const source = item.medicalRecords && item.medicalRecords.avatar ? { uri: item.medicalRecords.avatar.absoluteUrl() } : require("@images/new/user.png");
                            return <TouchableOpacity style={styles.details}>
                                <View style={styles.help}>
                                    <ScaleImage style={styles.plac} height={21} source={require("@images/new/hospital/ic_place.png")} />
                                    <Text style={styles.bv1}>1km</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.bv} numberOfLines={1}>Bệnh viện Đại học Y Hà Nội</Text>
                                    <Text style={styles.bv1} numberOfLines={2}>703 Trần Cung, Cổ Nhuế, Từ Liêm, Hà Nội</Text>
                                </View>
                                <ScaleImage style={styles.help} height={21} source={require("@images/new/hospital/ic_info.png")} />
                            </TouchableOpacity>
                        }}
                    />
                </View>
            </ActivityPanel >
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

        backgroundColor: 'rgb(246, 249, 251)',
    },
    cancel: {
        marginLeft: 15
    },
    container: {
        flex: 1,
        backgroundColor: 'rgb(246, 249, 251)',
        borderStyle: 'solid',
        paddingTop: 20
    },
    search: {
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.06)',
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    tkdiachi1: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
        marginLeft: 15,
        flex: 1
    },
    city: {
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 20,
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#4a4a4a"
    },
    playbtn: {
        position: 'absolute',
        top: 22,
        left: 75
    },

    row: {
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.16)',
        height: 25,
        width: 1,
        position: 'absolute',
        top: 13,
        left: 95

    },
    tk: {
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
        position: 'absolute',
        top: 16,
        left: 110
    },

    details: {
        flexDirection: 'row',
        paddingVertical: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)'
    },
    sc: {
        backgroundColor: '#FFF', flex: 1
    },
    bv: {
        fontSize: 15,
        fontWeight: "bold",
        letterSpacing: 0,
        color: "#000000",
    },
    bv1: {
        fontSize: 13,
        color: "#00000050",
        marginTop: 9
    },
    help: {
        marginHorizontal: 20,
        marginTop: 5,
        alignItems: 'center'
    },
    aa: {
        marginLeft: 20
    },
    tkdiachi: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a",
        marginLeft: 15,
    }

})
export default connect(mapStateToProps)(SelectHospitalScreen);