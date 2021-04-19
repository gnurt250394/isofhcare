import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux';
import SurgeryResultItem from '@components/ehealth/SurgeryResultItem';
import ImageEhealth from './ImageEhealth';
import ScaledImage from 'mainam-react-native-scaleimage';
import { Card } from 'native-base';


class SurgeryResult extends Component {
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
        let { result } = this.props;
        if (!result || !result.ListResulGiaiPhau || !result.ListResulGiaiPhau.length)
            return null;
        if (!result?.ListResulGiaiPhau[0]?.SummaryResult && !result?.ListResulGiaiPhau[0]?.ServiceName && (result?.ListResulGiaiPhau[0]?.Image?.length == 0 || !result?.ListResulGiaiPhau[0]?.Image)) {
            return null
        }
        let resultSurgery = result.ListResulGiaiPhau || [];
        return (<View style={styles.container}>
            <Card style={styles.card}>
                <TouchableOpacity
                    onPress={this.onSetShow}
                    style={[styles.buttonShowInfo, this.state.isShow ? { backgroundColor: '#075BB5' } : {}]}>
                    <ScaledImage source={require('@images/new/ehealth/ic_anatomy.png')} height={19} style={{
                        tintColor: this.state.isShow ? "#FFF" : '#075BB5'
                    }} />
                    <Text style={[styles.txtTitle, this.state.isShow ? { color: '#FFF' } : {}]}>KẾT QUẢ GIẢI PHẪU</Text>
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
                                resultSurgery.map((item, index) => {
                                    return (
                                        <View key={index} style={styles.viewSurgeryItem}>
                                            <SurgeryResultItem length={resultSurgery.length} item={item} index={index} key={index} {...this.props} />
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
    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' },
    container: { flex: 1, paddingHorizontal: 10 },
    txResult: { fontWeight: 'bold', fontSize: 18 },
    viewSurgeryItem: {
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
})
export default connect(mapStateToProps)(SurgeryResult);