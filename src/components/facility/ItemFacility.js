import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import clientUtils from '@utils/client-utils'
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
                elevation: 2,
                marginTop: 0,
                backgroundColor: 'white',
                borderRadius: 5.3,
                marginBottom: 10,
                borderColor: 'rgb(204, 204, 204)',
                borderWidth: 1,
                flexDirection: 'row',
                padding: 2
            }, this.props.style]} shadowColor='#000000' shadowOpacity={0.2} shadowOffset={{}} onPress={() => { this.props.navigation.navigate("facilityDetailScreen", { facility: this.props.facility }) }}>
                <View style={{
                    width: 100, height: 100, borderTopLeftRadius: 5.3,
                    borderBottomLeftRadius: 5.3
                }}>
                    <ImageLoad
                        borderRadius={5.3}
                        style={{
                            width: 100, height: 100
                        }}
                        imageStyle={{
                            borderTopLeftRadius: 5.3,
                            borderBottomLeftRadius: 5.3
                        }}
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        customImagePlaceholderDefaultStyle={{
                            borderTopLeftRadius: 5.3,
                            borderBottomLeftRadius: 5.3
                        }}
                        source={{ uri: image }}
                        resizeMode="cover"
                    />
                </View>
                <View style={{ flex: 1, margin: 12 }}>
                    <Text style={{ fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode='tail'>{this.props.facility.facility.name}</Text>
                    <Rating count={5} readonly={true} value={item.facility.review} starWidth={13} style={{ marginTop: 8 }} />

                    <Text style={{ fontSize: 12, marginTop: 5 }} numberOfLines={2} ellipsizeMode='tail'>{this.props.facility.facility.address}</Text>
                </View>
            </TouchableOpacity>);
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ItemFacility);