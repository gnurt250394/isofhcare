import React, { Component, } from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import constants from '@resources/strings';

class CheckupResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }
    renderItem(text) {

        if (!text) {
            return null
        }
        // if (!text) {
        //     while (text.indexOf('\n') != -1) {
        //         text = text.replace("\n", "");
        //     }
        //     text = text.trim();
        // }
        return <Text style={styles.txItem}>{text}</Text>
    }

    render() {
        let { item } = this.props;
        
        let { length } = this.props
        let { index } = this.props
        return <View style={[styles.container, index == length - 1 ? { borderBottomColor: '#fff' } : {}]} key={index}>
            <View style={styles.viewCheckup}>
                <Text style={styles.txServiceName}>{item.serviceName}</Text>
                {/* <TouchableOpacity onPress={() => this.exportPdf()}>
                        <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                    </TouchableOpacity> */}
            </View>
            <View style={styles.viewList}>
                {
                    item.biopsyLocation ?
                        <View>

                            <Text style={styles.diagnosticLabel}>Vị trí sinh thiết</Text>
                            <View style={styles.viewItem}>
                                <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                {this.renderItem(item.biopsyLocation)}
                            </View>
                        </View> : null
                }

                {
                    item.microsome ?
                        <View>

                            <Text style={styles.diagnosticLabel}>Vị thể</Text>
                            <View style={styles.viewItem}>
                                <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                {this.renderItem(item.microsome)}
                            </View>
                        </View> : null
                }

                {
                    item.macrosome ?
                        <View>

                            <Text style={styles.diagnosticLabel}>Đại thể</Text>
                            <View style={styles.viewItem}>
                                <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                {this.renderItem(item.macrosome)}
                            </View>
                        </View> : null
                }

                {
                    (item.result || item.summaryResult) ?
                        <View>

                            <Text style={styles.diagnosticLabel}>Kết quả</Text>
                            <View style={styles.viewItem}>
                                <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                {this.renderItem((item.result || '') + item.summaryResult || '')}
                            </View>
                        </View> : null
                }

                {
                    item.reportTemplate == "Tebaoamdao" || item.reportTemplate == "Thinprep"
                        && (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0) ?
                        item.ServiceMedicTestLine.map((item, i) => {
                            return (<View key={i}>
                                <View style={styles.viewImg}>
                                    {
                                        item.isVerified ?
                                            <ScaleImage source={require("@images/new/ehealth/check.png")} width={12} style={styles.scaleImg} />
                                            :
                                            <ScaleImage source={require("@images/new/ehealth/uncheck.png")} width={12} style={styles.scaleImg} />
                                    }
                                    <Text style={styles.diagnosticLabel1}>{item.nameLine}</Text>
                                </View>
                                {item.result2 ?
                                    this.renderItem(item.result2)
                                    : null}
                            </View>)
                        })
                        : <View></View>
                }

                {
                    item.conclusion ?
                        <View>

                            <Text style={styles.diagnosticLabel}>Kết luận</Text>
                            <View style={styles.viewItem}>
                                <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                {
                                    this.renderItem(item.conclusion)
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
    },
    txItem: { marginLeft: 10, marginBottom: 10 },
    container: { flex: 1, marginBottom: 20, borderBottomColor: '#c0c0c0', borderBottomWidth: 1, paddingBottom: 20 },
    viewCheckup: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    txServiceName: { flex: 1, fontWeight: 'bold', fontSize: 15, color: '#ED1846' },
    viewList: {

    },
    viewItem: { flexDirection: 'row' },
    viewImg: { flexDirection: 'row', marginTop: 10 },
    scaleImg: { marginTop: 4, marginRight: 7 }
})
export default connect(mapStateToProps)(CheckupResult);