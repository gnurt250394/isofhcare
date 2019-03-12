import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import questionProvider from '@data-access/question-provider';
import dateUtils from 'mainam-react-native-date-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import Dimensions from 'Dimensions';
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import Swiper from 'react-native-swiper';
import ListQuestion from '@components/question/ListQuestion';

class ListQuestionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    menuCreate() {
        return <View>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.navigation.navigate("createQuestionStep1")}><Text>Tạo</Text></TouchableOpacity>
        </View >
    }
    componentWillReceiveProps(props) {
        let reloadTime = props.navigation.getParam('reloadTime', undefined);
        if (this.state.reloadTime != reloadTime) {
            this.setState({ reloadTime }, () => {
                if (this.listAnswered) {
                    this.listAnswered.getWrappedInstance().onRefresh();
                }
                if (this.listNotAnswered) {
                    this.listNotAnswered.getWrappedInstance().onRefresh();
                }
            });
        }
    }
    swipe(targetIndex) {
        const currentIndex = this.swiper.state.index;
        const offset = targetIndex - currentIndex;
        this.swiper.scrollBy(offset);
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Hỏi đáp" showFullScreen={true}
                menuButton={this.menuCreate()}
            >
                <View style={{ height: 50, flexDirection: "row" }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={this.swipe.bind(this, 0)}>
                        <Text style={{ textAlign: 'center' }}>Đã trả lời</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }} onPress={this.swipe.bind(this, 1)}>
                        <Text style={{ textAlign: 'center' }}>Khác</Text>
                    </TouchableOpacity>
                </View>

                <Swiper
                    ref={ref => this.swiper = ref}
                    onIndexChanged={index => {
                        this.setState({ tabIndex: index });
                    }}
                    dot={<View />}
                    activeDot={<View />}
                    loop={false}
                    style={{ flex: 1 }}
                >
                    <ListQuestion isAnswered={true} ref={ref => this.listAnswered = ref} />
                    <ListQuestion isAnswered={false} ref={ref => this.listNotAnswered = ref} />
                </Swiper>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ListQuestionScreen);