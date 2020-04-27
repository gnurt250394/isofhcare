import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import dateUtils from 'mainam-react-native-date-utils';
import { connect } from 'react-redux';
import { Card } from 'native-base';
import StarRating from 'react-native-star-rating';
import ImageLoad from 'mainam-react-native-image-loader';
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
    onNavigateDetails =(item)=>{
        item.user && item.user.id != this.props.userApp.currentUser.id ? this.props.navigation.navigate('detailsDoctor',{
            id : item.assignee.id
        }) : this.props.navigation.navigate('detailsProfile',{
            id : item.author.id
        }) 
    }
    render() {
        let { item } = this.props;
        const source = item.author && item.author.avatar ? { uri: item.author.avatar.absoluteUrl() } : require("@images/new/user.png");
        return this.props.item && this.props.item.post ?
            <View style={{ margin: 20, marginTop: 0 }}>
                <Card style={{ padding: 20, borderRadius: 6 }}>
                    <TouchableOpacity key={this.props.index} onPress={() => this.props.navigation.navigate("detailQuestion", { post: this.props.item })}>
                        <View style={{ width: 25, height: 4, backgroundColor: item.post.status == 4 ? 'rgb(106,1,54)' : 'rgb(0,141,111)', borderRadius: 2, alignSelf: 'center', marginBottom: 27 }} />
                        <TouchableOpacity onPress = {() => this.onNavigateDetails(item)} style={{ flexDirection: 'row' }} >
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={{ borderRadius: 25, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)'  }}
                                borderRadius={25}
                                customImagePlaceholderDefaultStyle={[styles.avatar, { width: 50, height: 50 }]}
                                placeholderSource={require("@images/new/user.png")}
                                style={styles.avatar}
                                resizeMode="cover"
                                loadingStyle={{ size: 'small', color: 'gray' }}
                                source={source}
                                defaultImage={() => {
                                    return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={50} height={50} style={styles.avatar} />
                                }}
                            />
                            <View style={{ flex: 1, marginLeft: 12, marginTop: 5 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.author.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, fontSize: 15, color: '#00000048' }}>{this.getTime(item.post.createdDate)}</Text>
                                    {
                                        item.post.status == 6 &&
                                        <StarRating
                                            disabled={true}
                                            starSize={20}
                                            maxStars={5}
                                            rating={item.post.review}
                                            starStyle={{ marginLeft: 5 }}
                                            fullStarColor={"#fbbd04"}
                                            emptyStarColor={"#fbbd04"}
                                        />
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
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
                                            {
                                                item.post.status == 1 || item.post.status == 2 || item.post.status == 5 ?
                                                    <Text style={{ padding: 5, color: 'rgb(0,141,111)', fontWeight: 'bold' }}>Chờ trả lời</Text> :
                                                    item.post.status == 3 ?
                                                        <Text style={{ padding: 5, color: 'rgb(0,141,111)', fontWeight: 'bold' }}>{this.props.item.post.commentCount} trả lời</Text> :
                                                        item.post.status == 4 ?
                                                            <Text style={{ padding: 5, color: 'rgb(106,1,54)', fontWeight: 'bold' }}>Đã bị từ chối</Text> :
                                                            item.post.status ?
                                                                <Text style={{ padding: 5, color: 'rgb(0,141,111)', fontWeight: 'bold' }}>Đã hoàn thành</Text> :
                                                                null
                                            }
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


const styles = StyleSheet.create({
    avatar: {
        alignSelf: 'center',
        borderRadius: 25,
        width: 50,
        height: 50
    }
});
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ItemQuestion);