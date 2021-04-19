import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import { withNavigation } from 'react-navigation'
const { width, height } = Dimensions.get('window')
const ImageEhealth = (props) => {
    const showImage = (image, index) => () => {
        props.navigation.navigate("photoViewer", {
            index: index,
            urls: image.map(item => {
                return { 'uri': item.absoluteUrl() }
            }),
        });
    }
    if (props?.images?.length) {
        return <View style={styles.containerListImage}>
            {props.images.map((e, i) => {
                return (
                    <TouchableOpacity onPress={showImage(props.images, i)} style={styles.buttonImage} key={i}>
                        <Image source={{ uri: e }} style={styles.imageResult} />
                    </TouchableOpacity>
                )
            })}
        </View>
    } else {
        return null
    }
}
const styles = StyleSheet.create({
    imageResult: {
        height: width / 4,
        width: width / 4,
        resizeMode: 'contain',
        borderColor: '#006852',
        borderWidth: 0.2
    },
    buttonImage: {
        marginHorizontal: 5,
        borderColor: '#000',
        borderWidth: 0.1,
        marginBottom: 5
    },
    containerListImage: {
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: 5,
        paddingBottom: 20,
        flexWrap: 'wrap'
    },
});
export default withNavigation(ImageEhealth)
