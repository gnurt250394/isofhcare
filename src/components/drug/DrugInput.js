import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { ScrollView, } from 'react-native-gesture-handler';
import InsertInfoDrug from './InsertInfoDrug'
import SearchableDropdown from 'react-native-searchable-dropdown';
import drugProvider from '@data-access/drug-provider'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Modal from "@components/modal";

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
    demoTimeOut = () => {
        if (!this.state.typing) {
            this.setState({ typing: true })
            console.log('typing')
        } else {
            clearTimeout(timeoutVar);
        }

        //var lastTypingTime = (new Date()).getTime();

        timeoutVar = setTimeout(() => {
            console.log('Stop typing')
            this.setState({ typing: false });
        }, 2000);
    }
    onChangeText = (text) => {
        this.setState({
            txSearch: text,
        })
        if (text.length > 3) {
            drugProvider.searchDrug(text, 0, 5).then(res => {
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
        // if (this.state.typingTimeout) {
        //     clearTimeout(this.state.typingTimeout);
        // }
        // var itemsDrug = []
        // this.setState({
        //     typing: false,
        //     typingTimeout: setTimeout(function () {
        //         drugProvider.searchDrug(text, 0, 5).then(res => {
        //             if (res && res.length) {
        //                 this.setState({
        //                     itemsDrug: res,
        //                     isShowList: true,
        //                 })
        //             }

        //         }).catch(err => {
        //             console.log(err)
        //         })

        //     }, 2000),

        // }, () => {
        //     this.setState({
        //         itemsDrug: itemsDrug,
        //         isShowList: true,
        //     })
        //     console.log(itemsDrug, 'itemsDrugitemsDrug')

        // });

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
    onRemoveItem = (item) => {
        const items = this.state.selectedItems.filter((sitem) => sitem.medicineId !== item.medicineId);
        this.setState({ selectedItems: items });
    }

    render() {
        console.log(this.state.itemsDrug, 'itemsdrug', this.state.isShowList)
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.viewInputDrug}>
                        <TextInput onChangeText={text => this.onChangeText(text)} placeholderTextColor={'#000'} placeholder={'Nhập tên thuốc, vd (Paracetamol 500mg)'} style={styles.inpuNameDrug}></TextInput>
                        {/* {/* <ScaledImage height={20} source={require('@images/new/drug/ic_search.png')}></ScaledImage> */}
                    </View>
                    {this.state.isShowList ?
                        <ScrollView keyboardShouldPersistTaps="handled">
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