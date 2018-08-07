import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, ScrollView, Text, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import RadioButton from '@components/radio/RadioButton';

class SurveyScreen extends Component {
    constructor(props) {
        super(props)
        var listQuesion = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this.state = {
            listQuesion: listQuesion,
        }

    }


    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Survey" showFullScreen={true}>
                <FlatList
                    style={{ flex: 1, paddingTop: 28 }}
                    ref={ref => this.flatList = ref}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.listQuesion}
                    ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                    renderItem={({ item, index }) =>
                        <View style={{ paddingLeft: 28, paddingRight: 28, borderBottomWidth: 1, borderBottomColor: 'rgb(0,121,107)', marginTop: 20, paddingBottom: 22 }}>
                            <Text style={{ fontWeight: 'bold' }}>Câu hỏi {index + 1}</Text>
                            <Text style={{ color: 'rgba(0,121,107,0.8)', marginTop: 11, marginBottom: 10 }}>Đây là nội dung câu hỏi</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton width={22} style={{ padding: 2 }} checkedImage={require("@images/ic_checked.png")} uncheckImage={require("@images/ic_uncheck.png")} />
                                <Text style={{ marginTop: 5, marginLeft: 10 }}>Có</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <RadioButton width={22} style={{ padding: 2 }} checkedImage={require("@images/ic_checked.png")} uncheckImage={require("@images/ic_uncheck.png")} />
                                <Text style={{ marginTop: 5, marginLeft: 10 }}>Không</Text>
                            </View>
                        </View>
                    }
                />
                <TouchableOpacity style={{ backgroundColor: 'rgb(0,121,107)', height: 50, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', color: '#FFF', fontWeight: 'bold' }}>GỬI SURVEY</Text>
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
export default connect(mapStateToProps)(SurveyScreen);