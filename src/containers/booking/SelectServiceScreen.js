import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import ActivityPanel from '@components/ActivityPanel'
import serviceProvider from '@data-access/service-provider';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';

class SelectServiceScreen extends Component {
    constructor(props) {
        super(props);
        let hospital = this.props.navigation.state.params.hospital;
        let serviceType = this.props.navigation.state.params.serviceType || {};
        this.listServicesSelected = this.props.navigation.getParam('listServicesSelected') || [];
        if (!hospital) {
            this.props.navigation.pop();
            snackbar.show(constants.msg.booking.please_select_location, "danger");
        }
        if (!serviceType) {
            this.props.navigation.pop();
            snackbar.show(constants.msg.booking.please_select_require, "danger");
        }
        this.state = {
            listService: [],
            listServiceSearch: [],
            searchValue: "",
            refreshing: false,
            hospital: hospital || {},
            serviceType,
            listSpecialist: [],
            specialists: []
        }
    }
    componentDidMount() {
        this.onRefresh();
    }



    onRefresh = () => {
        let serviceType = this.state.serviceType ? this.state.serviceType.id || "" : ''
        let specialist = "";//this.state.specialist ? this.state.specialist.id : ''
        this.setState({ refreshing: true }, () => {
            serviceProvider.getAllServices(this.state.hospital.id).then(s => {
                this.setState({
                    refreshing: false
                }, () => {
                    if (s) {
                        // switch (s.code) {
                        //     case 0:
                        //         let listService = s.data.data.sort(function (a, b) {
                        //             return new Date(a.service.createdDate) - new Date(b.service.createdDate);
                        //         });
                        this.setState({
                            listService: s
                        }, () => {
                            this.onSearch();
                        });
                        // }
                    }
                })
            }).catch(e => {
                this.setState({
                    listService: [],
                    refreshing: false
                })
            })
        });
    }

