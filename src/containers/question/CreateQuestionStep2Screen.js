import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ScrollView, View, Text, StyleSheet, TextInput, Platform, Switch, Keyboard, Image, FlatList } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import snackbar from '@utils/snackbar-utils';
import questionProvider from '@data-access/question-provider';
import constants from '@resources/strings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
import specialistProvider from '@data-access/specialist-provider';
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';

import Form from 'mainam-react-native-form-validate/Form';
import TextField from 'mainam-react-native-form-validate/TextField';
import dataCacheProvider from '@data-access/datacache-provider';
import { Card } from 'native-base';
const padding = Platform.select({
    ios: 7,
    android: 2
});
class CreateQuestionStep2Screen extends Component {
    constructor(props) {
        super(props);
        let post = this.props.navigation.getParam("post", null);
        if (!post) {
            post = {}
        }
        post.imageUris = [];
        post.disease = 0;
        this.state = post;
    }
    componentDidMount() {
        dataCacheProvider.read(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_POSTS, (s, e) => {
            if (s && s.post) {
                let images = (s.post.images || "").split(',').filter(x => x != "").map(x => {
                    return {
                        uri: x.absoluteUrl(),
                        url: x.absoluteUrl(),
                        thumbnail: x.absoluteUrl(),
                        loading: false,
                        error: false
                    }
                });
                this.setState({
                    disease: s.post.diseaseHistory || 0,
                    // specialist_item: s.specialist ? { specialist: s.specialist } : null,
                    // otherContent: s.post.otherContent,
                    // imageUris: images
                })
            }
        })
    }
    componentWillMount() {
        specialistProvider.getTop(1000, (s, e) => {
            if (s) {
                this.setState({ specialist: s });
            }
        });
    }

