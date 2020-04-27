import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import ActivityPanel from '@components/ActivityPanel'
import serviceTypeProvider from '@data-access/service-type-provider';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import dataCacheProvider from '@data-access/datacache-provider';
import stringUtils from 'mainam-react-native-string-utils';
import locationProvider from '@data-access/location-provider';

class SelectRelationshipScreen extends Component {
    constructor(props) {
        super(props);
        let gender = this.props.navigation.state.params && this.props.navigation.state.params.gender ? this.props.navigation.state.params.gender : null
        this.state = {
            listService: [],
            listServiceSearch: [],
            searchValue: "",
            refreshing: false,
            gender: gender,
            dataMale: [
                {
                    id: 1,
                    name: 'Cha',
                    type: 'DAD',
                    gender: '1'
                }, {
                    id: 3,
                    name: 'Con trai',
                    type: 'BOY',
                    gender: '1'

                }, {
                    id: 5,
                    name: 'Cháu trai',
                    type: 'GRANDSON',
                    gender: '1'

                }, {
                    id: 7,
                    name: 'Ông',
                    type: 'GRANDFATHER',
                    gender: '1'

                }, {
                    id: 10,
                    name: 'Chồng',
                    type: 'HUSBAND',
                    gender: '1'

                }, {
                    id: 11,
                    name: 'Khác',
                    type: 'OTHER',
                    gender: '1'

                },
            ],
            dataFemale: [
                {
                    id: 2,
                    name: 'Mẹ',
                    type: 'MOTHER',
                    gender: '2'

                }, {
                    id: 4,
                    name: 'Con gái',
                    type: 'DAUGHTER',
                    gender: '2'

                }, {
                    id: 6,
                    name: 'Cháu gái',
                    type: 'NIECE',
                    gender: '2'

                }, {
                    id: 8,
                    name: 'Bà',
                    type: 'GRANDMOTHER',
                    gender: '2'

                }, {
                    id: 9,
                    name: 'Vợ',
                    type: 'WIFE',
                    gender: '2'

                },
                {
                    id: 11,
                    name: 'Khác',
                    type: 'OTHER',
                    gender: '2'

                },
            ]
        }
    }
    componentDidMount() {
        this.onSearch();
    }
    selectZone(relationShip) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(relationShip);
            this.props.navigation.pop();
        }
    }

    showSearch() {
        this.setState({
            showSearch: !this.state.showSearch,
            searchValue: ""
        })
    }
    searchTextChange = (s) => {
        this.setState({ searchValue: s });
    }
    onSearch = () => {
        switch (this.state.gender) {
            case '0': {
                var s = this.state.searchValue;
                var listSearch = this.state.dataFemale.filter(function (item) {
                    return (item == null || item.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1);
                });
                this.setState({ dataSearch: listSearch });
                break
            }
            case '1': {
                var s = this.state.searchValue;
                var listSearch = this.state.dataMale.filter(function (item) {
                    return (item == null || item.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1);
                });
                this.setState({ dataSearch: listSearch });
                break
            }
        }



    }
    renderSearchButton() {
        return (
            <TouchableOpacity onPress={() => this.showSearch()} style={{ padding: 10 }}>
                <ScaleImage source={require("@images/ic_timkiem.png")} width={20} />
            </TouchableOpacity>
        );
    }
    goBack = () => this.props.navigation.pop()
    keyExtractor = (item, index) => index.toString()
    headerComponent = () => {
        return (
            !this.state.refreshing &&
                (!this.state.dataSearch || this.state.dataSearch.length == 0) ?
                <View style={styles.containerSearchValue}>
                    <ScaleImage source={require("@images/empty_result.png")} width={120} />
                    <Text>{constants.none_service_type_match}<Text style={styles.txtSearchValue}>{this.state.searchValue}</Text></Text>
                </View> : null
        )
    }
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={this.selectZone.bind(this, item)}>
                <View style={styles.containerItem}>
                    <Text style={styles.txtItem}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    footerComponent = () => <View style={{ height: 10 }} />
    render() {
        return (
            <ActivityPanel
                backButton={<TouchableOpacity style={{ paddingLeft: 20 }} onPress={this.goBack}><Text>{constants.actionSheet.cancel}</Text></TouchableOpacity>}
                titleStyle={{ marginRight: 0 }} title={'Chọn quan hệ'}
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
                    style={styles.flatlist}
                    keyExtractor={this.keyExtractor}
                    extraData={this.state}
                    ListHeaderComponent={this.headerComponent}
                    ListFooterComponent={this.footerComponent}
                    data={this.state.dataSearch}
                    renderItem={this.renderItem}
                />


            </ActivityPanel >
        )
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}

export default connect(mapStateToProps)(SelectRelationshipScreen);


const styles = StyleSheet.create({
    txtItem: {
        fontWeight: 'bold'
    },
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
    flatlist: {
        flex: 1,
        backgroundColor: '#FFF'
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: constants.colors.actionbar_color,
        flexDirection: 'row'
    },
})