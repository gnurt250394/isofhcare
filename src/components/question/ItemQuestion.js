import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import dateUtils from 'mainam-react-native-date-utils';
import { connect } from 'react-redux';
class ItemQuestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return this.props.item && this.props.item.post ?
            <TouchableOpacity key={this.props.index}>
                <Text >{this.props.item.post.content}</Text>
                <View style={{ alignContent: 'flex-end', flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        {this.props.item.specialist &&
                            <Text style={{ padding: 5 }}>
                                Chuyên khoa: <Text>{this.props.item.specialist.name}</Text>
                            </Text>
                        }
                        {
                            this.props.item.post.isAnswered == 0 ?
                                <Text>Trạng thái: <Text>{this.props.item.post.reject ? "Đã bị từ chối" : "Chưa trả lời"}</Text></Text> : null
                        }
                    </View>
                    <Text style={{ padding: 5 }}>{this.props.item.post.createdDate.toDateObject("-").getPostTime()}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: '#cac', marginTop: 10, marginBottom: 10 }}></View>
            </TouchableOpacity> : null
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ItemQuestion);