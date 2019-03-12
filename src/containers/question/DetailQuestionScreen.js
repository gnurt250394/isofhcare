import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, FlatList, Image, ScrollView, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import questionProvider from '@data-access/question-provider';
import commentProvider from '@data-access/comment-provider';
import dateUtils from 'mainam-react-native-date-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import Dimensions from 'Dimensions';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import Slide from '@components/slide/Slide';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';

class DetailQuestionScreen extends Component {
    constructor(props) {
        super(props);
        const post = this.props.navigation.getParam("post", null);
        // alert(JSON.stringify(post));
        // if (post == null)
        //     this.props.navigation.pop();
        // console.log(post);
        this.state = {
            post
            //     isPrivate: post ? post.post.isPrivate : 0,
            //     data: [],
            //     refreshing: false,
            //     size: 100,
            //     page: 1,
            //     finish: false,
            //     loading: false,
        }
    }
    // onRefresh() {
    //     if (!this.state.loading)
    //         this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
    //             this.onLoad();
    //         });
    // }
    // componentDidMount() {
    //     this.onRefresh();
    // }
    // onLoad() {
    //     const { page, size } = this.state;
    //     this.setState({
    //         loading: true,
    //         refreshing: page == 1,
    //         loadMore: page != 1
    //     })
    //     commentProvider.search(this.state.post.post.id, page, size, (s, e) => {
    //         this.setState({
    //             loading: false,
    //             refreshing: false,
    //             loadMore: false
    //         });
    //         if (s) {
    //             switch (s.code) {
    //                 case 0:
    //                     var list = [];
    //                     var finish = false;
    //                     if (s.data.data.length == 0) {
    //                         finish = true;
    //                     }
    //                     if (page != 1) {
    //                         list = this.state.data;
    //                         list.push.apply(list, s.data.data);
    //                     }
    //                     else {
    //                         list = s.data.data;
    //                     }
    //                     this.setState({
    //                         data: [...list],
    //                         finish: finish
    //                     });
    //                     break;
    //             }
    //         }
    //     });
    // }
    // onLoadMore() {
    //     if (!this.state.finish && !this.state.loading)
    //         this.setState({ loadMore: true, refreshing: false, loading: true, page: this.state.page + 1 }, () => {
    //             this.onLoad(this.state.page)
    //         });
    // }
    // hideAuthor(author) {
    //     if (author && this.state.post && this.state.post.author) {
    //         if (this.state.post.post.isPrivate == 0)
    //             return false;
    //         return this.state.post.author.id == author.id;
    //     }
    //     return false;
    // }
    // likePost(item) {
    //     if (!this.props.userApp.isLogin) {
    //         snackbar.show(constants.msg.user.please_login, "danger");
    //         this.props.navigation.navigate('login');
    //         return;
    //     }
    //     var isLiked = item.post.isLiked;
    //     item.post.isLiked = !isLiked;
    //     if (!isLiked)
    //         item.post.likeCount++;
    //     else {
    //         item.post.likeCount--;
    //         if (item.post.likeCount < 0)
    //             item.post.likeCount = 0;
    //     }
    //     this.setState({
    //         data: [...this.state.data]
    //     });
    //     questionProvider.like(!isLiked ? 1 : 0, item.post.id);
    // }
    // selectImage() {
    //     if (this.imagePicker) {
    //         this.imagePicker.open(false, 200, 200, image => {
    //             setTimeout(() => {
    //                 Keyboard.dismiss();
    //             }, 500);

    //             this.setState({ isLoading: true }, () => {
    //                 imageProvider.upload(image.path, (s, e) => {
    //                     if (s.success && s.data.code == 0 && s.data.data && s.data.data.images && s.data.data.images.length > 0) {
    //                         var image = s.data.data.images[0];
    //                         this.send(this.state.post.post.id, "", image.image);
    //                     }
    //                     else {
    //                         snackbar.show("Gửi upload ảnh không thành công", "danger");
    //                         this.setState({ isLoading: false });
    //                     }
    //                 });
    //             })
    //         });
    //     }
    // }
    // dataCommentId = []
    // pushToListComment(item, index) {
    //     var data = this.state.data;
    //     if (this.dataCommentId.indexOf(item.comment.id) == -1) {
    //         this.dataCommentId.push(item.comment.id);
    //         if (index && index >= 0 && index < data.lenght) {
    //             data.splice(index, 0, item);

