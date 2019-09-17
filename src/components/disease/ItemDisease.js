import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import clientUtils from '@utils/client-utils'
import ImageLoad from 'mainam-react-native-image-loader';
class ItemDisease extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        console.log("==================================")
        console.log(JSON.stringify(this.props.disease))
        console.log("==================================")
    }
    detailDisease = () => {
        // this.props.navigation.navigate("facilityDetailScreen", { facility: this.props.facility })
        this.props.navigation.navigate("diseaseDetail", { disease: this.props.disease })
    }

    render() {
        let item = this.props.disease;
        let image = item.images && item.images.length > 0 ? item.images[0].url : null;
        if (!image)
            image = ".";
        else {
            image = image.absoluteUrl();
        }
        return (
            <TouchableOpacity {...this.props} style={[styles.container, this.props.style]}
                onPress={this.detailDisease}>
                <View style={styles.group}>
                    <ImageLoad
                        borderRadius={5.3}
                        style={styles.image}
                        imageStyle={styles.boderImage}
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        customImagePlaceholderDefaultStyle={styles.placeHolderImage}
                        source={{ uri: image }}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.containerInfo}>
                    <Text style={styles.txtDiseaseName} numberOfLines={1} ellipsizeMode='tail'>{this.props.disease.disease.name}</Text>
                    <Text style={styles.txtGeneralInfo} numberOfLines={2} ellipsizeMode='tail'>{this.props.disease.disease.generalInfo}</Text>
                </View>
            </TouchableOpacity>);
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ItemDisease);

const styles = StyleSheet.create({
    txtGeneralInfo: {
        fontSize: 12,
        marginTop: 5
    },
    txtDiseaseName: {
        fontWeight: 'bold'
    },
    containerInfo: {
        flex: 1,
        margin: 12
    },
    placeHolderImage: {
        borderTopLeftRadius: 5.3,
        borderBottomLeftRadius: 5.3
    },
    boderImage: {
        borderTopLeftRadius: 5.3,
        borderBottomLeftRadius: 5.3
    },
    image: {
        width: 100, height: 100
    },
    group: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 5.3,
        borderBottomLeftRadius: 5.3
    },
    container: {
        elevation: 2,
        marginTop: 0,
        backgroundColor: 'white',
        borderRadius: 5.3,
        marginBottom: 10,
        borderColor: 'rgb(204, 204, 204)',
        borderWidth: 1,
        flexDirection: 'row'
    },
})