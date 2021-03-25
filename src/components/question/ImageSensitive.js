import ScaledImage from 'mainam-react-native-scaleimage';
import React from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';

const ImageSensitive = ({style, ...props}) => {
  return (
    <ImageBackground
      {...props}
      source={require('@images/new/community/ic_bg_sensitive.png')}
      style={[style, styles.containerSensitive]}>
      <ScaledImage
        source={require('@images/new/community/ic_logo_sensitive.png')}
        height={50}
        width={50}
      />
      <Text style={styles.txtSensitive}>
        Ảnh có yếu tố nhạy cảm hoặc thông tin riêng tư
      </Text>
    </ImageBackground>
  );
};

export default ImageSensitive;

const styles = StyleSheet.create({
  containerSensitive: {alignItems: 'center', justifyContent: 'center'},
  txtSensitive: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    textAlign: 'center',
    paddingTop: 5,
  },
});
