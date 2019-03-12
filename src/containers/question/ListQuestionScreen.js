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
    // menuCreate() {
    //     return <View>
    //         <TouchableOpacity style={{ padding: 10 }} onPress={() => this.props.navigation.navigate("createQuestionStep1")}><Text>Tạo</Text></TouchableOpacity>
    //     </View >
    // }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Hỏi đáp" showFullScreen={true}
            // menuButton={this.menuCreate()}
            >
                <View style={{ height: 50, flexDirection: "row" }}>
                    <TouchableOpacity style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center' }}>Đã trả lời</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }}>
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
                    <ListQuestion isAnswered={true} />
                    <ListQuestion isAnswered={false} />
                </Swiper>

                <TouchableOpacity style={{ position: 'absolute', bottom: 11, right: 11 }} onPress={() => { this.props.navigation.navigate("createQuestion") }}>
                    <ScaleImage source={require("@images/btn_add_question.png")} width={81} />
                </TouchableOpacity>
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