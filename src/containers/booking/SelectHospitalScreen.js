import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
    View, StyleSheet, Text, TouchableOpacity,
    FlatList, ActivityIndicator, TextInput
} from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import { Card } from 'native-base';
import hospitalProvider from '@data-access/hospital-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import snackbar from '@utils/snackbar-utils';

import clientUtils from '@utils/client-utils';
class SelectHospitalScreen extends Component {
    constructor(props) {
        super(props);
        let specialist = this.props.navigation.state.params.specialist;
        if (!specialist) {
            this.props.navigation.pop();
            snackbar.show("Vui lòng chọn yêu cầu khám", "danger");

        }

        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            serviceType: specialist || {},
            keyword: "",
            loadMore: false,
            finish: false,
            loading: false,
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
    onLoad(s) {
        const { page, size } = this.state;
        let stringQuyery = s ? s : null
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        }, () => {
            hospitalProvider.getBySearch(page, size,stringQuyery).then(s => {
                console.log(s, 'hopspitalllll');
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadMore: false
                }, () => {
                    if (s) {
                        switch (s.code) {
                            case 0:
                            if(stringQuyery){
                                console.log(s.data.data,stringQuyery,'stringQuyerystringQuyerystringQuyery');
                                this.setState({
                                    data:s.data.data
                                });
                            }else{
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
    selectHospital(item) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(item);
            this.props.navigation.pop();
        }
    }
    search() {
        this.onLoad();
    }
    getAddress(item) {
        let address = item.hospital.address;
        if (item.zone && item.zone.name)
            address += ", " + item.zone.name;
        if (item.district && item.district.name)
            address += ", " + item.district.name;
        if (item.province && item.province.countryCode)
            address += ", " + item.province.countryCode;
        return address;
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
                    <TouchableOpacity style={styles.search} onPress={() => { snackbar.show("Chức năng đang phát triển", "danger") }}>
                        <ScaleImage style={styles.aa} width={18} source={require("@images/new/hospital/ic_placeholder.png")} />
                        <Text style={styles.tkdiachi}>Tìm kiếm gần tôi</Text>
                    </TouchableOpacity>
                    <View style={[styles.search, {
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0, 0, 0, 0.06)'
                    }]} >
                        <ScaleImage style={styles.aa} width={18} source={require("@images/new/hospital/ic_search.png")} />
                        <TextInput
                            value={this.state.keyword}
                            onChangeText={s => {
                                this.onLoad(s)
                                this.setState({ keyword: s })}}
                            onSubmitEditing={this.search.bind(this)}
                            returnKeyType='search'
                            style={styles.tkdiachi1} placeholder={"Tìm kiếm…"} underlineColorAndroid={"transparent"} />
                    </View>
                    <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.06)', marginTop: 27 }}></View>
                    <FlatList
                        onRefresh={this.onRefresh.bind(this)}
                        refreshing={this.state.refreshing}
                        style={styles.sc}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.data}
                        onEndReached={this.onLoadMore.bind(this)}
                        onEndReachedThreshold={1}
                        ListHeaderComponent={() =>
                            !this.state.refreshing &&
                                (!this.state.data || this.state.data.length == 0) ? (
                                    <View style={{ alignItems: "center", marginTop: 50 }}>
                                        <Text style={{ fontStyle: "italic" }}>
                                            Không có dữ liệu</Text>
                                    </View>
                                ) : null
                        }
                        ListFooterComponent={() => <View style={{ height: 10 }} />}
                        renderItem={({ item, index }) => {
                            const source = item.medicalRecords && item.medicalRecords.avatar ? { uri: item.medicalRecords.avatar.absoluteUrl() } : require("@images/new/user.png");
                            if (!item.merge) {
                                let address = this.getAddress(item);
                                item.hospital.address = address;
                                item.merge = true;
                            }


                            return <TouchableOpacity style={styles.details} onPress={this.selectHospital.bind(this, item)}>
                                {/* <View style={styles.help}>
                                    <ScaleImage style={styles.plac} height={21} source={require("@images/new/hospital/ic_place.png")} />
                                    <Text style={styles.bv1}>1km</Text>
                                </View> */}
                                <View style={{ flex: 1, marginLeft: 20 }}>
                                    <Text style={styles.bv} numberOfLines={1}>{item.hospital.name}</Text>
                                    <Text style={styles.bv1} numberOfLines={2}>{item.hospital.address}</Text>
                                </View>
                                <ScaleImage style={styles.help} height={21} source={require("@images/new/hospital/ic_info.png")} />
                            </TouchableOpacity>
                        }}
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
        borderBottomWidth: 0.7,
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