import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, ActivityIndicator, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import diseaseProvider from '@data-access/disease-provider';
// import ItemFacility from '@components/facility/ItemFacility';
import ItemDisease from '@components/disease/ItemDisease';
import constants from '@resources/strings';

class SearchDiseaseResultScreen extends Component {
    constructor(props) {
        super(props)
        let keyword = this.props.navigation.getParam('keyword', '');
        if (keyword)
            keyword = keyword.trim();
        else
            keyword = "";
        let symptom = this.props.navigation.getParam('symptom', null);

        if (symptom) {
            keyword = "";
        }


        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            finish: false,
            loading: false,
            keyword,
            symptom
        }

        // alert(JSON.stringify(symptom))
    }
    componentDidMount() {
        this.onRefresh();
    }

    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
                this.onLoad();
            });
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        })
        let func = diseaseProvider.search;
        let keyword = this.state.keyword;
        if (this.state.symptom) {
            func = diseaseProvider.searchBySymptom;
            keyword = this.state.symptom.symptom.id;
        }
        func(keyword, page, size, (s, e) => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
            });
            if (s) {
                switch (s.code) {
                    case 0:
                        var list = [];
                        var finish = false;
                        if (s.data.data.length == 0) {
                            finish = true;
                        }
                        if (page != 1) {
                            list = this.state.data;
                            list.push.apply(list, s.data.data);
                        }
                        else {
                            list = s.data.data;
                        }
                        this.setState({
                            data: [...list],
                            finish: finish
                        });
                        break;
                }
            }
        });
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState({ loadMore: true, refreshing: false, loading: true, page: this.state.page + 1 }, () => {
                this.onLoad(this.state.page)
            });
    }
    onClickSeeMore = () => {
        this.setState({ keyword: "", symptom: null }, this.onRefresh)
    }
    keyExtractor = (item, index) => index.toString()
    headerComponent = () => {
        return (!this.state.refreshing && (!this.state.data || this.state.data.length == 0) ?
            <View style={{ alignItems: 'center', marginTop: 50 }}>
                <ScaledImage source={require("@images/search/noresult.png")} width={136} />
                <TouchableOpacity onPress={this.onClickSeeMore}>
                    <Text style={styles.txtSeeMore}>Chúng tôi không tìm thấy kết quả nào phù hợp, bạn có thể xem thêm <Text style={{ color: "#000", fontWeight: 'bold' }}>Bệnh được tìm nhiều</Text></Text>
                </TouchableOpacity>

            </View> : null
        )
    }
    footerComponent = () => <View style={{ height: 20 }}></View>
    _renderItem = ({ item, index }) => <ItemDisease key={index} disease={item} />

    render() {
        return (
            <ActivityPanel style={styles.flex}
                title={this.state.keyword || this.state.symptom ? constants.disease.result_search_diseases : constants.disease.list_disease}
                showFullScreen={true}>
                <View style={styles.container}>
                    {
                        this.state.keyword ?
                            <Text style={styles.txtResult}>{constants.disease.result_search} "<Text style={{ fontWeight: 'bold' }}>{this.state.keyword.length > 50 ? this.state.keyword.substring(0, 49) + "..." : this.state.keyword}</Text>"</Text> :
                            this.state.symptom ?
                                <Text
                                    style={styles.txtResult}>{constants.disease.result_search_symptom} "<Text style={{ fontWeight: 'bold' }}>{this.state.symptom.symptom.name}</Text>"</Text> :
                                null
                    }
                    <FlatList
                        onRefresh={this.onRefresh.bind(this)}
                        refreshing={this.state.refreshing}
                        onEndReached={this.onLoadMore.bind(this)}
                        onEndReachedThreshold={1}
                        style={styles.flatList}
                        keyExtractor={this.keyExtractor}
                        extraData={this.state}
                        data={this.state.data}
                        ListHeaderComponent={this.headerComponent}
                        ListFooterComponent={this.footerComponent}
                        renderItem={this._renderItem}
                    />
                </View>
                {
                    this.state.loadMore ?
                        <View style={styles.containerLoadMore}>
                            <ActivityIndicator
                                size={'small'}
                                color={'gray'}
                            />
                        </View> : null
                }
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(SearchDiseaseResultScreen);

const styles = StyleSheet.create({
    containerLoadMore: {
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    txtSeeMore: {
        marginTop: 20,
        padding: 20,
        textAlign: 'center',
        lineHeight: 30
    },
    flatList: {
        flex: 1,
        marginTop: 10
    },
    txtResult: {
        marginTop: 13,
        fontSize: 14
    },
    container: {
        flex: 1,
        padding: 14
    },
    flex: { flex: 1 },
})