import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ActivityIndicator ,Dimensions} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import questionProvider from '@data-access/question-provider';
import dateUtils from 'mainam-react-native-date-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import ItemQuestion from '@components/question/ItemQuestion';

class ListQuestion extends Component {
    constructor(props) {
        super(props)
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
        questionProvider.search(this.props.userApp.isLogin ? this.props.userApp.currentUser.id : "", page, size, this.props.isAnswered
            , 6 //createdDate des
        ).then(s => {
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
        }).catch(e => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
            });
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
        const icSupport = require("@images/user.png");
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
            <ItemQuestion item={item} index={index} />
    }

    render() {
        return <View style={{ flex: 1 }} >
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
        </View >
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps, null, null, { forwardRef: true })(ListQuestion);