    showSearch = () => {
        this.setState({
            showSearch: !this.state.showSearch,
            searchValue: ""
        })
    }
    searchTextChange = (s) => {
        this.setState({ searchValue: s });
    }
    onSearch = () => {
        var s = this.state.searchValue;
        var listSearch = this.state.listService.filter(item => {
            return s == null || item.name && item.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1;
        });
        listSearch = listSearch.map(item => {
            item.checked = this.listServicesSelected.find(item2 => item2.id == item.id);
            return item;
        })

        this.setState({ listServiceSearch: listSearch });
    }
    renderSearchButton() {
        return (
            <TouchableOpacity onPress={this.showSearch} style={{ padding: 10 }}>
                <ScaleImage source={require("@images/ic_timkiem.png")} style={{ tintColor: '#FFF' }} width={20} />
            </TouchableOpacity>
        );
    }
    onPressItem1(item) {
        let x = this.listServicesSelected.find(item2 => item2.id == item.id);
        if (x) {
            item.checked = false;
            let index = this.listServicesSelected.indexOf(x);
            this.listServicesSelected.splice(index, 1);
        } else {
            item.checked = true;
            this.listServicesSelected.push(item);
        }


        // item.checked = !item.checked
        this.setState({
            listServiceSearch: [...this.state.listServiceSearch]
        })
    }
    ok = () => {
        // let listChecked = this.state.listServiceSearch.filter(item => item.checked);
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(this.listServicesSelected);
            this.props.navigation.pop();
        }
    }
    goBack = () => this.props.navigation.pop()
    keyExtractor = (item, index) => index.toString()
    headerComponent = () => {
        return (
            !this.state.refreshing &&
                (!this.state.listServiceSearch || this.state.listServiceSearch.length == 0) ?
                <View style={styles.headerSearch}>
                    <ScaleImage source={require("@images/empty_result.png")} width={120} />
                    <Text>{constants.none_service}<Text style={styles.txtHeaderSearch}>{this.state.searchValue}</Text></Text>
                </View> : null
        )
    }
    footerComponent = () => <View style={{ height: 10 }} />
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={this.onPressItem1.bind(this, item)}>
                <View style={[styles.containerItem, item.checked ? { backgroundColor: 'rgba(240, 243, 189, 0.2)' } : { backgroundColor: '#FFF' }]}>
                    <View style={styles.groupContentItem}>
                        <Text style={styles.txtServices}>
                            {item.name}
                        </Text>
                        <Text style={{ paddingRight: 10, fontStyle: 'italic' }}>{item.monetaryAmount && item.monetaryAmount.value ? item.monetaryAmount.value.formatPrice() : 0}đ </Text>
                        {item.checked ?
                            <ScaleImage source={require("@images/new/ic_verified.png")} width={20} />
                            :
                            <View style={{ width: 20 }} />
                        }
                        {/* <Text>{item.service.price.formatPrice() + 'đ'}</Text> */}
                    </View>
                    {/* <Text numberOfLines={2}>
                {item.service.describe}
            </Text> */}
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <ActivityPanel
                backButton={<TouchableOpacity
                    style={{ paddingLeft: 20 }}
                    onPress={this.goBack}>
                    <Text style={{ color: '#FFF' }}>{constants.actionSheet.cancel}</Text>
                </TouchableOpacity>}
                title={constants.title.service}
                isLoading={this.state.isLoading}
                menuButton={<View style={styles.menuButton}>
                    {this.renderSearchButton()}
                </View>}
                titleStyle={styles.titleHeader}
                showFullScreen={true}
            >

                {
                    this.state.showSearch ?
                        <View style={styles.containerSearch}>
                            <TextInput autoFocus={true} style={styles.inputSearch}
                                placeholderTextColor='#dddddd'
                                underlineColorAndroid="transparent"
                                placeholder={constants.ehealth.inputKeyword}
                                onChangeText={this.searchTextChange}
                                returnKeyType="search"
                                onSubmitEditing={this.onSearch} />
                            <TouchableOpacity onPress={this.onSearch}>
                                <Text style={styles.txtSearch}>{constants.search}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, backgroundColor: '#FFF' }}>
                    <TouchableOpacity style={styles.buttonCheck}
                        onPress={this.ok}>
                        <ScaleImage source={require("@images/new/ic_question_check_specialist.png")} width={20} />
                        <Text style={styles.txtDone}>{constants.actionSheet.done}</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={styles.flex}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    keyExtractor={this.keyExtractor}
                    extraData={this.state}
                    ListHeaderComponent={this.headerComponent}
                    ListFooterComponent={this.footerComponent}
                    data={this.state.listServiceSearch}
                    renderItem={this.renderItem}
                />


            </ActivityPanel>
        )
    }
}

const styles = StyleSheet.create({
    txtServices: {
        fontWeight: 'bold',
        flex: 1
    },
    groupContentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerItem: {
        marginBottom: 2,
        padding: 20,
        flexDirection: 'column',
        borderBottomColor: '#00000011',
        borderBottomWidth: 0.7
    },
    txtHeaderSearch: {
        fontWeight: 'bold',
        color: constants.colors.actionbar_title_color
    },
    headerSearch: {
        width: '100%',
        marginTop: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flex: { flex: 1 },
    txtDone: {
        color: "#02c39a",
        fontWeight: 'bold',
        marginLeft: 10,
        width: '15%'
    },
    buttonCheck: {
        alignSelf: 'flex-end',
        paddingVertical: 15,
        // marginRight: 20,
        flexDirection: 'row',

    },
    txtSearch: {
        backgroundColor: constants.colors.actionbar_title_color,
        padding: 7,
        borderRadius: 20,
        marginRight: 10,
        paddingLeft: 15,
        paddingRight: 15,
        fontWeight: 'bold',
        color: '#FFF'
    },
    inputSearch: {
        flex: 1,
        color: constants.colors.actionbar_title_color,
        padding: 10
    },
    containerSearch: {
        justifyContent: 'space-between',
        elevation: 5,
        height: 55,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: constants.colors.actionbar_color,
        flexDirection: 'row'
    },
    titleHeader: { marginLeft: 50 },
    menuButton: { flexDirection: 'row', alignItems: 'center' },
    menu: {
        padding: 5,
        paddingRight: 15
    },
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}

export default connect(mapStateToProps)(SelectServiceScreen);
