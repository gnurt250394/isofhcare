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
} from 'react-native';
import CustomMenu from '@components/CustomMenu';
import ScaledImage from 'mainam-react-native-scaleimage';
import ItemSharing from './ItemSharing';
const {width, height} = Dimensions.get('window');
const SearchProfile = ({typeSearch, onSelected, hideSearch, positionY}) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(positionY);
  const [isShow, setIsShow] = useState(false);
  const [keyword, setKeyword] = useState('');
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
  const [data, setData] = useState([
    // {
    //   avatar: 'https://media.vov.vn/uploaded/usobwtngx2k/2020_01_01/1_ljtd.jpg',
    //   name: 'Nguyễn Văn A',
    //   phone: '0987654321',
    // },
    // {
    //   avatar:
    //     'https://nld.mediacdn.vn/thumb_w/540/2019/8/3/photo-1-15648212499661517922266.jpg',
    //   name: 'Nguyễn Văn A',
    //   phone: '0987654321',
    // },
    // {
    //   avatar:
    //     'https://duhocvietglobal.com/wp-content/uploads/2018/12/dat-nuoc-va-con-nguoi-anh-quoc.jpg',
    //   name: 'Nguyễn Văn A',
    //   phone: '0987654321',
    // },
    // {
    //   avatar: 'https://media.vov.vn/uploaded/usobwtngx2k/2020_01_01/1_ljtd.jpg',
    //   name: 'Nguyễn Văn A',
    //   phone: '0987654321',
    // },
    // {
    //   avatar: 'https://media.vov.vn/uploaded/usobwtngx2k/2020_01_01/1_ljtd.jpg',
    //   name: 'Nguyễn Văn A',
    //   phone: '0987654321',
    // },
  ]);
  const _keyExtractor = (item, index) => index.toString();
  const _renderItem = ({item, index}) => {
    return <ItemSharing item={item} />;
  };
  const listEmpty = () => {
    if (keyword) {
      return (
        <View style={styles.containerNone}>
          <ScaledImage
            source={require('@images/new/ehealth/ic_none.png')}
            width={width / 2}
          />
          <Text style={styles.txtNone}>Không tìm thấy kết quả phù hợp :(</Text>
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
        // easing={'ease-in-circ'}
        // animation="fadeInUpBig"
        // // delay={500}
        // duration={800}

        // useNativeDriver={true}
        style={[styles.containerSearch, {opacity, transform: [{translateY}]}]}>
        <CustomMenu
          MenuSelectOption={
            <View style={styles.buttonFilter}>
              <Text style={styles.txtLabelFilter}>
                {typeSearch == 'user' ? 'Người dùng' : 'Bác sĩ'}
              </Text>
              <ScaledImage
                source={require('@images/new/ehealth/ic_down.png')}
                height={10}
                style={styles.imgFilter}
              />
            </View>
          }
          options={
            typeSearch == 'user'
              ? [{value: 'Bác sĩ', id: 1, type: 'doctor'}]
              : [{value: 'Người dùng', id: 1, type: 'user'}]
          }
          onSelected={onSelected}
        />

        <View style={styles.containerInput}>
          <TextInput
            placeholder="Tìm tên bác sĩ"
            style={styles.innput}
            onChangeText={_onChangeText}
            value={keyword}
          />
          <ScaledImage
            source={require('@images/new/ic_search.png')}
            height={18}
            style={{tintColor: '#86899B'}}
          />
        </View>
      </Animated.View>
      {isShow ? (
        <FlatList
          data={data}
          contentContainerStyle={{backgroundColor: '#FFF'}}
          keyExtractor={_keyExtractor}
          renderItem={_renderItem}
          ListEmptyComponent={listEmpty}
        />
      ) : null}
      <TouchableWithoutFeedback
        onPress={hideSearch}
        style={{flex: 1, backgroundColor: 'red'}}>
        <View style={{flex: 1}} />
      </TouchableWithoutFeedback>
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
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFF',
  },
});

export default SearchProfile;
