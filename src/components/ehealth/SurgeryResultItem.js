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
import { Table, Row } from 'react-native-table-component';
import ExportPDF from '@ehealth/daihocy/components/ExportPDF';

class CheckupResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }

    render() {
        let { item } = this.props;
        return <View style={{ flex: 1 }} key={this.props.key}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 15, color: constants.colors.primary_bold }}>{item.ServiceName}</Text>
                {/* <TouchableOpacity onPress={() => this.exportPdf()}>
                        <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                    </TouchableOpacity> */}
            </View>
            <View style={styles.slide}>

                <View>
                    {
                        item.BiopsyLocation ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Vị trí sinh thiết</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{item.BiopsyLocation}</Text>
                                </View>
                            </View> : null
                    }

                    {
                        item.Microsome ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Vị thể</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{item.Microsome}</Text>
                                </View>
                            </View> : null
                    }

                    {
                        item.Macrosome ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Đại thể</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{item.Macrosome}</Text>
                                </View>
                            </View> : null
                    }

                    {
                        (item.Result || item.Discussion) ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Kết quả</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{item.Result} {item.Discussion} </Text>
                                </View>
                            </View> : null
                    }

                    {
                        item.ReportTemplate == "Tebaoamdao" || item.ReportTemplate == "Thinprep"
                            && (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0) ?
                            item.ServiceMedicTestLine.map((item, i) => {
                                return (<View key={i}>
                                    <View style={styles.breakline} />
                                    <View style={{ flexDirection: 'row' }}>
                                        {
                                            item.IsVerified ?
                                                <ScaleImage source={require("@ehealth/daihocy/resources/images/check.png")} width={12} style={{ marginTop: 4, marginRight: 7 }} />
                                                :
                                                <ScaleImage source={require("@ehealth/daihocy/resources/images/uncheck.png")} width={12} style={{ marginTop: 4, marginRight: 7 }} />
                                        }
                                        <Text style={styles.diagnosticLabel}>{item.NameLine}</Text>
                                    </View>
                                    {item.Result2 ? <Text style={{ marginLeft: 10 }}>{item.Result2}</Text> : null}
                                </View>)
                            })
                            : <View></View>
                    }

                    {
                        item.Conclusion ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Kết luận</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{item.Conclusion}</Text>
                                </View>
                            </View> : null
                    }
                </View>
            </View>
        </View>
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
const styles = StyleSheet.create({
    diagnosticLabel:
    {
        color: constants.colors.primary_bold,
        fontWeight: 'bold', marginBottom: 10
    },
    breakline: {
        height: 1,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: constants.colors.breakline
    }
})
export default connect(mapStateToProps)(CheckupResult);