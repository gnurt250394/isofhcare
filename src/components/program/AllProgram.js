import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Program from '@components/program/Program';
import conferenceSessionProvider from "@data-access/conference/session-provider";

class AllProgram extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyword: ""
        }
    }

    loadData(conferenceId, userId, date, callback) {
        conferenceSessionProvider.getByConferenceDate(conferenceId, userId, date, this.state.keyword, callback);
    }

    search(s) {
        this.setState({ keyword: s }, () => {
            try {
                this.program.getWrappedInstance().onRefresh();
            } catch (error) {

            }
        })
    }
    render() {
        return (
            <Program ref={ref => this.program = ref} loadDataListener={this.loadData.bind(this)} />
        );

    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps, null, null, { withRef: true })(AllProgram);