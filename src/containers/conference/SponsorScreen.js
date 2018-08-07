import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import Dimensions from 'Dimensions';
const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;
const ITEM_HEIGHT = (DEVICE_HEIGHT - 100) / 5;
const LOGO_HEIGHT = (DEVICE_HEIGHT - 100) / 5 - 54;
import clientUtils from '@utils/client-utils';
import convertUtils from 'mainam-react-native-convert-utils';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';

class SponsorScreen extends Component {
    constructor(props) {
        super(props)
        var sponsors = [];
        if (!this.props.conference || !this.props.conference.conference || !this.props.conference.conference.sponsors)
            sponsors = [];
        else {
            var sponsors = convertUtils.toJsonArray(this.props.conference.conference.sponsors, []);
        }
        if (!sponsors.length)
            sponsors = [];
        this.state = {
            sponsors: sponsors
        }

    }


    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Nhà tài trợ" showFullScreen={true}>
                <FlatList
                    onEndReachedThreshold={1}
                    ref={ref => this.flatList = ref}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.sponsors}
                    ListHeaderComponent={() => !this.state.sponsors || this.state.sponsors.length == 0 ?
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ fontStyle: 'italic' }}>Danh sách nhà tài trợ hiện chưa được cập nhật</Text>
                        </View> : null
                    }
                    ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity style={{ height: ITEM_HEIGHT, backgroundColor: index % 2 == 0 ? "rgb(235,235,235)" : "white", justifyContent: 'center', alignItems: 'center' }}>
                            <ScaleImage height={LOGO_HEIGHT} width={DEVICE_WIDTH} uri={item.logo.absoluteUrl()} />
                        </TouchableOpacity>
                    }
                />
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        conference: state.conference
    };
}
export default connect(mapStateToProps)(SponsorScreen);