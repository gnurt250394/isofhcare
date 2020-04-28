import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet,Dimensions } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import questionProvider from '@data-access/question-provider';
import dateUtils from 'mainam-react-native-date-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import ListQuestion from '@components/question/ListQuestion';
import { IndicatorViewPager } from 'mainam-react-native-viewpager';

class ListQuestionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0
        }
    }
    onClickCreateMenu = () => this.props.navigation.navigate("createQuestionStep1")
    menuCreate() {
        return <TouchableOpacity style={{ marginRight: 20 }} onPress={this.onClickCreateMenu}>
            <ScaleImage source={require("@images/new/ic_create.png")} width={32} />
        </TouchableOpacity>
    }
    componentWillReceiveProps(props) {
        let reloadTime = props.navigation.getParam('reloadTime', undefined);
        if (this.state.reloadTime != reloadTime) {
            this.setState({ reloadTime }, () => {
                if (this.listAnswered) {
                    this.listAnswered.onRefresh();
                }
                if (this.listNotAnswered) {
                    this.listNotAnswered.onRefresh();
                }
            });
        }
    }
    swipe(targetIndex) {
        if (this.viewPager)
            this.viewPager.setPage(targetIndex);
    }
    onPageScroll(e) {
        var tabIndex = e.position;
        var offset = e.offset * 100;
        if (tabIndex == -1 || (tabIndex == 1 && offset > 0))
            return;
        this.setState({
            tabIndex: tabIndex
        })
    }
    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }}
                title={constants.title.advisory_online}
                showFullScreen={true}
                transparent={true}
                useCard={true}
                menuButton={this.props.userApp.isLogin ? this.menuCreate() : null}
                isLoading={this.state.isLoading}
                titleStyle={[this.props.userApp.isLogin ? { marginRight: 0 } : {}, { color: '#FFF' }]}
            >
                {
                    this.props.userApp.isLogin ?
                        <View style={styles.containerTab} keyboardShouldPersistTaps="handled">
                            <View style={styles.groupTab}>
                                <TouchableOpacity style={styles.flex} onPress={this.swipe.bind(this, 0)}>
                                    <Text style={[styles.txtTab, this.state.tabIndex == 0 ? styles.tabSelected : styles.tabNormal]}>{constants.questions.answered}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.flex} onPress={this.swipe.bind(this, 1)}>
                                    <Text style={[styles.txtTab, this.state.tabIndex == 1 ? styles.tabSelected : styles.tabNormal]}>{constants.questions.not_answered}</Text>
                                </TouchableOpacity>
                            </View>

                            <IndicatorViewPager style={styles.flex} ref={(viewPager) => { this.viewPager = viewPager }} onPageScroll={this.onPageScroll.bind(this)}>
                                <View>
                                    <ListQuestion isAnswered={true} ref={ref => this.listAnswered = ref} />
                                </View>
                                <View>
                                    <ListQuestion isAnswered={false} ref={ref => this.listNotAnswered = ref} />
                                </View>
                            </IndicatorViewPager>
                        </View> :
                        <View style={styles.containerNotLogin}>
                            <View style={styles.groupAdvisory}>
                                <ScaleImage source={require("@images/new/createPostImage.png")} width={200} />
                                <Text style={styles.txtAdvisory}>
                                    Gửi vấn đề của bạn tới bác sĩ để được tư vấn <Text style={{ fontWeight: 'bold' }}>miễn phí</Text> hôm nay.
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={this.onClickCreateMenu} style={styles.buttonCreateQuestion}>
                                <Text style={styles.txtCreateQuestion}>{constants.questions.make_question_now}</Text>
                            </TouchableOpacity>
                        </View>
                }
            </ActivityPanel >
        );
    }
}
const styles = StyleSheet.create({
    txtCreateQuestion: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center'
    },
    buttonCreateQuestion: {
        width: 230,
        marginBottom: 50,
        borderRadius: 6,
        backgroundColor: "#02c39a",
        shadowColor: "rgba(0, 0, 0, 0.21)",
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        padding: 11, justifyContent: 'center'
    },
    txtAdvisory: {
        textAlign: 'center',
        maxWidth: 240,
        marginTop: 20,
        fontSize: 15,
        lineHeight: 20
    },
    groupAdvisory: {
        flex: 1,
        alignItems: 'center'
    },
    containerNotLogin: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50
    },
    txtTab: { textAlign: 'center' },
    flex: { flex: 1 },
    groupTab: {
        height: 50,
        flexDirection: "row"
    },
    backgroundTab: {
        backgroundColor: '#02C39A',
        height: 130,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    containerTab: {
        flex: 1,
        position: 'relative'
    },
    tabSelected: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'rgb(106,1,54)'
    }, tabNormal:
    {
        fontSize: 18,
        color: 'rgba(106,1,54,48)'
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(ListQuestionScreen);