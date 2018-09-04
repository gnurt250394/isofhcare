import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { Dimensions, View, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import PhotoViewer from 'mainam-react-native-photo-viewer';
const { width, height } = Dimensions.get('window');
import permission from 'mainam-react-native-permission';
import RNFetchBlob from 'rn-fetch-blob';
let dirs = RNFetchBlob.fs.dirs
import Share from 'react-native-share';
class PhotoViewerScreen extends Component {
    constructor(props) {
        super(props)
        var urls = this.props.navigation.getParam("urls", null);
        if (!urls)
            urls = [];
        var index = this.props.navigation.getParam("index", null);
        if (!index)
            index = 0;
        this.state = {
            urls,
            index
        }
    }
    componentDidMount() {

    }
    preview() {
        if (this.state.index > 0) {
            this.setState({
                index: this.state.index - 1
            }, () => {
                if (this.props.onPreview) {
                    this.props.onPreview(this.state.index + 1, this.state.urls.length);
                }
            })
        }
    }
    next() {
        if (this.state.index < this.state.urls.length - 1) {
            this.setState({
                index: this.state.index + 1
            }, () => {
                if (this.props.onNext) {
                    this.props.onNext(this.state.index + 1, this.state.urls.length);
                }
            })
        }

    }
    async onDownload(url) {
        await permission.requestStoragePermission((s) => {
            if (s) {
                let index = url.lastIndexOf("/");
                let filename = "";
                if (index != -1) {
                    filename = url.substring(index + 1);
                } else {
                    filename = (new Date().getTime() + "");
                }
                let config = {
                    fileCache: true,
                };


                if (Platform.OS == "android") {
                    config.path = dirs.PictureDir + '/' + filename
                    config.addAndroidDownloads =
                        {
                            useDownloadManager: true,
                            notification: true,
                            description: 'File downloaded by download manager.'
                        }
                }
                // else {
                //     config.path = dirs.DocumentDir + '/' + filename
                // }
                RNFetchBlob
                    .config(config)
                    .fetch('GET', url)
                    .then((resp) => {
                        Share.open({
                            title: "Chia sẻ",
                            url: "file://" + resp.path(),
                        });
                    }).catch(err => {
                    })
            }
        })
    }


    render() {
        const bottonWidth = 200 > width ? width : 200;
        if (!this.state.urls || this.state.urls.length == 0)
            return null;
        return (
            <ActivityPanel style={{ flex: 1 }} showFullScreen={true} title={(this.state.index + 1) + "/" + (this.state.urls.length)}>
                <PhotoViewer urls={this.state.urls} index={this.state.index} style={{ flex: 1 }} onDownload={this.onDownload.bind(this)} onNext={(index, length) => { this.setState({ index }) }} onPreview={(index, length) => { this.setState({ index }) }} />
            </ActivityPanel >
        );
    }
}


export default PhotoViewerScreen;