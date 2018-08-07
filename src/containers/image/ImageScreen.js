import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, ScrollView, Text, TouchableOpacity, Linking, FlatList, Animated, StyleSheet, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/CircleSnail';
import Dimensions from 'Dimensions';
const IMAGE_WIDTH = (Dimensions.get('window').width - 28 - 16) / 4;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;
import ScaleImage from 'mainam-react-native-scaleimage';
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';
import ImageViewer from 'react-native-image-zoom-viewer';
import ActionBar from '@components/Actionbar';
import RNFetchBlob from 'rn-fetch-blob';
let dirs = RNFetchBlob.fs.dirs
import permission from 'mainam-react-native-permission';
import Modal from "react-native-modal";

class ImageScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listMem: [],
            refreshing: false,
            size: 20,
            page: 1,
            finish: false,
            loading: false,
            listNew: [],
            images: [],
            modalVisible: false,
            // isLoading: true
        }
    }

    componentDidMount() {
        this.onRefresh();
    }

    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
                this.onLoad();
            });
    }

    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        })
        imageProvider.getByConference(this.props.conference.conference.id, page, size, (s, e) => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
            });
            if (s) {
                switch (s.code) {
                    case 0:
                        var finish = s.data.data.length < size;
                        if (page != 1) {
                            let list = s.data.data;
                            let listMem = this.state.listMem;
                            list.forEach((item, index) => {
                                listMem.push(item);
                            });
                            this.setState({
                                listMem,
                                finish
                            });
                        }
                        else {
                            let list = s.data.data;
                            let listNew = [];
                            let listMem = [];

                            list.forEach((item, index) => {
                                if (index < 8)
                                    listNew.push(item);
                                else
                                    listMem.push(item);
                            });
                            this.setState({
                                listNew,
                                listMem,
                                finish
                            });
                        }
                        break;
                }
            }
        });
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState({ loadMore: true, refreshing: false, loading: true, page: this.state.page + 1 }, () => {
                this.onLoad(this.state.page)
            });
    }
    hideImageView() {
        this.setState({
            modalVisible: false
        });
    }
    async  saveImage() {
        await permission.requestStoragePermission((s) => {
            if (s) {
                let url = this.state.images[0].url;
                let index = url.lastIndexOf("/");
                let filename = "";
                if (index != -1) {
                    filename = url.substring(index + 1);
                } else {
                    filename = (new Date().getTime() + "");
                }
                let config = {
                    path: dirs.PictureDir + '/' + filename
                };

                if (Platform.OS == "android") {
                    config.addAndroidDownloads =
                        {
                            useDownloadManager: true,
                            notification: true,
                            description: 'File downloaded by download manager.'
                        }
                }

                RNFetchBlob
                    .config(config)
                    .fetch('GET', url)
                    .then((resp) => {
                        alert("Tải về hoàn tất tại: " + resp.path());
                    })
            }
        })
    }

    viewImage(item) {
        let url = item.url;
        if (url)
            url = url.absoluteUrl() + "";
        this.setState({
            images: [{
                url: url
            }],
            modalVisible: true,
        });
    }
    showImage(item, fromListNew, index) {
        let url = item.url;
        if (url)
            url = url.absoluteUrl() + "";
        return (<TouchableOpacity style={{ width: IMAGE_WIDTH, height: IMAGE_WIDTH, margin: 2 }} onPress={() => this.viewImage(item, fromListNew, index)}>
            <Image source={{ uri: url }} style={{ width: IMAGE_WIDTH, height: IMAGE_WIDTH }} resizeMode='cover' />
            {/* <ImageProgress
                indicator={Progress} resizeMode='cover' style={{ width: IMAGE_WIDTH, height: IMAGE_WIDTH }} imageStyle={{ width: IMAGE_WIDTH, height: IMAGE_WIDTH }} source={{ uri: url }}
                defaultImage={() => {
                    return <ScaleImage resizeMode='cover' source={require("@images/noimage.png")} width={IMAGE_WIDTH} style={{ width: IMAGE_WIDTH, height: IMAGE_WIDTH }} />
                }} /> */}
        </TouchableOpacity>);
    }
    selectImage() {
        if (this.imagePicker) {
            this.imagePicker.open(false, 200, 200, image => {
                this.setState({ isLoading: true });
                imageProvider.upload(image.path, (s, e) => {
                    if (s) {
                        if (s.code == 0 && s.data && s.data.images.length > 0) {
                            var url = s.data.images[0].image;
                            imageProvider.addImageToConference(url, image.filename, new Date().getTime(), "", this.props.conference.conference.id, (s, e) => {
                                // this.setState({ isLoading: false });
                                if (s) {
                                    let list = this.state.listNew;
                                    list.push(s.data.image);
                                    this.setState({
                                        listNew: list
                                    });
                                    snackbar.show(constants.msg.image.add_image_to_conference_success);
                                }
                                else
                                    snackbar.show(constants.msg.image.add_image_to_conference_failed);
                            });
                        }
                        if (e) {
                            snackbar.show(constants.msg.upload.upload_image_error);
                        }
                    }
                    else {
                        this.setState({ isLoading: false });
                    }
                });
            });
        }
    }
    shouldComponentUpdate(newprops, newstate) {
        if (newstate.listNew != this.state.listNew)
            return true;
        if (newstate.listMem != this.state.listMem)
            return true;
        return false;

    }


    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Hình ảnh" showFullScreen={true} isLoading={this.state.isLoading}>
                <View style={{ flex: 1 }}>
                    <View>
                        <ScrollView style={{ padding: 14 }}
                        >
                            <FlatList
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                                ListHeaderComponent={() =>
                                    this.state.listMem && this.state.listMem.length > 0 ?
                                        <Text style={{ marginTop: 10, color: 'rgba(0,0,0,0.64)', marginBottom: 14 }}>Mới nhất</Text> :
                                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                                            <Text style={{ fontStyle: 'italic' }}>Chưa có ảnh nào được tải lên</Text>
                                        </View>
                                }
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state.listNew}
                                data={this.state.listNew}
                                numColumns={4}
                                renderItem={({ item, index }) =>
                                    this.showImage(item, true, index)
                                }
                            />
                            <FlatList
                                onEndReached={this.onLoadMore.bind(this)}
                                onEndReachedThreshold={16}
                                style={{ backgroundColor: '#FFF' }}
                                ListHeaderComponent={() =>
                                    this.state.listMem && this.state.listMem.length > 0 ?
                                        <Text style={{ color: 'rgba(0,0,0,0.64)', marginBottom: 14, marginTop: 32 }}>Cũ hơn</Text>
                                        : null
                                }
                                numColumns={4}
                                ref={ref => this.flatList = ref}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state.listMem}
                                data={this.state.listMem}
                                renderItem={({ item, index }) =>
                                    this.showImage(item, false, index)
                                }
                            />
                            < View style={{ alignItems: 'flex-end', marginBottom: 100, marginTop: 10, minHeight: 100 }}>
                                {
                                    !this.state.finish && !this.state.loading && this.state.listNew.length != 0 ?
                                        < TouchableOpacity onPress={this.onLoadMore.bind(this)}>
                                            <Text style={{ padding: 10, borderRadius: 15, backgroundColor: 'rgb(0,121,107)', width: 100, textAlign: 'center', overflow: 'hidden', color: '#FFF', fontWeight: 'bold' }}>Tải thêm</Text>
                                        </TouchableOpacity> : null
                                }
                            </View>
                        </ScrollView>
                    </View>
                    {
                        this.props.userApp.currentUser.type == 4 || this.props.userApp.currentUser.type == 2 ?
                            < TouchableOpacity style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: -43 }} onPress={this.selectImage.bind(this)}>
                                <ScaleImage source={require("@images/iccamera.png")} width={86} />
                            </TouchableOpacity>
                            : null
                    }
                    <ImagePicker ref={ref => this.imagePicker = ref} />
                </View>
                <Modal isVisible={this.state.modalVisible} transparent={true} style={{ margin: 0 }}>
                    <ImageViewer imageUrls={this.state.images} ref={ref => this.imageView = ref}
                        saveToLocalByLongPress={false}
                        renderFooter={() => <View style={{ padding: 5, justifyContent: 'center', alignContent: 'center', backgroundColor: "#FFF", width: DEVICE_WIDTH, flexDirection: 'row' }} shadowColor='#000000' shadowOpacity={0.3} shadowOffset={{}}>
                            <TouchableOpacity onPress={this.hideImageView.bind(this)}>
                                <Text style={{ padding: 10, borderRadius: 10, backgroundColor: 'rgb(0,0,0)', width: 100, textAlign: 'center', color: '#FFF', fontWeight: 'bold' }} >Thoát</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.saveImage.bind(this)}>
                                <Text style={{ padding: 10, borderRadius: 10, backgroundColor: 'rgb(0,121,107)', width: 100, textAlign: 'center', color: '#FFF', fontWeight: 'bold', marginLeft: 5 }}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                        } />
                </Modal>
            </ActivityPanel >
        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        conference: state.conference
    };
}
export default connect(mapStateToProps)(ImageScreen);