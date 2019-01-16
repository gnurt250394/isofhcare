import React, { Component, PropTypes } from 'react';
import { TouchableOpacity } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';

class ListQuestionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            refreshing_list_most: false
        }
    }

    onRefreshListMost() {

    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Hỏi đáp" showFullScreen={true}>
                <FlatList
                    onRefresh={this.onRefreshListMost.bind(this)}
                    refreshing={this.state.refreshing_list_most}
                    style={{ flex: 1, marginTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.data}
                    ListHeaderComponent={() => !this.state.refreshing_list_most && (!this.state.data || this.state.data.length == 0) ?
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ fontStyle: 'italic' }}>Hiện tại chưa có thông tin</Text>
                        </View> : null
                    }
                    ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                    renderItem={({ item, index }) =>
                        <View style={{ flexDirection: 'column', padding: 10 }}>
                            <View flexDirection='row'>
                                <View style={{ width: 80, height: 80 }}>
                                    <ScaleImage source={require("@images/btn_add_question.png")} width={80} height={80} />
                                </View>
                                <View style={{ marginTop: 10, flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold' }} numberOfLines={2} ellipsizeMode="tail">Tư vấn cơ xương khớpTư vấn cơ xương khớpTư vấn cơ xương khớpTư vấn cơ xương khớpTư vấn cơ xương khớp</Text>
                                    <View flexDirection='row' style={{ marginTop: 5 }}>
                                        <Text style={{ flex: 1, fontWeight: 'bold', color: '#aaa' }} numberOfLines={1} ellipsizeMode='tail'>Mai Ngọc Nam</Text>
                                        <Text style={{ color: '#aaa' }}>28/07/1991</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={{ lineHeight: 15, textAlign: 'justify' }} numberOfLines={3} ellipsizeMode='tail'>
                                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate("detailQuestion") }}>
                                    <Text>Đọc chi tiết</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <ScaleImage source={require("@images/btn_add_question.png")} height={30} />
                                        <Text>0</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                                        <ScaleImage source={require("@images/btn_add_question.png")} height={30} />
                                        <Text>0</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity >
                                    <ScaleImage source={require("@images/btn_add_question.png")} height={30} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 20, height: 1, flex: 1, backgroundColor: '#cacaca' }} />
                        </View>
                    }
                />
                <TouchableOpacity style={{ position: 'absolute', bottom: 11, right: 11 }} onPress={() => { this.props.navigation.navigate("createQuestion") }}>
                    <ScaleImage source={require("@images/btn_add_question.png")} width={81} />
                </TouchableOpacity>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ListQuestionScreen);