    //         } else {
    //             data.push(item);

    //         }
    //     }
    //     return data;
    // }
    // send(postId, content, image) {
    //     commentProvider.create(postId, content, image, (s, e) => {
    //         this.setState({ isLoading: false });
    //         if (s && s.code == 0) {
    //             var data = this.pushToListComment(s.data);
    //             this.setState({ data: [...data] })
    //             if (content)
    //                 this.setState({ commentText: "" });
    //             this.setTimeout(() => {
    //                 this.scrollView.scrollToEnd();
    //             }, 1000);
    //             return;
    //         }
    //         else {
    //             snackbar.show("Gửi bình luận không thành công", "danger");
    //             return;
    //         }
    //     });
    // }
    // sendComment() {
    //     if (!this.state.commentText || !this.state.commentText.trim()) {
    //         snackbar.show("Vui lòng nhập nội dung bình luận", "danger");
    //         return;
    //     }
    //     this.setState({ isLoading: true }, () => {
    //         this.send(this.state.post.post.id, this.state.commentText, "");
    //     })
    // }
    // renderItemPager(list, item, index) {
    //     return <TouchableOpacity onPress={this.photoViewer.bind(this, list, index)} style={{
    //         flex: 1,
    //         elevation: 5,
    //         backgroundColor: 'white',
    //         marginBottom: 10,
    //         borderColor: 'rgb(204, 204, 204)',
    //         flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    //     }} shadowColor='#000000' shadowOpacity={0.2} shadowOffset={{}}>
    //         <ImageLoad
    //             resizeMode="cover"
    //             source={{ uri: item ? item.absoluteUrl() : "undefined" }} style={{ width: Dimensions.get('window').width, height: 200 }} />
    //     </TouchableOpacity>
    // }
    // renderItemCommentPager(list, item, index) {
    //     return <TouchableOpacity onPress={this.photoViewer.bind(this, list, index)} style={{
    //         flex: 1,
    //         elevation: 5,
    //         backgroundColor: 'white',
    //         marginBottom: 10,
    //         borderColor: 'rgb(204, 204, 204)',
    //         flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    //     }}
    //     // shadowColor='#000000' shadowOpacity={0.2} shadowOffset={{}}
    //     >
    //         <ImageLoad
    //             resizeMode="contain"
    //             source={{ uri: item ? item.absoluteUrl() : "undefined" }} style={{ width: 150, height: 150 }} />
    //     </TouchableOpacity>
    // }
    // componentWillMount() {
    //     this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    //     this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    // }

    // componentWillUnmount() {
    //     this.keyboardDidShowListener.remove();
    //     this.keyboardDidHideListener.remove();
    // }

    //When the keyboard appears, this gets the ScrollView to move the end back "up" so the last message is visible with the keyboard up
    //Without this, whatever message is the keyboard's height from the bottom will look like the last message.
    // keyboardDidShow(e) {
    //     this.scrollView.scrollToEnd();
    // }
    // keyboardDidHide(e) {
    //     this.scrollView.scrollToEnd();
    // }


    // renderItemPost(item) {
    //     const icSupport = require("@images/ichotro.png");
    //     const DEVICE_WIDTH = Dimensions.get('window').width;
    //     const source = item.author && item.author.avatar ? { uri: item.author.avatar.absoluteUrl() } : icSupport;
    //     var arr = [];
    //     if (item.post.images) {
    //         var arr = item.post.images.split(',');
    //     }

