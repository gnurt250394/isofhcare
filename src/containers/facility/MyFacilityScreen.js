import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, ActivityIndicator, Text, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import facilityProvider from '@data-access/facility-provider';
import ItemFacility from '@components/facility/ItemFacility';
import Dash from 'mainam-react-native-dash-view';
import Modal from "@components/modal";
import stylemodal from "@styles/modal-style";

class MyFacilityScreen extends Component {
    constructor(props) {
        super(props)
        let keyword = this.props.navigation.getParam('keyword', '');
        if (keyword)
            keyword = keyword.trim();
        else
            keyword = "";


        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            finish: false,
            loading: false,
            keyword,
            toggleTypeFacility: false
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
    componentWillReceiveProps(nextProps) {
        try {
            let propsFacility = nextProps.navigation.getParam('facility', undefined);
            if (propsFacility != this.state.propsFacility) {
                this.setState({ propsFacility }, () => {
                    this.onRefresh()
                });
            }
        } catch (error) {

        }
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        })
        facilityProvider.myFacility(this.state.keyword, this.props.userApp.currentUser.id, page, size, (s, e) => {
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
    addNewClinic() {
        this.setState({
            toggleTypeFacility: false
        }, () => {
            this.props.navigation.navigate("addNewClinic");
        });
    }
    addNewDrugStore() {
        this.setState({
            toggleTypeFacility: false
        }, () => {
            this.props.navigation.navigate("addNewDrugStore");
        });
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="CSYT C???A T??I" showFullScreen={true}>
                <View style={{ flex: 1, padding: 14 }}>
                    <TouchableOpacity onPress={() => { this.setState({ toggleTypeFacility: true }) }} style={{
                        marginLeft: 10, marginRight: 10
                    }}>
                        <Dash style={{ height: 2, width: '100%', flexDirection: 'row' }} dashColor="#00977c" />
                        <View style={{ flexDirection: 'row' }}>
                            <Dash style={{ width: 2, height: 50, flexDirection: 'column' }} dashColor="#00977c" />
                            <Text style={{
                                flex: 1,
                                padding: 12,
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: "600",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                color: "#00977c"
                            }}>+ Th??m m???i</Text>
                            <Dash style={{ width: 2, height: 50, flexDirection: 'column' }} dashColor="#00977c" />
                        </View>
                        <Dash style={{ height: 2, width: '100%', flexDirection: 'row' }} dashColor="#00977c" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            onRefresh={this.onRefresh.bind(this)}
                            refreshing={this.state.refreshing}
                            onEndReached={this.onLoadMore.bind(this)}
                            onEndReachedThreshold={1}
                            style={{ flex: 1, marginTop: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            data={this.state.data}
                            ListHeaderComponent={() => !this.state.refreshing_list_most && (!this.state.data || this.state.data.length == 0) ?
                                <View style={{ alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ fontStyle: 'italic' }}>B???n ch??a t???o c?? s??? y t??? n??o</Text>
                                </View> : null
                            }                                                      
                            ListFooterComponent={() => <View style={{ height: 20 }}></View>}
                            renderItem={({ item, index }) =>
                                <ItemFacility facility={item} showEdit={true} />
                            }
                        />
                    </View>
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
                <Modal
                    isVisible={this.state.toggleTypeFacility}
                    onBackdropPress={() => this.setState({ toggleTypeFacility: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                                CH???N LO???I CSYT
                            </Text>
                        </View>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <TouchableOpacity style={{
                                width: 272,
                                height: 52,
                                flexDirection: 'row',
                                borderRadius: 4,
                                alignItems: 'center',
                                padding: 10,
                                backgroundColor: "#00977c"
                            }} onPress={this.addNewClinic.bind(this)}>
                                <ScaledImage source={require("@images/ic_phongkham1.png")} width={32} style={{ marginRight: 12 }} />
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    color: '#FFF',
                                    fontStyle: "normal"
                                }}>PH??NG KH??M</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                width: 272,
                                marginTop: 12,
                                height: 52,
                                flexDirection: 'row',
                                borderRadius: 4,
                                alignItems: 'center',
                                padding: 10,
                                backgroundColor: "#00977c"
                            }}
                                onPress={this.addNewDrugStore.bind(this)}
                            >
                                <ScaledImage source={require("@images/ic_nhathuoc.png")} width={25} style={{ marginRight: 19 }} />
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    color: '#FFF',
                                    fontStyle: "normal"
                                }}>NH?? THU???C</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(MyFacilityScreen);