import {Keyboard, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import {View, ScrollView, Text} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import DocumentPicker from 'react-native-document-picker';

export default class SelectDocument extends Component {
  constructor(props) {
    super(props);
    Keyboard.dismiss();
    this.state = {};
  }
  show(_options) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      let options = _options || {};
      options.cropping = _options.cropping ? true : false;

      this.setState(
        {
          options,
        },
        () => {
          this.ActionSheet.show();
        },
      );
    });
  }
  open(cropping, width, height, callback) {
    this.resolve = callback;
    let options = {
      cropping: cropping,
      width: width,
      height: height,
    };
    this.setState(
      {
        options,
      },
      () => {
        this.ActionSheet.show();
      },
    );
  }
  takePicture() {
    ImagePicker.openCamera(this.state.options)
      .then(image => {
        if (this.resolve) this.resolve(image);
      })
      .catch(e => {
        if (this.reject) this.reject(e);
      });
  }
  openDocument = async () => {
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('results: ', results);
     let result = results.map(res => {
        return {
          ...res,
          path: res.uri,
          mime: res.type,
          file: true,
        };
      });
      this.resolve(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
      }
      if (this.reject) this.reject(err);
    }
  };
  selectImage() {
    ImagePicker.openPicker(this.state.options)
      .then(image => {
        console.log('image: ', image);
        if (this.resolve) this.resolve(image);
      })
      .catch(e => {
        if (this.reject) this.reject(e);
      });
  }
  onActionSheet(index) {
    try {
      switch (index) {
        case 0:
          this.openDocument();
          return;
        case 1:
          this.selectImage();
          return;
        case 2:
          this.takePicture();
          return;
      }
    } catch (error) {}
  }

  render() {
    let options = this.props.listOptions || [];
    if (!options || options.length == 0)
      options = ['Chọn từ file', 'Chọn từ ảnh', 'Chụp ảnh', 'Hủy'];
    return (
      <ActionSheet
        ref={o => (this.ActionSheet = o)}
        options={options}
        cancelButtonIndex={2}
        // destructiveButtonIndex={1}
        onPress={this.onActionSheet.bind(this)}
      />
    );
  }
}
