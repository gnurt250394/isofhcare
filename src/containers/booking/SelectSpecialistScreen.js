import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import ActivityPanel from '@components/ActivityPanel'
import specialistProvider from '@data-access/specialist-provider';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import dataCacheProvider from '@data-access/datacache-provider';

class SelectSpecialistScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialist: [],
            listSpecialistSearch: [],
            searchValue: "",
            refreshing: false,
        }
    }
    componentDidMount() {
        this.onRefresh();
    }
    selectSpecilist(specialist) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(specialist);
            this.props.navigation.pop();
            dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_SPECIALIST, specialist);

        }
    }


    onRefresh = () => {
        this.setState({ refreshing: true }, () => {
            specialistProvider.getAll().then(s => {
                this.setState({
                    refreshing: false
                }, () => {
                    if (s) {
                        this.setState({
                            listSpecialist: s
                        }, () => {
                            this.onSearch();
                        });
                    }
                })
            }).catch(e => {
                this.setState({
                    listSpecialist: [],
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
        var listSearch = this.state.listSpecialist.filter(function (item) {
            return s == null || item.name && item.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1;
        });
        this.setState({ listSpecialistSearch: listSearch });
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
                (!this.state.listSpecialistSearch || this.state.listSpecialistSearch.length == 0) ?
                <View style={styles.containerHeaderSearch}>
                    <ScaleImage source={require("@images/empty_result.png")} width={120} />
                    <Text>{constants.booking.specialist_not_found} <Text style={styles.txtValueSearch}>{this.state.searchValue}</Text></Text>
                </View> : null
        )
    }
    footerComponent = () => <View style={{ height: 10 }} />
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={this.selectSpecilist.bind(this, item)}>
                <View style={styles.containerItem}>
                    <Text style={styles.txtItemName}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <ActivityPanel
                backButton={<TouchableOpacity style={{ paddingLeft: 20 }} onPress={this.goBack}><Text>{constants.actionSheet.cancel}</Text></TouchableOpacity>}
                titleStyle={{ marginRight: 0 }}
                title={constants.title.select_specialist}
                isLoading={this.state.isLoading} menuButton={this.renderSearchButton()} showFullScreen={true}
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

                <FlatList
                    style={styles.flatlit}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    keyExtractor={this.keyExtractor}
                    extraData={this.state}
                    ListHeaderComponent={this.headerComponent}
                    ListFooterComponent={this.footerComponent}
                    data={this.state.listSpecialistSearch}
                    renderItem={this.renderItem}
                />


            </ActivityPanel >
        )
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}

export default connect(mapStateToProps)(SelectSpecialistScreen);


const styles = StyleSheet.create({
    txtItemName: { fontWeight: 'bold' },
    containerItem: {
        marginBottom: 2,
        backgroundColor: '#FFF',
        padding: 20,
        flexDirection: 'column',
        borderBottomColor: '#00000011',
        borderBottomWidth: 0.7
    },
    txtValueSearch: { fontWeight: 'bold', color: constants.colors.actionbar_title_color },
    containerHeaderSearch: {
        width: '100%',
        marginTop: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flatlit: { flex: 1, backgroundColor: '#FFF' },
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: constants.colors.actionbar_color,
        flexDirection: 'row'
    },
})