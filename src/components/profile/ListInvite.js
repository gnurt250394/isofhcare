import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity, Text} from 'react-native';
import profileProvider from '@data-access/profile-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import snackbar from '@utils/snackbar-utils';
import ScaledImage from 'mainam-react-native-scaleimage';
import objectUtils from '@utils/object-utils';

const ListInvite = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getListAwaitProfile();
  }, []);
  const getListAwaitProfile = async () => {
    try {
      let res = await profileProvider.getListWaitting('INVITE');
      console.log('res: ', res);
      setData(res?.content);
    } catch (error) {
      console.log('error: ', error);
    }
  };
  const onClickItem = item => () => {};
  const _renderItem = ({item, index}) => {
    return (
      <View style={styles.cardItem}>
        <TouchableOpacity
          onPress={onClickItem(item)}
          style={styles.viewProfileUser}>
          <View style={styles.viewActive}>
            <ImageLoad
              resizeMode="cover"
              imageStyle={styles.imageStyle}
              borderRadius={35}
              customImagePlaceholderDefaultStyle={[styles.avatar, styles.image]}
              placeholderSource={require('@images/new/user.png')}
              resizeMode="cover"
              loadingStyle={{size: 'small', color: 'gray'}}
              source={{
                uri: item?.personal?.avatar?.absoluteUrl() || '',
              }}
              style={styles.imgLoad}
              defaultImage={() => {
                return (
                  <ScaleImage
                    resizeMode="cover"
                    source={require('@images/new/user.png')}
                    width={60}
                    height={60}
                  />
                );
              }}
            />
            <View style={styles.viewItemActive}>
              <Text style={styles.nameActive}>
                {item?.personal?.fullName}
                {item.defaultProfile
                  ? ' (Chủ tài khoản)'
                  : objectUtils.renderTextRelations(
                      item?.personal.relationshipType,
                    )}
              </Text>

              {item?.personal?.mobileNumber && (
                <Text style={styles.phoneActive}>
                  SĐT {item?.personal?.mobileNumber}
                </Text>
              )}
              <Text style={styles.dobActive}>
                {item?.personal?.value && item?.personal?.hospitalName
                  ? item?.personal?.hospitalName
                  : ''}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const _keyExtractor = (item, index) => index.toString();
  return (
    <View>
      <FlatList
        data={data}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    padding: 10,
    borderRadius: 6,
    margin: 5,
  },
  image: {width: 70, height: 70},
  imgLoad: {
    alignSelf: 'center',
    borderRadius: 35,
    width: 70,
    height: 70,
  },
  imageStyle: {
    borderRadius: 35,
    borderWidth: 0.5,
    borderColor: '#27AE60',
  },

  viewProfileUser: {
    // backgroundColor: '#01BE84',
    flex: 1,
    // alignItems:'center'
  },
  viewActive: {flexDirection: 'row', alignItems: 'center'},
  viewItemActive: {marginLeft: 10, flex: 1},
  nameActive: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  phoneActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00000050',
    marginVertical: 5,
  },
  dobActive: {fontSize: 15, fontWeight: 'bold', color: '#00CBA7'},
});
export default ListInvite;
