import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import questionProvider from '@data-access/question-provider';
import dateUtils from 'mainam-react-native-date-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import Dimensions from 'Dimensions';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';

class ListQuestionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            finish: false,
            loading: false,
        }
    }
    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
                this.onLoad();
            });
    }
    componentDidMount() {
        this.onRefresh();
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        })
        questionProvider.search("", page, size, (s, e) => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
            });
            if (s) {
                switch (s.code) {
                    case 0:
                        var list = [];
                        var finish = false;
                        if (s.data.data.length == 0) {
                            finish = true;
                        }
                        if (page != 1) {
                            list = this.state.data;
                            list.push.apply(list, s.data.data);
                        }
                        else {
                            list = s.data.data;
                        }
                        this.setState({
                            data: [...list],
                            finish: finish
                        });
                        break;
                }
            }
        });
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState({ loadMore: true, refreshing: false, loading: true, page: this.state.page + 1 }, () => {
                this.onLoad(this.state.page)
            });
    }
    likePost(item) {
        if (!this.props.userApp.isLogin) {
            snackbar.show(constants.msg.user.please_login, "danger");
            this.props.navigation.navigate('login');
            return;
        }
        var isLiked = item.post.isLiked;
        item.post.isLiked = !isLiked;
        if (!isLiked)
            item.post.likeCount++;
        else {
            item.post.likeCount--;
            if (item.post.likeCount < 0)
                item.post.likeCount = 0;
        }
        this.setState({
            data: [...this.state.data]
        });
        questionProvider.like(!isLiked ? 1 : 0, item.post.id);
    }

    componentWillReceiveProps(nextProps) {
        try {
            let s = nextProps.navigation.getParam('reloadTime', undefined);
            if (s != this.state.reloadTime) {
                this.setState({
                    reloadTime: s
                }, () => {
                    this.onRefresh();
                })
            }
        } catch (error) {

        }
    }
    renderItemPost(item, index) {
        const icSupport = require("@images/ichotro.png");
        const DEVICE_WIDTH = Dimensions.get('window').width;
        const source = item.author && item.author.avatar ? { uri: item.author.avatar.absoluteUrl() } : icSupport;
        var image = "";
        if (item.post.images) {
            var arr = item.post.images.split(',');
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    image = arr[i].absoluteUrl();
                    break;
                }
            }
        }


        return (item.post && item.author) &&
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <View style={{ width: 60, height: 60, margin: 10, marginLeft: 0, marginBottom: 0 }}>
                        <ImageLoad
                            resizeMode="cover"
                            imageStyle={{ borderRadius: 35 }}
                            borderRadius={35}
                            customImagePlaceholderDefaultStyle={{ width: 60, height: 60, alignSelf: 'center' }}
                            placeholderSource={icSupport}
                            style={{ width: 60, height: 60, alignSelf: 'center' }}
                            resizeMode="cover"
                            loadingStyle={{ size: 'small', color: 'gray' }}
                            source={source}
                            defaultImage={() => {
                                return <ScaleImage resizeMode='cover' source={icSupport} width={60} style={{ width: 60, height: 60, alignSelf: 'center' }} />
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 10, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }} numberOfLines={2} ellipsizeMode="tail">{item.post.title}</Text>
                        <View flexDirection='row' style={{ marginTop: 5, flex: 1 }}>
                            <Text style={{ flex: 1, fontWeight: 'bold', color: 'rgb(74,74,74)' }} numberOfLines={1} ellipsizeMode='tail'>{item.post.isPrivate == 0 ? item.author.name : "Ẩn danh"}</Text>
                            <Text style={{ color: 'rgb(155,155,155)' }}>{item.post.createdDate.toDateObject('-').getPostTime()}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate("detailQuestion", { post: item }) }}>
                    <View>
                        {
                            image ? <Image source={{ uri: image }} style={{ width: DEVICE_WIDTH, height: 200, marginTop: 10 }} resizeMode='cover' /> : null
                        }
                        <View style={{ margin: 10 }}>
                            <Text style={{ lineHeight: 15, textAlign: 'justify' }} numberOfLines={3} ellipsizeMode='tail'>{item.post.content}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', color: 'rgb(0,151,124)' }}>Đọc chi tiết</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{ margin: 10 }}>
                    {/* <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={this.likePost.bind(this, item)}>
                                <ScaleImage source={require("@images/question/liked.png")} height={20} />
                                <Text style={{ marginLeft: 10, minWidth: 20 }}>{item.post.likeCount}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                                <ScaleImage source={require("@images/question/comment.png")} height={20} />
                                <Text style={{ marginLeft: 10 }}>{item.post.commentCount}</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                </View>
                <View style={{ marginTop: 10, marginBottom: 10, height: 2, flex: 1, backgroundColor: '#cacaca' }} />
            </View>
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Hỏi đáp" showFullScreen={true}>
                <View style={{ height: 50, flexDirection: "row" }}>
                    <TouchableOpacity style={{ flex: 1 }}>
                        <Text>Đã trả lời</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }}>
                        <Text>Câu hỏi khác</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    onRefresh={this.onRefresh.bind(this)}
                    refreshing={this.state.refreshing}
                    onEndReached={this.onLoadMore.bind(this)}
                    onEndReachedThreshold={1}
                    style={{ flex: 1, marginTop: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.data}
                    ListHeaderComponent={() => !this.state.refreshing && (!this.state.data || this.state.data.length == 0) ?
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ fontStyle: 'italic' }}>Hiện tại chưa có thông tin</Text>
                        </View> : null
                    }
                    ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                    renderItem={({ item, index }) => {
                        return this.renderItemPost(item, index)
                    }}
                />
                {
                    this.state.loadMore ?
                        <View style={{ alignItems: 'center', padding: 10, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                            <ActivityIndicator
                                size={'small'}
                                color={'gray'}
                            />
                        </View> : null
                }
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