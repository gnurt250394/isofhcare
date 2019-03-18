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

import Form from 'mainam-react-native-form-validate/Form';
import TextField from 'mainam-react-native-form-validate/TextField';
import dataCacheProvider from '@data-access/datacache-provider';
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
            debugger;
            if (s) {
                this.setState({
                    disease: s.diseaseHistory || 0,
                    specialist_item: s.specialist
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

        connectionUtils.checkConnect(c => {
            if (c) {
                this.setState({ isLoading: true }, () => {
                    var images = "";
                    this.state.imageUris.forEach((item) => {
                        if (images)
                            images += ",";
                        images += item.url;
                    });
                    questionProvider.create(this.state.content, this.state.gender, this.state.age, this.state.specialist_item ? this.state.specialist_item.specialist.id : "0", this.state.disease, this.state.otherContent, images).then(s => {
                        debugger;
                        dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_POSTS, {
                            gender: this.state.gender,
                            age: this.state.age,
                            diseaseHistory: this.state.disease,
                            specialist: this.state.specialist_item
                        });
                        this.setState({ isLoading: false });
                        if (s && s.code == 0) {
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
            }
            else {
                snackbar.show("Không có kết nối mạng", "danger");
            }
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
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title={"Thông tin bổ sung"} showFullScreen={true} touchToDismiss={true} isLoading={this.state.isLoading}>
                <ScrollView style={{ flex: 1 }}
                    keyboardShouldPersistTaps="always">
                    <View style={{ padding: 10 }}>
                        <TouchableOpacity onPress={() => { this.toggleModalSpecialize() }}>
                            <View style={{ position: 'relative', margin: 20, marginTop: 0, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ borderColor: "#0c8c8b", borderWidth: 1, padding: 10, flex: 1 }}>
                                    {
                                        this.state.specialist_item ? this.state.specialist_item.specialist.name : "Chọn chuyên khoa"
                                    }
                                </Text>
                                <Image source={require("@images/icdropdown.png")} style={{ width: 14, height: 10, position: 'absolute', right: 10 }} />
                            </View>
                        </TouchableOpacity>
                        <Text style={{ fontWeight: 'bold' }}>Tiền sử bệnh</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1 }}>Tim mạch</Text>
                                    <TouchableOpacity onPress={this.selectDisease.bind(this, 1)} style={{ padding: 10, flexDirection: 'row' }}>
                                        {
                                            (this.state.disease & 1) == 1 ?
                                                <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                                <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                        }
                                    </TouchableOpacity>

                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1 }}>huyết áp</Text>
                                    <TouchableOpacity onPress={this.selectDisease.bind(this, 4)} style={{ padding: 10, flexDirection: 'row' }}>
                                        {
                                            (this.state.disease & 4) == 4 ?
                                                <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                                <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1 }}>Hô hấp</Text>
                                    <TouchableOpacity onPress={this.selectDisease.bind(this, 16)} style={{ padding: 10, flexDirection: 'row' }}>
                                        {
                                            (this.state.disease & 16) == 16 ?
                                                <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                                <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1 }}>Xương khớp</Text>
                                    <TouchableOpacity onPress={this.selectDisease.bind(this, 64)} style={{ padding: 10, flexDirection: 'row' }}>
                                        {
                                            (this.state.disease & 64) == 64 ?
                                                <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                                <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1 }}>Mỡ máu</Text>
                                    <TouchableOpacity onPress={this.selectDisease.bind(this, 2)} style={{ padding: 10, flexDirection: 'row' }}>
                                        {
                                            (this.state.disease & 2) == 2 ?
                                                <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                                <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1 }}>HIV</Text>
                                    <TouchableOpacity onPress={this.selectDisease.bind(this, 8)} style={{ padding: 10, flexDirection: 'row' }}>
                                        {
                                            (this.state.disease & 8) == 8 ?
                                                <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                                <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1 }}>Dạ dày</Text>
                                    <TouchableOpacity onPress={this.selectDisease.bind(this, 32)} style={{ padding: 10, flexDirection: 'row' }}>
                                        {
                                            (this.state.disease & 32) == 32 ?
                                                <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                                <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1 }}>Thiếu chất</Text>
                                    <TouchableOpacity onPress={this.selectDisease.bind(this, 128)} style={{ padding: 10, flexDirection: 'row' }}>
                                        {
                                            (this.state.disease & 128) == 128 ?
                                                <ScaleImage source={require("@images/ic_check_tick.png")} width={20} /> :
                                                <ScaleImage source={require("@images/ic_check.png")} width={20} />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <Form ref={ref => this.form = ref}>

                            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Thông tin khác</Text>
                            <TextField validate={
                                {
                                    rules: {
                                        maxlength: 255
                                    },
                                    messages: {
                                        maxlength: "Không cho phép nhập quá 255 kí tự"
                                    }
                                }
                            } inputStyle={[styles.textinput, { marginTop: 10, height: 50 }]} onChangeText={(s) => { this.setState({ otherContent: s }) }} autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid='transparent'
                                autoFocus={true}
                                multiline={true}
                                autoCorrect={false} />
                        </Form>
                        <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Hình ảnh <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(Tối đa 5 ảnh)</Text></Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                            {
                                this.state.imageUris.map((item, index) => <TouchableOpacity key={index} style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1 }}>
                                    <Image source={{ uri: item.uri }} resizeMode="cover" style={{ width: 100, height: 100, backgroundColor: '#000' }} />
                                    {
                                        item.error ?
                                            <View style={{ position: 'absolute', left: 30, top: 30 }} >
                                                <ScaleImage source={require("@images/ic_warning.png")} width={40} />
                                            </View> :
                                            item.loading ?
                                                < View style={{ position: 'absolute', left: 30, top: 30, backgroundColor: '#FFF', borderRadius: 20 }} >
                                                    <ScaleImage source={require("@images/loading.gif")} width={40} />
                                                </View>
                                                : null
                                    }
                                    <TouchableOpacity onPress={this.removeImage.bind(this, index)} style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#FFFFFF70', padding: 1, borderRadius: 5, margin: 2 }} >
                                        <ScaleImage source={require("@images/icclose.png")} width={12} />
                                    </TouchableOpacity>
                                </TouchableOpacity>)
                            }
                            {
                                !this.state.imageUris || this.state.imageUris.length < 5 ?
                                    <TouchableOpacity onPress={this.selectImage.bind(this)} style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <ScaleImage width={40} source={require("@images/ic_add_image.png")} />
                                        <Text>Thêm ảnh</Text>
                                    </TouchableOpacity> : null
                            }
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={this.createQuestion.bind(this)} style={{ width: 200, backgroundColor: '#58bc91', padding: 15, borderRadius: 25, alignSelf: 'center', margin: 10 }}>
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>{this.state.post ? "Lưu" : "Gửi"}</Text>
                </TouchableOpacity>
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
            </ActivityPanel>
        );

    }
}
const styles = StyleSheet.create({
    field: {
        flexDirection: 'row', alignItems: 'center', marginTop: 17, borderColor: '#cacaca', borderWidth: 1, padding: 7
    }, textinput:
        { borderColor: '#cacaca', borderWidth: 1, paddingLeft: 7, padding: padding }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(CreateQuestionStep2Screen);