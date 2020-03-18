import React, { useState } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { Text, StyleSheet } from 'react-native';
import ImageView from "react-native-image-viewing";

function PhotoViewerScreen(props) {
    const [index, setIndex] = useState(props.navigation.getParam("index", 0));
    const [urls, seturls] = useState(props.navigation.getParam("urls", []));
    const [visible, setIsVisible] = useState(true);
    const close = () => {
        props.navigation.pop()
    }
    return (
        <ActivityPanel
            containerStyle={{ flex: 1, backgroundColor: '#000' }}
            hideActionbar={true}
            showFullScreen={true}

        >
            <ImageView images={urls} imageIndex={index} visible={visible} onRequestClose={close} />
            {/* <Text style={styles.txIndex}>{(index + 1) + "/" + (urls.length)}</Text> */}
        </ActivityPanel>
    );
}
const styles = StyleSheet.create({
    txIndex: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold', position: 'absolute', top: 10, alignSelf: 'center' }
})

export default PhotoViewerScreen;