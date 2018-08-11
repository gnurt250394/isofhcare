import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import ItemFacility from '@components/facility/ItemFacility';

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
                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', paddingRight: 10 }} numberOfLines={1} ellipsizeMode='tail'>CSYT hàng đầu</Text>
                    <TouchableOpacity><Text style={{ fontSize: 14, color: 'rgb(74,144,226)', marginRight: 3, marginTop: 2 }}>Xem tất cả</Text></TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 14 }}>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                            return <ItemFacility key={index} />
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