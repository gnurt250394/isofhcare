import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, ActivityIndicator,ScrollView } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import InsertInfoDrug from './InsertInfoDrug'
import SearchableDropdown from 'react-native-searchable-dropdown';
import drugProvider from '@data-access/drug-provider'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Modal from "@components/modal";
import constants from "@resources/strings";

export default class DrugInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            itemsDrug: [],
            txSearch: '',
            typing: false,
            typingTimeout: 0,
            isVisible: false,
            isShowList: false
        };
        this.timeout = 0
    }

    onSearch = () => {
        let { text } = this.state
        this.setState({
            isSearch: true,
        }, () => {
            drugProvider.searchDrug(text, 0, 5).then(res => {
                if (res && res.length) {
                    this.setState({
                        itemsDrug: res,
                        isSearch: false,
                        isShowList: true,
                    })
                }

            }).catch(err => {
                this.setState({
                    isSearch: false,
                })
            })
        })
    }
    onChangeText(text) {
        this.setState({
            text
        }, () => {
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.setState({
                    isSearch: true,
                }, () => {
                    drugProvider.searchDrug(text, 0, 5).then(res => {
                        if (res && res.length) {
                            this.setState({
                                itemsDrug: res,
                                isSearch: false,
                                isShowList: true,
                            })
                        } else {
                            this.setState({
                                itemsDrug: [],
                                isSearch: false,
                                isShowList: true,
                            })
                        }

                    }).catch(err => {
                        this.setState({
                            isSearch: false,
                        })
                    })
                })
            }, 500);
        })

    }
    renderItem = ({ item, index }) => {
        return (
            <View style={styles.viewItem}>
                <Text style={styles.txName}>{`${item.name} ${item.packing ? item.packing : ''}`}</Text>
                <TouchableOpacity style={{ padding: 5 }} onPress={() => this.onRemoveItem(item)}><ScaledImage height={10} source={require('@images/new/drug/ic_cancer.png')}></ScaledImage></TouchableOpacity>
            </View>
        )
    }
    onGetItem = (item) => {
        this.setState({
            itemsDrug: [],
            isShowList: false,
            text: ''
        }, () => {
            this.setState(prev => ({
                selectedItems: prev.selectedItems.concat(item)
            }))
        })
    }
    onRemoveItem = (item) => {
        const items = this.state.selectedItems.filter((sitem) => sitem.medicineId !== item.medicineId);
        this.setState({ selectedItems: items });
    }
    listEmpty = () => !this.state.isSearch && <Text style={styles.none_data}>Kh??ng t??m th???y t??n thu???c ???? nh???p</Text>

    render() {

        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.viewInputDrug}>
                        <TextInput value={this.state.text} onChangeText={text => this.onChangeText(text)} placeholderTextColor={'#000'} placeholder={'Nh???p t??n thu???c, vd (Paracetamol 500mg)'} style={styles.inpuNameDrug}></TextInput>
                        {this.state.isSearch ? <ActivityIndicator size={'small'}></ActivityIndicator> : null}
                    </View>
                    {this.state.isShowList ?
                        <ScrollView keyboardShouldPersistTaps="handled" >
                            {this.state.itemsDrug.map((item, index) => {
                                return (
                                    <TouchableOpacity style={styles.itemDrug} onPress={() => this.onGetItem(item)} key={index}>
                                        <Text style={styles.txItem}>{`${item.name} ${item.packing}`}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                            {!this.state.isSearch && !this.state.itemsDrug.length && this.listEmpty()}
                            <KeyboardSpacer></KeyboardSpacer>
                        </ScrollView> : <View></View>
                    }
                </View>
                <View style={styles.listSelect}>
                    <Text style={styles.txSelect}>Danh s??ch thu???c ???? ch???n {this.state.selectedItems ? `(${this.state.selectedItems.length})` : '(0)'}</Text>
                    <FlatList
                        data={this.state.selectedItems}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                    >
                    </FlatList>
                </View>
                <InsertInfoDrug dataSearchDrug={this.state.selectedItems} ></InsertInfoDrug>
                <View style={styles.viewBottom}></View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
    },
    txItem: { textAlign: 'left', color: '#00ba99', fontSize: 14 },
    itemDrug: { backgroundColor: '#fff', padding: 15, borderRadius: 6, borderColor: '#00ba99', borderWidth: 0.5, marginTop: 5, marginHorizontal: 10 },
    viewInputDrug: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#00ba99',
        alignItems: 'center'
    },
    none_data: {
        fontStyle: 'italic',
        alignSelf: 'center',
        fontSize: 14,
        color: '#00ba99',
    },
    inpuNameDrug: {
        width: '92%',
        height: '100%',
        padding: 10,
        color: '#000'
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