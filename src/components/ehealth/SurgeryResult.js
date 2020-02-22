import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import SurgeryResultItem from '@components/ehealth/SurgeryResultItem';
import { withNavigation } from 'react-navigation'


class SurgeryResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }

    showImage = (image, index) => () => {
        this.props.navigation.navigate("photoViewer", {
            index: index,
            urls: image.map(item => {
                return item.absoluteUrl()
            }),
        });
    }
    renderImages = (images) => {
        if (images?.length) {
            return <View style={styles.containerListImage}>
                {images.map((e, i) => {
                    return (
                        <TouchableOpacity
                            onPress={this.showImage(images, i)}
                            style={styles.buttonImage} key={i}>
                            <Image source={{ uri: e }} style={styles.imageResult} />
                        </TouchableOpacity>
                    )
                })}
            </View>
        } else {
            return null
        }
    }
    render() {
        let { result } = this.props;
        if (!result || !result.ListResulGiaiPhau || !result.ListResulGiaiPhau.length)
            return null;
        if (!result.ListResulGiaiPhau[0].SummaryResult && !result.ListResulGiaiPhau[0].ServiceName && result.ListResulGiaiPhau[0].Image.length == 0) {
            return null
        }
        let resultSurgery = result.ListResulGiaiPhau || [];
        return (<View style={styles.container}>
            {
                (this.props.showTitle == true || this.props.showTitle == undefined) &&
                <View style={[styles.item, { marginTop: 0 }]}>
                    <View style={styles.round1}>
                        <View style={styles.round2} />
                    </View>
                    <View style={[styles.itemlabel, { marginTop: 0 }]}>
                        <Text style={styles.txResult}>KẾT QUẢ GIẢI PHẪU</Text>
                    </View>
                </View>
            }
            {
                resultSurgery.map((item, index) => {
                    return (
                        <View style={{
                            backgroundColor: "#ffffff",
                            shadowColor: "rgba(0, 0, 0, 0.05)",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowRadius: 10,
                            shadowOpacity: 1,
                            elevation: 3,
                            borderRadius: 5,
                            padding: 10
                        }}>
                            <SurgeryResultItem item={item} key={index} {...this.props} />
                            {this.renderImages(item.Image)}
                        </View>
                    )
                })
            }
        </View>)
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
const styles = StyleSheet.create({
    imageResult: {
        height: 100,
        width: 100,
        resizeMode: 'cover'
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
    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' },
    container: { flex: 1, padding: 10 },
    txResult: { fontWeight: 'bold', fontSize: 18 }
})
export default connect(mapStateToProps)(withNavigation(SurgeryResult));