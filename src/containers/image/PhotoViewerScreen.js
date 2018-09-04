import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import PhotoView from 'react-native-photo-view';
const { width, height } = Dimensions.get('window');
import { IndicatorViewPager } from 'mainam-react-native-viewpager';
class PhotoViewerScreen extends Component {
    constructor(props) {
        super(props)
        var list = this.props.navigation.getParam("urls", null);
        if (!list)
            list = [];
        this.state = {
            urls: list,
            index: 0
        }
    }
    componentDidMount() {

    }

    render() {
        if (!this.state.list || this.state.list.length == 0)
            return null;
        return (
            <ActivityPanel style={{ flex: 1 }} showFullScreen={true} hideActionbar={true}>

                <PhotoView
                    source={{ uri: 'https://thumbs.dreamstime.com/z/bokeh-background-christmas-tree-decoration-46320638.jpg' }}
                    minimumZoomScale={0.5}
                    maximumZoomScale={3}
                    androidScaleType="center"
                    onLoad={() => console.log("Image loaded!")}
                    style={{ width, height }} />
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(PhotoViewerScreen);