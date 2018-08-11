import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import drugProvider from '@data-access/drug-provider';
import SearchPanel from '@components/SearchPanel';
import ItemDrug from '@components/drug/ItemDrug';
import realmModel from '@models/realm-models';
const Realm = require('realm');
import historyProvider from '@data-access/history-provider';

class TopSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginTop: 23 }}>
                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', paddingRight: 10 }} numberOfLines={1} ellipsizeMode='tail'>Chuyên khoa được tìm kiếm</Text>
                    <TouchableOpacity><Text style={{ fontSize: 14, color: 'rgb(74,144,226)', marginRight: 3, marginTop: 2 }}>Xem tất cả</Text></TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 14 }}>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                            return <TouchableOpacity style={{ margin: 3, padding: 4, paddingLeft: 12, paddingRight: 12, borderRadius: 16, backgroundColor: 'rgb(0,151,124)' }}><Text style={{ color: '#FFF', fontWeight: 'bold', maxWidth: 100 }} numberOfLines={1} ellipsizeMode='tail'>Khoa răng</Text></TouchableOpacity>
                        })
                    }
                </View>

            </View>);
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(TopSearch);