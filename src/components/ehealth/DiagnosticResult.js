import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
import scheduleProvider from '@data-access/schedule-provider';
import snackbar from '@utils/snackbar-utils';
import dateUtils from "mainam-react-native-date-utils";
import bookingProvider from '@data-access/booking-provider';
import dataCacheProvider from '@data-access/datacache-provider';
import constants from '@resources/strings';
const DEVICE_WIDTH = Dimensions.get('window').width;
import ImageLoad from 'mainam-react-native-image-loader';
import ScaledImage from "mainam-react-native-scaleimage";
import DiagnosticResultItem from '@components/ehealth/DiagnosticResultItem';


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
        let resultDiagnostic = result.ListDiagnostic || [];
        return (<View style={{ flex: 1, padding: 10 }}>
            <View style={[styles.item, { marginTop: 0 }]}>
                <View style={styles.round1}>
                    <View style={styles.round2} />
                </View>
                <View style={[styles.itemlabel, { marginTop: 0 }]}>
                    <Text style={[{ fontWeight: 'bold', fontSize: 18 }]}>KẾT QUẢ CHẨN ĐOÁN HÌNH ẢNH</Text>
                </View>
            </View>
            {
                resultDiagnostic.map((item, index) => <DiagnosticResultItem item={item} key={index} />)
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
    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' }
})
export default connect(mapStateToProps)(DiagnosticResult);