import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
const getMimeType = type => {
  switch (type) {
    case 'aac':
      return 'audio/aac';
    case 'abw':
      return 'application/x-abiword';
    case 'csv':
      return 'text/csv';
    case 'bin':
      return 'application/octet-stream';
    case 'bmp':
      return 'image/bmp';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'gif':
      return 'image/gif';
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpeg';
    case 'mp3':
      return 'audio/mpeg';
    case 'mpeg':
      return 'video/mpeg';
    case 'pdf':
      return 'application/pdf';
    case 'ppt':
      return 'application/vnd.ms-powerpoint';
    case 'pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'rar':
      return 'application/x-rar-compressed';
    case 'wav':
      return 'audio/wav';
    case 'weba':
      return 'audio/webm';
    case 'webm':
      return 'video/webm';
    case 'webp':
      return 'image/webp';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'zip':
      return 'application/zip';
    case '3gp':
      return 'video/3gpp';
    case '3g2':
      return 'video/3gpp2';
    case '7z':
      return 'application/x-7z-compressed';
    case 'swf':
      return 'application/x-shockwave-flash';
    case 'tar':
      return 'application/x-tar';
    case 'tif':
      return 'image/tiff';
    case 'tiff':
      return 'image/tiff';
    case 'txt':
      return 'text/plain';

    default:
      return '';
  }
};
const OpenFile = url => {
  const fileType = url.split('.').pop();
  const SavePath =
    Platform.OS === 'ios'
      ? RNFS.DocumentDirectoryPath
      : RNFS.ExternalDirectoryPath;
  const mimeType = getMimeType(fileType); // getMimeType is a method (switch statement) that returns the correct mimetype
  const path = `${SavePath}/${new Date().getTime()}.${fileType}`;
  const android = RNFetchBlob.android;
  RNFS.downloadFile({
    fromUrl: url,
    toFile: path,
  }).promise.then(() => {
    if(Platform.OS =="android"){
      android
        .actionViewIntent(path, mimeType)
        .then(success => {
          console.log('success: ', success);
        })
        .catch(err => {
          console.log('err:', err);
        });

    }else{
      RNFetchBlob.ios.openDocument(path)
    }
  });
};
export default OpenFile;
