import React, { Component, } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from "mainam-react-native-date-utils";
import CheckupResultItem from '@components/ehealth/CheckupResultItem';
import { Card } from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';


class CheckupResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: [],
            isShow: false
        }
    }

    onSetShow = () => {
        this.setState({ isShow: !this.state.isShow })
    }
    render() {
        let { result } = this.props;


        if (!result || !result.ListResultCheckup || !result.ListResultCheckup.length)
            return null;
        // if (!result?.ListResultCheckup[0]?.SummaryResult && result?.ListResultCheckup[0]?.ServiceName && !result?.ListResultCheckup[0]?.Image) {
        //     return null
        // }
        let arr = result?.ListResultCheckup.every(e => !e.DoctorAdviceTxt && !e.DiseaseDiagnostic && (!e?.Image || e?.Image?.length == 0))

        let resultCheckup = result.ListResultCheckup || [];

        let resultContractCheckup = result?.ResultContractCheckup

        var arrayContractCheckup = Object.entries(resultContractCheckup ? resultContractCheckup : {})
        if (arrayContractCheckup.length) {
            let indexConclusion = arrayContractCheckup.findIndex(obj => obj[0] == 'Conclusion')
            let itemBottom = arrayContractCheckup[indexConclusion]
            arrayContractCheckup.pop()
            arrayContractCheckup.unshift(itemBottom)
        }


        if (arr && !arrayContractCheckup.length) {
            return null
        }
        return (<View style={styles.container}>
            <Card style={styles.card}>
                <TouchableOpacity
                    onPress={this.onSetShow}
                    style={[styles.buttonShowInfo, this.state.isShow ? { backgroundColor: '#075BB5' } : {}]}>
                    <ScaledImage source={require('@images/new/ehealth/ic_result.png')} height={19} style={{
                        tintColor: this.state.isShow ? "#FFF" : '#075BB5'
                    }} />
                    <Text style={[styles.txtTitle, this.state.isShow ? { color: '#FFF' } : {}]}>KẾT QUẢ KHÁM</Text>
                    <ScaledImage source={require('@images/new/ehealth/ic_down2.png')} height={10} style={this.state.isShow ? {
                        tintColor: "#FFF",
                    } : {
                            transform: [{ rotate: '-90deg' }],
                            tintColor: '#075BB5'
                        }} />
                </TouchableOpacity>
                {
                    this.state.isShow ?
                        <View style={{
                            padding: 10
                        }}>
                            {
                                !arr && resultCheckup.map((item, index) => <CheckupResultItem length={resultCheckup.length} item={item} key={index} index={index} {...this.props} />) || null
                            }
                            {
                                arrayContractCheckup.map((item, index) => <CheckupResultItem internalMedicine={item} key={index} length={arrayContractCheckup.length} index={index} {...this.props} />) || null
                            }

                        </View>
                        : null

                }
            </Card>
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
    txtTitle: {
        flex: 1,
        paddingHorizontal: 10,
        color: '#075BB5',
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
    container: {
        paddingHorizontal: 10
    },
    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' },
    txCheckUp: { fontWeight: 'bold', fontSize: 18 },
})
export default connect(mapStateToProps)(CheckupResult);