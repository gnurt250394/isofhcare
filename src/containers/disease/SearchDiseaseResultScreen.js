import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, ActivityIndicator, Text, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import diseaseProvider from '@data-access/disease-provider';
// import ItemFacility from '@components/facility/ItemFacility';
import ItemDisease from '@components/disease/ItemDisease';

class SearchDiseaseResultScreen extends Component {
    constructor(props) {
        super(props)
        let keyword = this.props.navigation.getParam('keyword', '');
        if (keyword)
            keyword = keyword.trim();
        else
            keyword = "";

        let sympton = this.props.navigation.getParam('sympton', null);

        if (sympton) {
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
            sympton
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
        let func = diseaseProvider.search;
        let keyword = this.state.keyword;
        if (this.state.specialist) {
            func = diseaseProvider.searchBySympton;
            // keyword = this.state.s.specialist.id;
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

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title={this.state.keyword || this.state.specialist ? "KẾT QUẢ TÌM KIẾM BỆNH" : "DANH SÁCH BỆNH"} showFullScreen={true}>
                <View style={{ flex: 1, padding: 14 }}>
                    {
                        this.state.keyword ?
                            <Text style={{ marginTop: 13, fontSize: 14 }}>Kết quả tìm kiếm "<Text style={{ fontWeight: 'bold' }}>{this.state.keyword.length > 50 ? this.state.keyword.substring(0, 49) + "..." : this.state.keyword}</Text>"</Text> :
                            this.state.specialist ?
                                <Text style={{ marginTop: 13, fontSize: 14 }}>Kết quả tìm kiếm theo chuyên khoa "<Text style={{ fontWeight: 'bold' }}>{this.state.specialist.specialist.name}</Text>"</Text> :
                                null
                    }
                    <FlatList
                        onRefresh={this.onRefresh.bind(this)}
                        refreshing={this.state.refreshing}
                        onEndReached={this.onLoadMore.bind(this)}
                        onEndReachedThreshold={1}
                        style={{ flex: 1, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.data}
                        ListHeaderComponent={() => !this.state.refreshing && (!this.state.data || this.state.data.length == 0) ?
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <ScaledImage source={require("@images/search/noresult.png")} width={136} />
                                <TouchableOpacity onPress={() => { this.setState({ keyword: "", specialist: null }, this.onRefresh) }}>
                                    <Text style={{ marginTop: 20, padding: 20, textAlign: 'center', lineHeight: 30 }}>Chúng tôi không tìm thấy kết quả nào phù hợp, bạn có thể xem thêm <Text style={{ color: "#000", fontWeight: 'bold' }}>CSYT Hàng đầu</Text></Text>
                                </TouchableOpacity>

                            </View> : null
                        }
                        ListFooterComponent={() => <View style={{ height: 20 }}></View>}
                        renderItem={({ item, index }) =>
                            <ItemDisease key={index} disease={item} />
                        }
                    />
                </View>
                {
                    this.state.loadMore ?
                        <View style={{ alignItems: 'center', padding: 10, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
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
export default connect(mapStateToProps)(SearchDiseaseResultScreen);