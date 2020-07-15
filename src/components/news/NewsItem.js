import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, } from 'react-native';
import StarRating from 'react-native-star-rating';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
class NewsItem extends Component {
    constructor(props) {
        super(props)
    }

    getWidthImage() {
        let devicewidth = Dimensions.get("window").width;
        let width = (devicewidth / 2);
        if (width > 180)
            width = 180;
        return width;
    }


    render() {
        const item = this.props.item;
        let imageWidth = this.getWidthImage();
        let imageHeight = Dimensions.get("window").width <= 375 ? imageWidth / 1.5 + 10 : imageWidth / 1.5

        return (
            <View style={[styles.viewItem, {
                paddingVertical: 5,
            }]}>
                <View style={[styles.viewImg]}>
                    <Image resizeMode={'cover'} source={{ uri: item.image ? item.image : '' }} style={{ width: imageWidth, height: imageHeight }}></Image>
                    <View style={styles.viewStar}>
                        <StarRating
                            disabled={true}
                            starSize={12}
                            maxStars={5}
                            rating={item.rate}
                            starStyle={{ margin: 1 }}
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
                    <Text style={[styles.txInfo, Dimensions.get("window").width <= 375 ? { right: 20 } : {}]}>Xem thêm>></Text>

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
        marginBottom: 20,

    },
    txTitle: { fontWeight: '600', color: '#02C39A', fontSize: 15 },
    contents: { width: '50%', paddingLeft: 5, top: -5 },
    viewImg: { position: 'relative', marginRight: 11, },
    viewStar: { position: 'absolute', top: 5, right: 5 },
    txInfo: { color: '#02C39A', textAlign: 'right', bottom: -5, right: 10, position: 'absolute', fontSize: 12 }
});
export default NewsItem;