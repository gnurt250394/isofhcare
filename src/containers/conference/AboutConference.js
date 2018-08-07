import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';

class IntroScreen extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Giới thiệu" showFullScreen={true}>
                <ScrollView>
                    <Text style={{ marginTop: 5, textAlign: 'justify', lineHeight: 20, padding: 10, fontSize: 16 }}>{this.props.conference.conference.note}</Text>
                </ScrollView>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        conference: state.conference
    };
}
export default connect(mapStateToProps)(IntroScreen);