import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import Dimensions from 'Dimensions';
const DEVICE_WIDTH = Dimensions.get('window').width;
import * as Animatable from 'react-native-animatable';

class TabSearch extends Component {
    constructor(props) {
        super(props)
        var features = [
            //     {
            //     icon: require("@images/search/icchuandoantrieuchung.png"),
            //     id: 3
            // }, {
            //     icon: require("@images/search/ictimbacsi.png"),
            //     id: 4
            // }, {
            //     icon: require("@images/search/icgiadichvu.png"),
            //     id: 5
            // },
            {
                icon: require("@images/timcsyt.png"),
                id: 0
            }, {
                icon: require("@images/timthuoc.png"),
                id: 1
            },
            {
                icon: require("@images/ybadientu.png"),
                id: 2
            }
        ];
        var ads = [
            //     {
            //     icon: require("@images/search/icchuandoantrieuchung.png"),
            //     id: 3
            // }, {
            //     icon: require("@images/search/ictimbacsi.png"),
            //     id: 4
            // }, {
            //     icon: require("@images/search/icgiadichvu.png"),
            //     id: 5
            // },
            // {
            //     icon: require("@images/banner/findcdyt.png"),
            //     id: 0
            // },
            {
                icon: require("@images/banner/bannerbooking.png"),
                id: 0
            },
            {
                icon: require("@images/banner/bannerquestion.png"),
                id: 0
            },
            {
                icon: require("@images/banner/findcdyt.png"),
                id: 0
            }
        ];
        this.state = {
            features,
            ads
        }
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
                navigate("createQuestion");
                break;
            case 1:
                navigate("createQuestion");
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
        let itemWidth = 370;
        if (itemWidth > width)
            return width - 10;
        return width;
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

    render() {
        const itemWidth = this.getItemWidth();
        return (
            <ActivityPanel
                style={[{ flex: 1 }, this.props.style]}
                titleStyle={{ marginRight: 60 }}
                image={require("@images/logo_home.png")}
                icBack={require("@images/icmenu.png")}
                backButtonClick={() => { this.showDrawer() }}
                showMessenger={this.props.userApp.isLogin ? true : false}
                badge={0}
                showFullScreen={true} >
                <ScrollView style={{
                    flex: 1,
                    paddingLeft: 15, paddingRight: 15, paddingTop: 0,
                    width: DEVICE_WIDTH
                }}>
                    <View style={{
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
                                        <ScaledImage source={item.icon} width={itemWidth - 30} style={{ borderRadius: 5 }} />
                                    </TouchableOpacity>
                                </Animatable.View>);
                            })
                        }
                    </View>
                    <View style={{ height: 30 }} />
                </ScrollView>
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