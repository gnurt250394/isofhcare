import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import ItemFacility from '@components/facility/ItemFacility';
import facilityProvider from '@data-access/facility-provider';

class TopSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        facilityProvider.getTop(10, (s, e) => {
            if (s && s.code == 0 && s.data && s.data.data && s.data.data.length > 0) {
                this.setState({ data: s.data.data });
            }
        });
    }

    render() {

        if (this.state.data && this.state.data.length > 0)
            return (<View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginTop: 23 }}>
                    <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold', paddingRight: 10 }} numberOfLines={1} ellipsizeMode='tail'>CSYT hàng đầu</Text>
                    <TouchableOpacity><Text style={{ fontSize: 14, color: 'rgb(74,144,226)', marginRight: 3, marginTop: 2 }}>Xem tất cả</Text></TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 14 }}>
                    {
                        this.state.data.map((item, index) => {
                            return <ItemFacility key={index} facility={item}/>
                        })
                    }
                </View>
            </View>);
        return null;
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(TopSearch);