    //     return (item.post && item.author) &&
    //         <View style={{ flexDirection: 'column' }}>
    //             <View style={{ flexDirection: 'row', margin: 10 }}>
    //                 <View style={{ width: 60, height: 60, margin: 10, marginLeft: 0, marginBottom: 0 }}>
    //                     <ImageLoad
    //                         resizeMode="cover"
    //                         imageStyle={{ borderRadius: 35 }}
    //                         borderRadius={35}
    //                         customImagePlaceholderDefaultStyle={{ width: 60, height: 60, alignSelf: 'center' }}
    //                         placeholderSource={icSupport}
    //                         style={{ width: 60, height: 60, alignSelf: 'center' }}
    //                         resizeMode="cover"
    //                         loadingStyle={{ size: 'small', color: 'gray' }}
    //                         source={source}
    //                         defaultImage={() => {
    //                             return <ScaleImage resizeMode='cover' source={icSupport} width={60} style={{ width: 60, height: 60, alignSelf: 'center' }} />
    //                         }}
    //                     />
    //                 </View>
    //                 <View style={{ marginTop: 20, flex: 1 }}>
    //                     <Text style={{ fontWeight: 'bold', color: 'rgb(74,74,74)' }} numberOfLines={1} ellipsizeMode='tail'>
    //                         {item.post.isPrivate == 0 ? item.author.name : "Ẩn danh"}
    //                     </Text>
    //                     <Text style={{ color: 'rgb(155,155,155)', marginTop: 10 }}>{item.post.createdDate.toDateObject('-').getPostTime()}</Text>
    //                 </View>
    //             </View>
    //             <View style={{ margin: 10 }}>
    //                 <Text style={{ fontWeight: 'bold', color: 'rgb(0,151,124)', fontSize: 16, textAlign: 'justify' }} numberOfLines={2} ellipsizeMode="tail">{item.post.title}</Text>

    //                 <Text style={{ lineHeight: 15, textAlign: 'justify', marginTop: 10 }}>
    //                     {item.post.content}
    //                 </Text>
    //             </View>
    //             {
    //                 arr.length > 0 ?
    //                     <Slide autoPlay={true} inteval={3000} dataArray={arr}
    //                         renderItemPager={(image, index) => {
    //                             var images = item.post.images.split(',');
    //                             return this.renderItemPager(images, image, index);
    //                         }} style={{ height: 200, marginTop: 10 }} />
    //                     : null
    //             }

    //             <View style={{ margin: 10 }}>
    //                 <View style={{ flexDirection: 'row', marginTop: 20 }}>
    //                     <View style={{ flexDirection: 'row', flex: 1 }}>
    //                         <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={this.likePost.bind(this, item)}>
    //                             <ScaleImage source={require("@images/question/liked.png")} height={20} />
    //                             <Text style={{ marginLeft: 10, minWidth: 20 }}>{item.post.likeCount}</Text>
    //                         </TouchableOpacity>
    //                         <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
    //                             <ScaleImage source={require("@images/question/comment.png")} height={20} />
    //                             <Text style={{ marginLeft: 10 }}>{item.post.commentCount}</Text>
    //                         </TouchableOpacity>
    //                     </View>
    //                     {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
    //                         <ScaleImage source={require("@images/question/share.png")} height={20} />
    //                         <Text style={{ marginLeft: 10 }}>Chia sẻ</Text>
    //                     </TouchableOpacity> */}
    //                 </View>
    //             </View>
    //         </View>
    // }
    // renderItemComment(item, index) {
    //     const icSupport = require("@images/ichotro.png");
    //     const DEVICE_WIDTH = Dimensions.get('window').width;
    //     const source = item.author && item.author.avatar ? { uri: item.author.avatar.absoluteUrl() } : icSupport;
    //     var arr = [];
    //     if (item.comment.images) {
    //         var arr = item.comment.images.split(',');
    //     }

