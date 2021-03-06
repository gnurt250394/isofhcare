import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CustomMenu from '@components/CustomMenu';
import ScaledImage from 'mainam-react-native-scaleimage';
import ItemSharing from './ItemSharing';
import ehealthProvider from '@data-access/ehealth-provider';
const {width, height} = Dimensions.get('window');
const SearchProfile = ({
  typeSearch,
  onSelected,
  hideSearch,
  positionY,
  itemEhealth,
  onShare,
}) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(positionY);
  const [isShow, setIsShow] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    const endValue = 1;
    const duration = 600;
    Animated.parallel([
      // decay, then spring to start and twirl
      Animated.timing(opacity, {
        toValue: endValue,
        duration: duration,
        useNativeDriver: true,
      }),
      // after decay, in parallel:
      Animated.timing(translateY, {
        toValue: endValue,
        duration: duration,
        easing: Easing.exp,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsShow(true);
    }); // start the sequence group
  }, []);
  useEffect(() => {
    let timeout = setTimeout(() => {
      onSearch();
    }, 500);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [typeSearch, keyword]);
  const onSearch = async () => {
    try {
      setRefreshing(true);
      let res = await ehealthProvider.searchUserShare(typeSearch, keyword);

      setRefreshing(false);
      setData(res?.content);
    } catch (error) {}
  };
  const [data, setData] = useState([]);
  const _keyExtractor = (item, index) => index.toString();
  const _renderItem = ({item, index}) => {
    return (
      <ItemSharing item={item} itemEhealth={itemEhealth} onShare={onShare} />
    );
  };
  const listEmpty = () => {
    if (keyword) {
      return (
        <View style={styles.containerNone}>
          <ScaledImage
            source={require('@images/new/ehealth/ic_none.png')}
            width={width / 2}
          />
          <Text style={styles.txtNone}>Kh??ng t??m th???y k???t qu??? ph?? h???p :(</Text>
        </View>
      );
    }
    return null;
  };
  const _onChangeText = value => {
    setKeyword(value);
  };
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.containerSearch, {opacity, transform: [{translateY}]}]}>
        <CustomMenu
          MenuSelectOption={
            <View style={styles.buttonFilter}>
              <Text style={styles.txtLabelFilter}>
                {typeSearch == 'USER' ? 'Ng?????i d??ng' : 'B??c s??'}
              </Text>
              <ScaledImage
                source={require('@images/new/ehealth/ic_down.png')}
                height={10}
                style={styles.imgFilter}
              />
            </View>
          }
          options={
            typeSearch == 'USER'
              ? [{value: 'B??c s??', id: 1, type: 'DOCTOR'}]
              : [{value: 'Ng?????i d??ng', id: 1, type: 'USER'}]
          }
          onSelected={onSelected}
        />

        <View style={styles.containerInput}>
          <TextInput
            placeholder="T??m t??n b??c s??"
            style={styles.innput}
            onChangeText={_onChangeText}
            value={keyword}
          />
          <TouchableOpacity onPress={onSearch}>
            <ScaledImage
              source={require('@images/new/ic_search.png')}
              height={18}
              style={{tintColor: '#86899B'}}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      {isShow ? (
        <FlatList
          data={data}
          contentContainerStyle={{backgroundColor: '#FFF'}}
          keyExtractor={_keyExtractor}
          refreshing={refreshing}
          renderItem={_renderItem}
          ListEmptyComponent={listEmpty}
        />
      ) : null}
      {/* <TouchableWithoutFeedback
        onPress={hideSearch}
        style={{flex: 1, backgroundColor: 'red'}}>
        <View style={{flex: 1}} />
      </TouchableWithoutFeedback> */}
    </View>
  );
};
const styles = StyleSheet.create({
  txtNone: {
    fontSize: 17,
    paddingTop: 10,
    paddingBottom: 10,
    color: '#86899B',
    fontWeight: 'bold',
  },
  containerNone: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    flex: 1,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000080',
  },
  imgFilter: {
    tintColor: '#000',
  },
  txtLabelFilter: {
    marginRight: 7,
  },
  innput: {
    flex: 1,
    justifyContent: 'center',
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#16695020',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },
  buttonFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16695040',
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingRight: 15,
    height: 42,
  },
  containerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFF',
  },
});

export default SearchProfile;
