import React, { Component, } from 'react';
import { View, StyleSheet, Text, Linking, } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import constants, { key } from '@resources/strings';
import { TouchableOpacity } from 'react-native-gesture-handler';

class DiagnosticResultItem extends Component {
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
        return <Text style={styles.txItem}>{text}</Text>
    }
    viewImage = () => {
        let { item } = this.props;
        Linking.openURL(item.pacs)
    }
    render() {
        let { item } = this.props;
        

        return <View style={[styles.container,]} key={this.props.index}>
            <View style={styles.viewService}>
                <Text style={styles.txSerivceName}>{item.ServiceName}</Text>

                {/* <TouchableOpacity onPress={() => this.exportPdf()}>
                    <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                </TouchableOpacity> */}
            </View>
            <TouchableOpacity style = {styles.btnViewImage} onPress={this.viewImage}>
                <ScaleImage style={{ tintColor:'#166950'}} source={require('@images/new/ehealth/ic_image.png')} height={26}></ScaleImage>
                <Text style = {styles.txViewImg}>
                    Xem ảnh
                    </Text>
            </TouchableOpacity>
            <View style={[styles.viewItem, this.props.length - 1 == this.props.index ? { borderBottomWidth: 0, } : {}]}>
                {
                    (item.Result || item.SummaryResult || item.Discussion) ?
                        <View>

                            <Text style={styles.diagnosticLabel}>{constants.ehealth.describe}</Text>
                            {item.Result ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    {
                                        this.renderItem(item.Result)
                                    }
                                </View> : null}
                            {item.SummaryResult ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    {
                                        this.renderItem(item.SummaryResult)
                                    }
                                </View> : null}
                            {item.Discussion ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    {
                                        this.renderItem(item.Discussion)
                                    }
                                </View> : null}
                        </View> : null}

                {
                    (item.Conclusion) ?
                        <View>

                            <Text style={styles.diagnosticLabel}>{constants.ehealth.conclude}</Text>
                            {item.Conclusion ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    <Text style={styles.txConclusion}>{item.Conclusion}</Text>
                                </View> : null}
                        </View> : null}
            </View>
        </View>
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        ehealth: state.auth.ehealth
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
    txItem: { marginLeft: 10, marginBottom: 10 },
    viewService: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    txSerivceName: { flex: 1, fontWeight: 'bold', fontSize: 15, color: '#ED1846' },
    viewItem: {
        borderBottomColor: '#00000020', borderBottomWidth: 1, paddingBottom: 20,
    },
    viewList: { flexDirection: 'row' },
    imgList: { marginTop: 7 },
    txConclusion: { marginLeft: 10 },
    btnViewImage:{
        flexDirection:'row',
        alignItems:'center'
    },
    txViewImg:{
        fontSize:16,
        marginLeft:5,
        textDecorationLine:'underline',
        color:'#166950',
        fontWeight:'bold'
    }

})
export default connect(mapStateToProps)(DiagnosticResultItem);