import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import StarRating from 'react-native-star-rating';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
class NewsItem extends Component {
    constructor(props) {
        super(props)
    }



    render() {
        const item = this.props.item
        console.log(item.image.absoluteUrl());
        return (
            <View style={styles.viewItem}>
                <View style={{ width: '50%', alignItems: "center", justifyContent: 'center' }}>
                    <Image resizeMode={'cover'} source={{ uri: item.image ? item.image.absoluteUrl() : '' }} style={{ width: '100%', height: 140 }}></Image>
                    <View style={{ position: 'absolute', top: 5, right: 5 }}>
                    <StarRating
                            disabled={true}
                            starSize={12}
                            maxStars={5}
                            rating={item.rate}
                            starStyle={{ margin: 0 }}
                            fullStarColor={"#fbbd04"}
                            emptyStarColor={"#fbbd04"}
                        />
                    </View>
                </View>
                <View style={{ width: '50%',padding:5}}>
                    <Text>{item.title}</Text>
                    <Text>{item.content}</Text>
                    <Text style={{color:'#4BBA7B',textAlign:'right'}}>Xem thêm>></Text>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    viewItem: {
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'space-around',
    }
});
export default NewsItem;