import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import constants from '@resources/strings';

class DiagnosticResultItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }
    renderItem(text) {
        // if (!text) {
        //     while (text.indexOf('\n') != -1) {
        //         text = text.replace("\n", "");
        //     }
        //     text = text.trim();
        // }
        return <Text style={styles.txItem}>{text}</Text>
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
                        <TouchableOpacity onPress={this.showImage(images, i)} style={styles.buttonImage} key={i}>
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
        let { item } = this.props;
        return <View style={styles.container} key={this.props.key}>
            <View style={styles.viewService}>
                <Text style={styles.txSerivceName}>{item.ServiceName}</Text>
                {/* <TouchableOpacity onPress={() => this.exportPdf()}>
                    <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                </TouchableOpacity> */}
            </View>
            <View style={styles.viewItem}>
                {
                    (item.Result || item.SummaryResult || item.Discussion) ?
                        <View>

                            <Text style={styles.diagnosticLabel}>{constants.ehealth.describe}</Text>
                            {item.Result ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    {
                                        this.renderItem(item.Result)
                                    }
                                </View> : null}
                            {item.SummaryResult ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    {
                                        this.renderItem(item.SummaryResult)
                                    }
                                </View> : null}
                            {item.Discussion ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    {
                                        this.renderItem(item.Discussion)
                                    }
                                </View> : null}
                            {this.renderImages(item.Image)}
                        </View> : null}

                {
                    (item.Conclusion) ?
                        <View>

                            <Text style={styles.diagnosticLabel}>{constants.ehealth.conclude}</Text>
                            {item.Conclusion ?
                                <View style={styles.viewList}>
                                    <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={styles.imgList} />
                                    <Text style={styles.txConclusion}>{item.Conclusion}</Text>
                                </View> : null}
                        </View> : null}
            </View>
        </View>
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
    container: { flex: 1, marginBottom: 20 },
    diagnosticLabel1:
    {
        color: constants.colors.primary_bold,
        fontWeight: 'bold', marginBottom: 5
    },
    diagnosticLabel:
    {
        color: constants.colors.primary_bold,
        fontWeight: 'bold', marginBottom: 5
    },
    breakline: {
    },
    txItem: { marginLeft: 10, marginBottom: 10 },
    viewService: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    txSerivceName: { flex: 1, fontWeight: 'bold', fontSize: 15, color: constants.colors.primary_bold },
    viewItem: {
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
    },
    viewList: { flexDirection: 'row' },
    imgList: { marginTop: 7 },
    txConclusion: { marginLeft: 10 }

})
export default connect(mapStateToProps)(DiagnosticResultItem);