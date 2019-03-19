import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, FlatList, Image, ScrollView, TextInput, KeyboardAvoidingView, Keyboard, StyleSheet } from 'react-native';
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

const disease = [{
    value: 1,
    text: "Tim mạch"
}, {
    value: 2,
    text: "Mỡ máu"
}, {
    value: 4,
    text: "Huyết áp"
}, {
    value: 8,
    text: "HIV"
}, {
    value: 16,
    text: "Hô hấp"
}, {
    value: 32,
    text: "Dạ dày"
}, {
    value: 64,
    text: "Xương khớp"
}, {
    value: 128,
    text: "Thiếu chất"
}]
class DetailQuestionScreen extends Component {
    constructor(props) {
        super(props);
        const post = this.props.navigation.getParam("post", null);
        this.state = {
            post
        }
    }
    renderImages(post) {
        var image = post.images;
        if (image) {
            var images = image.split(",");
            return (<View><Text style={[styles.moreInfo, { marginTop: 20 }]}>Hình ảnh:</Text>
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
        let { post } = this.state;
        return (
            <ActivityPanel style={{ flex: 1 }} title="Tư vấn online" showFullScreen={true} isLoading={this.state.isLoading}>
                <ScrollView ref={(ref) => { this.scrollView = ref }} style={{ padding: 20 }} >
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <View style={{ flex: 1 }} ><Text style={{ fontSize: 18, fontWeight: 'bold' }}>{post.author ? post.author.name : ""}</Text></View>
                        <View><Text style={{ color: '#00000038' }}>{(() => {
                            let date = post.post.createdDate.toDateObject('-');
                            let hour = (new Date() - date) / 1000 / 60 / 60;
                            if (hour > 24)
                                return date.format("dd/MM/yyyy");
                            else {
                                if (hour < 1)
                                    return date.getPostTime();
                                return Math.round(hour) + " giờ trước";
                            }
                        }).call(this)}</Text></View>
                    </View>
                    <Text style={{ color: '#00000064', marginTop: 7 }}>
                        {this.state.post.post.content}
                    </Text>
                    <View style={{ backgroundColor: 'rgb(231,241,239)', borderRadius: 6, marginTop: 26, paddingTop: 13, paddingBottom: 13, paddingLeft: 20, paddingRight: 20 }}>
                        <TouchableOpacity onPress={() => { this.setState({ showMore: !this.state.showMore }) }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'rgb(0,141,111)', fontWeight: 'bold', fontSize: 16, flex: 1 }}>Thông tin bổ sung</Text>
                            <ScaleImage width={12} source={this.state.showMore ? require("@images/new/down.png") : require("@images/new/up.png")} />
                        </TouchableOpacity>
                        {
                            this.state.showMore &&
                            <View style={{ marginTop: 15 }}>
                                {this.state.post.specialist &&
                                    <Text style={styles.moreInfo}>
                                        Chuyên khoa: {this.state.post.specialist.name}
                                    </Text>
                                }
                                {this.state.post.post.age ?
                                    <Text style={styles.moreInfo}>
                                        Tuổi: {this.state.post.post.age}
                                    </Text> : null
                                }
                                <Text style={styles.moreInfo}>
                                    Giới tính: {this.state.post.post.gender == 1 ? "Nam" : "Nữ"}
                                </Text>
                                {
                                    this.state.post.post.diseaseHistory != 0 ?
                                        <Text style={[styles.moreInfo, { lineHeight: 25 }]}>
                                            Tiền sử bệnh: {disease.filter(x => (x.value & this.state.post.post.diseaseHistory) == x.value).map((item, index) => { return item.text }).join(", ")}
                                        </Text> : null
                                }
                                {
                                    this.state.post.post.otherContent &&
                                    <View>
                                        <Text style={styles.moreInfo}>Thông tin khác:</Text>
                                        <Text style={{ fontSize: 16, marginTop: 6 }}>
                                            {this.state.post.post.otherContent}
                                        </Text>
                                    </View>
                                }
                                {
                                    this.renderImages(this.state.post.post)
                                }
                            </View>
                        }
                    </View>
                    <View style={{ marginTop: 25 }}>
                        {
                            this.state.post.post.isAnswered == 0 ?
                                <Text style={{ fontSize: 15 }}>Trạng thái: <Text>{this.state.post.post.reject ? "Đã bị từ chối" : "Chưa trả lời"}</Text></Text> : null
                        }
                        {
                            this.state.post.post.reject ?
                                <View style={{ backgroundColor: 'rgba(106,1,54,0.11)', padding: 17, marginTop: 13 }}>
                                    <Text style={{ fontWeight: 'bold', color: 'rgb(106,1,54)' }}>Lý do từ chối: {this.state.post.post.reject}</Text>
                                </View> : null
                        }
                    </View>


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


const styles = StyleSheet.create({
    moreInfo:
    {
        color: '#00000080', fontSize: 16, fontWeight: '500', marginTop: 7
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(DetailQuestionScreen);