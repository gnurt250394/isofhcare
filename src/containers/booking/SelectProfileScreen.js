import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
    View, StyleSheet, Text, TouchableOpacity,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import { Card } from 'native-base';
import medicalRecordProvider from '@data-access/medical-record-provider';
import ImageLoad from 'mainam-react-native-image-loader';

import clientUtils from '@utils/client-utils';
class SelectProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1
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
componentWillReceiveProps(nextProps){
    if(nextProps.navigation.state.params && nextProps.navigation.state.params.loading){
        this.onRefresh()
    }
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
    selectPofile(profile) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(profile);
        }
        this.props.navigation.pop();
    }
    render() {
        return (
            <ActivityPanel 
            style={styles.AcPanel} 
            title="Tất cả hồ sơ"
            // titleStyle={{ marginRight: -10 }}

                containerStyle={{
                    backgroundColor: "#f7f9fb"
                }}
                actionbarStyle={{
                    backgroundColor: '#ffffff',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0, 0, 0, 0.06)'
                }}
                // menuButton={
                //     <View style ={{width:15,marginLeft: 10
                //     }}>
                //     </View>
                //   }
                >

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
                        const source = item.medicalRecords && item.medicalRecords.avatar ? { uri: item.medicalRecords.avatar.absoluteUrl() } : require("@images/new/user.png");

                        return (<TouchableOpacity style={styles.bn} onPress={this.selectPofile.bind(this, item)}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={{ borderRadius: 20, borderWidth: 1, borderColor: '#CAC' }}
                                borderRadius={20}
                                customImagePlaceholderDefaultStyle={[styles.avatar, { width: 40, height: 40 }]}
                                placeholderSource={require("@images/new/user.png")}
                                resizeMode="cover"
                                loadingStyle={{ size: 'small', color: 'gray' }}
                                source={source}
                                style={{
                                    alignSelf: 'center',
                                    borderRadius: 20,
                                    width: 40,
                                    height: 40
                                }}
                                defaultImage={() => {
                                    return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
                                }}
                            />
                            <Text style={styles.bntext}>{item.medicalRecords.name}</Text>
                            {/* <ScaleImage style={styles.ckeck} height={18} source={require("@images/new/profile/ic_question_check_specialist.png")} /> */}
                        </TouchableOpacity>);
                    }}
                />

                {this.state.data && this.state.data.length <10 || !this.state.data ?(
                    <TouchableOpacity style={{ backgroundColor: "#02c39a", width: 200, borderRadius: 6, alignSelf: 'center', marginVertical: 10, marginBottom: 30 }} onPress={() =>
                        this.props.navigation.navigate("createProfile",
                            {   isDataNull : !this.state.data || this.state.data.length == 0 ? true : false,
                                onCreate: this.onRefresh.bind(this)
                            })}>
                            {!this.state.data || this.state.data.length == 0 ? (  <Text style={styles.btntext}>Thêm hồ sơ</Text>) : (  <Text style={styles.btntext}>Thêm người thân</Text>)}
                      
                    </TouchableOpacity>
                ):(
                    null
                )}
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
        marginLeft: 10,
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
        color: "#FFF",
        textAlign: 'center',
        margin: 10,

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