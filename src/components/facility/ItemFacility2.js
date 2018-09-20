import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ImageLoad from 'mainam-react-native-image-loader';

import Rating from '@components/Rating';
class ItemFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        let item = this.props.facility;
        let image = item.facility.logo;
        if (!image)
            image = ".";
        else {
            image = image.absoluteUrl();
        }
        return (
            <TouchableOpacity {...this.props} style={[{
                marginTop: 0,
                backgroundColor: 'white',
                borderColor: 'rgb(204, 204, 204)',
                borderBottomWidth: 1,
                flexDirection: 'row',
                padding: 10
            }, this.props.style]}
                onPress={() => { this.props.navigation.navigate("facilityDetailScreen", { facility: this.props.facility }) }}
            >
                <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode='tail'>{this.props.facility.facility.name}</Text>
                    <Rating readonly={true} count={5} value={item.facility.review} starWidth={13} style={{ marginTop: 8 }} />

                    <Text style={{ fontSize: 12, marginTop: 5 }} numberOfLines={2} ellipsizeMode='tail'>{this.props.facility.facility.address}</Text>
                </View>
                <ImageLoad
                    resizeMode="cover"
                    borderRadius={5.3}
                    style={{ width: 80, height: 80 }}
                    loadingStyle={{ size: 'small', color: 'gray' }}
                    source={{ uri: image }}
                />
            </TouchableOpacity>);
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ItemFacility);