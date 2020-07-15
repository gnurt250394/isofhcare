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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
        dataCacheProvider.read(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_INFO, (s, e) => {
            this.setState({
                specialist: s[0].specialist
                , disease: s[0].disease, otherContent: s[0].otherContent, imageUris: s[0].imageUris
            })
        })
        dataCacheProvider.read(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_POSTS, (s, e) => {
            if (s && s.post) {
                let images = (s.post.images || "").split(',').filter(x => x != "").map(x => {
                    return {
                        uri: x,
                        url: x,
                        thumbnail: x,
                        loading: false,
                        error: false
                    }
                });
                this.setState({
                    disease: s.post.diseaseHistory || 0,
                    // specialist: s.specialist ? { specialist: s.specialist } : null,
                    // otherContent: s.post.otherContent,
                    // imageUris: images
                })
            }
        })
    }
    onClickBack = () => {

        let data = [{ specialist: this.state.specialist, disease: this.state.disease, otherContent: this.state.otherContent, imageUris: this.state.imageUris }]
        dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_INFO, data);
        this.props.navigation.pop()
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
                this.imagePicker.show({
                    multiple: true,
                    mediaType: 'photo',
                    maxFiles: 5,
                    compressImageMaxWidth: 500,
                    compressImageMaxHeight: 500
                }).then(images => {
                    let listImages = [];
                    if (images.length)
                        listImages = [...images];
                    else
                        listImages.push(images);
                    let imageUris = this.state.imageUris;
                    listImages.forEach(image => {
                        if (imageUris.length >= 5)
                            return;
                        let temp = null;
                        imageUris.forEach((item) => {
                            if (item.uri == image.path)
                                temp = item;
                        })
                        if (!temp) {
                            imageUris.push({ uri: image.path, loading: true });
                            imageProvider.upload(image.path, image.mime, (s, e) => {
                                if (s.success) {
                                    if (s && s.data.length > 0) {
                                        let imageUris = this.state.imageUris;
                                        imageUris.forEach((item) => {
                                            if (item.uri == s.uri) {
                                                item.loading = false;
                                                item.url = s.data[0].fileDownloadUri;
                                                item.thumbnail = s.data[0].fileDownloadUri;
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
                    })
                    this.setState({ imageUris: [...imageUris] });
                });

            }
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        });
    }
    createQuestion() {
        if (!this.form.isValid()) {
            return;
        }

        for (var i = 0; i < this.state.imageUris.length; i++) {
            if (this.state.imageUris[i].loading) {
                snackbar.show(constants.msg.booking.image_loading, 'danger');
                return;
            }
            if (this.state.imageUris[i].error) {
                snackbar.show(constants.msg.booking.image_load_err, 'danger');
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
                questionProvider.create(this.state.content, this.state.gender, this.state.age, this.state.specialist ? this.state.specialist.id : "0", this.state.disease, this.state.otherContent, images).then(s => {
                    this.setState({ isLoading: false });
                    if (s && s.code == 0) {
                        dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_POSTS, s.data);
                        snackbar.show(constants.msg.question.create_question_success, "success");
                        this.props.navigation.navigate("listQuestion", { reloadTime: new Date().getTime() });
                        dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_INFO, '');
                    } else {
                        snackbar.show(constants.msg.question.create_question_failed, "danger");
                    }
                }).catch(e => {
                    this.setState({ isLoading: false });
                    snackbar.show(constants.msg.question.create_question_failed, "danger");
                });
            });
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })
    }

    toggleModalSpecialize = () => {
        Keyboard.dismiss();
        this.setState({
            toggleModalSpecialize: !this.state.toggleModalSpecialize
        })
    }

    selectSpecialist(specialize) {
        this.setState({ specialist: specialize })
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
        return <View style={{ height: 50 }}>
            <TouchableOpacity onPress={this.selectDisease.bind(this, value)} style={[styles.buttonSelected, {
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? '#02C39A' : 'rgba(151,151,151,0.36)',
                marginRight: left ? 5 : 0,
                marginLeft: !left ? 5 : 0,
            }]}>
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
                <Text style={styles.txtContent} numberOfLines={1} ellipsizeMode='tail'>{text}</Text>
                <View style={styles.row}>
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
    onSelectSpecialist = () => {
        this.props.navigation.navigate("selectSpecialist", {
            onSelected: this.selectSpecialist.bind(this)
        });
    }
    onChangeText = state => value => {
        this.setState({ [state]: value })
    }
    onSwipe = () => this.setState({ toggleModalSpecialize: false })
    renderItem = ({ item }) => <TouchableOpacity onPress={this.selectSpecialist.bind(this, item)}>
        <Text style={styles.txtSpecialistName}>
            {item.specialist.name}
        </Text>
    </TouchableOpacity>
    keyExtractor = (item, index) => index.toString()
    render() {
        return (
            <ActivityPanel
                backButtonClick={this.onClickBack}
                style={{ flex: 1 }}
                title={constants.title.info_complementary}
                showFullScreen={true}
                isLoading={this.state.isLoading}
            >
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    style={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                // keyboardDismissMode='on-drag'
                >
                    <KeyboardAwareScrollView >
                        <View style={styles.backgroundHeader}></View>
                        <View style={styles.container}>
                            <Card style={styles.card}>
                                <View style={styles.minus}></View>
                                <Text style={[styles.label, { marginTop: 15 }]}>{constants.questions.specialist_asking}</Text>
                                <TouchableOpacity onPress={this.onSelectSpecialist} style={[styles.textinput, styles.buttonSelectSpecialist]}>
                                    <Text style={styles.txtSpecialist}>
                                        {
                                            this.state.specialist && this.state.specialist.name ? this.state.specialist.name : constants.title.select_specialist
                                        }
                                    </Text>
                                    <ScaleImage source={require("@images/ic_dropdown.png")} height={8} style={{ marginRight: 5 }} />
                                </TouchableOpacity>
                                <Text style={[styles.label, { marginTop: 20 }]}>{constants.questions.anamnesis}</Text>
                                <View style={styles.row}>
                                    <View style={styles.flex}>
                                        {
                                            this.renderItemDisease(1, constants.questions.heart, true)
                                        }
                                        {
                                            this.renderItemDisease(4, constants.questions.diabetes, true)
                                        }
                                        {
                                            this.renderItemDisease(16, constants.questions.respiratory, true)
                                        }
                                        {
                                            this.renderItemDisease(64, constants.questions.osteoarthritis, true)
                                        }
                                    </View>
                                    <View style={styles.flex}>
                                        {
                                            this.renderItemDisease(2, constants.questions.cholesterol, false)
                                        }
                                        {
                                            this.renderItemDisease(8, constants.questions.HIV, false)
                                        }
                                        {
                                            this.renderItemDisease(32, constants.questions.stomach, false)
                                        }
                                        {
                                            this.renderItemDisease(128, constants.questions.lack_of_substance, false)
                                        }
                                    </View>
                                </View>
                                <Form ref={ref => this.form = ref}>

                                    <Text style={[styles.label, { marginTop: 20 }]}>{constants.questions.other_info}</Text>
                                    <TextField validate={
                                        {
                                            rules: {
                                                maxlength: 255
                                            },
                                            messages: {
                                                maxlength: constants.msg.user.text_without_255
                                            }
                                        }
                                    } inputStyle={[styles.textinput, styles.inputOtherInfo]}
                                        onChangeText={this.onChangeText('otherContent')}
                                        autoCapitalize={'none'}
                                        value={this.state.otherContent}
                                        returnKeyType={'next'}
                                        underlineColorAndroid='transparent'
                                        autoFocus={true}
                                        multiline={true}
                                        errorStyle={[styles.errorStyle, { marginLeft: 10, marginBottom: 10 }]}
                                        autoCorrect={false} />
                                </Form>
                                <Text style={[styles.label, { marginTop: 20 }]}>{constants.upload_image}</Text>
                                <View style={styles.containerListImage}>
                                    {
                                        this.state.imageUris.map((item, index) => <View key={index} style={styles.groupImagePicker}>
                                            <View style={styles.groupImage}>
                                                <Image source={{ uri: item.uri }} resizeMode="cover" style={styles.imagePicker} />
                                                {
                                                    item.error ?
                                                        <View style={styles.imageError} >
                                                            <ScaleImage source={require("@images/ic_warning.png")} width={40} />
                                                        </View> :
                                                        item.loading ?
                                                            < View style={styles.imageLoading} >
                                                                <ScaleImage source={require("@images/loading.gif")} width={40} />
                                                            </View>
                                                            : null
                                                }
                                            </View>
                                            <TouchableOpacity onPress={this.removeImage.bind(this, index)} style={styles.buttonClose} >
                                                <ScaleImage source={require("@images/new/ic_close.png")} width={16} />
                                            </TouchableOpacity>
                                        </View>)
                                    }
                                    {
                                        !this.state.imageUris || this.state.imageUris.length < 5 ?
                                            <TouchableOpacity onPress={this.selectImage.bind(this)} style={styles.buttonSelectImage}>
                                                <ScaleImage width={80} source={require("@images/new/ic_new_image.png")} />
                                            </TouchableOpacity> : null
                                    }
                                </View>
                                <TouchableOpacity onPress={this.createQuestion.bind(this)} style={styles.buttonCreateQuestion}>
                                    <Text
                                        style={styles.txtCreateQuestion}
                                    >{constants.questions.send_question}</Text>
                                </TouchableOpacity>
                            </Card>
                        </View>
                    </KeyboardAwareScrollView>
                </ScrollView>
                <ImagePicker ref={ref => this.imagePicker = ref} />
                {
                    Platform.OS == 'ios' && <KeyboardSpacer />
                }
                <Modal isVisible={this.state.toggleModalSpecialize}
                    onSwipe={this.onSwipe}
                    swipeDirection="left"
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    onBackdropPress={this.toggleModalSpecialize}
                    style={stylemodal.bottomModal}>
                    <View style={styles.containerModal}>
                        <View style={styles.containerSelectSpecialist}>
                            <Text style={styles.txtSelectSpecialist}>
                                {constants.title.select_specialist}
                            </Text>
                            <TouchableOpacity onPress={this.toggleModalSpecialize}>
                                <View style={{ padding: 10 }}>
                                    <ScaleImage source={require("@images/ic_close.png")} width={15}></ScaleImage>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {!this.state.specialist || this.state.specialist.length == 0 ? <View style={{ flex: 1 }}>
                            <Text style={styles.notSpecialist}>{constants.questions.specialist_not_found}</Text></View> : null}

                        <FlatList
                            data={this.state.specialist}
                            extraData={this.state}
                            keyExtractor={this.keyExtractor}

                            renderItem={this.renderItem}
                        />
                    </View>
                </Modal>
            </ActivityPanel >
        );

    }
}
const styles = StyleSheet.create({
    txtSpecialistName: {
        padding: 15,
        fontWeight: 'bold',
        borderBottomColor: '#0c8c8b',
        borderBottomWidth: 1
    },
    notSpecialist: {
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 10
    },
    txtSelectSpecialist: {
        fontWeight: 'bold',
        padding: 10,
        flex: 1
    },
    containerSelectSpecialist: {
        borderBottomWidth: 2,
        borderBottomColor: "#0c8c8b",
        flexDirection: 'row',
        alignItems: "center"
    },
    containerModal: {
        backgroundColor: '#fff',
        elevation: 3,
        flexDirection: 'column',
        maxHeight: 400,
        minHeight: 100
    },
    txtCreateQuestion: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16
    },
    buttonCreateQuestion: {
        width: 250,
        backgroundColor: "#58bc91",
        padding: 15,
        borderRadius: 6,
        alignSelf: "center",
        margin: 36
    },
    buttonSelectImage: {
        marginTop: 10,
        width: 80,
        height: 80
    },
    buttonClose: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    imageLoading: {
        position: 'absolute',
        left: 20,
        top: 20,
        backgroundColor: '#FFF',
        borderRadius: 20
    },
    imageError: {
        position: 'absolute',
        left: 20,
        top: 20
    },
    imagePicker: {
        width: 80,
        height: 80,
        borderRadius: 8
    },
    groupImage: {
        marginTop: 8,
        width: 80,
        height: 80
    },
    groupImagePicker: {
        margin: 2,
        width: 88,
        height: 88,
        position: 'relative'
    },
    containerListImage: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10
    },
    inputOtherInfo: {
        marginTop: 10,
        height: 90,
        textAlignVertical: 'top',
        paddingTop: 13,
        paddingLeft: 10,
        paddingBottom: 13,
        paddingRight: 10
    },
    flex: { flex: 1 },
    txtSpecialist: {
        padding: 10,
        flex: 1,
        color: "#4A4A4A",
        fontWeight: '600'
    },
    buttonSelectSpecialist: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6
    },
    minus: {
        backgroundColor: '#02C39A',
        width: 20,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center'
    },
    card: {
        padding: 22
    },
    container: {
        margin: 22,
        marginTop: 10
    },
    backgroundHeader: {
        backgroundColor: '#02C39A',
        height: 130,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    scroll: {
        flex: 1,
        position: 'relative'
    },
    row: { flexDirection: 'row' },
    txtContent: {
        flex: 1,
        marginHorizontal: 5,
        fontSize: 13,
        fontWeight: '500'
    },
    buttonSelected: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 6,
        borderRadius: 6
    },
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
        borderRadius: 6,
        color: '#000'
    },
    errorStyle: {
        color: 'red',
        marginTop: 10,
        marginLeft: 6
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(CreateQuestionStep2Screen);