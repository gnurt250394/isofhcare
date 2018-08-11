import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import Dimensions from 'Dimensions';
const DEVICE_WIDTH = Dimensions.get('window').width;

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
            <ActivityPanel style={{ flex: 1 }} title="TRA CỨU" icBack={require("@images/icmenu.png")} backButtonClick={() => { this.showDrawer() }} >
                <ScrollView style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10 }}>
                    <Text style={{ color: "rgb(155,155,155)", fontSize: 14, textAlign: 'center', lineHeight: 20 }}>ISofh Care có hệ thống dữ liệu lớn từ các chuyên gia hàng đầu và thực sự đáng tin cậy cho cộng đồng.</Text>
                    <View style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }}>
                        {
                            this.state.features.map((item, position) => {
                                return (<TouchableOpacity key={position} style={{ padding: 5 }} onPress={() => { this.onClick(position) }}>
                                    <ScaledImage source={item.icon} width={itemWidth} />
                                </TouchableOpacity>);
                            })
                        }
                    </View>
                    {/* <FlatList
                        numColumns={3}
                        style={{ flex: 1, paddingBottom: 100 }}
                        ref={ref => this.flatList = ref}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.listFun}
                        ListHeaderComponent={this.renderHeader.bind(this)}
                        ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                        renderItem={({ item, index }) =>
                            <View style={{ flex: 1 }}>
                                {
                                    item.icon ?
                                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', padding: 5 }} onPress={() => { item.action() }}>
                                            <ScaleImage source={item.icon} width={67} />
                                            <Text style={{ marginTop: 8, fontWeight: '800', fontSize: 13, textAlign: 'center' }}>{item.title}</Text>
                                        </TouchableOpacity> :
                                        <View style={{ flex: 1 }} />
                                }
                            </View>
                        }
                    /> */}
                </ScrollView>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(TabSearch);