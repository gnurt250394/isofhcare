import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import clientUtils from '@utils/client-utils';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';

class ItemDrug extends Component {
    constructor(props) {
        super(props);
    }
    showDetail() {
        this.props.navigation.navigate("drugDetailScreen", { drug: this.props.drug });
    }
    render() {
        let item = this.props.drug;
        return (
            <TouchableOpacity onPress={this.showDetail.bind(this)} style={{ borderRadius: 6, flexDirection: 'row', padding: 5, margin: 5, backgroundColor: '#FFF', shadowColor: '#000000', shadowOpacity: 0.2, shadowOffset: {}, elevation: 2 }} >
                <ImageProgress
                    indicator={Progress} resizeMode='cover' style={{ width: 100, height: 100 }} imageStyle={{ width: 100, height: 100 }} source={{ uri: (item.images && item.images.length && item.images[0].url) ? item.images[0].url.absoluteUrl() : "undefined" }}
                    defaultImage={() => {
                        return <ScaledImage resizeMode='cover' source={require("@images/noimage.jpg")} width={100} height={100} />
                    }} />
                <View style={{ flex: 1, marginLeft: 18, marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'rgb(74,74,74)', marginBottom: 13 }}>{item.drug.name}</Text>
                    {
                        item.drug.manufacturer ?
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, color: 'rgb(74,74,74)', marginBottom: 6 }}>{item.drug.manufacturer}</Text>
                            : null
                    }
                    {
                        item.drug.price ?
                            <Text style={{ fontSize: 14, color: 'rgb(74,74,74)' }}>Giá tham khảo: <Text style={{ color: 'rgb(208,2,27)' }}>{item.drug.price} đ</Text></Text>
                            : null
                    }
                </View>
            </TouchableOpacity>

        );
    }
}
function mapStateToProps(state) {
    return {
        navigation: state.navigation
    }
}
export default connect(mapStateToProps, null, null, { withRef: true })(ItemDrug);