import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';
import { Rating } from 'react-native-ratings';
import clientUtils from '@utils/client-utils'

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
        let image = item.logo;
        if (!image)
            image = ".";
        return (
            <TouchableOpacity {...this.props} style={[{
                elevation: 2,
                marginTop: 0,
                backgroundColor: 'white',
                borderRadius: 5.3,
                marginBottom: 10,
                borderColor: 'rgb(204, 204, 204)',
                borderWidth: 1,
                flexDirection: 'row'
            }, this.props.style]} shadowColor='#000000' shadowOpacity={0.2} shadowOffset={{}} onPress={() => { this.props.navigation.navigate("facilityDetailScreen", { facility: this.props.facility }) }}>
                <ImageProgress
                    indicator={Progress} resizeMode='cover' style={{ width: 100, height: 100 }} imageStyle={{
                        borderTopLeftRadius: 5.3,
                        borderBottomLeftRadius: 5.3,
                        width: 100, height: 100
                    }} source={{ uri: image }}
                    defaultImage={() => {
                        return <ScaledImage resizeMode='cover' source={require("@images/noimage.jpg")} width={100} height={100} style={{
                            borderTopLeftRadius: 5.3,
                            borderBottomLeftRadius: 5.3
                        }} />
                    }} />
                <View style={{ flex: 1, margin: 12 }}>
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
            </TouchableOpacity>);
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ItemFacility);