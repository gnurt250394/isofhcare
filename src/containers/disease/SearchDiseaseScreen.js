import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import SearchPanel from '@components/SearchPanel';
import realmModel from '@models/realm-models';
const Realm = require('realm');
import historyProvider from '@data-access/history-provider';
import diseaseProvider from '@data-access/disease-provider';
import TopSymptom from '@components/symptom/TopSearch';
import ListDisease from '@components/disease/ListDisease';
import constants from '@resources/strings';

class SearchDiseaseScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page_list_most: 1,
            size_list_most: 20,
            list_most: [],
            refreshing_list_most: true
        }
    }

    searchFocus() {
        this.setState({ showOverlay: true });
    }
    overlayClick() {
        if (this.searchPanel) {
            this.searchPanel.clear();
        }
        this.setState({ showOverlay: false });
    }

    onSearch(s) {
        return new Promise((resolve, reject) => {
            diseaseProvider.search(s, 1, 4, (s, e) => {
                if (e)
                    reject(e);
                else {
                    if (s && s.code == 0) {
                        resolve(s.data.data);
                    } else {
                        reject([]);
                    }
                }
            });
        });
    }
    onSearchItemClick(item) {
        this.props.navigation.navigate("diseaseDetail", { disease: item });
        const { DISEASE_HISTORY } = realmModel;
        historyProvider.addHistory("", DISEASE_HISTORY, item.name, item.id, "");
    }
    renderSearchItem(item, index, keyword) {
        // alert(JSON.stringify(item))
        return <TouchableOpacity style={{ padding: 5 }} onPress={this.onSearchItemClick.bind(this, item)}>
            <Text style={{ paddingLeft: 10 }}>{item.disease.name}</Text>
            <View style={{ height: 0.5, backgroundColor: '#00000040', marginTop: 12 }} />
        </TouchableOpacity>
    }
    onClickSeeAllResult = () => this.props.navigation.navigate("searchDiseaseResult", { keyword })
    renderFooter(keyword, data) {
        if (keyword)
            return <TouchableOpacity
                style={{ padding: 5, paddingLeft: 15, flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}
                onPress={this.onClickSeeAllResult}>
                <ScaledImage source={require("@images/search/icsearch2.png")} width={15} />
                <Text style={styles.txtSeeMore}>{constants.disease.see_all_result}</Text>
            </TouchableOpacity>
        return <View />
    }

    onSymptomClick(item) {
        if (item) {
            this.props.navigation.navigate("searchDiseaseResult", { symptom: item });
        }
    }

    render() {
        return (
            <ActivityPanel style={styles.flex} title={constants.title.search_disease} showFullScreen={true}>
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.scroll}>
                        <View style={styles.flex}>
                            <TopSymptom onItemClick={this.onSymptomClick.bind(this)} />
                            <ListDisease />
                        </View>
                    </ScrollView>
                    {
                        this.state.showOverlay ?
                            <TouchableWithoutFeedback onPress={this.overlayClick.bind(this)} style={{}}>
                                <View style={styles.containerOverLay} />
                            </TouchableWithoutFeedback> : null
                    }
                    <SearchPanel
                        style={styles.searchPanel}
                        searchTypeId={realmModel.DISEASE_HISTORY}
                        resultPage="searchDiseaseResult"
                        ref={ref => this.searchPanel = ref}
                        onFocus={this.searchFocus.bind(this)}
                        placeholder={constants.disease.search_name_disease_or_symptom}
                        onSearch={this.onSearch.bind(this)}
                        renderItem={this.renderSearchItem.bind(this)}
                        renderFooter={this.renderFooter.bind(this)} />

                </View>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(SearchDiseaseScreen);

const styles = StyleSheet.create({
    searchPanel: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12
    },
    containerOverLay: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: '#37a3ff59'
    },
    scroll: {
        marginTop: 43
    },
    container: {
        flex: 1,
        padding: 14,
        position: 'relative'
    },
    flex: { flex: 1 },
    txtSeeMore: {
        paddingLeft: 10,
        color: 'rgb(74,144,226)'
    },
})