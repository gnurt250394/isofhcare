import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { ScrollView } from 'react-native-gesture-handler';
import ImageLoad from 'mainam-react-native-image-loader';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import connectionUtils from '@utils/connection-utils';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';
import InsertInfoDrug from '@components/drug/InsertInfoDrug'
import ActivityPanel from '@components/ActivityPanel';


export default class EditDrugScanScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUris: []
        }
    }
    selectTab = () => {
        let isScan = this.state.isScan
        this.setState({
            isScan: !isScan
        })
    }
    selectImage = () => {
        if (this.state.imageUris && this.state.imageUris.length >= 5) {
            snackbar.show(constants.msg.booking.image_without_five, "danger");
            return;
        }
        connectionUtils.isConnected().then(s => {
            if (this.imagePicker) {
                this.imagePicker.show({
                    multiple: true,
                    mediaType: 'photo',
                    maxFiles: 5,
                    compressImageMaxWidth: 500,
                    compressImageMaxHeight: 500
                }).then(images => {
                    let listImages = [];
                    if (images.length)
                        listImages = [...images];
                    else
                        listImages.push(images);
                    let imageUris = this.state.imageUris;
                    listImages.forEach(image => {
                        if (imageUris.length >= 5)
                            return;
                        let temp = null;
                        imageUris.forEach((item) => {
                            if (item.uri == image.path)
                                temp = item;
                        })
                        if (!temp) {
                            imageUris.push({ uri: image.path, loading: true });
                            imageProvider.upload(image.path, (s, e) => {
                                if (s.success) {
                                    if (s.data.code == 0 && s.data.data && s.data.data.images && s.data.data.images.length > 0) {
                                        let imageUris = this.state.imageUris;
                                        imageUris.forEach((item) => {
                                            if (item.uri == s.uri) {
                                                item.loading = false;
                                                item.url = s.data.data.images[0].image;
                                                item.thumbnail = s.data.data.images[0].thumbnail;
                                            }
                                        });
                                        this.setState({
                                            imageUris
                                        });
                                    }
                                } else {
                                    imageUris.forEach((item) => {
                                        if (item.uri == s.uri) {
                                            item.error = true;
                                        }
                                    });
                                }
                            });
                        }
                    })
                    this.setState({ imageUris: [...imageUris] });
                    console.log('imageUris: ', [...imageUris]);
                });

            }
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        });
    }
    removeImage(index) {
        var imageUris = this.state.imageUris;
        imageUris.splice(index, 1);
        this.setState({ imageUris });
    }
    componentDidMount() {
        // "pathOriginal": item.url,
        //                 "pathThumbnail": item.thumbnail
        let dataEdit = this.props.navigation.getParam('dataEdit', null).images
        var imageUris = []
        for (let i = 0; i < dataEdit.length; i++) {
            imageUris.push({
                url: dataEdit[i].pathOriginal,
                thumbnail: dataEdit[i].pathThumbnail,
            })
        }
        console.log(imageUris, 'img')
        this.setState({
            imageUris
        })
    }
    render() {
        return (
            <ActivityPanel style={styles.container} title={"Chỉnh sửa đơn thuốc"} showFullScreen={true}>
                <ScrollView>
                    <TouchableOpacity onPress={this.selectImage} style={styles.btnCamera}>
                        <ScaledImage source={require('@images/new/drug/ic_scan.png')} height={20}></ScaledImage>
                        <Text style={styles.txCamera}>Chụp đơn thuốc</Text></TouchableOpacity>
                    <View style={styles.list_image}>
                        {
                            this.state.imageUris && this.state.imageUris.map((item, index) => <View key={index} style={styles.containerImagePicker}>
                                <View style={styles.groupImagePicker}>
                                    <Image source={{ uri: item.uri || item.url.absoluteUrl() }} resizeMode="cover" style={styles.imagePicker} />
                                    {
                                        item.error ?
                                            <View style={styles.groupImageError} >
                                                <ScaledImage source={require("@images/ic_warning.png")} width={40} />
                                            </View> :
                                            item.loading ?
                                                <View style={styles.groupImageLoading} >
                                                    <ScaledImage source={require("@images/loading.gif")} width={40} />
                                                </View>
                                                : null
                                    }
                                </View>
                                <TouchableOpacity onPress={this.removeImage.bind(this, index)} style={styles.buttonClose} >
                                    <ScaledImage source={require("@images/new/ic_close.png")} width={16} />
                                </TouchableOpacity>
                            </View>)
                        }
                    </View>
                    <InsertInfoDrug dataEdit={this.props.navigation.getParam('dataEdit', null)} imageUris={this.state.imageUris} ></InsertInfoDrug>
                    <ImagePicker ref={ref => this.imagePicker = ref} />
                </ScrollView>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonClose: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    btnCamera: {
        marginTop: 20,
        backgroundColor: '#FF8A00',
        borderRadius: 6,
        height: 48,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20
    },
    list_image: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginHorizontal: 20 },
    txCamera: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
    groupImageLoading: {
        position: 'absolute',
        left: 20,
        top: 20,
        backgroundColor: '#FFF',
        borderRadius: 20
    },
    groupImageError: {
        position: 'absolute',
        left: 20,
        top: 20
    },
    imagePicker: {
        width: 80,
        height: 80,
        borderRadius: 5
    },
    groupImagePicker: {
        marginTop: 8,
        width: 80,
        height: 80
    },
    containerImagePicker: {
        margin: 2,
        width: 88,
        height: 88,
        position: 'relative'
    },

})