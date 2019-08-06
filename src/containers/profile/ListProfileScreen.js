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
import NavigationService from "@navigators/NavigationService";
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet'

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
    onShowOptions = (id,medicalRelatedId) => {
        this.actionSheetOptions.show();
        this.setState({
            idProfile: id,
            medicalRelatedId:medicalRelatedId ? medialRelatedId : null
        })
    };
    onRefresh = () => {
        this.setState({
            refreshing: true,
        }, () => {
            this.onLoad();
        })
    }
    onSetOptions = index => {
        try {
            switch (index) {
                case 0:
                    NavigationService.navigate("shareDataProfile",{
                        medialRelatedId:this.state.medialRelatedId,
                        id:this.state.idProfile
                    })
                    return;
                case 1:
                    this.setState(
                        {
                            isVisible: true,

                        });
                    return;
            }
        } catch (error) {

        }

    };
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
                        if (s.data) {
                            this.setState({
                                data: s.data,
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
        NavigationService.navigate('profile', { data: item })
    }
    onDeleteItem = (id) => {
        this.setState({

        })
    }
    onClickDone = () => {
        this.state.idProfile &&
            profileProvider.deleteFamilyProfile(this.state.idProfile).then(res => {
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
    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params && nextProps.navigation.state.params.reset) {
            this.onRefresh()
        }
    }
    renderItem = (item, index) => {
        return (
            item.medicalRecords.status == 1 ? (
                <Card style={styles.viewProfileUser}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onClickItem(item)}>
                        <LinearGradient style={styles.viewGradientUser} colors={['#02C293', '#01bb72', '#01BF88']}>
                            <Text style={styles.txProfileUser}>{item.medicalRecords.name}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Card>
            ) : (<View style={{
                marginHorizontal: 10,
            }}>
                <Card style={styles.cardView}>
                    <View style={styles.viewProfileFamily}>
                        <TouchableOpacity onPress={() => this.onClickItem(item)} >
                            <View>
                                <Text style={styles.txName}>{item.medicalRecords.name}</Text>
                                {
                                    item.medicalRecords.relationshipType ?
                                        <Text style={{ color: '#02C293', fontSize: 14 }}>Quan hệ: <Text style={{ color: '#868686', fontSize: 14 }}>{item.medicalRecords.relationshipType}</Text></Text>
                                        : <View></View>
                                }
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity  style = {{padding:10}}  onPress={() => this.onShowOptions(item.medicalRecords.id,item.medicalRecords.medicalRelatedId ? item.medicalRecords.medicalRelatedId : null)}>
                            <ScaledImage height={8} source={require('@images/new/profile/ic_three_dot.png')}></ScaledImage>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
                )
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
                    ListFooterComponent={() => <TouchableOpacity onPress={() => NavigationService.navigate('createProfile')}><LinearGradient colors={['#02C293', '#01bb72', '#01BF88']} style={styles.btn}><Text style={styles.txBtn}>Thêm thành viên</Text></LinearGradient></TouchableOpacity>
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
                <ActionSheet
                    ref={o => this.actionSheetOptions = o}
                    options={['Cài đặt chia sẻ', 'Xóa', 'Hủy']}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={1}
                    onPress={this.onSetOptions}
                />
            </ActivityPanel>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    txId: {
        color: '#000'
    },
    txTitle: { color: '#fff', textAlign: 'left', marginHorizontal: 10, fontSize: 14 },
    actionbarStyle: {
        backgroundColor: '#4BBA7B',
        borderBottomWidth: 0
    },
    btn: {
        paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#359A60', borderRadius: 5, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', marginHorizontal: 10, marginLeft: 12, marginBottom: 20, marginTop: 10
    },
    txNotifi: { fontSize: 18, color: '#000', textAlign: 'center', marginHorizontal: 40 },

    viewPopup: { backgroundColor: '#fff', marginHorizontal: 20, paddingVertical: 40, borderRadius: 5 },
    viewModal: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    txBtn: { color: '#fff', fontSize: 16 },
    cardView: {
        paddingHorizontal: 10,
        minHeight: 60,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#01BF88',
        justifyContent: 'center'
    },
    txName: { color: '#4BBA7B', fontWeight: '500', fontSize: 15, maxWidth: 200 },
    txDelelte: { color: '#C4C4C4', fontSize: 10 },
    txLabel: { color: '#4BBA7B' },
    btnDone: { justifyContent: 'center', alignItems: 'center', height: 30, width: 78, backgroundColor: '#359A60', borderRadius: 5, },
    btnReject: { justifyContent: 'center', alignItems: 'center', height: 30, width: 78, marginLeft: 10, borderRadius: 5, backgroundColor: '#FFB800', },
    viewBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    txDone: { color: '#fff' },
    viewProfileUser: {
        // backgroundColor: '#01BE84',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        // padding: 10,
        marginVertical: 20,
        marginLeft: 10,
        flex: 1,
        minHeight: 50,
        justifyContent: 'center'
    },
    txProfileUser: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
    viewProfileFamily: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    viewGradientUser: {
        flex: 1, justifyContent: 'center', borderTopLeftRadius: 10,
        padding: 10,
        borderBottomLeftRadius: 10,
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ListProfileScreen);