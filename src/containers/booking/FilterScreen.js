import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import ActivityPanel from '@components/ActivityPanel'
import specialistProvider from '@data-access/specialist-provider';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import dataCacheProvider from '@data-access/datacache-provider';

class FilterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialist: [],
            listSpecialistSearch: [],
            searchValue: "",
            refreshing: false,
            index: '',
            listSelected: [],
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

    showSearch() {
        this.setState({
            showSearch: !this.state.showSearch,
            searchValue: ""
        })
    }
    searchTextChange(s) {
        this.setState({ searchValue: s });
    }
    onSearch() {
        var s = this.state.searchValue;
        var listSearch = this.state.listSpecialist.filter(function (item) {
            return s == null || item.name && item.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1;
        });
        this.setState({ listSpecialistSearch: listSearch });
    }
    onFilter = () => {
        let filterData = this.state.listSpecialist.filter(data => {
            return (data.selected);
        })
        this.props.navigation.navigate('addBooking', { data: filterData })
    }
    onSelected = (item) => {
        if (!item.selected) {
            item.selected = true;
            this.setState({
                listSpecialist: [...this.state.listSpecialist]
            });
        } else {
            item.selected = false;
            this.setState({
                listSpecialist: [...this.state.listSpecialist]
            });
        }

        //  this.setState({
        //      listSelected:  this.state.listSelected.concat(item)
        //  } ,() => {
        //     console.log(this.state.listSelected,'ssssss');
        //  })
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.onSelected(item)} style={styles.viewBtn}>
                <View style={{ flexDirection: 'row' }}>
                    <ScaleImage width={30} source={require("@images/ic_test.png")} />
                    <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>{item.name}</Text>
                </View>
                {item.selected ? (
                    <ScaleImage height={20} source={require('@images/new/ic_question_check_specialist.png')}></ScaleImage>

                ) : null}
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <ActivityPanel
                backButtonClick={this.onFilter} title={"Lọc"}
                titleStyle={{ marginLeft: 55 }}
                menuButton={<TouchableOpacity style={styles.menu} onPress={() => this.props.navigation.navigate('filter')}><Text>Đồng ý</Text></TouchableOpacity>}
            >
                <FlatList
                    style={{ flex: 1, backgroundColor: '#FFF' }}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    ListHeaderComponent={() =>
                        !this.state.refreshing &&
                            (!this.state.listSpecialistSearch || this.state.listSpecialistSearch.length == 0) ?
                            <View style={{ width: '100%', marginTop: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                                <ScaleImage source={require("@images/empty_result.png")} width={120} />
                                <Text>Không tìm thấy chuyên khoa nào phù hợp <Text style={{ fontWeight: 'bold', color: constants.colors.actionbar_title_color }}>{this.state.searchValue}</Text></Text>
                            </View> : null
                    }
                    ListFooterComponent={() => <View style={{ height: 10 }} />}
                    data={this.state.listSpecialistSearch}
                    renderItem={this.renderItem}
                />


            </ActivityPanel>
        )
    }
}
const styles = StyleSheet.create({
    viewBtn: { marginBottom: 2, padding: 20, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#00000011', borderBottomWidth: 0.7, justifyContent: 'space-between' },
    menu: {
        marginRight: 10
    }

})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.dhyBooking
    };
}

export default connect(mapStateToProps)(FilterScreen);
