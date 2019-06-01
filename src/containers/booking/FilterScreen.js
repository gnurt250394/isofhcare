import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import ActivityPanel from '@components/ActivityPanel'
import specialistProvider from '@data-access/specialist-provider';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import dataCacheProvider from '@data-access/datacache-provider';
import ImageLoad from 'mainam-react-native-image-loader';

class FilterScreen extends Component {
    constructor(props) {
        super(props);
        let listSelected = ((this.props.navigation.state || {}).params || {}).listSelected;
        let listSpecialist = ((this.props.navigation.state || {}).params || {}).specialists;
        listSpecialist.map(item => {
            if (listSelected.indexOf(item.id) != -1) {
                item.selected = true;
            }
        })
        this.state = {
            listSpecialist: listSpecialist,
            listSpecialistSearch: [],
            searchValue: "",
            index: '',
            listSelected: listSelected || [],
            listSpecialist: listSpecialist || []
        }
    }
    componentDidMount() {
        this.onSearch();
    }
    selectSpecilist(specialist) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(specialist);
            this.props.navigation.pop();
            dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_SPECIALIST, specialist);

        }
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
        console.log(listSearch,'listSearch');
        this.setState({ listSpecialistSearch: listSearch });
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
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.onSelected(item)} style={styles.viewBtn}>
                <ScaleImage width={30} source={ item.linkImages ? {uri:linkImages.absoluteUrl()} : require("@images/new/booking/ic_default.png")} />
                <Text style={{ fontWeight: 'bold', marginVertical: 10, flex: 1,marginLeft:10 }}>{item.name}</Text>
                {item.selected ? (
                    <ScaleImage height={20} source={require('@images/new/ic_question_check_specialist.png')}></ScaleImage>

                ) : null}
            </TouchableOpacity>
        )
    }
    done() {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            let listItem = this.state.listSpecialist.filter(item => item.selected).map(item => item.id);
            callback(listItem);
            this.props.navigation.pop();
        }
    }

    render() {
        return (
            <ActivityPanel
                title={"Lọc"}
                titleStyle={{ marginLeft: 55 }}
                menuButton={<TouchableOpacity style={styles.menu} onPress={this.done.bind(this)}><Text style={{ fontWeight: 'bold' }}>Đồng ý</Text></TouchableOpacity>}
            >
                <FlatList
                    style={{ flex: 1, backgroundColor: '#FFF' }}
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