    //     return (item.comment && item.author) &&
    //         <View style={{ flexDirection: 'column' }} key={index}>
    //             <View style={{ flexDirection: 'row', margin: 10, marginTop: 0 }}>
    //                 <View style={{ width: 60, height: 60, marginRight: 10 }}>
    //                     <ImageLoad
    //                         resizeMode="cover"
    //                         imageStyle={{ borderRadius: 35 }}
    //                         borderRadius={35}
    //                         customImagePlaceholderDefaultStyle={{ width: 60, height: 60, alignSelf: 'center' }}
    //                         placeholderSource={icSupport}
    //                         style={{ width: 60, height: 60, alignSelf: 'center' }}
    //                         resizeMode="cover"
    //                         loadingStyle={{ size: 'small', color: 'gray' }}
    //                         source={source}
    //                         defaultImage={() => {
    //                             return <ScaleImage resizeMode='cover' source={icSupport} width={60} style={{ width: 60, height: 60, alignSelf: 'center' }} />
    //                         }}
    //                     />
    //                 </View>
    //                 <View style={{ marginTop: 10, flex: 1 }}>
    //                     <View style={{ flexDirection: 'row' }}>
    //                         <Text style={{ fontWeight: 'bold', color: 'rgb(0,151,124)' }} numberOfLines={1} ellipsizeMode='tail'>{
    //                             this.hideAuthor(item.author) ? "Ẩn danh" : item.author.name}</Text>
    //                         {
    //                             (item.author && item.author.role == 2 && item.author.verify == 1) &&
    //                             <ScaleImage source={require("@images/question/verified.png")} height={15} style={{ marginLeft: 5 }} />
    //                         }
    //                     </View>
    //                     <Text style={{ color: 'rgb(155,155,155)', marginTop: 10 }}>{item.comment.createdDate.toDateObject('-').getPostTime()}</Text>
    //                     {
    //                         arr.length > 0 ?
    //                             <Slide autoPlay={true} inteval={3000} dataArray={arr} renderItemPager={(image, index) => {
    //                                 var images = item.comment.images.split(',');
    //                                 return this.renderItemCommentPager(images, image, index);
    //                             }} style={{ height: 170, width: 170, margin: 10 }} />
    //                             : null
    //                     }
    //                     {item.comment.content &&
    //                         <View style={{ margin: 10 }}>
    //                             <Text style={{ lineHeight: 15, textAlign: 'justify', marginTop: 10 }}>
    //                                 {item.comment.content}
    //                             </Text>
    //                         </View>
    //                     }
    //                     {/* <View style={{ height: 0.5, backgroundColor: "#cacaca" }} /> */}
    //                 </View>
    //             </View>
    //         </View>
    // }
    // inputTextSizeChange() {
    //     setTimeout(function () {
    //         this.scrollView.scrollToEnd({ animated: false });
    //     }.bind(this))
    // }
    // photoViewer(list, index) {
    //     try {
    //         if (!list || list.length == 0) {
    //             snackbar.show("Không có ảnh nào");
    //             return;
    //         }
    //         var list2 = [];
    //         list.forEach(element => {
    //             list2.push(element.absoluteUrl())
    //         });
    //         this.props.navigation.navigate("photoViewer", { urls: list2, index });

