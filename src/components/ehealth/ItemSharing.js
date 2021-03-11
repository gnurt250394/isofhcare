import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ModalSelectTime from './ModalSelectTime';
import ImageLoad from 'mainam-react-native-image-loader';
import ScaledImage from 'mainam-react-native-scaleimage';

const ItemSharing = ({item}) => {
  const [isVisible, setIsVisible] = useState(false);
  const onCloseModal = () => setIsVisible(false);
  const source = item?.avatar
    ? {uri: item?.avatar.absoluteUrl()}
    : require('@images/new/user.png');
  const onShare = () => {
    setIsVisible(true);
  };
  return (
    <View style={styles.containerItem}>
      <ImageLoad
        resizeMode="cover"
        imageStyle={[styles.imageStyle]}
        borderRadius={5}
        customImagePlaceholderDefaultStyle={styles.defaultImage}
        placeholderSource={source}
        resizeMode="cover"
        loadingStyle={{size: 'small', color: 'gray'}}
        source={source}
        backgroundColor={'#FFF'}
        style={styles.imgLoad}
        defaultImage={() => {
          return (
            <ScaledImage
              resizeMode="cover"
              source={source}
              width={40}
              height={40}
            />
          );
        }}
      />
      <View style={styles.containerName}>
        <Text style={styles.txtName}>{item.name}</Text>
        <Text style={styles.txtPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity onPress={onShare} style={styles.buttonShare}>
        <Text>Chia sẻ</Text>
      </TouchableOpacity>
      <ModalSelectTime isVisible={isVisible} onCloseModal={onCloseModal} />
    </View>
  );
};
const styles = StyleSheet.create({
  buttonShare: {
    padding: 7,
    backgroundColor: 'rgba(49, 97, 173, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  containerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  txtPhone: {color: '#00000070', paddingTop: 3},
  txtName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  containerName: {
    flex: 1,
    paddingHorizontal: 10,
  },
  imgLoad: {
    borderRadius: 20,
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
  },
  defaultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  imageStyle: {
    borderRadius: 25,
  },
});

export default ItemSharing;
