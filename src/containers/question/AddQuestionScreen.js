
import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TouchableOpacity, Text, Platform, TextInput, ScrollView, KeyboardAvoidingView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
import conferenceTopicProvider from "@data-access/conference/topic-provider";
import conferenceSessionProvider from "@data-access/conference/session-provider";
import conferenceQuestionProvider from "@data-access/conference/question-provider";
import constants from '@resources/strings';

class AddQuestionScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listQuesion: [],
            listTopics: [],
            listSessions: [],
            loadingTopic: true,
            loadingQuestion: true
        }
    }

    showListChuDe() {
        this.setState({ toggleChuDe: true });
    }
    showListPhien() {
        this.setState({ togglePhien: true });
    }

    showTemplateQuestion() {
        this.setState({ toggleListQuestion: true });
    }

    componentDidMount() {
        this.setState({
            currentTopic: this.props.topic,
            loadingTopic: true,
        });
        if (this.props.session) {
            this.setState({
                currentSession: {
                    conferenceSession: this.props.session
                }
            });
        }
        conferenceTopicProvider.getByConference(this.props.conference.conference.id, (s, e) => {
            if (s) {
                this.setState({
                    loadingTopic: false,
                    listTopics: s.data.data,
                });
            }
        });
        if (this.props.topic) {
            this.setState({
                loadingSession: true
            });

            conferenceSessionProvider.getByTopic(this.props.topic.id, (s, e) => {
                if (s && s.data) {
                    this.setState({
                        listSessions: s.data.data,
                        loadingSession: false
                    });
                }
            });
        }
        conferenceQuestionProvider.getTemplate(this.props.conference.conference.id, (s, e) => {
            if (s && s.data) {
                this.setState({
                    loadingQuestion: false,
                    listQuesion: s.data.data
                });
            }
            else {
                this.setState({
                    loadingQuestion: false,
                });
            }
        });
    }
    selectSession(item) {
        if (this.state.currentSession && item.id == this.state.currentSession.id) {
            this.setState({ currentSession: null, togglePhien: false })
        } else {
            this.setState({ currentSession: item, togglePhien: false })
        }

    }
    selectTopic(item) {
        if (this.state.currentTopic && item.id == this.state.currentTopic.id) {
            this.setState({
                currentTopic: null, toggleChuDe: false, currentSession: null,
                listSessions: []
            })
        } else {
            this.setState({
                currentTopic: item, toggleChuDe: false, currentSession: null,
                listSessions: [],
                loadingSession: true
            });
            conferenceSessionProvider.getByTopic(item.id, (s, e) => {
                if (s && s.data) {
                    this.setState({
                        listSessions: s.data.data,
                        loadingSession: false
                    });
                }
                else {
                    this.setState({
                        loadingSession: false
                    });
                }
            });
        }
    }

    send() {
        if (!this.state.content || !this.state.content.trim()) {
            snackbar.show(constants.msg.question.please_input_content);
            return;
        }
        this.setState({
            isLoading: true
        });

        conferenceQuestionProvider.create(this.state.content, this.props.conference.conference.id, this.state.currentTopic ? this.state.currentTopic.id : "", this.state.currentSession ? this.state.currentSession.conferenceSession.id : "", (s, e) => {
            this.setState({
                isLoading: false
            });
            if (s && s.code == 0) {
                snackbar.show(constants.msg.question.create_question_success);
                this.setState({
                    currentSession: null,
                    currentTopic: null,
                    content: ""
                });
                Actions.pop();
            }
            else {
                snackbar.show(constants.msg.question.create_question_failed);
            }
        });
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Đặt câu hỏi" showFullScreen={true} isLoading={this.state.isLoading}>
                <ScrollView style={{ paddingTop: 50, paddingLeft: 10, paddingRight: 10 }}>
                    <TouchableOpacity onPress={() => { this.showListChuDe() }} style={{ padding: 16, borderWidth: 1, borderColor: 'rgb(0,121,107)', borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        {
                            this.state.currentTopic ?
                                <Text style={{ color: "rgb(0,121,107)", fontWeight: 'bold', fontSize: 14, flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>{this.state.currentTopic.name}</Text> :
                                <Text style={{ color: "rgb(0,121,107)", fontWeight: 'bold', fontSize: 14, flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>CHỌN CHỦ ĐỀ</Text>
                        }
                        <ScaleImage source={require("@images/icdropdown.png")} width={13} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.showListPhien() }} style={{ marginTop: 16, padding: 16, borderWidth: 1, borderColor: 'rgb(0,121,107)', borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        {
                            this.state.currentSession ?
                                <Text style={{ color: "rgb(0,121,107)", fontWeight: 'bold', fontSize: 14, flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>{this.state.currentSession.conferenceSession.name}</Text> :
                                <Text style={{ color: "rgb(0,121,107)", fontWeight: 'bold', fontSize: 14, flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>CHỌN PHIÊN</Text>
                        }
                        <ScaleImage source={require("@images/icdropdown.png")} width={13} />
                    </TouchableOpacity>
                    <Text style={{ marginTop: 32, padding: 10, lineHeight: 22 }}>Quý vị có thể chọn câu hỏi
                    <Text style={{ padding: 10, color: "rgb(0,121,107)", fontWeight: '900', fontSize: 16 }} onPress={() => this.showTemplateQuestion()} > tại đây</Text> hoặc nhập câu hỏi cho báo cáo viên</Text>
                    <KeyboardAvoidingView behavior={'padding'} >
                        <View style={{ marginTop: 19, padding: 16, borderWidth: 1, borderColor: 'rgb(0,121,107)', borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                onChangeText={(s) => this.setState({
                                    content: s
                                })}
                                placeholder="NHẬP NỘI DUNG CÂU HỎI"
                                underlineColorAndroid="transparent" style={{ flex: 1, height: 150, textAlignVertical: "top" }} multiline={true}
                                value={this.state.content} />
                        </View>
                    </KeyboardAvoidingView>
                    <TouchableOpacity style={{ backgroundColor: "rgb(0,121,107)", marginTop: 16, padding: 16, borderWidth: 1, borderColor: 'rgb(0,121,107)', borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}
                        onPress={this.send.bind(this)}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, flex: 1, color: 'white', textAlign: 'center' }}>GỬI CÂU HỎI</Text>
                    </TouchableOpacity>

                    <View style={{ height: 400 }} />
                </ScrollView>
                <Modal isVisible={this.state.toggleListQuestion}
                    onBackdropPress={() => this.setState({ toggleListQuestion: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                                CHỌN CÂU HỎI MẪU
                            </Text>
                        </View>

                        <View style={{ padding: 19, paddingTop: 0 }}>
                            {
                                this.state.loadingQuestion ?
                                    <View style={{ alignItems: 'center' }}>
                                        <ScaleImage source={require("@images/loading.gif")} width={50} />
                                    </View>
                                    :
                                    !this.state.listQuesion || this.state.listQuesion.length == 0 ?
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontStyle: 'italic' }}>Hiện tại không có câu hỏi mẫu nào</Text>
                                        </View> :

                                        <FlatList
                                            style={{ paddingTop: 5 }}
                                            ref={ref => this.flatList = ref}
                                            keyExtractor={(item, index) => index.toString()}
                                            extraData={this.state}
                                            data={this.state.listQuesion}
                                            ListFooterComponent={() => <View style={{ height: 20 }}></View>}
                                            renderItem={({ item, index }) =>
                                                <TouchableOpacity onPress={() => { this.setState({ toggleListQuestion: false, content: item.conferenceQuestion.content }) }}>
                                                    <View style={{ paddingTop: 10, position: 'relative', marginBottom: 15 }}>
                                                        <Text style={{ padding: 10, paddingTop: 15, borderWidth: 1, borderColor: 'rgb(0,121,107)', borderRadius: 5, }}>{item.conferenceQuestion.content}</Text>
                                                        <Text style={{ position: 'absolute', backgroundColor: 'rgb(0,121,107)', color: 'white', padding: 2, left: 10, paddingLeft: 5, paddingRight: 5, fontWeight: 'bold' }}>{index + 1}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }
                                        />
                            }
                        </View>
                    </View>
                </Modal>
                <Modal isVisible={this.state.toggleChuDe}
                    onBackdropPress={() => this.setState({ toggleChuDe: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                                CHỌN CHỦ ĐỀ
                            </Text>
                        </View>

                        <View style={{ padding: 19, paddingTop: 0 }}>
                            {
                                this.state.loadingTopic ?
                                    <View style={{ alignItems: 'center' }}>
                                        <ScaleImage source={require("@images/loading.gif")} width={50} />
                                    </View>
                                    :
                                    !this.state.listTopics || this.state.listTopics.length == 0 ?
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontStyle: 'italic' }}>Hiện tại không có chủ đề nào</Text>
                                        </View> :
                                        <FlatList
                                            style={{ paddingTop: 5 }}
                                            ref={ref => this.flatList = ref}
                                            keyExtractor={(item, index) => index.toString()}
                                            extraData={this.state}
                                            data={this.state.listTopics}
                                            ListFooterComponent={() => <View style={{ height: 20 }}></View>}
                                            renderItem={({ item, index }) =>
                                                <TouchableOpacity onPress={this.selectTopic.bind(this, item)}>
                                                    <View style={{
                                                        elevation: 2,
                                                        backgroundColor: 'white',
                                                        paddingTop: 16, paddingBottom: 16,
                                                        margin: 5,
                                                        borderRadius: 4.7,
                                                        padding: 10,
                                                    }} shadowColor={this.state.currentTopic && this.state.currentTopic.id == item.id ? 'red' : '#000000'} shadowOpacity={this.state.currentTopic && this.state.currentTopic.id == item.id ? 0.8 : 0.2} shadowOffset={{}}>
                                                        <Text style={{ fontSize: 16, textAlign: 'justify', fontWeight: '900' }}>
                                                            {index + 1}. {item.name}
                                                        </Text>

                                                    </View>
                                                </TouchableOpacity>
                                            }
                                        />
                            }
                        </View>
                    </View>
                </Modal>
                <Modal isVisible={this.state.togglePhien}
                    onBackdropPress={() => this.setState({ togglePhien: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                                CHỌN PHIÊN
                            </Text>
                        </View>

                        <View style={{ padding: 19, paddingTop: 0 }}>
                            {
                                !this.state.currentTopic ?
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontStyle: 'italic' }}>Vui lòng chọn chủ đề</Text>
                                    </View> :
                                    this.state.loadingSession ?
                                        <View style={{ alignItems: 'center' }}>
                                            <ScaleImage source={require("@images/loading.gif")} width={50} />
                                        </View>
                                        :
                                        !this.state.listSessions || this.state.listSessions.length == 0 ?
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={{ fontStyle: 'italic' }}>Không tìm thấy phiên nào của chủ đề đang chọn</Text>
                                            </View>
                                            :
                                            <FlatList
                                                style={{ paddingTop: 5 }}
                                                ref={ref => this.flatList = ref}
                                                keyExtractor={(item, index) => index.toString()}
                                                extraData={this.state}
                                                data={this.state.listSessions}
                                                ListFooterComponent={() => <View style={{ height: 20 }}></View>}
                                                renderItem={({ item, index }) =>
                                                    <TouchableOpacity onPress={this.selectSession.bind(this, item)}>
                                                        <View style={{
                                                            elevation: 2,
                                                            backgroundColor: 'white',
                                                            paddingTop: 16, paddingBottom: 16,
                                                            margin: 5,
                                                            borderRadius: 4.7,
                                                            padding: 10,
                                                        }} shadowColor={this.state.currentSession && this.state.currentSession.id == item.id ? 'red' : '#000000'} shadowOpacity={this.state.currentSession && this.state.currentSession.id == item.id ? 0.8 : 0.2} shadowOffset={{}}>
                                                            <Text style={{ fontSize: 16, textAlign: 'justify', fontWeight: '900' }}>
                                                                {index + 1}. {item.conferenceSession.name}
                                                            </Text>

                                                        </View>
                                                    </TouchableOpacity>
                                                }
                                            />
                            }
                        </View>
                    </View>
                </Modal>
            </ActivityPanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        conference: state.conference
    };
}
export default connect(mapStateToProps)(AddQuestionScreen);