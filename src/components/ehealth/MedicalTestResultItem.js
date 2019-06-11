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
import CheckupResultItem from '@components/ehealth/CheckupResultItem';


class MedicalTestResultItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }


    render() {
        let { result1 } = this.props;
        if (!result1 || !result1.ListResultCheckup || !result1.ListResultCheckup.length)
            return null;

        debugger;


        var result = [];
        if (medicalTestResult.resultViSinh && medicalTestResult.resultViSinh.length > 0) {
            var item = {
                type: 'Vi Sinh',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);

            medicalTestResult.resultViSinh.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }
        if (medicalTestResult.resultHoaSinh && medicalTestResult.resultHoaSinh.length > 0) {
            var item = {
                type: 'Hóa Sinh',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);
            medicalTestResult.resultHoaSinh.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }
        if (medicalTestResult.resultHuyetHoc && medicalTestResult.resultHuyetHoc.length > 0) {
            var item = {
                type: 'Huyết Học',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);
            medicalTestResult.resultHuyetHoc.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }
        if (medicalTestResult.resultKhac && medicalTestResult.resultKhac.length > 0) {
            var item = {
                type: 'Xét Nghiệm Khác',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);
            medicalTestResult.resultKhac.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }



        debugger;
        return null;
        let resultCheckup = result.ListResultCheckup || [];
        return (<View>
            <View style={{ flexDirection: 'row', position: 'relative', flex: 1, padding: 10 }}>
                <View style={{ flex: 1, marginLeft: 16.5 }}>
                    <View style={[styles.item, { marginTop: 0 }]}>
                        <View style={styles.round1}>
                            <View style={styles.round2} />
                        </View>
                        <View style={[styles.itemlabel, { marginTop: 0 }]}>
                            <Text style={[{ fontWeight: 'bold', fontSize: 18 }]}>KẾT QUẢ KHÁM</Text>
                        </View>
                    </View>
                    {
                        resultCheckup.map((item, index) => <CheckupResultItem item={item} key={index} />)
                    }

                </View>
            </View>
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
    round1: { width: 25, height: 25, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 2, borderRadius: 12.5, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' }
})
export default connect(mapStateToProps)(MedicalTestResultItem);