import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ItemDrug from '@components/drug/ItemDrug';
import drugProvider from '@data-access/drug-provider';

class TopSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            refreshing_list_most: true
        }
    }
    componentDidMount() {
        this.onRefreshListMost();
    }
    onRefreshListMost() {
        if (!this.state.loading_list_most)
            this.setState({ refreshing_list_most: true, page_list_most: 1, loading_list_most: true }, () => {
                this.onLoadListMost();
            });
    }
    onLoadListMost() {
        this.setState({
            loading_list_most: true,
            refreshing_list_most: true
        }, () =>
                drugProvider.getTop(10, (s, e) => {
                    if (s) {
                        this.setState({
                            data: s,
                            loading_list_most: false,
                            refreshing_list_most: false
                        });
                    }
                }));
    }
    render() {

        if (this.state.data && this.state.data.length > 0)
            return (
                <View style={this.props.style}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thuốc được tra cứu nhiều</Text>
                    <FlatList
                        onRefresh={this.onRefreshListMost.bind(this)}
                        refreshing={this.state.refreshing_list_most}
                        style={{ flex: 1, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.data}
                        ListHeaderComponent={() => !this.state.refreshing_list_most && (!this.state.data || this.state.data.length == 0) ?
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <Text style={{ fontStyle: 'italic' }}>Hiện tại chưa có thông tin</Text>
                            </View> : null
                        }
                        ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                        renderItem={({ item, index }) =>
                            <ItemDrug drug={item} />
                        }
                    />
                </View>
            );
        return null;
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(TopSearch);