import ActivityPanel from '@components/ActivityPanel';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import ImageLoad from 'mainam-react-native-image-loader';
import ScaledImage from 'mainam-react-native-scaleimage';
import ehealthProvider from '@data-access/ehealth-provider';

const ListHistoryShareScreen = ({navigation}) => {
  let item = navigation.state?.params?.itemEhealth;
  console.log('item: ', item);
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      let res = await ehealthProvider.getListHistoryShare(item.id);
      console.log('res: ', res);
      setData(res?.content);
    } catch (error) {
      console.log('error: ', error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const _renderItem = ({item, index}) => {
    const source = item?.target?.avatar
      ? {uri: item?.target?.avatar.absoluteUrl()}
      : require('@images/new/user.png');
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
          <Text style={styles.txtName}>{item?.target?.fullName}</Text>
          <Text style={styles.txtPhone}>
            Hiệu lực:{' '}
            {item?.issuedOfDate.toDateObject('-').format('HH:mm dd/MM/yyyy')} -{' '}
            {item?.expirationDate.toDateObject('-').format('HH:mm dd/MM/yyyy')}
          </Text>
        </View>
      </View>
    );
  };
  const _keyExtractor = (item, index) => index.toString();
  return (
    <ActivityPanel title={'Lịch sử chia sẻ'}>
      <FlatList
        data={data}
        renderItem={_renderItem}
        contentContainerStyle={{paddingTop: 20}}
        keyExtractor={_keyExtractor}
      />
    </ActivityPanel>
  );
};
const styles = StyleSheet.create({
  buttonHistoryShare: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
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
  txtGuide: {
    color: '#00000070',
    fontStyle: 'italic',
    paddingLeft: 10,
  },
  imgFilter: {
    tintColor: '#000',
  },
  txtLabelFilter: {
    marginRight: 7,
  },
  innput: {
    flex: 1,
    height: '100%',
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    backgroundColor: '#16695020',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 10,
  },
  buttonFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16695040',
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingRight: 15,
  },
  containerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  txtTitleShare: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  imageStyle: {
    borderRadius: 25,
  },
});
export default ListHistoryShareScreen;
