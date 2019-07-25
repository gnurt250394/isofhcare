import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from "@components/ActivityPanel";
import { Card } from 'native-base';
import medicalRecordProvider from '@data-access/medical-record-provider';
import { connect } from "react-redux";
import constants from '@resources/strings';
import profileProvider from '@data-access/profile-provider'
import Modal from '@components/modal';

class ListProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ name: 'ádasd' }, { name: 'ádasd' }, { name: 'ádasd' }],
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            isVisible: false,
        };
    }
    onRefresh = () => {
        this.setState({
            refreshing: true,
        }, () => {
            this.onLoad();
        })
    }
    componentDidMount() {
        this.onRefresh();
    }

    onLoad = () => {
        profileProvider.getListProfile().then(s => {
            this.setState({
                refreshing: false,
            }, () => {
                switch (s.code) {
                    case 0:
                        if (s.data && s.data.profiles) {
                            this.setState({
                                data: s.data.profiles,
                            });
                        }
                        break;
                }
            });
        }).catch(e => {
            this.setState({
                refreshing: false,
            });
        })
    }
    onClickItem = (item) => {
        this.props.navigation.navigate('profile', { data: item })
    }
    onDeleteItem = (id) => {
        this.setState({
            isVisible: true,
            idProfile: id
        })
    }
    onClickDone = () => {
        this.state.idProfile &&
            profileProvider.deleteFamilyProfile(this.state.idProfile).then(res => {
                console.log(res, 'resss')
                this.setState({
                    isVisible: false
                })
                
                this.onRefresh()
            }).catch(err => {
                this.setState({
                    isVisible: false
                })
            })
    }
    onCloseModal = () => {
        this.setState({
            isVisible: false
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.navigation.state.params && nextProps.navigation.state.params.reset){
            this.onRefresh()
        }
    }
    renderItem = (item, index) => {
        return (
            <TouchableOpacity onPress={() => this.onClickItem(item)} style={{ paddingHorizontal: 10, marginVertical: 5,flex:1 }}>
                <Card style={styles.cardView}>
                        <Text style={styles.txName}>{item.name}</Text>
                        {/* <Text style={styles.txLabel}>ID: <Text style={styles.txId}>{item.profileNoID}</Text></Text> */}
                    {item.type !== 'ORIGINAL' ? (<TouchableOpacity onPress={() => this.onDeleteItem(item.id)}>
                        <ScaledImage height={20} source={require('@images/new/profile/ic_clear.png')}></ScaledImage>
                        <Text style={styles.txDelelte}>Xóa</Text>
                    </TouchableOpacity>) : (<View></View>)}
                </Card>
                <View style={{ height: 1, width: '98%', backgroundColor: '#4BBA7B',  alignSelf: 'center',marginTop:5}}></View>
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
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
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
                    ListFooterComponent={() => <TouchableOpacity onPress={() => this.props.navigation.navigate('createProfile',{screen:'listProfile'})} style={styles.btn}><Text style={styles.txBtn}>Thêm thành viên</Text></TouchableOpacity>
                    }
                ></FlatList>
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={this.onCloseModal}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={styles.viewModal}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <View style={styles.viewPopup}>
                        <Text style={styles.txNotifi}>{'Bạn có chắc chắn muốn xóa thành viên này?'}</Text>
                        <View style={styles.viewBtn}>
                            <TouchableOpacity onPress={this.onClickDone} style={styles.btnDone}><Text style={styles.txDone}>Đồng ý</Text></TouchableOpacity>
                            <TouchableOpacity onPress={this.onCloseModal} style={styles.btnReject}><Text style={styles.txDone}>Hủy</Text></TouchableOpacity>
                        </View>

                    </View>
                </Modal>
            </ActivityPanel>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1
    },
    txId: {
        color: '#000'
    },
    txTitle: { color: '#fff', textAlign: 'left', marginHorizontal: 10, fontSize: 14 },
    actionbarStyle: {
        backgroundColor: '#22b060',
        borderBottomWidth: 0
    },
    btn: {
        paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#359A60', borderRadius: 5, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginHorizontal: 10, marginLeft: 12, marginBottom: 20, marginTop: 10
    },
    txNotifi: { fontSize: 18, color: '#000', textAlign: 'center', marginHorizontal: 40 },

    viewPopup: { backgroundColor: '#fff', marginHorizontal: 20, paddingVertical: 40, borderRadius: 5 },
    viewModal: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    txBtn: { color: '#fff' },
    cardView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    txName: { color: '#4BBA7B', fontWeight: '500', fontSize: 15, maxWidth: 200 },
    txDelelte: { color: '#C4C4C4', fontSize: 10 },
    txLabel: { color: '#4BBA7B' },
    btnDone: { justifyContent: 'center', alignItems: 'center', height: 30, width: 78, backgroundColor: '#359A60', borderRadius: 5, },
    btnReject: { justifyContent: 'center', alignItems: 'center', height: 30, width: 78, marginLeft: 10, borderRadius: 5, backgroundColor: '#FFB800', },
    viewBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    txDone: { color: '#fff' },

})
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ListProfileScreen);