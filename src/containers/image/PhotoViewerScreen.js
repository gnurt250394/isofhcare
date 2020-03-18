import React, { useState, useEffect } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { Text, StyleSheet } from 'react-native';
import ImageView from "react-native-image-viewing";

function PhotoViewerScreen(props) {
    const [index, setIndex] = useState(props.navigation.getParam("index", 0));
    const [urls, seturls] = useState(props.navigation.getParam("urls", []));
    const [visible, setIsVisible] = useState(true);
    const [id, setId] = useState(0);
    const close = () => {
        props.navigation.pop()
    }
    const header = () => {
        return (
            <Text style={styles.txIndex}>{(id + 1) + "/" + (urls.length)}</Text>
        )
    }
    return (
        <ActivityPanel
            containerStyle={{ flex: 1, backgroundColor: '#000' }}
            hideActionbar={true}
            showFullScreen={true}

        >
            <ImageView HeaderComponent={header} onImageIndexChange={imageIndex => setId(imageIndex)} images={urls} imageIndex={index} visible={visible} onRequestClose={close} />
        </ActivityPanel>
    );
}
const styles = StyleSheet.create({
    txIndex: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold', position: 'absolute', top: 10, alignSelf: 'center' }
})

export default PhotoViewerScreen;