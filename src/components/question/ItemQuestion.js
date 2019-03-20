import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import dateUtils from 'mainam-react-native-date-utils';
import { connect } from 'react-redux';
import { Card } from 'native-base';
import StarRating from 'react-native-star-rating';
class ItemQuestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    getTime(createdDate) {
        let date = createdDate.toDateObject('-');
        let hour = (new Date() - date) / 1000 / 60 / 60;
        if (hour > 24)
            return date.format("dd/MM/yyyy");
        else {
            if (hour < 1)
                return date.getPostTime();
            return Math.round(hour) + " giờ trước";
        }
    }
    render() {
        let { item } = this.props;
        return this.props.item && this.props.item.post ?
            <View style={{ margin: 20, marginTop: 0 }}>
                <Card style={{ padding: 20, borderRadius: 6 }}>
                    <TouchableOpacity key={this.props.index} onPress={() => this.props.navigation.navigate("detailQuestion", { post: this.props.item })}>
                        <View style={{ flexDirection: 'row' }} >
                            <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: "#000" }}>

                            </View>
                            <View style={{ flex: 1, marginLeft: 12, marginTop: 5 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.author.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, fontSize: 15, color: '#00000048' }}>{this.getTime(item.post.createdDate)}</Text>
                                    <StarRating
                                        disabled={true}
                                        starSize={20}
                                        maxStars={5}
                                        rating={item.post.review}
                                        starStyle={{ margin: 0 }}
                                        fullStarColor={"#fbbd04"}
                                        emptyStarColor={"#fbbd04"}
                                    />
                                </View>
                            </View>
                        </View>
                        <Text numberOfLines={3} ellipsizeMode='tail' style={{ fontSize: 16, color: '#00000080', marginTop: 16 }} >{this.props.item.post.content}</Text>
                        <View style={{ height: 2, backgroundColor: '#00000011', marginTop: 21, marginBottom: 9 }} />
                        <View style={{ alignContent: 'flex-end', flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                {
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1 }}>
                                            {
                                                this.props.item.specialist &&
                                                <Text style={{ padding: 5, color: 'rgb(155,155,155)' }}>
                                                    {this.props.item.specialist.name}
                                                </Text>
                                            }
                                        </View>
                                        <View>
                                            <Text style={{ padding: 5, color: 'rgb(0,141,111)', fontWeight: 'bold' }}>
                                                {this.props.item.post.commentCount} trả lời
                                                </Text>
                                        </View>
                                    </View>
                                }
                                {/* {
                                    this.props.item.post.isAnswered == 0 ?
                                        <Text>Trạng thái: <Text>{this.props.item.post.reject ? "Đã bị từ chối" : "Chưa trả lời"}</Text></Text> : null
                                } */}
                            </View>
                        </View>
                    </TouchableOpacity>
                </Card>
            </View > : null
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ItemQuestion);