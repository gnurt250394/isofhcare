import React, {useState, useEffect, useRef} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import permission from 'mainam-react-native-permission';
import ScaledImage from 'mainam-react-native-scaleimage';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';

let dirs = RNFetchBlob.fs.dirs;

function FileViewerScreen(props) {
  const [index, setIndex] = useState(props.navigation.getParam('index', 0));
  const [urls, seturls] = useState(props.navigation.getParam('urls', ''));
  console.log('urls: ', urls);
  const [visible, setIsVisible] = useState(true);
  const [id, setId] = useState(0);
  const _webView = useRef();
  const close = () => {
    props.navigation.pop();
  };
  const header = () => {
    return (
      <View style={styles.viewHeader}>
        <Text style={styles.txIndex}>{id + 1 + '/' + urls.length}</Text>
        <TouchableOpacity onPress={close} style={styles.btnCancel}>
          <ScaledImage
            height={20}
            style={styles.colorImg}
            source={require('@images/new/ehealth/ic_close.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const footer = () => {
    return (
      <TouchableOpacity onPress={onDownload} style={styles.btnDownload}>
        <Text style={styles.txDownload}>Tải xuống</Text>
      </TouchableOpacity>
    );
  };
  const onDownload = async () => {
    let url = urls[id].uri;
    await permission.requestStoragePermission(s => {
      if (s) {
        let index = url.lastIndexOf('/');
        let filename = '';
        if (index != -1) {
          filename = url.substring(index + 1);
        } else {
          filename = new Date().getTime() + '';
        }
        let config = {
          fileCache: true,
        };

        if (Platform.OS == 'android') {
          config.path = dirs.PictureDir + '/' + filename;
          config.addAndroidDownloads = {
            useDownloadManager: true,
            notification: true,
            description: 'File downloaded by download manager.',
          };
        } else {
          config.path = dirs.DocumentDir + '/' + filename;
        }
        RNFetchBlob.config(config)
          .fetch('GET', url)
          .then(resp => {
            Share.open({
              title: 'Chia sẻ',
              url: 'file://' + resp.path(),
            });
          })
          .catch(err => {});
      }
    });
  };
  // const onNavigationStateChange = navState => {
  //   var wb_url = navState.url;
  //   console.log('wb_url: ', wb_url);
  //   var lastPart = wb_url.substr(wb_url.lastIndexOf('.') + 1);
  //   console.log('lastPart: ', lastPart);
  //   if (lastPart == 'doc' || lastPart == 'xlsx' || lastPart == 'pdf') {
  //     // var DEFAULT_URL = {
  //     //   uri: 'http://docs.google.com/gview?embedded=true&url=' + wb_url,
  //     // };
  //     // seturls(DEFAULT_URL.uri);
  //     setTimeout(() => {
  //       _webView.current.stopLoading();
  //     }, 2000);
  //   }
  // };
  return (
    <ActivityPanel
      containerStyle={{flex: 1}}
      // hideActionbar={true}
      showFullScreen={true}
      title={''}>
      {/* <ImageView FooterComponent={footer} HeaderComponent={header} onImageIndexChange={imageIndex => setId(imageIndex)} images={urls} imageIndex={index} visible={visible} onRequestClose={close} /> */}
      <WebView
        ref={_webView}
        source={{
          uri: `https://docs.google.com/gview?embedded=true&url=${urls}`,
        }}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        useWebKit={true}
        startInLoadingState={true}
        cacheEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        decelerationRate="normal"
        scalesPageToFit={true}
        automaticallyAdjustContentInsets={false}
      />
    </ActivityPanel>
  );
}
const styles = StyleSheet.create({
  colorImg: {tintColor: '#fff'},
  btnCancel: {padding: 5},
  viewHeader: {alignItems: 'flex-end', paddingRight: 10, paddingTop: 30},
  txIndex: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
  },
  txDownload: {color: '#fff', textAlign: 'center', fontSize: 14},
  btnDownload: {
    height: 52,
    borderRadius: 6,
    backgroundColor: '#5eb8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 60,
    marginBottom: 20,
  },
});

export default FileViewerScreen;
