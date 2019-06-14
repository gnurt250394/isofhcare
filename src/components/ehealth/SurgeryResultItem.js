import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import constants from '@resources/strings';
import ExportPDF from '@ehealth/daihocy/components/ExportPDF';

class CheckupResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }
    renderItem(text) {
        // if (!text) {
        //     while (text.indexOf('\n') != -1) {
        //         text = text.replace("\n", "");
        //     }
        //     text = text.trim();
        // }
        return <Text style={{ marginLeft: 10, marginBottom: 10 }}>{text}</Text>
    }

    render() {
        let { item } = this.props;
        return <View style={{ flex: 1, marginTop: 20 }} key={this.props.key}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 15, color: constants.colors.primary_bold }}>{item.ServiceName}</Text>
                {/* <TouchableOpacity onPress={() => this.exportPdf()}>
                        <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                    </TouchableOpacity> */}
            </View>
            <View style={{
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
            }}>
                {
                    item.BiopsyLocation ?
                        <View>

                            <Text style={styles.diagnosticLabel}>Vị trí sinh thiết</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                {this.renderItem(item.BiopsyLocation)}
                            </View>
                        </View> : null
                }

                {
                    item.Microsome ?
                        <View>

                            <Text style={styles.diagnosticLabel}>Vị thể</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                {this.renderItem(item.Microsome)}
                            </View>
                        </View> : null
                }

                {
                    item.Macrosome ?
                        <View>

                            <Text style={styles.diagnosticLabel}>Đại thể</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                {this.renderItem(item.Macrosome)}
                            </View>
                        </View> : null
                }

                {
                    (item.Result || item.Discussion) ?
                        <View>

                            <Text style={styles.diagnosticLabel}>Kết quả</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                {this.renderItem(item.Result + item.Discussion)}
                            </View>
                        </View> : null
                }

                {
                    item.ReportTemplate == "Tebaoamdao" || item.ReportTemplate == "Thinprep"
                        && (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0) ?
                        item.ServiceMedicTestLine.map((item, i) => {
                            return (<View key={i}>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    {
                                        item.IsVerified ?
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/check.png")} width={12} style={{ marginTop: 4, marginRight: 7 }} />
                                            :
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/uncheck.png")} width={12} style={{ marginTop: 4, marginRight: 7 }} />
                                    }
                                    <Text style={styles.diagnosticLabel1}>{item.NameLine}</Text>
                                </View>
                                {item.Result2 ?
                                    this.renderItem(item.Result2)
                                    : null}
                            </View>)
                        })
                        : <View></View>
                }

                {
                    item.Conclusion ?
                        <View>

                            <Text style={styles.diagnosticLabel}>Kết luận</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                {
                                    this.renderItem(item.Conclusion)
                                }
                            </View>
                        </View> : null
                }
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
    diagnosticLabel1:
    {
        color: constants.colors.primary_bold,
        fontWeight: 'bold', marginBottom: 5
    },
    diagnosticLabel:
    {
        color: constants.colors.primary_bold,
        fontWeight: 'bold', marginBottom: 5
    },
    breakline: {
    }
})
export default connect(mapStateToProps)(CheckupResult);