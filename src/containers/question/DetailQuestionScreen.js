import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, FlatList, Image, ScrollView, TextInput, KeyboardAvoidingView, Keyboard, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import questionProvider from '@data-access/question-provider';
import commentProvider from '@data-access/comment-provider';
import dateUtils from 'mainam-react-native-date-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import DialogBox from 'react-native-dialogbox';
import StarRating from 'react-native-star-rating';
import Dash from 'mainam-react-native-dash-view';
import connectionUtils from '@utils/connection-utils';

const disease = [{
    value: 1,
    text: "Tim mạch"
}, {
    value: 2,
    text: "Mỡ máu"
}, {
    value: 4,
    text: "Tiểu đường"
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
            post,
            writeQuestion: false,
            confirmed: false,
            rating: false,
            dataComment: [],
            userCommentCount: 0
        }
    }
    componentDidMount() {
        questionProvider.detail(this.state.post.post.id).then(s => {
            if (s.code == 0) {
                let post = s.data;
                let doctorComment;
                try {
                    doctorComment = JSON.parse(post.post.doctorComment);
                    if (!doctorComment.user)
                        doctorComment = null;
                } catch (error) {

                }

                this.setState({ post: s.data, showMore: post.post.status == 1 || post.post.status == 2 || post.post.status == 4 || post.post.status == 5, diagnose: post.post.diagnose, userCommentCount: post.post.numberCommentUser || 0, lastComment: doctorComment }, () => {
                    commentProvider.search(this.state.post.post.id, 1, 1).then(s => {
                        if (s.code == 0) {
                            if (s.data && s.data.data && s.data.data.length > 0) {
                                this.setState({ commentCount: s.data.total - 1, lastComment: this.state.lastComment || s.data.data[0], lastInteractive: s.data.data[0].comment.createdDate.toDateObject('-'), lastComment2: s.data.data[0] })
                            }
                        }
                    }).catch(e => {
                    })
                });
            }
            else {
                this.props.navigation.pop();
            }
        }).catch(e => {
            this.props.navigation.pop();
        });
        if (this.state.post.assignee)
            questionProvider.getResultReview(this.state.post.assignee.id).then(s => {
                if (s.code == 0) {
                    this.setState({ ratedoctor: (s.data.ratingCount || s.data.ratingCout) || 0 });
                }
            }).catch(e => {

            });
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
    userSend() {
        if (!this.form.isValid()) { return; }
        this.dialogbox.confirm({
            title: constants.alert,
            content: ["Bạn muốn thực hiện gửi câu trả lời cho câu hỏi này?"],
            ok: {
                text: "Đồng ý",
                style: {
                    color: 'red'
                },
                callback: (() => {
                    this.setState({ isLoading: true }, () => {
                        commentProvider.create(this.state.post.post.id, this.state.content, "", "").then(s => {
                            this.setState({ isLoading: false });
                            if (s.code == 0) {
                                this.setState({
                                    lastComment: s.data,
                                    lastComment2: s.data,
                                    commentCount: ((this.state.commentCount || 0) + 1),
                                    content: "",
                                    writeQuestion: false,
                                    userCommentCount: this.state.userCommentCount + 1
                                });
                            }
                        }).catch(e => {
                            this.setState({ isLoading: false });
                        })
                    });
                }).bind(this),
            },
            cancel: {
                text: constants.cancel,
                style: {
                    color: 'blue'
                },
                callback: () => {
                },
            }
        });

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
    onStarRatingPress(rating) {
        this.setState({
            star: rating
        }, () => {
            this.setState({ isLoading: true }, () => {
                connectionUtils.checkConnect(c => {
                    if (c) {
                        questionProvider.review(this.state.post.post.id, rating).then(s => {
                            let post = this.state.post;
                            post.post.status = 6;
                            this.setState({ isLoading: false, post })
                            snackbar.show("Bạn đã gửi đánh giá thành công", "success");
                        }).catch(e => {
                            snackbar.show("Gửi đánh giá không thành công", "danger");
                            this.setState({ isLoading: false })
                        });
                    }
                    else {
                        snackbar.show("Không có kết nối mạng", "danger");
                    }
                });
            });
        });
    }

    showAllComment() {
        this.setState({ loadingComment: true })
        commentProvider.search(this.state.post.post.id, 1, this.state.commentCount + 1).then(s => {
            this.setState({ loadingComment: false });
            if (s.code == 0) {
                if (s.data && s.data.data && s.data.data.length > 0) {
                    this.setState({ dataComment: s.data.data, showComment: true });
                }
            }
        }).catch(e => {
            this.setState({ loadingComment: false });
        })
    }
    showItemComment(item, key) {
        return <View key={key}>
            {item.user &&
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#000' }}></View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{item.user.name}</Text>
                        {item.user && item.user.id != this.props.userApp.currentUser.id ?
                            <View style={{ width: 100 }}>
                                <StarRating
                                    disabled={true}
                                    starSize={20}
                                    maxStars={5}
                                    rating={this.state.ratedoctor}
                                    starStyle={{ margin: 0 }}
                                    fullStarColor={"#fbbd04"}
                                    emptyStarColor={"#fbbd04"}
                                />
                            </View> : null
                        }
                    </View>
                </View>
            }
            <View style={{ position: 'relative', marginTop: 10 }}>
                <Dash style={{ width: 1, position: 'absolute', top: 0, bottom: 7, flexDirection: 'column', marginLeft: 25 }} dashStyle={{ backgroundColor: '#cacaca' }} />
                <View style={{ marginLeft: 37, marginBottom: 20 }}>
                    <Text style={{ color: '#00000038' }}>
                        {this.getTime(item.comment.createdDate)}
                    </Text>
                    <Text style={{ marginTop: 15, fontSize: 16 }}>{item.comment.content}</Text>
                </View>
            </View>
        </View>
    }

    renderFormSendWithoutDiagnostic() {
        return (<View style={{
            marginTop: 20,
            flexDirection: 'row', borderRadius: 6, borderColor: "#cacaca", borderWidth: 1
        }}>
            <Form ref={ref => this.form = ref} style={{ flex: 1, marginTop: 10 }}>
                <TextField placeholder={"Viết trả lời"}
                    inputStyle={[{ textAlignVertical: 'top', paddingLeft: 10, paddingBottom: 5, paddingRight: 10 }]}
                    errorStyle={[styles.errorStyle, { marginLeft: 10, marginBottom: 10 }]}
                    onChangeText={(s) => this.setState({ content: s })}
                    value={this.state.content}
                    validate={{
                        rules: {
                            required: true,
                            maxlength: 20000
                        },
                        messages:
                        {
                            required: "Câu trả lời bắt buộc phải nhập",
                            maxlength: "Không cho phép nhập quá 20000 ký tự"
                        }
                    }}
                />
            </Form>
            <TouchableOpacity style={{ padding: 20 }} onPress={this.userSend.bind(this)}>
                <ScaleImage width={22} source={require("@images/new/send.png")} />
            </TouchableOpacity>
        </View>);
    }

    renderViewReview() {
        if (this.state.post.post.status == 3) {
            if (this.state.userCommentCount == 3)
                return null;
            if (this.state.lastComment && this.state.lastComment2 && (this.state.lastComment2.user.id != this.props.userApp.currentUser.id))
                return (<View style={{ marginTop: 10 }}>
                    {
                        !this.state.confirmed &&
                        <View>
                            <Text style={{ textAlign: 'center', marginTop: 39, fontSize: 16 }}>Bạn có hài lòng với câu hỏi này không?</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                                <TouchableOpacity onPress={() => { this.setState({ confirmed: true, writeQuestion: true }) }} style={{ width: 130, borderWidth: 1, borderColor: '#00000044', borderRadius: 6, alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}><Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Không</Text><Text style={{ color: '#cacaca' }}>muốn hỏi thêm</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.setState({ confirmed: true, rating: true }) }} style={{ width: 130, backgroundColor: 'rgb(2,195,154)', borderRadius: 6, marginLeft: 10, alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}><Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#FFF' }}>Có</Text><Text style={{ color: '#fff' }}>cảm ơn bác sĩ</Text></TouchableOpacity>
                            </View>
                        </View>
                    }
                    {
                        this.state.writeQuestion &&
                        this.renderFormSendWithoutDiagnostic()
                    }
                </View>);
        }
        return null;
    }
    renderViewRating() {
        if (this.state.post.post.status != 6 && this.state.rating || (this.state.post.post.status == 3 && this.state.userCommentCount >= 3))
            return (<View style={{ flexDirection: 'row', padding: 20, borderTopColor: '#cacaca', borderTopWidth: 2 }}>
                <Text style={{ flex: 1 }}>Đánh giá</Text>
                <StarRating
                    starSize={30}
                    maxStars={5}
                    rating={this.state.star}
                    starStyle={{ margin: 0 }}
                    fullStarColor={"#fbbd04"}
                    emptyStarColor={"#fbbd04"}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                />

            </View>);
        return null;
    }
    showMoreInfo() {
        return <View style={{ backgroundColor: 'rgb(231,241,239)', borderRadius: 6, marginTop: 26, paddingTop: 13, paddingBottom: 13, paddingLeft: 20, paddingRight: 20 }}>
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
    }
    renderListComment() {
        if (this.state.showComment)
            return this.state.dataComment.map((item, index) => {
                return !this.state.lastComment || item.comment.id != this.state.lastComment.comment.id ?
                    this.showItemComment(item, index) : null
            });
        return null;
    }
    isFinish() {
        let lastInteractive = this.state.lastInteractive;
        totalTime = new Date() - (lastInteractive || new Date());
        return (totalTime > (1000 * 60 * 60 * 2) || this.state.post.post.status == 6);
    }
    renderStatusPost() {
        if (this.isFinish()) {
            return (<View style={{ marginTop: 25 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'rgb(0,141,111)' }}>Trạng thái: Hoàn thành</Text>
            </View>);
        }

        if (this.state.post.post.status == 1 || this.state.post.post.status == 2 || this.state.post.post.status == 5) {
            return (<View style={{ marginTop: 25 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'rgb(0,141,111)' }}>Trạng thái: Chờ trả lời</Text>
            </View>);
        }

        if (this.state.post.post.status == 4) {
            return <View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'rgb(106,1,54)' }}>Trạng thái: Bị từ chối</Text>
                </View>
                {
                    this.state.post.post.reject ?
                        <View style={{ backgroundColor: 'rgba(106,1,54,0.11)', padding: 17, marginTop: 13 }}>
                            <Text style={{ fontWeight: 'bold', color: 'rgb(106,1,54)' }}>Lý do từ chối: {this.state.post.post.reject}</Text>
                        </View> : null
                }
            </View>
        }

        return null;
    }
    renderDiagnosticView() {
        return this.state.post.post.diagnose ?
            <View style={{
                marginTop: 16,
                flexDirection: 'row',
                backgroundColor: 'rgb(239,240,241)', paddingTop: 14, paddingBottom: 14, paddingLeft: 18, paddingRight: 10
            }}>
                <View style={{ width: 16, height: 16, backgroundColor: 'rgb(2,195,154)', borderRadius: 8, marginTop: 2 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, flex: 1 }}>Chẩn đoán ban đầu</Text>
                    </View>
                    <Text>{this.state.post.post.diagnose}</Text>
                </View>
            </View> : null;
    }
    renderShowMoreComment() {
        return this.state.loadingComment ?
            <View style={{ alignItems: 'center', padding: 10 }}>
                <ActivityIndicator
                    size={'small'}
                    color={'gray'}
                />
            </View> :
            !this.state.showComment ?
                this.state.commentCount != 0 ?
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgb(155,155,155)', marginLeft: 20 }} />
                        <TouchableOpacity onPress={this.showAllComment.bind(this)}>
                            <Text style={{ color: 'rgb(10,155,225)', marginLeft: 10 }} > Xem thêm {this.state.commentCount} trả lời ></Text>
                        </TouchableOpacity>
                    </View> :
                    null
                : null
    }
    render() {
        // const post = this.props.navigation.getParam("post", null);
        let { post } = this.state;
        return (
            <ActivityPanel style={{ flex: 1 }} title="Tư vấn online" showFullScreen={true} isLoading={this.state.isLoading}>
                <ScrollView ref={(ref) => { this.scrollView = ref }} style={{ padding: 20 }} >
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <View style={{ flex: 1 }} ><Text style={{ fontSize: 18, fontWeight: 'bold' }}>{post.author ? post.author.name : ""}</Text></View>
                        <View><Text style={{ color: '#00000038' }}>{this.getTime(post.post.createdDate)}</Text></View>
                    </View>
                    <Text style={{ color: '#00000064', marginTop: 7 }}>
                        {this.state.post.post.content}
                    </Text>
                    {
                        this.showMoreInfo()
                    }
                    <View>
                        {
                            this.state.lastComment &&
                            <View style={{ marginTop: 10 }}>
                                {
                                    this.showItemComment(this.state.lastComment, -1)
                                }
                                {
                                    this.renderShowMoreComment()
                                }
                                {
                                    this.renderListComment()
                                }
                                {
                                    this.renderDiagnosticView()
                                }
                            </View>
                        }
                    </View>
                    {
                        this.renderViewReview()
                    }
                    {
                        this.renderStatusPost()
                    }
                    <View style={{ height: 100 }} />
                </ScrollView>
                {
                    this.renderViewRating()
                }
                {
                    Platform.OS == "ios" &&
                    <KeyboardSpacer />
                }
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }} />
                <ImagePicker ref={ref => this.imagePicker = ref} />
            </ActivityPanel >
        );
    }
}


const styles = StyleSheet.create({
    moreInfo:
    {
        color: '#00000080', fontSize: 16, fontWeight: '500', marginTop: 7
    },
    errorStyle: {
        color: "red",
        marginTop: 10
    },
    textinput: {
        borderColor: "#cacaca",
        borderWidth: 1,
        paddingLeft: 7,
        borderRadius: 6
    },
    labelStyle: { paddingTop: 10, color: '#53657B', fontSize: 16 }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(DetailQuestionScreen);