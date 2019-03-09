import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import Dimensions from 'Dimensions';
const DEVICE_WIDTH = Dimensions.get('window').width;
import * as Animatable from 'react-native-animatable';
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
import Carousel from 'react-native-snap-carousel';

class TabSearch extends Component {
    constructor(props) {
        super(props)
        // var features = [
        //     //     {
        //     //     icon: require("@images/search/icchuandoantrieuchung.png"),
        //     //     id: 3
        //     // }, {
        //     //     icon: require("@images/search/ictimbacsi.png"),
        //     //     id: 4
        //     // }, {
        //     //     icon: require("@images/search/icgiadichvu.png"),
        //     //     id: 5
        //     // },
        //     {
        //         icon: require("@images/timcsyt.png"),
        //         id: 0
        //     }, {
        //         icon: require("@images/timthuoc.png"),
        //         id: 1
        //     },
        //     {
        //         icon: require("@images/ybadientu.png"),
        //         id: 2
        //     }
        // ];
        // var ads = [
        //     //     {
        //     //     icon: require("@images/search/icchuandoantrieuchung.png"),
        //     //     id: 3
        //     // }, {
        //     //     icon: require("@images/search/ictimbacsi.png"),
        //     //     id: 4
        //     // }, {
        //     //     icon: require("@images/search/icgiadichvu.png"),
        //     //     id: 5
        //     // },
        //     // {
        //     //     icon: require("@images/banner/findcdyt.png"),
        //     //     id: 0
        //     // },
        //     {
        //         icon: require("@images/banner/bannerbooking.png"),
        //         id: 0
        //     },
        //     {
        //         icon: require("@images/banner/bannerquestion.png"),
        //         id: 1
        //     },
        //     {
        //         icon: require("@images/banner/findcdyt.png"),
        //         id: 2
        //     }
        // ];
        // this.state = {
        //     features,
        //     ads
        // }
    }
    onClick(item) {
        const navigate = this.props.navigation.navigate;
        switch (item.id) {
            case 0:
                navigate("searchFacility");
                break;
            case 1:
                navigate("searchDrug");
                break;
            case 2:
                if (this.props.userApp.isLogin)
                    navigate("ehealth");
                else
                    navigate("login");
                break;
        }
    }
    onClickItemAds(item) {
        const navigate = this.props.navigation.navigate;
        switch (item.id) {
            case 0:
                if (!this.props.userApp.isLogin) {
                    this.props.navigation.navigate("login");
                    return;
                }
                this.setState({ showModalSelectHospital: true });
                break;
            case 1:
                navigate("listQuestion");
                break;
            case 2:
                navigate("searchFacilityByLocation");
                break;
        }
    }
    showDrawer() {
        if (this.props.drawer) {
            this.props.drawer.open();
        }
    }

    getItemWidth() {
        const width = DEVICE_WIDTH;
        // let itemWidth = 360;
        // if (itemWidth > width - 10)
        //     return width - 10;
        return width - 15;
        // if (width >= 320)
        //     return 150;
        // if (width > 320)
        //     return 150;
        // if (width > 300)
        //     return 140;
        // if (width > 250)
        //     return 115;
        // if (width > 170)
        //     return 160;
        // return width - 10;
    }

    // renderTitlePage() {
    //     alert("ádasdasdas");
    //     return(
    //     )
    // }
    // selectBVDHY() {
    //     this.setState({
    //         showModalSelectHospital: false
    //     }, () => {
    //         this.props.navigation.navigate("addBookingBVDHY");
    //     });
    // }
    _renderItem({ item, index }) {
        return (
            <View>
                <ScaledImage source={require("@images/banner/bannerbooking.png")} width={DEVICE_WIDTH - 100} />
            </View>
        );
    }
    render() {
        const itemWidth = this.getItemWidth();
        return (
            <ActivityPanel
                style={[{ flex: 1 }, this.props.style]}
                titleStyle={{ marginRight: 60 }}
                imageStyle={{ marginRight: 50 }}
                image={require("@images/logo_home.png")}
                icBack={require("@images/icmenu.png")}
                backButtonClick={() => { this.showDrawer() }}
                // showMessenger={this.props.userApp.isLogin ? true : false}
                showMessenger={false}
                badge={0}>
                <ScrollView style={{
                    flex: 1,
                    paddingLeft: 15, paddingRight: 15, paddingTop: 0,
                    width: DEVICE_WIDTH
                }}>
                    <Text>Bạn cần gì hôm nay</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ flex: 1, marginLeft: 5 }}>
                            <Text>Đặt khám</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, marginLeft: 5 }} onPress={() => this.props.navigation.navigate("listQuestion")}>
                            <Text>Tư vấn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, marginLeft: 5 }}>
                            <Text>Tra cứu</Text>
                        </TouchableOpacity>
                    </View>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={[1, 2, 3, 4, 5]}
                        renderItem={this._renderItem}
                        sliderWidth={DEVICE_WIDTH}
                        itemWidth={DEVICE_WIDTH - 100}
                    />
                    {/* <View style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }}>
                        {
                            this.state.features.map((item, position) => {
                                return (<Animatable.View key={position} delay={50 * position} animation={"slideInLeft"} direction="alternate">
                                    <TouchableOpacity key={position} onPress={() => { this.onClick(item) }}>
                                        <ScaledImage source={item.icon} width={itemWidth} />
                                    </TouchableOpacity>
                                </Animatable.View>);
                            })
                        }
                    </View>

                    <View style={{
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'flex-start'
                    }}>
                        <Text style={{
                            marginTop: 20,
                            color: "#9b9b9b",
                            fontSize: 16,
                            fontWeight: "500",
                            // marginLeft: (DEVICE_WIDTH - itemWidth) / 2
                        }}>iSofH Care</Text>{
                            this.state.ads.map((item, position) => {
                                return (<Animatable.View key={position} delay={50 * position} animation={"slideInRight"} direction="alternate">
                                    <TouchableOpacity key={position} style={{ paddingTop: 5, paddingBottom: 5 }} onPress={() => { this.onClickItemAds(item) }}>
                                        <ScaledImage source={item.icon} width={itemWidth - 15} style={{ borderRadius: 5 }} />
                                    </TouchableOpacity>
                                </Animatable.View>);
                            })
                        }
                    </View> */}
                    <View style={{ height: 30 }} />
                </ScrollView>
                {/* <Modal
                    isVisible={this.state.showModalSelectHospital}
                    onBackdropPress={() => this.setState({ showModalSelectHospital: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                                CHỌN BỆNH VIỆN
                            </Text>
                        </View>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <TouchableOpacity style={{
                                height: 52,
                                flexDirection: 'row',
                                borderRadius: 4,
                                alignItems: 'center',
                                padding: 10,
                                backgroundColor: "#00977c"
                            }} onPress={this.selectBVDHY.bind(this)}>
                                <ScaledImage source={require("@images/ic_phongkham1.png")} width={32} style={{ marginRight: 12 }} />
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: "600",
                                    color: '#FFF',
                                    fontStyle: "normal"
                                }}>BỆNH VIỆN ĐẠI HỌC Y HÀ NỘI</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal> */}
            </ ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation,
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(TabSearch);