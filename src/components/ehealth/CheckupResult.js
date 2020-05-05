import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, FlatList, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from "mainam-react-native-date-utils";
import constants from '@resources/strings';
import CheckupResultItem from '@components/ehealth/CheckupResultItem';


class CheckupResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }


    render() {
        let { result } = this.props;
        console.log('result: ', result);
        if (!result || !result.ListResultCheckup || !result.ListResultCheckup.length)
            return null;
        // if (!result?.ListResultCheckup[0]?.SummaryResult && result?.ListResultCheckup[0]?.ServiceName && !result?.ListResultCheckup[0]?.Image) {
        //     return null
        // }
        let arr = result?.ListResultCheckup.every(e => !e.DoctorAdviceTxt && !e.DiseaseDiagnostic && (!e?.Image || e?.Image?.length == 0))
        console.log('arr: ', arr);
        let resultCheckup = result.ListResultCheckup || [];

        if (arr) {
            return null
        }
        return (<View style={styles.container}>
            {
                (this.props.showTitle == true || this.props.showTitle == undefined) &&
                <View style={[styles.item, { marginTop: 0 }]}>
                    <View style={styles.round1}>
                        <View style={styles.round2} />
                    </View>
                    <View style={[styles.itemlabel, { marginTop: 0 }]}>
                        <Text style={styles.txCheckUp}>{constants.ehealth.checkupResult}</Text>
                    </View>
                </View>
            }
            {
                resultCheckup.map((item, index) => <CheckupResultItem item={item} key={index} {...this.props} />)
            }
        </View>)
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        ehealth: state.auth.ehealth
    };
}
const styles = StyleSheet.create({
    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' },
    container: { flex: 1, padding: 10 },
    txCheckUp: { fontWeight: 'bold', fontSize: 18 },
})
export default connect(mapStateToProps)(CheckupResult);