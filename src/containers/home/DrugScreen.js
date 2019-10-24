import React, { Component, PropTypes } from "react";
import {
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    StyleSheet,
    Platform,
    Dimensions,
} from "react-native";
import { Card } from 'native-base';
import ActivityPanel from "@components/ActivityPanel";
import { connect } from "react-redux";
import constants from "@resources/strings";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import dataCacheProvider from '@data-access/datacache-provider';
import Field from "mainam-react-native-form-validate/Field";
import ScaleImage from 'mainam-react-native-scaleimage';
const devices_width = Dimensions.get('window').width
const padding = Platform.select({
    ios: 7,
    android: 2
});
class drugScreen extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            // <ActivityPanel
            //     style={{ flex: 1 }}
            //     title={constants.title.content}
            //     showFullScreen={true}
            //     // isLoading={this.state.isLoading}
            //     titleStyle={{
            //         color: '#FFF'
            //     }}
            // >
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                style={styles.scroll}
                keyboardShouldPersistTaps="handled"
            // keyboardDismissMode='on-drag' 
            >
                <ScaleImage width={devices_width} source={require('@images/new/drug/ic_bg_drug.png')}></ScaleImage>
                <View style={styles.containerCard}>

                </View>
            </ScrollView>
            // {Platform.OS == "ios" && <KeyboardSpacer />}
            // </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        position: 'relative',
    },
    containerCard: {
        margin: 22,
        marginTop: 10,
        backgroundColor: 'red'
    },
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(drugScreen);