    removeImage(index) {
        var imageUris = this.state.imageUris;
        imageUris.splice(index, 1);
        this.setState({ imageUris });
    }
    selectImage() {
        connectionUtils.isConnected().then(s => {
            if (this.imagePicker) {
                this.imagePicker.open(false, 200, 200, image => {
                    setTimeout(() => {
                        Keyboard.dismiss();
                    }, 500);
                    let imageUris = this.state.imageUris;
                    let temp = null;
                    imageUris.forEach((item) => {
                        if (item.uri == image.path)
                            temp = item;
                    })
                    if (!temp) {
                        imageUris.push({ uri: image.path, loading: true });
                        imageProvider.upload(image.path, (s, e) => {
                            if (s.success) {
                                if (s.data.code == 0 && s.data.data && s.data.data.images && s.data.data.images.length > 0) {
                                    let imageUris = this.state.imageUris;
                                    imageUris.forEach((item) => {
                                        if (item.uri == s.uri) {
                                            item.loading = false;
                                            item.url = s.data.data.images[0].image;
                                            item.thumbnail = s.data.data.images[0].thumbnail;
                                        }
                                    });
                                    this.setState({
                                        imageUris
                                    });
                                }
                            } else {
                                imageUris.forEach((item) => {
                                    if (item.uri == s.uri) {
                                        item.error = true;
                                    }
                                });
                            }
                        });
                    }
                    this.setState({ imageUris: [...imageUris] });
                });
            }
        }).catch(e => {
            snackbar.show("Không có kết nối mạng", "danger");
        });
    }
    createQuestion() {
        if (!this.form.isValid()) {
            return;
        }

        for (var i = 0; i < this.state.imageUris.length; i++) {
            if (this.state.imageUris[i].loading) {
                snackbar.show('Một số ảnh đang được tải lên. Vui lòng chờ', 'danger');
                return;
            }
            if (this.state.imageUris[i].error) {
                snackbar.show('Ảnh tải lên bị lỗi, vui lòng kiểm tra lại', 'danger');
                return;
            }
        }

        if (!this.props.userApp.isLogin) {
            this.props.navigation.navigate("login", {
                nextScreen: {
                    screen: "createQuestionStep2",
                    param: {
                        fromlogin: true,
                        state: this.state
                    }
                }
            });
            return;
        }

        connectionUtils.isConnected().then(s => {
            this.setState({ isLoading: true }, () => {
                var images = "";
                this.state.imageUris.forEach((item) => {
                    if (images)
                        images += ",";
                    images += item.url;
                });
                questionProvider.create(this.state.content, this.state.gender, this.state.age, this.state.specialist_item ? this.state.specialist_item.specialist.id : "0", this.state.disease, this.state.otherContent, images).then(s => {
                    this.setState({ isLoading: false });
                    if (s && s.code == 0) {
                        dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_POSTS, s.data);
                        snackbar.show(constants.msg.question.create_question_success, "success");
                        this.props.navigation.navigate("listQuestion", { reloadTime: new Date().getTime() });
                    } else {
                        snackbar.show(constants.msg.question.create_question_failed, "danger");
                    }
                }).catch(e => {
                    this.setState({ isLoading: false });
                    snackbar.show(constants.msg.question.create_question_failed, "danger");
                });
            });
        }).catch(e => {
            snackbar.show("Không có kết nối mạng", "danger");
        })
    }

    toggleModalSpecialize() {
        Keyboard.dismiss();
        this.setState({
            toggleModalSpecialize: !this.state.toggleModalSpecialize
        })
    }

    selectSpecialist(specialize) {
        this.state.specialist_item = specialize;
        this.setState({
            toggleModalSpecialize: false
        })
    }
    selectDisease(value) {
        if ((this.state.disease & value) == value) {
            this.setState({ disease: this.state.disease ^ value })
        } else {
            this.setState({ disease: this.state.disease | value })
        }
    }
    renderItemDisease(value, text, left) {
        let selected = (this.state.disease & value) == value;
        return <View style={{ height: 50 }}><TouchableOpacity onPress={this.selectDisease.bind(this, value)} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: selected ? 2 : 1, borderColor: selected ? '#02C39A' : 'rgba(151,151,151,0.36)', padding: 10, marginTop: 6, marginRight: left ? 5 : 0, marginLeft: !left ? 5 : 0, borderRadius: 6 }}>
            {
                ((disease, value, selected) => {
                    if (selected) {
                        switch (value) {
                            case 1:
                                return <ScaleImage source={require("@images/new/timmach1.png")} height={18} />
                            case 4:
                                return <ScaleImage source={require("@images/new/tieuduong1.png")} height={18} />
                            case 16:
                                return <ScaleImage source={require("@images/new/hohap1.png")} height={18} />
                            case 64:
                                return <ScaleImage source={require("@images/new/xuongkhop1.png")} height={18} />
                            case 2:
                                return <ScaleImage source={require("@images/new/momau1.png")} height={18} />
                            case 8:
                                return <ScaleImage source={require("@images/new/hiv1.png")} height={18} />
                            case 32:
                                return <ScaleImage source={require("@images/new/daday1.png")} height={18} />
                            case 128:
                                return <ScaleImage source={require("@images/new/thieuchat1.png")} height={18} />
                        }
                    } else {
                        switch (value) {
                            case 1:
                                return <ScaleImage source={require("@images/new/timmach0.png")} height={18} />
                            case 4:
                                return <ScaleImage source={require("@images/new/tieuduong0.png")} height={18} />
                            case 16:
                                return <ScaleImage source={require("@images/new/hohap0.png")} height={18} />
                            case 64:
                                return <ScaleImage source={require("@images/new/xuongkhop0.png")} height={18} />
                            case 2:
                                return <ScaleImage source={require("@images/new/momau0.png")} height={18} />
                            case 8:
                                return <ScaleImage source={require("@images/new/hiv0.png")} height={18} />
                            case 32:
                                return <ScaleImage source={require("@images/new/daday0.png")} height={18} />
                            case 128:
                                return <ScaleImage source={require("@images/new/thieuchat0.png")} height={18} />
                        }
                    }
                }).call(this, this.state.disease, value, selected)
            }
            <Text style={{ flex: 1, marginHorizontal: 5, fontSize: 13, fontWeight: '500' }} numberOfLines={1} ellipsizeMode='tail'>{text}</Text>
            <View style={{ flexDirection: 'row' }}>
                {
                    selected &&
                    <ScaleImage source={require("@images/new/ic_question_check_specialist.png")} width={18} />
                }
            </View>
        </TouchableOpacity></View>
    }

    componentWillReceiveProps(props) {
        if (props.navigation.getParam("fromlogin", null) && props.navigation.getParam("state", null)) {
            this.setState(props.navigation.getParam("state", null) || {}, () => {
                this.createQuestion();
            });
        }
    }

    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }}
                title={"Thông tin bổ sung"}
                showFullScreen={true}
                isLoading={this.state.isLoading}
                actionbarStyle={{
                    backgroundColor: '#02C39A'
                }}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#02C39A"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, position: 'relative' }} keyboardShouldPersistTaps="always">
                    <View style={{ backgroundColor: '#02C39A', height: 130, position: 'absolute', top: 0, left: 0, right: 0 }}></View>
                    <View style={{ margin: 22, marginTop: 10 }}>
                        <Card style={{ padding: 22 }}>
                            <View style={{ backgroundColor: '#02C39A', width: 20, height: 4, borderRadius: 2, alignSelf: 'center' }}></View>
                            <Text style={[styles.label, { marginTop: 15 }]}>Chuyên khoa đang hỏi</Text>
                            <TouchableOpacity onPress={() => { this.toggleModalSpecialize() }} style={[styles.textinput, { flexDirection: 'row', alignItems: 'center', marginTop: 6 }]}>
                                <Text style={{ padding: 10, flex: 1, color: "#4A4A4A", fontWeight: '600' }}>
                                    {
                                        this.state.specialist_item ? this.state.specialist_item.specialist.name : "Chọn chuyên khoa"
                                    }
                                </Text>
                                <ScaleImage source={require("@images/icdropdown.png")} height={8} style={{ marginRight: 5 }} />
                            </TouchableOpacity>
                            <Text style={[styles.label, { marginTop: 20 }]}>Tiền sử bệnh</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    {
                                        this.renderItemDisease(1, "Tim mạch", true)
                                    }
                                    {
                                        this.renderItemDisease(4, "Tiểu đường", true)
                                    }
                                    {
                                        this.renderItemDisease(16, "Hô hấp", true)
                                    }
                                    {
                                        this.renderItemDisease(64, "Xương khớp", true)
                                    }
                                </View>
                                <View style={{ flex: 1 }}>
                                    {
                                        this.renderItemDisease(2, "Mỡ máu", false)
                                    }
                                    {
                                        this.renderItemDisease(8, "HIV", false)
                                    }
                                    {
                                        this.renderItemDisease(32, "Dạ dày", false)
                                    }
                                    {
                                        this.renderItemDisease(128, "Thiếu chất", false)
                                    }
                                </View>
                            </View>
                            <Form ref={ref => this.form = ref}>

                                <Text style={[styles.label, { marginTop: 20 }]}>Thông tin khác</Text>
                                <TextField validate={
                                    {
                                        rules: {
                                            maxlength: 255
                                        },
                                        messages: {
                                            maxlength: "Không cho phép nhập quá 255 kí tự"
                                        }
                                    }
                                } inputStyle={[styles.textinput, { marginTop: 10, height: 90, textAlignVertical: 'top', paddingTop: 13, paddingLeft: 10, paddingBottom: 13, paddingRight: 10 }]} onChangeText={(s) => { this.setState({ otherContent: s }) }} autoCapitalize={'none'}
                                    value={this.state.otherContent}
                                    returnKeyType={'next'}
                                    underlineColorAndroid='transparent'
                                    autoFocus={true}
                                    multiline={true}
                                    errorStyle={[styles.errorStyle, { marginLeft: 10, marginBottom: 10 }]}
                                    autoCorrect={false} />
                            </Form>
                            <Text style={[styles.label, { marginTop: 20 }]}>Tải ảnh lên</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                                {
                                    this.state.imageUris.map((item, index) => <View key={index} style={{ margin: 2, width: 88, height: 88, position: 'relative' }}>
                                        <View style={{ marginTop: 8, width: 80, height: 80 }}>
                                            <Image source={{ uri: item.uri }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: 8 }} />
                                            {
                                                item.error ?
                                                    <View style={{ position: 'absolute', left: 20, top: 20 }} >
                                                        <ScaleImage source={require("@images/ic_warning.png")} width={40} />
                                                    </View> :
                                                    item.loading ?
                                                        < View style={{ position: 'absolute', left: 20, top: 20, backgroundColor: '#FFF', borderRadius: 20 }} >
                                                            <ScaleImage source={require("@images/loading.gif")} width={40} />
                                                        </View>
                                                        : null
                                            }
                                        </View>
                                        <TouchableOpacity onPress={this.removeImage.bind(this, index)} style={{ position: 'absolute', top: 0, right: 0 }} >
                                            <ScaleImage source={require("@images/new/ic_close.png")} width={16} />
                                        </TouchableOpacity>
                                    </View>)
                                }
                                {
                                    !this.state.imageUris || this.state.imageUris.length < 5 ?
                                        <TouchableOpacity onPress={this.selectImage.bind(this)} style={{ marginTop: 10, width: 80, height: 80 }}>
                                            <ScaleImage width={80} source={require("@images/new/ic_new_image.png")} />
                                        </TouchableOpacity> : null
                                }
                            </View>
                            <TouchableOpacity onPress={this.createQuestion.bind(this)} style={{
                                width: 250,
                                backgroundColor: "#58bc91",
                                padding: 15,
                                borderRadius: 6,
                                alignSelf: "center",
                                margin: 36
                            }}>
                                <Text
                                    style={{ color: "#FFF", textAlign: "center", fontWeight: "bold", fontSize: 16 }}
                                >Gửi câu hỏi</Text>
                            </TouchableOpacity>
                        </Card>
                    </View>
                </ScrollView>
                <ImagePicker ref={ref => this.imagePicker = ref} />
                {
                    Platform.OS == 'ios' && <KeyboardSpacer />
                }
                <Modal isVisible={this.state.toggleModalSpecialize}
                    onSwipe={() => this.setState({ toggleModalSpecialize: false })}
                    swipeDirection="left"
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    onBackdropPress={() => this.toggleModalSpecialize()}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ borderBottomWidth: 2, borderBottomColor: "#0c8c8b", flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ fontWeight: 'bold', padding: 10, flex: 1 }}>
                                Chọn chuyên khoa
                            </Text>
                            <TouchableOpacity onPress={this.toggleModalSpecialize.bind(this)}>
                                <View style={{ padding: 10 }}>
                                    <ScaleImage source={require("@images/ic_close.png")} width={15}></ScaleImage>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {!this.state.specialist || this.state.specialist.length == 0 ? <View style={{ flex: 1 }}>
                            <Text style={{ fontStyle: 'italic', textAlign: 'center', padding: 10 }}>Không có chuyên khoa nào</Text></View> : null}

                        <FlatList
                            data={
                                this.state.specialist
                            }
                            extraData={this.state}
                            keyExtractor={(item, index) => index}

                            renderItem={({ item }) => <TouchableOpacity onPress={this.selectSpecialist.bind(this, item)}>
                                <Text style={{ padding: 15, fontWeight: 'bold', borderBottomColor: '#0c8c8b', borderBottomWidth: 1 }}>
                                    {item.specialist.name}
                                </Text>
                            </TouchableOpacity>
                            }
                        />
                    </View>
                </Modal>
            </ActivityPanel >
        );

    }
}
const styles = StyleSheet.create({
    label: {
        color: '#00000048', marginLeft: 9
    },
    field: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 17,
        borderColor: "#cacaca",
        borderWidth: 1,
        padding: 7
    },
    textinput: {
        borderColor: "#cacaca",
        borderWidth: 1,
        paddingLeft: 7,
        padding: padding,
        borderRadius: 6
    },
    errorStyle: {
        color: 'red',
        marginTop: 10,
        marginLeft: 6
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(CreateQuestionStep2Screen);