    //     } catch (error) {
    //     }
    // }
    renderImages(post) {
        var image = post.images;
        if (image) {
            var images = image.split(",");
            return (<View><Text style={{ fontWeight: 'bold' }}>Ảnh</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                    {
                        images.map((item, index) => <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate("photoViewer", {
                                urls: images.map(item => {
                                    return item.absoluteUrl()
                                }), index
                            });
                        }} key={index} style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1 }}>
                            <Image source={{ uri: item.absoluteUrl() }} resizeMode="cover" style={{ width: 100, height: 100, backgroundColor: '#000' }} />
                        </TouchableOpacity>)
                    }
                </View>
            </View>);
        } else {
            return null;
        }
    }
    render() {
        // const post = this.props.navigation.getParam("post", null);
        return (
            <ActivityPanel style={{ flex: 1 }} title="Tư vấn online" showFullScreen={true} isLoading={this.state.isLoading}>
                <ScrollView ref={(ref) => { this.scrollView = ref }} >
                    <Text>
                        {this.state.post.post.content}
                    </Text>
                    {this.state.post.specialist &&
                        <Text>
                            Chuyên khoa: <Text> {this.state.post.specialist.name}</Text>
                        </Text>
                    }
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            {
                                this.state.post.post.age ?
                                    <Text>Tuổi: <Text>{this.state.post.post.age}</Text></Text>
                                    : null
                            }
                        </View>
                        <View style={{ flex: 1 }}>
                            {
                                <Text>Giới tính: <Text>{this.state.post.post.gender == 1 ? "Nam" : "Nữ"}</Text></Text>
                            }
                        </View>
                    </View>
                    <Text style={{ fontWeight: 'bold' }}>Tiền sử bệnh</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1 }}>Tim mạch</Text>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    {
                                        (this.state.post.post.diseaseHistory & 1) == 1 ?
                                            <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                            <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                    }
                                </View>

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1 }}>huyết áp</Text>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    {
                                        (this.state.post.post.diseaseHistory & 4) == 4 ?
                                            <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                            <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                    }
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1 }}>Hô hấp</Text>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    {
                                        (this.state.post.post.diseaseHistory & 16) == 16 ?
                                            <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                            <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                    }
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1 }}>Xương khớp</Text>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    {
                                        (this.state.post.post.diseaseHistory & 64) == 64 ?
                                            <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                            <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1 }}>Mỡ máu</Text>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    {
                                        (this.state.post.post.diseaseHistory & 2) == 2 ?
                                            <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                            <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                    }
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1 }}>HIV</Text>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    {
                                        (this.state.post.post.diseaseHistory & 8) == 8 ?
                                            <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                            <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                    }
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1 }}>Dạ dày</Text>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    {
                                        (this.state.post.post.diseaseHistory & 32) == 32 ?
                                            <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                            <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                    }
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1 }}>Thiếu chất</Text>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    {
                                        (this.state.post.post.diseaseHistory & 128) == 128 ?
                                            <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                            <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                    {
                        this.state.post.post.otherContent &&
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>Thông tin khác</Text>
                            <Text style={{}}>{this.state.post.post.otherContent}</Text>
                        </View>
                    }
                    {
                        this.renderImages(this.state.post.post)
                    }
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            {
                                this.state.post.post.isAnswered == 0 ?
                                    <Text>Trạng thái: <Text>{this.state.post.post.reject ? "Đã bị từ chối" : "Chưa trả lời"}</Text></Text> : null
                            }
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ padding: 5, textAlign: 'right' }}>{this.state.post.post.createdDate.toDateObject("-").getPostTime()}</Text>
                        </View>
                    </View>
                    {
                        this.state.post.post.reject ?
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>Lý do từ chối</Text>
                                <Text style={{ color: 'red' }}>{this.state.post.post.reject}</Text>
                            </View> : null
                    }


                    {/* {
                        this.renderItemPost(post)
                    } */}
                    {/* <View style={{ height: 2, backgroundColor: "#cacaca" }} /> */}
                    {/* {
                        (this.state.data && this.state.data.length > 0) &&
                        <View style={{ marginTop: 10 }}>
                            {
                                this.state.data.map((item, index) => {
                                    return this.renderItemComment(item, index);
                                })
                            }</View>
                    } */}
                    {/* {
                        (!this.state.data || this.state.data.length == 0) &&
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ fontStyle: 'italic', paddingBottom: 30 }}>Hãy là người đầu tiên trả lời câu hỏi này</Text>
                        </View>
                    } */}
                    {/* <FlatList
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
                            return this.renderItemComment(item, index);
                        }}
                    /> */}
                    {/* {
                        this.state.loadMore ?
                            <View style={{ alignItems: 'center', padding: 10, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                                <ActivityIndicator
                                    size={'small'}
                                    color={'gray'}
                                />
                            </View> : null
                    } */}
                </ScrollView>
                {/* <View style={{ flexDirection: 'column' }}>
                    <View style={{ height: 2, backgroundColor: '#cacaca' }} />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ padding: 15 }} onPress={this.selectImage.bind(this)}>
                            <ScaleImage source={require("@images/question/camera.png")} width={30} />
                        </TouchableOpacity>
                        <TextInput
                            onContentSizeChange={this.inputTextSizeChange.bind(this)}
                            style={{ flex: 1, maxHeight: 100, padding: 10, paddingTop: 20 }} underlineColorAndroid='transparent' multiline={true} placeholder="Nhập nội dung thảo luận" value={this.state.commentText} onChangeText={x => this.setState({ commentText: x })} />
                        <TouchableOpacity style={{ padding: 17 }} onPress={this.sendComment.bind(this)}>
                            <Text style={{ color: 'rgb(0,155,121)', fontWeight: '900', fontSize: 16 }}>GỬI</Text>
                        </TouchableOpacity>
                    </View>

                </View> */}
                <KeyboardSpacer />
                <ImagePicker ref={ref => this.imagePicker = ref} />
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(DetailQuestionScreen);