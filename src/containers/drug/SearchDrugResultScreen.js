import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, ActivityIndicator, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import drugProvider from '@data-access/drug-provider';
import constants from '@resources/strings';
// import ItemDrug from '@components/drug/ItemDrug';

class SearchDrugScreen extends Component {
    constructor(props) {
        super(props)
        let keyword = this.props.navigation.getParam('keyword', '');
        if (keyword)
            keyword = keyword.trim();
        else
            keyword = "";


        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            finish: false,
            loading: false,
            keyword
        }
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
        drugProvider.search(this.state.keyword, page, size, (s, e) => {
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
    keyExtractor = (item, index) => index.toString()
    onClickSeeMore = () => {
        this.setState({ keyword: "" }, this.onRefresh)
    }
    headerComponent = () => {
        return (!this.state.refreshing && (!this.state.data || this.state.data.length == 0) ?
            <View style={{ alignItems: 'center', marginTop: 50 }}>
                <ScaledImage source={require("@images/search/noresult.png")} width={136} />
                <TouchableOpacity onPress={this.onClickSeeMore}>
                    <Text style={styles.txtSeeMore}>Chúng tôi không tìm thấy kết quả nào phù hợp, bạn có thể xem thêm <Text style={styles.seeMore}>Thuốc được tìm nhiều</Text></Text>
                </TouchableOpacity>

            </View> : null
        )
    }
    footerComponent = () => <View style={{ height: 100 }}></View>
    renderItem = ({ item, index }) => <ItemDrug drug={item} />

    render() {
        return (
            <ActivityPanel style={styles.flex} title={this.state.keyword ? constants.drug.result_search_drug : constants.drug.list_drug} showFullScreen={true}>
                <View style={styles.container}>
                    <View style={styles.flex}>
                        {
                            this.state.keyword ?
                                <Text style={styles.txtResult}>{constants.drug.result_search} "<Text style={{ fontWeight: 'bold' }}>{this.state.keyword.length > 50 ? this.state.keyword.substring(0, 49) + "..." : this.state.keyword}</Text>"</Text> :
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
                            renderItem={this.renderItem}
                        />
                    </View>
                </View>
                {
                    this.state.loadMore ?
                        <View style={styles.containerLoading}>
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
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(SearchDrugScreen);

const styles = StyleSheet.create({
    containerLoading: {
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    txtResult: {
        marginTop: 13,
        fontSize: 14
    },
    seeMore: {
        color: "#000",
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        padding: 14
    },
    flex: { flex: 1 },
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
})