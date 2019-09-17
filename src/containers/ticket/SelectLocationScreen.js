import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import ActivityPanel from '@components/ActivityPanel'
import serviceProvider from '@data-access/service-provider';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import locationProvider from '@data-access/location-provider';

class SelectLocationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listService: [],
            refreshing: false,
        }
    }
    componentDidMount() {
        this.onRefresh();
    }
    selectService(service) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(service.service);
            this.props.navigation.pop();
        }
    }


    onRefresh = () => {
        this.setState({ refreshing: true }, () => {
            locationProvider.getListProvince((s, e) => {
                console.log(s, e);
                this.setState({
                    refreshing: false
                }, () => {
                    if (s) {
                        this.setState({
                            listService: s.countryCode
                        });
                    } else {
                        this.setState({
                            listService: [],
                            refreshing: false
                        })
                    }
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
        var listSearch = this.state.listService.filter(function (item) {
            return s == null || item.service.name && item.service.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1;
        });
        this.setState({ listServiceSearch: listSearch });
    }
    renderSearchButton() {
        return (
            <TouchableOpacity onPress={this.showSearch} style={{ padding: 10 }}>
                <ScaleImage source={require("@images/ic_timkiem.png")} width={20} />
            </TouchableOpacity>
        );
    }
    goBack = () => this.props.navigation.pop()
    keyExtractor = (item, index) => index.toString()
    headerComponent = () => {
        return (
            !this.state.refreshing &&
                (!this.state.listServiceSearch || this.state.listServiceSearch.length == 0) ?
                <View style={styles.containerSearchValue}>
                    <ScaleImage source={require("@images/empty_result.png")} width={120} />
                    <Text>{constants.none_service} <Text style={styles.txtSearchValue}>{this.state.searchValue}</Text></Text>
                </View> : null
        )
    }
    footerComponent = () => <View style={{ height: 10 }} />
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={this.selectService.bind(this, item)}>
                <View style={styles.containerItem}>
                    <Text style={styles.fontBold}>
                        {item.service.name}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <ActivityPanel
                backButton={<TouchableOpacity style={{ paddingLeft: 20 }} onPress={this.goBack}><Text>{constants.actionSheet.cancel}</Text></TouchableOpacity>}
                titleStyle={{ marginRight: 0 }} title={constants.ehealth.city}
                isLoading={this.state.isLoading} menuButton={this.renderSearchButton()} showFullScreen={true}
            >
                {
                    this.state.showSearch ?
                        <View style={styles.containerSearch}>
                            <TextInput autoFocus={true}
                                style={styles.inputSearch}
                                placeholderTextColor='#dddddd'
                                underlineColorAndroid="transparent"
                                placeholder={constants.ehealth.inputKeyword}
                                onChangeText={this.searchTextChange} returnKeyType="search" onSubmitEditing={this.onSearch} />
                            <TouchableOpacity onPress={this.onSearch}>
                                <Text style={styles.txtSearch}>{constants.search}</Text>
                            </TouchableOpacity>
                        </View>
                        : null

                }

                <FlatList
                    style={styles.flatlist}
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
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}

export default connect(mapStateToProps)(SelectLocationScreen);


const styles = StyleSheet.create({
    fontBold: { fontWeight: 'bold' },
    containerItem: {
        marginBottom: 2,
        backgroundColor: '#FFF',
        padding: 20,
        flexDirection: 'column',
        borderBottomColor: '#00000011',
        borderBottomWidth: 0.7
    },
    txtSearchValue: {
        fontWeight: 'bold',
        color: constants.colors.actionbar_title_color
    },
    containerSearchValue: {
        width: '100%',
        marginTop: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flatlist: { flex: 1, backgroundColor: '#FFF' },
    txtSearch: {
        backgroundColor: constants.colors.actionbar_title_color,
        padding: 7, borderRadius: 20,
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: constants.colors.actionbar_color,
        flexDirection: 'row'
    },
})