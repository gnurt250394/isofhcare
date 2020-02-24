import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import dateUtils from "mainam-react-native-date-utils";
import constants from '@resources/strings';
import DiagnosticResultItem from '@components/ehealth/DiagnosticResultItem';
import ImageEhealth from './ImageEhealth';


class DiagnosticResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }

    render() {
        let { result } = this.props;
        if (!result || !result.ListDiagnostic || !result.ListDiagnostic.length)
            return null;
        if (!result.ListDiagnostic[0]?.SummaryResult && !result.ListDiagnostic[0]?.ServiceName && (result?.ListDiagnostic[0]?.Image?.length == 0 || !result?.ListDiagnostic[0]?.Image)) {
            return null
        }
        let resultDiagnostic = result.ListDiagnostic || [];
        return (<View style={styles.container}>
            {
                (this.props.showTitle == true || this.props.showTitle == undefined) &&
                <View style={[styles.item, { marginTop: 0 }]}>
                    <View style={styles.round1}>
                        <View style={styles.round2} />
                    </View>
                    <View style={[styles.itemlabel, { marginTop: 0 }]}>
                        <Text style={styles.txDiagnostiResult}>{constants.ehealth.diagnosticResult}</Text>
                    </View>
                </View>
            }
            {
                resultDiagnostic.map((item, index) => {
                    return (
                        <View key={index} style={styles.containerItem}>
                            <DiagnosticResultItem item={item} key={index} {...this.props} />
                            <ImageEhealth images={item.Image} />
                        </View>
                    )
                })
            }

        </View>)
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
const styles = StyleSheet.create({
    containerItem: {
        backgroundColor: "#ffffff",
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 3,
        borderRadius: 5,
        padding: 10
    },

    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' },
    container: { flex: 1, padding: 10 },
    txDiagnostiResult: { fontWeight: 'bold', fontSize: 18 },

})
export default connect(mapStateToProps)(DiagnosticResult);