import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';
import { Rating } from 'react-native-ratings';

class ItemFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
        let item = this.props.facility;
        if (this.rating) {
            this.rating.setCurrentRating(item.facility.review);
        }
    }

    render() {
        let item = this.props.facility;
        let images = item.images;
        let image = "undefined";
        try {
            if (images && images.length > 0) {
                image = images[0].url.absoluteUrl();
            }
        } catch (error) {

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
                    <Rating
                        ref={(ref) => { this.rating = ref }}
                        style={{ marginTop: 8 }}
                        ratingCount={5}
                        imageSize={13}
                        readonly
                    />
                    <Text style={{ fontSize: 12, marginTop: 5 }} numberOfLines={2} ellipsizeMode='tail'>{this.props.facility.facility.address}</Text>
                </View>
                <ImageProgress
                    indicator={Progress} resizeMode='cover' style={{ width: 80, height: 80 }} imageStyle={{
                        borderTopLeftRadius: 5.3,
                        borderBottomLeftRadius: 5.3,
                        width: 80, height: 80
                    }} source={{ uri: image }}
                    defaultImage={() => {
                        return <ScaledImage resizeMode='cover' source={require("@images/noimage.jpg")} width={80} height={80} style={{
                            borderTopLeftRadius: 5.3,
                            borderBottomLeftRadius: 5.3
                        }} />
                    }} />
            </TouchableOpacity>);
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ItemFacility);