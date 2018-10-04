import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
                navigate("ehealth");
                break;
        }
    }
    onClickItemAds(item) {
        const navigate = this.props.navigation.navigate;
        switch (item.id) {
            case 0:
                navigate("searchDisease");
                break;
            case 1:
                break;
            case 2:
                break;
        }
    }
    showDrawer() {
        if (this.props.drawer) {
            this.props.drawer.open();
        }
    }

    getItemWidth() {
        const width = DEVICE_WIDTH - 40;
        let itemWidth = 370;
        if (itemWidth > width)
            return width - 10;
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

    render() {
        const itemWidth = this.getItemWidth();
        return (
            <ActivityPanel style={[{ flex: 1 }, this.props.style]} titleStyle={{ marginRight: 60 }} title="ISOFH CARE" icBack={require("@images/icmenu.png")} backButtonClick={() => { this.showDrawer() }} showFullScreen={true} >
                <ScrollView style={{
                    flex: 1,
                    paddingLeft: 20, paddingRight: 20, paddingTop: 10,
                    width: DEVICE_WIDTH
                }}>
                    <View style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'flex-start'
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
                            fontWeight: "500", marginLeft: (DEVICE_WIDTH - itemWidth) / 2
                        }}>iSofH Care</Text>{
                            this.state.features.map((item, position) => {
                                return (<Animatable.View key={position} delay={50 * position} animation={"slideInRight"} direction="alternate">
                                    <TouchableOpacity key={position} style={{ padding: 5 }} onPress={() => { this.onClickItemAds(item) }}>
                                        <View style={{ width: itemWidth, height: 150, borderRadius: 6, backgroundColor: 'rgba(74, 144, 226, 0.44)' }} />
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
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(TabSearch);