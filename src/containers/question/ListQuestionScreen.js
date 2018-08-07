
import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TouchableOpacity, Text, Platform, TextInput, ScrollView, KeyboardAvoidingView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
import ImageProgress from 'mainam-react-native-image-progress';
import dateUtils from 'mainam-react-native-date-utils';
import Progress from 'react-native-progress/Pie';
import userProvider from "@data-access/user-provider";
import conferenceTopicProvider from "@data-access/conference/topic-provider";
import conferenceSessionProvider from "@data-access/conference/session-provider";
import conferenceQuestionProvider from "@data-access/conference/question-provider";
import clientUtils from '@utils/client-utils';

class ListQuestionScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listQuesion: [],
            listTopics: [],
            listSessions: [],
            loadingTopic: true,
            refreshing: false,
            size: 10,
            page: 1,
            finish: false,
            loading: false
        }
    }

    showListChuDe() {
        this.setState({ toggleChuDe: true });
    }
    showListPhien() {
        this.setState({ togglePhien: true });
    }
    componentDidMount() {
        conferenceTopicProvider.getByConference(this.props.conference.conference.id, (s, e) => {
            if (s) {
                this.setState({
                    loadingTopic: false,
                    listTopics: s.data.data
                });
            }
        });
        this.onRefresh();
    }

    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
                this.onLoad();
            });
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        })
        conferenceQuestionProvider.getListQuestion(this.props.conference.conference.id, this.state.currentTopic ? this.state.currentTopic.id : "", this.state.currentSession ? this.state.currentSession.conferenceSession.id : "", page, size, (s, e) => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
            });
            if (s) {
                switch (s.code) {
                    case 0:
                        var list = [];
                        var finish = false;
                        if (s.data.data.length == 0) {
                            finish = true;
                        }
                        if (page != 1) {
                            list = this.state.listQuesion;
                            list.push.apply(list, s.data.data);
                        }
                        else {
                            list = s.data.data;
                        }
                        this.setState({
                            listQuesion: [...list],
                            finish: finish
                        });
                        break;
                }
            }
        });
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState({ loadMore: true, refreshing: false, loading: true, page: this.state.page + 1 }, () => {
                this.onLoad(this.state.page)
            });
    }


    selectSession(item) {
        if (item == this.state.currentSession) {
            this.setState({ currentSession: null, togglePhien: false })
        } else {
            this.setState({ currentSession: item, togglePhien: false })
        }
        this.onRefresh();

    }
    selectTopic(item) {
        if (item == this.state.currentTopic) {
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
        this.onRefresh();
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Danh sách câu hỏi" showFullScreen={true}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ backgroundColor: 'rgb(255,132,137)', flex: 1, justifyContent: 'center', borderRadius: 16, flexDirection: 'row', alignItems: 'center', padding: 13, paddingBottom: 10, paddingTop: 10, margin: 15, marginRight: 8 }}
                        onPress={() => { this.showListChuDe() }}>
                        {
                            this.state.currentTopic ?
                                <Text style={{ color: "#FFF", fontWeight: 'bold', fontSize: 14, flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>{this.state.currentTopic.name}</Text> :
                                <Text style={{ color: "#FFF", fontWeight: 'bold', fontSize: 14, flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>CHỌN CHỦ ĐỀ</Text>
                        }
                        <ScaleImage source={require("@images/arrdown.png")} width={13} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: 'rgb(0,121,107)', flex: 1, justifyContent: 'center', borderRadius: 16, flexDirection: 'row', alignItems: 'center', padding: 13, paddingBottom: 10, paddingTop: 10, margin: 15, marginLeft: 8 }}
                        onPress={() => { this.showListPhien() }}>
                        {
                            this.state.currentSession ?
                                <Text style={{ color: "#FFF", fontWeight: 'bold', fontSize: 14, flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>{this.state.currentSession.conferenceSession.name}</Text> :
                                <Text style={{ color: "#FFF", fontWeight: 'bold', fontSize: 14, flex: 1 }} ellipsizeMode="tail" numberOfLines={1}>CHỌN PHIÊN</Text>
                        }
                        <ScaleImage source={require("@images/arrdown.png")} width={13} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                    onEndReached={this.onLoadMore.bind(this)}
                    onEndReachedThreshold={1}
                    style={{ flex: 1, paddingTop: 5 }}
                    ref={ref => this.flatList = ref}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.listQuesion}
                    ListHeaderComponent={() =>
                        !this.state.loading && (!this.state.listQuesion || this.state.listQuesion.length == 0) ?
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <Text style={{ fontStyle: 'italic' }}>Không tìm thấy câu hỏi nào</Text>
                            </View>
                            : null
                    }

                    ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                    renderItem={({ item, index }) =>
                        <View style={{
                            elevation: 3,
                            backgroundColor: 'white',
                            padding: 30,
                            paddingTop: 16, paddingBottom: 16,
                            marginBottom: 10
                        }} shadowColor='#000000' shadowOpacity={0.2} shadowOffset={{}}>
                            <View style={{ flexDirection: 'row', marginBottom: 11 }}>
                                <ImageProgress
                                    indicator={Progress} resizeMode='cover' style={{ width: 50, height: 50 }} imageStyle={{ width: 50, height: 50 }} source={{ uri: item.user && item.user.avatar ? item.user.avatar.absoluteUrl() : "undefined" }}
                                    defaultImage={() => {
                                        return <ScaleImage resizeMode='cover' source={require("@images/doctor.png")} width={50} style={{ width: 50, height: 50 }} />
                                    }} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.user && item.user.degree ? item.user.degree : ""} {item.user && item.user.name}</Text>
                                    <Text style={{ color: 'rgba(0,0,0,0.6)', marginBottom: 4, fontSize: 12 }}>{item.conferenceQuestion.createdDate.toDateObject().getPostTime()}</Text>
                                    <Text style={{ color: 'rgba(192,33,38,0.8)' }}>{userProvider.getFirstPosition(item.user)}</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 16, lineHeight: 22, textAlign: 'justify' }}>
                                {item.conferenceQuestion.content}
                            </Text>

                        </View>
                    }
                />
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
                                                    }} shadowColor={this.state.currentTopic == item ? 'red' : '#000000'} shadowOpacity={this.state.currentTopic == item ? 0.8 : 0.2} shadowOffset={{}}>
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
                                                        }} shadowColor={this.state.currentTopic == item ? 'red' : '#000000'} shadowOpacity={this.state.currentTopic == item ? 0.8 : 0.2} shadowOffset={{}}>
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
                {
                    this.state.loadMore ?
                        <View style={{ alignItems: 'center', padding: 10 }}>
                            <ScaleImage width={20} source={require("@images/loading2.gif")} />
                        </View> : null
                }
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
export default connect(mapStateToProps)(ListQuestionScreen);