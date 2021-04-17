import React, { Component, } from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import constants, { key } from '@resources/strings';

class DiagnosticResultItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }
    renderItem(text) {
        //  => {
        //     return <p>{paragraph}</p>;
        // }) || "");
        // if (!text) {
        //     while (text.indexOf('\n') != -1) {
        //         text = text.replace("\n", "");
        //     }
        //     text = text.trim();
        // }
        // return (text.split("\n")?.map((paragraph, i) => {
        return <View style={{ flex: 1, }} ><Text style={styles.txItem}>{`${text}`}</Text></View>
        // }))
    }

    render() {
        let { item } = this.props;


        return <View style={[styles.container,]} key={this.props.index}>
            <View style={styles.viewService}>
                <Text style={styles.txSerivceName}>{item.serviceName}</Text>
                {/* <TouchableOpacity onPress={() => this.exportPdf()}>
                    <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                </TouchableOpacity> */}
            </View>
            <View style={[styles.viewItem, this.props.length - 1 == this.props.index ? { borderBottomWidth: 0, } : {}]}>
                {
                    (item.result || item.summaryResult || item.discussion) ?
                        <View style={{ flex: 1, }}>

                            <Text style={styles.diagnosticLabel}>{constants.ehealth.describe}</Text>
                            {item.result ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    {
                                        this.renderItem(item.result)
                                    }
                                </View> : null}
                            {item.summaryResult ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    {
                                        this.renderItem(item.summaryResult)
                                    }
                                </View> : null}
                            {item.discussion ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    {
                                        this.renderItem(item.discussion)
                                    }
                                </View> : null}
                        </View> : null}

                {
                    (item.conclusion) ?
                        <View>

                            <Text style={styles.diagnosticLabel}>{constants.ehealth.conclude}</Text>
                            {item.conclusion ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    <Text style={styles.txConclusion}>{item.conclusion}</Text>
                                </View> : null}
                        </View> : null}
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

    container: { flex: 1, },
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
    txItem: { marginLeft: 10, marginBottom: 10, width: '100%', },
    viewService: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    txSerivceName: { flex: 1, fontWeight: 'bold', fontSize: 15, color: '#ED1846' },
    viewItem: {
        borderBottomColor: '#00000020', borderBottomWidth: 1, paddingBottom: 20, flex: 1,
    },
    viewList: { flexDirection: 'row', width: '100%', },
    imgList: { marginTop: 7 },
    txConclusion: { marginLeft: 10 }

})
export default connect(mapStateToProps)(DiagnosticResultItem);