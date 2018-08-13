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
        var features = [{
            icon: require("@images/search/icchuandoantrieuchung.png"),
            index: 0
        }, {
            icon: require("@images/search/icchuandoanbenh.png"),
            index: 0
        }, {
            icon: require("@images/search/ictimbacsi.png"),
            index: 0
        }, {
            icon: require("@images/search/icgiadichvu.png"),
            index: 0
        }, {
            icon: require("@images/search/ictimcsyt.png"),
            index: 0
        }, {
            icon: require("@images/search/ictimthuoc.png"),
            index: 0
        },];
        this.state = {
            features
        }
    }
    onClick(index) {
        const navigate = this.props.navigation.navigate;
        switch (index) {
            case 4:
                navigate("searchFacility");
                break;
            case 5:
                navigate("searchDrug");
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
        if (width >= 320)
            return 150;
        if (width > 320)
            return 150;
        if (width > 300)
            return 140;
        if (width > 250)
            return 115;
        if (width > 170)
            return 160;
        return width - 10;
    }

    render() {
        const itemWidth = this.getItemWidth();
        return (
            <ActivityPanel style={{ flex: 1 }} title="TRA CỨU" icBack={require("@images/icmenu.png")} backButtonClick={() => { this.showDrawer() }} showFullScreen={true} >
                <ScrollView style={{
                    paddingLeft: 20, paddingRight: 20, paddingTop: 10,
                    width: DEVICE_WIDTH
                }}>
                    <Text style={{ color: "rgb(155,155,155)", fontSize: 14, textAlign: 'center', lineHeight: 20 }}>ISofH Care có hệ thống dữ liệu lớn từ các chuyên gia hàng đầu và thực sự đáng tin cậy cho cộng đồng.</Text>
                    <View style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'flex-start'
                    }}>
                        {
                            this.state.features.map((item, position) => {
                                return (<Animatable.View delay={50 * position} animation={position % 2 == 0 ? "slideInLeft" : "slideInRight"} direction="alternate">
                                    <TouchableOpacity key={position} style={{ padding: 5 }} onPress={() => { this.onClick(position) }}>
                                        <ScaledImage source={item.icon} width={itemWidth} />
                                    </TouchableOpacity>
                                </Animatable.View>);
                            })
                        }
                    </View>
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