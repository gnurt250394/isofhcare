import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import InsertInfoDrug from '@components/drug/InsertInfoDrug'
import ActivityPanel from '@components/ActivityPanel';
import drugProvider from '@data-access/drug-provider'
import KeyboardSpacer from 'react-native-keyboard-spacer';
export default class EditDrugInputScreen extends Component {
    constructor(props) {
        super(props);
        const dataEdit = this.props.navigation.getParam('dataEdit', null)
        console.log('dataEdit: ', dataEdit);
        this.state = {
            selectedItems: dataEdit.medicines
        };
        this.timeout = 0
    }
    renderItem = ({ item, index }) => {
        if (!item.action || item.action !== 'DELETE') {
            return (
                <View style={styles.viewItem}>
                    <Text style={styles.txName}>{`${item.name} ${item.packing ? item.packing : ''}`}</Text>
                    <TouchableOpacity style={{ padding: 5 }} onPress={() => this.onRemoveItem(item)}><ScaledImage height={10} source={require('@images/new/drug/ic_cancer.png')}></ScaledImage></TouchableOpacity>
                </View>
            )
        }
    }
    onGetItem = (item) => {
        console.log('item: ', item);
        this.setState({
            itemsDrug: [],
            isShowList: false
        }, () => {
            this.setState(prev => ({
                selectedItems: prev.selectedItems.concat(item)
            }))
        })
    }
    onSearch = () => {
        drugProvider.searchDrug(this.state.txSearch, 0, 5).then(res => {
            if (res && res.length) {
                this.setState({
                    itemsDrug: res,
                    isShowList: true,
                })
            }

        }).catch(err => {
            console.log(err)
        })
    }

    onChangeText(text) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            drugProvider.searchDrug(text, 0, 5).then(res => {
                if (res && res.length) {
                    this.setState({
                        itemsDrug: res,
                        isShowList: true,
                    })
                }

            }).catch(err => {

            })
        }, 500);
    }
    onRemoveItem = (item) => {
        const items = this.state.selectedItems;
        for (var i in items) {
            if (items[i].id && item.id) {
                if (items[i].id == item.id) {
                    items[i].action = 'DELETE';
                    break; //Stop this loop, we found it!
                }
            }
        }
        this.setState({ selectedItems: items });
    }
    render() {
        return (
            <ActivityPanel style={styles.container} title={"Chỉnh sửa đơn thuốc"} showFullScreen={true}>
                <ScrollView style={{ backgroundColor: '#f2f2f2' }}>
                    <View>
                        <View style={styles.viewInputDrug}>
                            <TextInput onChangeText={text => this.onChangeText(text)} placeholderTextColor={'#000'} placeholder={'Nhập tên thuốc, vd (Paracetamol 500mg)'} style={styles.inpuNameDrug}></TextInput>
                            {/* {/* <ScaledImage height={20} source={require('@images/new/drug/ic_search.png')}></ScaledImage> */}
                        </View>
                        {this.state.isShowList ?
                            <ScrollView>
                                {this.state.itemsDrug.map((item, index) => {
                                    return (
                                        <TouchableOpacity style={styles.itemDrug} onPress={() => this.onGetItem(item)} key={index}>
                                            <Text style={styles.txItem}>{`${item.name} ${item.packing}`}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                                <KeyboardSpacer></KeyboardSpacer>
                            </ScrollView> : <View></View>
                        }
                    </View>
                    <View style={styles.listSelect}>
                        <Text style={styles.txSelect}>Danh sách thuốc đã chọn {this.state.selectedItems ? `(${this.state.selectedItems.length})` : '(0)'}</Text>
                        <FlatList
                            data={this.state.selectedItems}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderItem}
                        >
                        </FlatList>
                    </View>
                    <InsertInfoDrug dataEdit={this.props.navigation.getParam('dataEdit', null)} dataSearchDrug={this.state.selectedItems} ></InsertInfoDrug>
                    <View style={styles.viewBottom}></View>
                </ScrollView>
            </ActivityPanel>

        );
    }
}
const styles = StyleSheet.create({
    container: {
    },
    viewInputDrug: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#00ba99',
        alignItems: 'center'
    },
    txItem: { textAlign: 'left', color: '#00ba99', fontSize: 14 },
    itemDrug: { backgroundColor: '#fff', padding: 15, borderRadius: 6, borderColor: '#00ba99', borderWidth: 0.5, marginTop: 5, marginHorizontal: 10 },
    inpuNameDrug: {
        width: '92%',
        height: '100%',
        padding: 10,
    },
    listSelect: {
        padding: 10
    },
    txSelect: {
        fontStyle: 'italic',
    },
    viewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 0.5,
        paddingVertical: 10

    },
    txName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00B090',
        textAlign: 'left',
        maxWidth: '80%'
    },
    imgDelete: {
    }

})
