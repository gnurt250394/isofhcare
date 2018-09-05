import React, { Component } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';

class DiseaseDetailScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="CHI TIẾT" showFullScreen={true}>
                <ScrollView>
                </ScrollView>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(DiseaseDetailScreen);