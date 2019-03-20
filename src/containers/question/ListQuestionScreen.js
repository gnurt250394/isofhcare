import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
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
            tabIndex: 0
        }
    }
    menuCreate() {
        return <View>
            <TouchableOpacity style={{ marginRight: 20 }} onPress={() => this.props.navigation.navigate("createQuestionStep1")}>
                <ScaleImage source={require("@images/new/ic_create.png")} width={32} /></TouchableOpacity>
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
            <ActivityPanel
                style={{ flex: 1 }}
                title={"Tư vấn online"}
                showFullScreen={true}
                menuButton={this.menuCreate()}
                isLoading={this.state.isLoading}
                actionbarStyle={{
                    backgroundColor: '#02C39A'
                }}
                titleStyle={{ marginRight: 0}}
            >
                <View style={{ flex: 1, position: 'relative' }} keyboardShouldPersistTaps="always">
                    <View style={{ backgroundColor: '#02C39A', height: 130, position: 'absolute', top: 0, left: 0, right: 0 }}></View>
                    <View style={{ height: 50, flexDirection: "row" }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={this.swipe.bind(this, 0)}>
                            <Text style={[{ textAlign: 'center' }, this.state.tabIndex == 0 ? styles.tabSelected : styles.tabNormal]}>Đã trả lời</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1 }} onPress={this.swipe.bind(this, 1)}>
                            <Text style={[{ textAlign: 'center' }, this.state.tabIndex == 1 ? styles.tabSelected : styles.tabNormal]}>Khác</Text>
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
                </View>
            </ActivityPanel >
        );
    }
}
const styles = StyleSheet.create({
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
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ListQuestionScreen);