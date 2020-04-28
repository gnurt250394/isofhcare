import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, FlatList, Image, ScrollView, TextInput, KeyboardAvoidingView, Keyboard, StyleSheet, Platform, RefreshControl } from 'react-native';
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
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import DialogBox from 'react-native-dialogbox';
import StarRating from 'react-native-star-rating';
import Dash from 'mainam-react-native-dash-view';
import connectionUtils from '@utils/connection-utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
            star: (post && post.post) ? (post.post.review || 0) : 0,
            post,
            writeQuestion: false,
            confirmed: false,
            rating: false,
            dataComment: [],
            userCommentCount: 0,
            commentCount: 0,
            refreshing: false
        }
    }
    componentDidMount() {
        this.onRefresh();
    }
    showImage = (images,index) => () => {
        this.props.navigation.navigate("photoViewer", {
            urls:images.map(item => {
                return { 'uri': item.absoluteUrl() }
            }), index
        });
    }
    renderImages(post) {
        var image = post.images;
        if (image) {
            var images = image.split(",");
            return (<View>
                <Text style={[styles.moreInfo, { marginTop: 20 }]}>{constants.image}:</Text>
                <View style={styles.containerListImage}>
                    {
                        images.map((item, index) => <TouchableOpacity onPress={this.showImage(images,index)} key={index} style={styles.buttonShowImage}>
                            <Image
                                style={styles.image}
                                source={{
                                    uri: item.absoluteUrl()
                                }}
                                resizeMode={'cover'}
                            />
                        </TouchableOpacity>)
                    }
                </View>
            </View>);
        } else {
            return null;
        }
    }
    userSend() {
        if (!this.state.content)
            return;
        connectionUtils.isConnected().then(s => {
            if (!this.form.isValid()) { return; }
            this.setState({ isLoading: true }, () => {
                commentProvider.create(this.state.post.post.id, this.state.content, "", "").then(s => {
                    this.setState({ isLoading: false });
                    if (s.code == 0) {
                        let listComment = this.state.dataComment || [];
                        listComment.push(s.data);
                        this.setState({
                            lastComment: s.data,
                            commentCount: ((this.state.commentCount || 0) + 1),
                            content: "",
                            writeQuestion: false,
                            userCommentCount: this.state.userCommentCount + 1,
                            dataComment: [...listComment]
                        });
                        snackbar.show(constants.msg.question.send_idea_success, "success");
                    }
                }).catch(e => {
                    this.setState({ isLoading: false });
                })
            });
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })
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
        connectionUtils.isConnected().then(s => {
            this.setState({
                star: rating
            }, () => {
                this.setState({ isLoading: true }, () => {
                    questionProvider.review(this.state.post.post.id, rating).then(s => {
                        let post = this.state.post;
                        post.post.status = 6;
                        this.setState({ isLoading: false, post })
                        snackbar.show(constants.msg.question.send_rate_success, "success");
                    }).catch(e => {
                        snackbar.show(constants.msg.question.send_rate_fail, "danger");
                        this.setState({ isLoading: false })
                    });
                });
            });
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })
    }
    onNavigateDetails = (item) => {
        item.user && item.user.id != this.props.userApp.currentUser.id ? this.props.navigation.navigate('detailsDoctor', {
            id: this.state.post.assignee.id
        }) : this.props.navigation.navigate('detailsProfile', {
            id: item.user.id
        })
    }
    showAllComment() {
        this.setState({ loadingComment: true })
        commentProvider.search(this.state.post.post.id, 1, this.state.commentCount + 1).then(s => {
            this.setState({ loadingComment: false });
            if (s.code == 0) {
                if (s.data && s.data.data && s.data.data.length > 0) {
                    this.setState({ dataComment: (s.data.data || []).reverse(), showComment: true }, () => {
                        setTimeout(() => {
                            this.scrollView.scrollToEnd({ animated: true });
                        }, 500);
                    });
                }
            }
        }).catch(e => {
            this.setState({ loadingComment: false });
        })
    }
    showItemComment(item, key, size) {
        if (!item.user)
            return null;
        const source = item.user && item.user.avatar ? { uri: item.user.avatar.absoluteUrl() } : require("@images/new/user.png");
        return <View key={key}>
            {item.user &&
                <TouchableOpacity onPress={() => this.onNavigateDetails(item)} style={styles.buttonShowDetails}>
                    <Image source={source} style={styles.imgDetails} resizeMode="cover" />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.txtName}>{item.user.name}</Text>
                        {item.user && item.user.id != this.props.userApp.currentUser.id ?
                            <View style={{ width: 120 }}>
                                <StarRating
                                    disabled={true}
                                    starSize={20}
                                    maxStars={5}
                                    rating={this.state.ratedoctor}
                                    starStyle={{ marginLeft: 5 }}
                                    fullStarColor={"#fbbd04"}
                                    emptyStarColor={"#fbbd04"}
                                />
                            </View> : null
                        }
                    </View>
                </TouchableOpacity>
            }
            <View style={styles.containerComment}>
                {
                    ((key != -1 || (key == -1 && this.state.commentCount > 0)) && key != size - 1) &&
                    <Dash style={styles.dash} dashStyle={{ backgroundColor: '#cacaca' }} />
                }
                <View style={styles.contentComment}>
                    <Text style={styles.txtTime}>
                        {this.getTime(item.comment.createdDate)}
                    </Text>
                    <Text style={styles.txtComment}>{item.comment.content}</Text>
                </View>
            </View>
        </View>
    }
    onChangeText = state => value => {
        this.setState({ [state]: value })
    }
    onValidateQuestion = (valid, messages) => {
        if (valid) {
            this.setState({ contentError: "" });
        }
        else {
            this.setState({ contentError: messages });
        }
    }
    renderFormSendWithoutDiagnostic() {
        return (

            <View style={{ marginTop: 20 }}>
                <Text style={{ color: 'rgb(155,155,155)' }}>Bạn còn {(num => { let x = 3 - num; if (x < 0) return 0; return x }).call(this, this.state.post.post.numberCommentUser)} lượt hỏi</Text>
                <View style={styles.containerFormReply}>
                    <Form ref={ref => this.form = ref} style={styles.form}>
                        <TextField placeholder={constants.questions.input_answer}
                            inputStyle={[styles.inputAnswer]}
                            errorStyle={[styles.errorStyle, styles.errorInput]}
                            onChangeText={this.onChangeText('content')}
                            value={this.state.content}
                            multiline={true}
                            hideError={true}
                            validate={{
                                rules: {
                                    required: true,
                                    maxlength: 2000
                                },
                                messages:
                                {
                                    required: constants.questions.question_require,
                                    maxlength: constants.msg.question.not_allow_2000_keyword
                                }
                            }}
                            onValidate={this.onValidateQuestion}
                        />
                    </Form>

                    <TouchableOpacity style={{ padding: 20 }} onPress={this.userSend.bind(this)}>
                        <ScaleImage width={22} source={this.state.content && this.state.content.trim().length > 0 ? require("@images/new/send2.png") : require("@images/new/send.png")} />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.errorStyle]}>{this.state.contentError}</Text>

            </View>
        );
    }

    isFinish() {
        let lastInteractive = new Date();
        if (this.state.lastComment) {
            if (this.state.lastComment.author && this.state.lastComment.author.id != this.props.userApp.currentUser.id)
                lastInteractive = this.state.lastComment.comment.createdDate.toDateObject('-')
        }

        totalTime = new Date() - lastInteractive;
        return totalTime > 2 * 24 * 60 * 60 * 1000;
    }
    confirmAnswer = (state) => () => {
        connectionUtils.isConnected().then(s => {
            this.setState({ confirmed: true, [state]: true })
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })
    }
    renderViewReview() {
        if (this.state.post.post.status == 3) {
            if (this.state.userCommentCount == 3 || this.isFinish())
                return null;
            if (this.state.lastComment && this.state.lastComment.user && (this.state.lastComment.user.id != this.props.userApp.currentUser.id))
                return (<View style={{ marginTop: 10 }}>
                    {
                        !this.state.confirmed &&
                        <View>
                            <Text style={styles.txtAskAnswer}>{constants.msg.question.you_happy_with_answer}</Text>
                            <View style={styles.containerButtonConfirm}>
                                <TouchableOpacity onPress={this.confirmAnswer('writeQuestion')} style={styles.buttonNotAnswer}>
                                    <Text style={styles.txtNotAnswer}>Không</Text><Text style={{ color: '#cacaca' }}>muốn hỏi thêm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.confirmAnswer('rating')} style={styles.buttonAnswer}>
                                    <Text style={[styles.txtNotAnswer, { color: '#FFF' }]}>Có</Text><Text style={{ color: '#fff' }}>cảm ơn bác sĩ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    {
                        this.state.writeQuestion && this.renderFormSendWithoutDiagnostic()
                    }
                </View>);
        }
        return null;
    }
    renderViewRating() {
        if (
            this.state.post.post.status == 6 ||
            this.state.rating ||
            (this.state.post.post.status == 3
                && (this.state.userCommentCount >= 3 ||
                    this.isFinish())))
            return (<View style={styles.containerRating}>
                <Text style={styles.txtRating}>{constants.questions.rating}</Text>
                <StarRating
                    disabled={this.state.post.post.status == 6 ? true : false}
                    starSize={30}
                    maxStars={5}
                    rating={this.state.star}
                    starStyle={{ marginLeft: 5 }}
                    fullStarColor={"#fbbd04"}
                    emptyStarColor={"#fbbd04"}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                />

            </View>);
        return null;
    }
    onShowMore = () => { this.setState({ showMore: !this.state.showMore }) }
    showMoreInfo() {
        return <View style={styles.containerShowMore}>
            <TouchableOpacity onPress={this.onShowMore} style={styles.buttonShowMore}>
                <Text style={styles.txtShowMore}>{constants.questions.info_complementary}</Text>
                <ScaleImage width={12} source={this.state.showMore ? require("@images/new/down.png") : require("@images/new/up.png")} />
            </TouchableOpacity>
            {
                this.state.showMore &&
                <View style={{ marginTop: 15 }}>
                    {this.state.post.specialist &&
                        <Text style={styles.moreInfo}>
                            {constants.questions.specialist}: {this.state.post.specialist.name}
                        </Text>
                    }
                    {this.state.post.post.age ?
                        <Text style={styles.moreInfo}>
                            {constants.questions.age}: {this.state.post.post.age}
                        </Text> : null
                    }
                    <Text style={styles.moreInfo}>
                        {constants.gender}: {this.state.post.post.gender == 1 ? "Nam" : "Nữ"}
                    </Text>
                    {
                        this.state.post.post.diseaseHistory != 0 ?
                            <Text style={[styles.moreInfo, { lineHeight: 25 }]}>
                                {constants.questions.anamnesis}: {disease.filter(x => (x.value & this.state.post.post.diseaseHistory) == x.value).map((item, index) => { return item.text }).join(", ")}
                            </Text> : null
                    }
                    {
                        this.state.post.post.otherContent ? <View>
                            <Text style={styles.moreInfo}>{constants.questions.other_info}:</Text>
                            <Text style={styles.txtOtherContent}>
                                {this.state.post.post.otherContent}
                            </Text>
                        </View> : null
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
                return this.showItemComment(item, index, this.state.dataComment.length)
            });
        return null;
    }
    renderStatusPost() {
        if (this.state.post.post.status == 1 || this.state.post.post.status == 2 || this.state.post.post.status == 5) {
            return (<View style={{ marginTop: 25 }}>
                <Text style={styles.txtStatus}>{constants.questions.status}: {constants.questions.content_status.wait}</Text>
            </View>);
        }

        if (this.state.post.post.status == 4) {
            return <View>
                <View style={{ marginTop: 25 }}>
                    <Text style={styles.txtStatusReject}>{constants.questions.status}: {constants.questions.content_status.reject}</Text>
                </View>
                {
                    this.state.post.post.reject ?
                        <View style={styles.containerReject}>
                            <Text style={styles.txtContentReject}>{constants.questions.cause_reject}: {this.state.post.post.reject}</Text>
                        </View> : null
                }
            </View>
        }

        return null;
    }
    renderDiagnosticView() {
        return this.state.post.post.diagnose ?
            <View style={styles.containerDiagnose}>
                <View style={styles.viewHeader} />
                <View style={styles.contentDiagnose}>
                    <View style={styles.groupDiagnose}>
                        <Text style={styles.txtDiagnoseInitial}>Chẩn đoán ban đầu</Text>
                    </View>
                    <Text>{this.state.post.post.diagnose}</Text>
                </View>
            </View> : null;
    }
    renderShowMoreComment() {
        return this.state.loadingComment ?
            <View style={styles.loading}>
                <ActivityIndicator
                    size={'small'}
                    color={'gray'}
                />
            </View> :
            !this.state.showComment ?
                this.state.commentCount != 0 ?
                    <View style={styles.groupComment}>
                        <View style={styles.lineTopComment} />
                        <TouchableOpacity onPress={this.showAllComment.bind(this)}>
                            <Text style={styles.txtSeeMore} > Xem thêm {this.state.commentCount} trả lời ></Text>
                        </TouchableOpacity>
                    </View> :
                    null
                : null
    }
    onRefresh() {
        if (this.state.post && this.state.post.post)
            this.setState({ refreshing: true }, () => {
                var promise = [
                    questionProvider.detail(this.state.post.post.id),
                    commentProvider.search(this.state.post.post.id, 1, 1)
                ];
                if (this.state.post.assignee) {
                    promise.push(questionProvider.getResultReview(this.state.post.assignee.id))
                }
                Promise.all(promise).then(values => {
                    let state = {};
                    if (values[0].code == 0) {
                        let post = values[0].data;
                        state.star = (post && post.post) ? (post.post.review || 0) : 0;
                        state.post = post;
                        state.showMore = post.post.status == 1 || post.post.status == 2 || post.post.status == 4 || post.post.status == 5;
                        state.diagnose = post.post.diagnose;
                        state.userCommentCount = post.post.numberCommentUser || 0;
                        state.confirmed = false;
                    }
                    if (values[1].code == 0) {
                        state.commentCount = values[1].data.total - 1;
                        state.lastComment = values[1].data.data[0];
                        state.lastInteractive = values[1].data.data[0].comment.createdDate.toDateObject('-')
                        commentProvider.search(this.state.post.post.id, 1, values[1].data.total).then(s => {
                            if (s.code == 0) {
                                if (s.data && s.data.data && s.data.data.length > 0) {
                                    this.setState({ dataComment: (s.data.data || []).reverse() }, () => {
                                        if (this.state.showComment)
                                            setTimeout(() => {
                                                this.scrollView.scrollToEnd({ animated: true });
                                            }, 500);
                                    });
                                }
                            }
                        })
                    }
                    if (values.length >= 3) {
                        if (values[2].code == 0) {
                            state.ratedoctor = (values[2].data.ratingCount || values[2].data.ratingCout) || 0;
                        }
                    }
                    state.refreshing = false;
                    this.setState(state);
                }).catch(s => {
                    this.setState({ refreshing: false });
                })
            })
    }
    render() {
        // const post = this.props.navigation.getParam("post", null);
        let { post } = this.state;
        if (!post.post) {
            snackbar.show(constants.msg.notification.ports_not_found, "danger");
            this.props.navigation.pop();
        }

        return (
            <ActivityPanel style={styles.flex} title={constants.title.advisory_online} showFullScreen={true} isLoading={this.state.isLoading}>
                {
                    post.post &&
                    <KeyboardAwareScrollView style={styles.flex}>
                        <View style={styles.container}>
                            <ScrollView
                                refreshControl={<RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />}
                                showsVerticalScrollIndicator={false}
                                ref={(ref) => { this.scrollView = ref }}
                                keyboardShouldPersistTaps="handled"
                                keyboardDismissMode='on-drag'
                            >
                                <View style={styles.containerPost}>
                                    <View style={styles.flex} ><Text style={styles.txtAuthor}>{post.author ? post.author.name : ""}</Text></View>
                                    <View><Text style={styles.txtTime}>{this.getTime(post.post.createdDate)}</Text></View>
                                </View>
                                <Text style={styles.txtContentPost}>
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
                                                !this.state.showComment &&
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
                        </View>
                        {
                            this.renderViewRating()
                        }
                        {
                            Platform.OS == "ios" &&
                            <KeyboardSpacer />
                        }
                        <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }} />
                    </KeyboardAwareScrollView>
                }
            </ActivityPanel>
        );
    }
}


