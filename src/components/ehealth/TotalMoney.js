import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import constants from '@resources/strings';
import stringUtils from 'mainam-react-native-string-utils';
import { Table, Row } from 'react-native-table-component';


class TotalMoney extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }
    renderService(list, showMoney) {
        if (list) {
            return list.map((data, i) => (
                this.renderServiceItem(i, data, showMoney)
            ))
        }
        return null;
    }
    renderServiceItem(index, item, showMoney) {
        if (!showMoney) {
            var data = [index + 1, item.Name, 1];
            return (<Row data={data} key={index} textStyle={styles.text} flexArr={[1, 3, 1]} />);
        }
        else {
            var data = [index + 1, item.Name, 1, (item.PriceService || 0).formatPrice() + " đ"]
            return (<Row data={data} key={index} textStyle={styles.text} flexArr={[1, 3, 1, 2]} />);
        }
    }


    render() {
        let { resultDetail } = this.props;
        if (!resultDetail || !resultDetail.ListService || !resultDetail.ListService.length)
            return null;
        let sum = 0; //resultDetail.ListService.reduce((a, b) => a + (b.PriceService || 0), 0);
        let tableHead = ['STT', 'Tên', 'Số lượng', 'Tiền'];
        if (!sum)
            tableHead = ['STT', 'Tên', 'Số lượng'];


        return ((<View style={styles.container}>
            {
                (this.props.showTitle == true || this.props.showTitle == undefined) &&
                <View style={[styles.item, { marginTop: 0 }]}>
                    <View style={styles.round1}>
                        <View style={styles.round2} />
                    </View>
                    <View style={[styles.itemlabel, { marginTop: 0 }]}>
                        <Text style={[{ fontWeight: 'bold', fontSize: 18 }]}>{sum ? "TIỀN" : "DỊCH VỤ"}</Text>
                    </View>
                </View>
            }
            <Table style={[styles.table, { marginTop: 10 }]} borderStyle={styles.borderStyle}>
                <Row data={tableHead} style={styles.head} textStyle={styles.textHead} flexArr={sum ? [1, 3, 1, 2] : [1, 3, 1]} />
                {this.renderService(resultDetail.ListService, sum)}
            </Table>
            {
                sum ?
                    <View style={styles.viewListService}>
                        <Text style={styles.txTotal}>Tổng:<Text style={styles.valueTotal}>{sum.formatPrice()}đ</Text>
                        </Text>
                    </View> : null
            }
        </View>))
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
    item: { marginTop: 10, flexDirection: 'row' },
    slide: {
        flex: 1,
    },
    table: { marginTop: 30 },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    textHead: { textAlign: 'center', fontWeight: 'bold' },
    text: { padding: 4, textAlign: 'center' },
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
    },
    container: { flex: 1, padding: 10 },
    txMoney: { fontWeight: 'bold', fontSize: 18 },
    borderStyle: { borderWidth: 0.5, borderColor: '#c8e1ff' },
    viewListService: { alignItems: 'flex-end', marginTop: 10 },
    txTotal: { fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#979797', paddingBottom: 5, color: '#333333', fontWeight: 'bold' },
    valueTotal: { color: 'red', fontWeight: 'bold', fontSize: 18 },
})
export default connect(mapStateToProps)(TotalMoney);