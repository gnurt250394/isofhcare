import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity, Text} from 'react-native';
import profileProvider from '@data-access/profile-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import snackbar from '@utils/snackbar-utils';
import ScaledImage from 'mainam-react-native-scaleimage';
import objectUtils from '@utils/object-utils';

const ListInvite = ({onRefresh}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getListAwaitProfile();
  }, []);
  const getListAwaitProfile = async () => {
    try {
      let res = await profileProvider.getListWaitting('INVITE');
      let res2 = await profileProvider.getListWaitting('INVITED');

      res2?.content.forEach(e => {
        e.type = 'INVITED';
      });
      res?.content.forEach(e => {
        e.type = 'INVITE';
      });
      let data = res2?.content.concat(res?.content);
      setData(data);
    } catch (error) {}
  };
  const onAccept = id => async () => {
    try {
      let res = await profileProvider.acceptProfile(id);
      console.log('res: ', res);
      onRefresh();
      getListAwaitProfile();
    } catch (error) {}
  };

  const onReject = id => async () => {
    try {
      let res = await profileProvider.rejectProfile(id);
      onRefresh();
      getListAwaitProfile();
    } catch (error) {}
  };
  const onCancel = id => async () => {
    try {
      let res = await profileProvider.cancelProfile(id);
      onRefresh();
      getListAwaitProfile();
    } catch (error) {}
  };

  const _renderItem = ({item, index}) => {
    return (
      <View style={styles.cardItem}>
        <View style={styles.viewProfileUser}>
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
            <View style={{flex: 1}}>
              <View style={styles.viewItemActive}>
                <Text style={styles.nameActive}>{item?.message}</Text>

                {item?.personal?.mobileNumber && (
                  <Text style={styles.phoneActive}>
                    SĐT {item?.personal?.mobileNumber}
                  </Text>
                )}
              </View>
              {item?.type == 'INVITE' ? (
                <View style={styles.containerConfirm}>
                  <View
                    style={[
                      styles.buttonConfirm,
                      {backgroundColor: '#BABABA'},
                    ]}>
                    <Text style={{color: '#FFF'}}>Chờ xác nhận</Text>
                  </View>
                  <TouchableOpacity
                    onPress={onCancel(item?.requestId)}
                    style={styles.buttonDelete}>
                    <Text>Huỷ</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.containerConfirm}>
                  <TouchableOpacity
                    onPress={onAccept(item?.requestId)}
                    style={[styles.buttonConfirm]}>
                    <Text style={{color: '#FFF'}}>Xác nhận</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onReject(item?.requestId)}
                    style={styles.buttonDelete}>
                    <Text>Xoá</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };
  const _keyExtractor = (item, index) => index.toString();
  return (
    <View style={{flex: 1, paddingBottom: 30}}>
      <FlatList
        data={data}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonDelete: {
    padding: 5,
    borderRadius: 25,
    borderColor: '#00000070',
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  buttonConfirm: {
    backgroundColor: '#00CBA7',
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
  },
  containerConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cardItem: {
    padding: 10,
    borderRadius: 6,
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#00000060',
    paddingBottom: 20,
    flex: 1,
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