const styles = StyleSheet.create({
    txtContentPost: {
        color: '#00000064',
        marginTop: 7
    },
    txtAuthor: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    containerPost: {
        flexDirection: "row",
        alignItems: 'center'
    },
    container: {
        padding: 20,
        flex: 1
    },
    flex: { flex: 1 },
    txtSeeMore: {
        color: 'rgb(10,155,225)',
        marginLeft: 10
    },
    lineTopComment: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgb(155,155,155)',
        marginLeft: 20
    },
    groupComment: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    loading: {
        alignItems: 'center',
        padding: 10
    },
    txtDiagnoseInitial: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1
    },
    groupDiagnose: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    contentDiagnose: {
        flex: 1,
        marginLeft: 10
    },
    viewHeader: {
        width: 16,
        height: 16,
        backgroundColor: 'rgb(2,195,154)',
        borderRadius: 8,
        marginTop: 2
    },
    containerDiagnose: {
        marginTop: 16,
        flexDirection: 'row',
        backgroundColor: 'rgb(239,240,241)',
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 18,
        paddingRight: 10
    },
    txtContentReject: {
        fontWeight: 'bold',
        color: 'rgb(106,1,54)'
    },
    containerReject: {
        backgroundColor: 'rgba(106,1,54,0.11)',
        padding: 17,
        marginTop: 13
    },
    txtStatusReject: {
        fontSize: 15,
        color: 'rgb(106,1,54)'
    },
    txtStatus: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'rgb(0,141,111)'
    },
    txtOtherContent: {
        fontSize: 16,
        marginTop: 6,
        color: '#00000064'
    },
    txtShowMore: {
        color: 'rgba(0,141,111,0.70)',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1
    },
    buttonShowMore: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerShowMore: {
        backgroundColor: 'rgb(231,241,239)',
        borderRadius: 6,
        marginTop: 26,
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 20,
        paddingRight: 20
    },
    txtRating: {
        flex: 1,
        fontWeight: 'bold'
    },
    containerRating: {
        flexDirection: 'row',
        padding: 20,
        borderTopColor: '#cacaca',
        borderTopWidth: 0.5
    },
    txtNotAnswer: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    buttonAnswer: {
        width: 130,
        backgroundColor: 'rgb(2,195,154)',
        borderRadius: 6,
        marginLeft: 10,
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    buttonNotAnswer: {
        width: 130,
        borderWidth: 1,
        borderColor: '#00000044',
        borderRadius: 6,
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    containerButtonConfirm: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    txtAskAnswer: {
        textAlign: 'center',
        marginTop: 39,
        fontSize: 16
    },
    errorInput: {
        marginLeft: 10,
        marginBottom: 10
    },
    inputAnswer: {
        maxHeight: 200,
        textAlignVertical: 'top',
        paddingLeft: 10,
        paddingBottom: 5,
        paddingRight: 10
    },
    form: {
        flex: 1,
        marginTop: 10
    },
    containerFormReply: {
        marginTop: 5,
        flexDirection: 'row',
        borderRadius: 6,
        borderColor: "#cacaca",
        borderWidth: 1
    },
    txtComment: {
        marginTop: 15,
        fontSize: 16
    },
    txtTime: {
        color: '#00000038'
    },
    contentComment: {
        marginLeft: 37,
        marginBottom: 20
    },
    dash: {
        width: 1,
        position: 'absolute',
        top: 0,
        bottom: 7,
        flexDirection: 'column',
        marginLeft: 25
    },
    containerComment: {
        position: 'relative',
        marginTop: 10
    },
    txtName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    imgDetails: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        borderColor: 'rgba(151, 151, 151, 0.29)'
    },
    buttonShowDetails: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10
    },
    buttonShowImage: {
        marginRight: 10,
        borderRadius: 10,
        marginBottom: 10,
        width: 70,
        height: 70
    },
    containerListImage: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10
    },
    moreInfo:
    {
        color: '#00000080', fontSize: 15, fontWeight: 'bold', marginTop: 7
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
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(DetailQuestionScreen);