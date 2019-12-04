import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import InsertInfoDrug from './InsertInfoDrug'
import SearchableDropdown from 'react-native-searchable-dropdown';
import drugProvider from '@data-access/drug-provider'

export default class DrugInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            itemsDrug: [],
            txSearch: '',
            typing: false,
            typingTimeout: 0
        };
    }

    onSearch = () => {
        drugProvider.searchDrug(this.state.txSearch).then(res => {
            console.log('res: ', res);
        })
    }
    onChangeText = (text) => {
        this.setState({
            txSearch: text,
        })
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }
        this.setState({
            typing: false,
            typingTimeout: setTimeout(function () {
                drugProvider.searchDrug(text).then(res => {
                    console.log('res: ', res);

                })
            }, 2000)
        });
    }
    renderItem = ({ item, index }) => {
        return (
            <View style={styles.viewItem}>
                <Text style={styles.txName}>{item.name}</Text>
                <TouchableOpacity style={{ padding: 5 }} onPress={() => this.onRemoveItem(item)}><ScaledImage height={10} source={require('@images/new/drug/ic_cancer.png')}></ScaledImage></TouchableOpacity>
            </View>
        )
    }
    onRemoveItem = (item) => {
        const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
        this.setState({ selectedItems: items });
    }
    render() {
        return (
            <View style={styles.container}>
                {/* <View style={styles.viewInputDrug}> */}
                {/* <TextInput placeholder={'Nhập tên thuốc, vd (Paracetamol 500mg)'} style={styles.inpuNameDrug}></TextInput> */}
                <SearchableDropdown
                    multi={false}
                    selectedItems={this.state.selectedItems}
                    onItemSelect={(item) => {

                        const items = this.state.selectedItems;
                        items.push(item)
                        this.setState({ selectedItems: items });
                    }}
                    containerStyle={{ padding: 5 }}
                    onRemoveItem={(item, index) => {
                        const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
                        this.setState({ selectedItems: items });
                    }}
                    itemStyle={{
                        padding: 20,
                        marginTop: 2,
                        backgroundColor: '#fff',
                        borderColor: '#bbb',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                    itemTextStyle={{ color: '#222' }}
                    itemsContainerStyle={{ maxHeight: 140 }}
                    items={this.state.itemsDrug}
                    defaultIndex={2}
                    // chip={true}
                    resetValue={false}

                    textInputProps={

                        {
                            onSubmitEditing: this.onSearch,
                            returnKeyType: 'search',
                            placeholder: "Nhập tên thuốc, vd (Paracetamol 500mg",
                            underlineColorAndroid: "transparent",
                            style: {
                                flex: 1,
                                flexDirection: 'row',
                                margin: 10,
                                borderRadius: 6,
                                borderWidth: 1,
                                borderColor: '#00ba99',
                                alignItems: 'center',
                                padding: 10,
                            },
                            onTextChange: text => this.onChangeText(text)
                        }
                    }
                    listProps={
                        {
                            nestedScrollEnabled: true,
                        }
                    }
                />
                {/* <ScaledImage height={20} source={require('@images/new/drug/ic_search.png')}></ScaledImage>
                </View> */}
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
                <InsertInfoDrug dataDrug={this.state.selectedItems} ></InsertInfoDrug>
                <View style={styles.viewBottom}></View>
            </View>
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