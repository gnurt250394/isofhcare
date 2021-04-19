import React, { Component, } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from "mainam-react-native-date-utils";
import DiagnosticResultItem from '@components/ehealth/DiagnosticResultItem';
import ImageEhealth from './ImageEhealth';
import ScaledImage from 'mainam-react-native-scaleimage';
import { Card } from 'native-base';


class DiagnosticResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }
    onSetShow = () => {
        this.setState({ isShow: !this.state.isShow })
    }
    render() {
        let resultDiagnostic = this.props.diagnosticImage || [];
        
        if (resultDiagnostic.length)
            return (<View style={styles.container}>
                {/* {
                (this.props.showTitle == true || this.props.showTitle == undefined) &&
                <View style={[styles.item, { marginTop: 0 }]}>
                    <View style={styles.round1}>
                        <View style={styles.round2} />
                    </View>
                    <View style={[styles.itemlabel, { marginTop: 0 }]}>
                        <Text style={styles.txDiagnostiResult}>{constants.ehealth.diagnosticResult}</Text>
                    </View>
                </View>
            } */}
                <Card style={styles.card}>
                    <TouchableOpacity
                        onPress={this.onSetShow}
                        style={[styles.buttonShowInfo, this.state.isShow ? { backgroundColor: '#3161AD' } : {}]}>
                        <ScaledImage source={require('@images/new/ehealth/ic_result_picture.png')} height={19} style={{
                            tintColor: this.state.isShow ? "#FFF" : '#3161AD'
                        }} />
                        <Text style={[styles.txtTitle, this.state.isShow ? { color: '#FFF' } : {}]}>KẾT QUẢ CHẨN ĐOÁN HÌNH ẢNH VÀ THĂM DÒ CHỨC NĂNG</Text>
                        <ScaledImage source={require('@images/new/ehealth/ic_down2.png')} height={10} style={this.state.isShow ? {
                            tintColor: "#FFF",
                        } : {
                                transform: [{ rotate: '-90deg' }],
                                tintColor: '#3161AD'
                            }} />
                    </TouchableOpacity>
                    {
                        this.state.isShow ?
                            <View style={{
                                padding: 10
                            }}>
                                {
                                    resultDiagnostic.map((item, index) => {

                                        return (
                                            <View key={index} style={styles.containerItem}>
                                                <DiagnosticResultItem item={item} index={index} length={resultDiagnostic.length} {...this.props} />
                                                <ImageEhealth images={item.Image} />
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            : null
                    }
                </Card>
            </View>)
        else
            return null

    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
const styles = StyleSheet.create({
    txtTitle: {
        flex: 1,
        paddingHorizontal: 10,
        color: '#3161AD',
        fontWeight: 'bold'
    },
    buttonShowInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    card: {
        borderRadius: 5
    },
    containerItem: {
        // backgroundColor: "#ffffff",
        // shadowColor: "rgba(0, 0, 0, 0.05)",
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowRadius: 10,
        // shadowOpacity: 1,
        // elevation: 3,
        borderRadius: 5,
        padding: 10
    },

    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0291E1' },
    item: { marginTop: 10, flexDirection: 'row' },
    container: { flex: 1, paddingHorizontal: 10, },
    txDiagnostiResult: { fontWeight: 'bold', fontSize: 18 },

})
export default connect(mapStateToProps)(DiagnosticResult);