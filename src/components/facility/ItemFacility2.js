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
    }

    render() {
        return (
            <TouchableOpacity {...this.props} style={[{
                marginTop: 0,
                backgroundColor: 'white',
                borderColor: 'rgb(204, 204, 204)',
                borderBottomWidth: 1,
                flexDirection: 'row',
                padding: 10
            }, this.props.style]} >
                <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode='tail'>Nhà thuốc Minh Đường</Text>
                    <Rating
                        style={{ marginTop: 8 }}
                        ratingCount={5}
                        imageSize={13}
                        readonly
                    />
                    <Text style={{ fontSize: 12, marginTop: 5 }} numberOfLines={2} ellipsizeMode='tail'>Xóm Hải Bình, Nga Hải, Nga Sơn, Thanh Hóa</Text>
                </View>
                <ImageProgress
                    indicator={Progress} resizeMode='cover' style={{ width: 80, height: 80 }} imageStyle={{
                        borderTopLeftRadius: 5.3,
                        borderBottomLeftRadius: 5.3,
                        width: 80, height: 80
                    }} source={{ uri: "https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg" }}
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
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ItemFacility);