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

        return (
            <View style={styles.viewItem}>
                <View style={styles.viewImg}>
                    <Image resizeMode={'cover'} source={{ uri: item.image ? item.image.absoluteUrl() : '' }} style={{ width: '100%', height: 90 }}></Image>
                    <View style={styles.viewStar}>
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
                <View style={styles.contents}>
                    <Text style={styles.txTitle}>{item.title && item.title.length > 51 ? item.title.substring(0, 50) + "....."
                        : item.title}</Text>
                    <Text style={{ color: '#000' }}>{item.content && item.title && item.content.length > 51
                        ? item.content.substring(0, 50) + "....."
                        : item.content}</Text>
                    <Text style={styles.txInfo}>Xem thêm>></Text>

                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    viewItem: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-around',
        height: 90
    },
    txTitle: { fontWeight: '600', color: '#4BBA7B', fontSize: 18 },
    contents: { width: '50%', paddingLeft: 5, top: -5 },
    viewImg: { width: '50%', alignItems: "center", justifyContent: 'center' },
    viewStar: { position: 'absolute', top: 5, right: 5 },
    txInfo: { color: '#4BBA7B', textAlign: 'right', bottom: -5, right: 0, position: 'absolute', fontSize: 12 }
});
export default NewsItem;