import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';

import specialistProvider from '@data-access/specialist-provider';

class TopSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        specialistProvider.getTop(10, (s, e) => {
            if (s) {
                this.setState({ data: s });
            }
        });
    }

    onItemClick(item) {
        if (this.props.onItemClick)
            this.props.onItemClick(item);
    }

    render() {
        return (
            this.state.data && this.state.data.length > 0 ?
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', marginTop: 23 }}>
                        <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', paddingRight: 10 }} numberOfLines={1} ellipsizeMode='tail'>Chuyên khoa được tìm kiếm</Text>
                        <TouchableOpacity onPress={() => snackbar.show("Chức năng đang phát triển")}><Text style={{ fontSize: 14, color: 'rgb(74,144,226)', marginRight: 3, marginTop: 2 }}>Xem tất cả</Text></TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 14 }}>
                        {
                            this.state.data.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={this.onItemClick.bind(this, item)} style={{ margin: 3, padding: 4, paddingLeft: 12, paddingRight: 12, borderRadius: 16, backgroundColor: 'rgb(0,151,124)' }}><Text style={{ color: '#FFF', fontWeight: 'bold', maxWidth: 80, fontSize: 13 }} numberOfLines={1} ellipsizeMode='tail'>{item.specialist.name}</Text></TouchableOpacity>
                            })
                        }
                    </View>

                </View> : null);
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(TopSearch);