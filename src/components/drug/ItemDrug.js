import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import clientUtils from '@utils/client-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import stringUtils from 'mainam-react-native-string-utils';
import { Card } from 'native-base';

class ItemDrug extends Component {
    constructor(props) {
        super(props);
    }
    showDetail() {
        this.props.navigation.navigate("drugDetailScreen", { drug: this.props.drug });
    }
    render() {
        let item = this.props.drug;
        let images = item.drug.images;
        let image = "";
        if (images) {
            let arrs = images.split(',');
            if (arrs.length > 0)
                image = arrs[0];
        }
        image = image.absoluteUrl();
        return (
            <Card style={{ padding: 2 }}>
                <TouchableOpacity onPress={this.showDetail.bind(this)} style={{ flexDirection: 'row' }} >
                    <ImageLoad
                        placeholderSource={require("@images/icthuoc.png")} style={{ width: 100, height: 100 }} imageStyle={{ width: 100, height: 100 }} loadingStyle={{ size: 'small', color: 'gray' }} source={{ uri: image }}
                        resizeMode="cover" />
                    <View style={{ flex: 1, marginLeft: 18, marginTop: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'rgb(74,74,74)', marginBottom: 13 }}>{item.drug.name}</Text>
                        {
                            item.drug.manufacturer ?
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: 'rgb(74,74,74)', marginBottom: 6 }}>{item.drug.manufacturer}</Text>
                                : null
                        }
                        {
                            item.drug.price ?
                                <Text style={{ fontSize: 14, color: 'rgb(74,74,74)' }}>Giá tham khảo: <Text style={{ color: 'rgb(208,2,27)' }}>{item.drug.price.formatPrice()} đ</Text></Text>
                                : null
                        }
                    </View>
                </TouchableOpacity>
            </Card>



        );
    }
}
function mapStateToProps(state) {
    return {
        navigation: state.navigation
    }
}
export default connect(mapStateToProps, null, null, { withRef: true })(ItemDrug);