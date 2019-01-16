import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ScrollView, View, Text, StyleSheet, TextInput, Platform, Switch, Keyboard, Image } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import snackbar from '@utils/snackbar-utils';
import questionProvider from '@data-access/question-provider';
import constants from '@resources/strings';
const padding = Platform.select({
    ios: 7,
    android: 2
});
class CreateQuestionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUris: []
        }
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
        if (!this.state.title || !this.state.title.trim()) {
            snackbar.show(constants.msg.question.please_input_title, 'danger');
            return;
        }
        if (!this.state.content || !this.state.content.trim()) {
            snackbar.show(constants.msg.question.please_input_content, 'danger');
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
        this.setState({ isLoading: true }, () => {
            var images = "";
            this.state.imageUris.forEach((item) => {
                if (images)
                    images += ",";
                images += item.url;
            });
            questionProvider.create("", [], this.state.title, this.state.content, images, this.state.isPrivate ? 1 : 0, (s, e) => {
                this.setState({ isLoading: false });
                if (s && s.code == 0) {
                    snackbar.show(constants.msg.question.create_question_success, "success");
                    this.props.navigation.pop();
                } else {
                    snackbar.show(constants.msg.question.create_question_failed, "danger");
                }
            });
        })
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Đặt câu hỏi" showFullScreen={true} touchToDismiss={true} isLoading={this.state.isLoading}>
                <ScrollView style={{ flex: 1 }}
                    keyboardShouldPersistTaps="always">
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Tiêu đề</Text>
                        <TextInput
                            autoFocus={true} placeholder="Nhập tiêu đề câu hỏi" underlineColorAndroid='transparent' style={[styles.textinput, { marginTop: 10 }]}
                            onChangeText={(s) => { this.setState({ title: s }) }}
                        />
                        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Nội dung</Text>
                        <TextInput
                            multiline={true}
                            autoFocus={true} placeholder="Nhập nội dung câu hỏi" underlineColorAndroid='transparent' style={[styles.textinput, { marginTop: 10, height: 150 }]}
                            onChangeText={(s) => { this.setState({ content: s }) }}
                        />
                        <View style={{ marginTop: 10, alignItems: 'center' }} flexDirection="row">
                            <Text style={{ flex: 1, fontWeight: '700' }}>Không hiển thị người hỏi</Text>
                            <Switch value={this.state.isPrivate} onValueChange={x => this.setState({ isPrivate: x })} />
                        </View>
                        <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Hình ảnh <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(Tối đa 4 ảnh)</Text></Text>
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
                                !this.state.imageUris || this.state.imageUris.length < 4 ?
                                    <TouchableOpacity onPress={this.selectImage.bind(this)} style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <ScaleImage width={40} source={require("@images/ic_add_image.png")} />
                                        <Text>Thêm ảnh</Text>
                                    </TouchableOpacity> : null
                            }
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={this.createQuestion.bind(this)} style={{ width: 200, backgroundColor: '#58bc91', padding: 15, borderRadius: 25, alignSelf: 'center', margin: 10 }}>
                    <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: 'bold' }}>Gửi</Text>
                </TouchableOpacity>
                <ImagePicker ref={ref => this.imagePicker = ref} />
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
export default connect(mapStateToProps)(CreateQuestionScreen);