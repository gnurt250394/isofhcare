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
import Dimensions from 'Dimensions';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import Slide from '@components/slide/Slide';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import DialogBox from 'react-native-dialogbox';
import StarRating from 'react-native-star-rating';
import Dash from 'mainam-react-native-dash-view';

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
    componentDidMount() {
        questionProvider.detail(this.state.post.post.id).then(s => {
            if (s.code == 0) {
                let post = s.data;
                this.setState({ post: s.data, diagnose: post.post.diagnose });
            }
            else {
                this.props.navigation.pop();
            }
        }).catch(e => {
            this.props.navigation.pop();
        });
        commentProvider.search(this.state.post.post.id, 1, 1).then(s => {
            if (s.code == 0) {
                if (s.data && s.data.data && s.data.data.length > 0) {
                    this.setState({ commentCount: s.data.total - 1, lastComment: s.data.data[0] })
                }
            }
        }).catch(e => {
        })
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
    doctorSend() {
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
                        commentProvider.create(this.state.post.post.id, this.state.content, this.state.diagnose, "").then(s => {
                            this.setState({ isLoading: false });
                            if (s.code == 0) {
                                this.setState({ lastComment: s.data, commentCount: ((this.state.commentCount || 0) + 1), content: "" });
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
                    {
                        !this.state.lastComment &&
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
                    }
                    <View>
                        {
                            this.state.lastComment &&
                            <View style={{ marginTop: 10 }}>
                                {this.state.lastComment.user &&
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#000' }}></View>
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{this.state.lastComment.user.name}</Text>
                                            {/* <StarRating
                                                disabled={true}
                                                starSize={20}
                                                maxStars={5}
                                                rating={5}
                                                starStyle={{ margin: 0 }}
                                                fullStarColor={"#fbbd04"}
                                                emptyStarColor={"#fbbd04"}
                                            /> */}
                                        </View>
                                    </View>
                                }
                                <View style={{ position: 'relative', marginTop: 10 }}>
                                    <Dash style={{ width: 1, position: 'absolute', top: 0, bottom: 20, flexDirection: 'column', marginLeft: 25 }} dashStyle={{ backgroundColor: '#cacaca' }} />
                                    <View style={{ marginLeft: 37, marginBottom: 20 }}>
                                        <Text style={{ color: '#00000038' }}>
                                            {this.getTime(this.state.lastComment.comment.createdDate)}
                                        </Text>
                                        <Text style={{ marginTop: 15, fontSize: 16 }}>{this.state.lastComment.comment.content}</Text>
                                    </View>
                                    {
                                        this.state.commentCount != 0 ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgb(155,155,155)', marginLeft: 19 }} />
                                            <TouchableOpacity onPress={() => snackbar.show("Chức năng đang phát triển")}>
                                                <Text style={{ color: 'rgb(10,155,225)', marginLeft: 10 }} > Xem thêm {this.state.commentCount} trả lời ></Text>
                                            </TouchableOpacity>
                                        </View> : null
                                    }
                                </View>
                                {
                                    this.state.post.post.diagnose &&
                                    <View style={{
                                        marginTop: 16,
                                        flexDirection: 'row',
                                        backgroundColor: 'rgb(239,240,241)', paddingTop: 14, paddingBottom: 14, paddingLeft: 18, paddingRight: 10
                                    }}><View style={{ width: 16, height: 16, backgroundColor: 'rgb(2,195,154)', borderRadius: 8, marginTop: 2 }} />
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Chẩn đoán ban đầu</Text>
                                            <Text>{this.state.post.post.diagnose}</Text>
                                        </View></View>
                                }
                            </View>
                        }
                    </View>
                    {/* {
                        this.props.userApp.currentUser.role == 2 ?
                            <View>
                                {this.state.lastComment ?
                                    <Form ref={ref => this.form = ref} style={{ marginTop: 20 }}>
                                        <TextField placeholder={"Viết trả lời"}
                                            inputStyle={[styles.textinput, { marginTop: 6, borderRadius: 6, textAlignVertical: 'top', paddingTop: 13, paddingLeft: 10, paddingBottom: 13, paddingRight: 10 }]}
                                            errorStyle={styles.errorStyle}
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
                                    </Form> :
                                    <Form ref={ref => this.form = ref} style={{ marginTop: 20 }}>
                                        <TextField placeholder={"Viết trả lời"}
                                            inputStyle={[styles.textinput, { marginTop: 6, borderRadius: 6, textAlignVertical: 'top', paddingTop: 13, paddingLeft: 10, paddingBottom: 13, paddingRight: 10 }]}
                                            errorStyle={styles.errorStyle}
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
                                        <Text style={[styles.moreInfo, { marginTop: 20 }]}>Chẩn đoán ban đầu</Text>
                                        <TextField
                                            onChangeText={(s) => this.setState({ diagnose: s })}
                                            value={this.state.diagnose}
                                            validate={{
                                                rules: {
                                                    required: true,
                                                    maxlength: 2000
                                                },
                                                messages:
                                                {
                                                    required: "Chẩn đoán ban đầu bắt buộc phải nhập",
                                                    maxlength: "Không cho phép nhập quá 2000 ký tự"
                                                }
                                            }}
                                            inputStyle={[styles.textinput, { height: 100, marginTop: 6, borderRadius: 6, textAlignVertical: 'top', paddingTop: 13, paddingLeft: 10, paddingBottom: 13, paddingRight: 10 }]}
                                            errorStyle={styles.errorStyle}
                                            multiline={true}
                                        />
                                    </Form>
                                }
                                <TouchableOpacity onPress={this.doctorSend.bind(this)} style={{ backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#FFF', fontSize: 20, textTransform: 'uppercase' }}>{"Gửi câu trả lời"}</Text>
                                </TouchableOpacity>
                            </View> : null
                    } */}

                    <View style={{ height: 100 }} />
                </ScrollView>
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