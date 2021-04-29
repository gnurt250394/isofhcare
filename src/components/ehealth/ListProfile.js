import React, {useEffect, useState, useRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  FlatList,
  Text,
  Image,
} from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
import profileProvider from '@data-access/profile-provider';
import NavigationService from '@navigators/NavigationService';
import {connect, useDispatch} from 'react-redux';
import redux from '@redux-store';
import snackbar from '@utils/snackbar-utils';

const {width, height} = Dimensions.get('screen');
const ListProfile = ({index, onSeletedProfile}) => {
  const [dataProfile, setDataProfile] = useState([]);
  const scroll = useRef();
  const [currentIndex, setCurrentIndex] = useState(index || 0);
  const [currentPage, setCurrentPage] = useState(0);

  const dispatch = useDispatch();
  const onViewRef = useRef(({viewableItems}) => {
    setCurrentPage(viewableItems[0].index);
    // Use viewable items in state or as intended
  });
  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  useEffect(() => {
    onLoad();
  }, []);
  const onLoad = async () => {
    let s = await profileProvider.getListProfile();
    if (s.length) {
      let defaultProfile = s.find(e => e.defaultProfile);

      s.unshift({
        type: 'share',
        profileInfo: {personal: {fullName: 'Chia sẻ với tôi'}},
      });
      let index = s.findIndex(e => e.defaultProfile);

      setDataProfile(s);
      if (!currentIndex) {
        setCurrentIndex(index);
        await dispatch(redux.profileEhealth(defaultProfile));
        onSeletedProfile(defaultProfile, index);
      }
    }
  };
  const onPressProfile = async (item, index) => {
    if (currentIndex == index) {
      return;
    }
    setCurrentIndex(index);
    await dispatch(redux.profileEhealth(item));
    onSeletedProfile && onSeletedProfile(item, index);
  };

  const renderProfile = ({item, index}) => {
    const source =
      item.type == 'share'
        ? require('@images/new/homev2/ic_ehealth.png')
        : item?.profileInfo?.personal?.avatar
        ? {uri: item?.profileInfo?.personal?.avatar.absoluteUrl()}
        : require('@images/new/user.png');
    return (
      <View style={styles.containerItem}>
        {index == currentIndex ? (
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => onPressProfile(item, index)}
              style={styles.btnPress}>
              <Image resizeMode="cover" source={source} style={styles.img} />
            </TouchableOpacity>
            <View style={[styles.layoutTriangle]} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => onPressProfile(item, index)}
            style={[styles.btnItem]}>
            <Image resizeMode="cover" source={source} style={styles.img} />

            <Text
              style={{
                paddingTop: 6,
                textAlign: 'center',
              }}
              numberOfLines={2}>
              {item?.profileInfo?.personal?.fullName.trim()}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const onSelectProfile = isBack => () => {
    if (currentPage <= 4 && currentPage == 0 && isBack) return;
    if (currentPage >= dataProfile?.length - 4 && !isBack) return;
    if (isBack) {
      let page =
        currentPage == 1
          ? currentPage - 1
          : currentPage == 2
          ? currentPage - 2
          : currentPage == 3
          ? currentPage - 3
          : currentPage - 4;
      scroll.current.scrollToIndex({index: page});
    } else {
      let page = currentPage + 4;
      scroll.current.scrollToIndex({index: page});
    }
  };
  const keyExtractor = (item, index) => index.toString();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
      }}>
      <TouchableOpacity onPress={onSelectProfile(true)} style={{padding: 10}}>
        <ScaleImage
          source={require('@images/new/account/ic_back.png')}
          width={20}
          height={20}
          style={{tintColor: '#86899B'}}
        />
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <FlatList
          pagingEnabled={true}
          ref={scroll}
          contentContainerStyle={styles.container}
          scrollEventThrottle={16}
          renderItem={renderProfile}
          data={dataProfile}
          snapToAlignment={'start'}
          snapToInterval={width + 10}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>
      <TouchableOpacity style={{padding: 10}} onPress={onSelectProfile()}>
        <ScaleImage
          source={require('@images/new/account/ic_back.png')}
          width={20}
          height={20}
          style={{tintColor: '#86899B', transform: [{rotate: '180deg'}]}}
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  containerItem: {
    width: width / 5 + 5,
    // height: width / 4 + 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    alignSelf:'flex-start'
  },
  layoutTriangle: {
    width: 0,
    height: 0,
    backgroundColor: '#00000000',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF',
    bottom: -10,
    position: 'absolute',
    alignSelf: 'center',
  },
  imageStyle: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  container: {
    // height: width / 4,
  },
  viewItem: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: 10,
  },
  imgAdd: {borderRadius: 10},
  btnAdd: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 7,
  },
  imgLoad: {
    alignSelf: 'center',
    borderRadius: 30,
    width: width / 6,
    height: width / 6,
    // borderWidth: 1,
    // borderColor: '#FFF',
    // shadowOpacity: 0.3,
    // shadowColor: '#000',
    // shadowOffset: {width: 2, height: 2},
    backgroundColor: '#FFF',
  },
  defaultImage: {
    width: width / 7,
    height: width / 7,
    // borderRadius: 30,
    // borderColor: '#FFF',
    // borderWidth: 1,
    // shadowOpacity: 0.6,
    // shadowColor: '#000',
    // shadowOffset: {width: 2, height: 2},
    // elevation: 2,
  },
  btnItem: {
    width: width / 6,
    // height: '100%',
    marginRight: 5,
    transform: [{scale: 0.9}],
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  img: {
    alignSelf: 'center',
    borderRadius: 20,
    width: width / 7,
    height: width / 7,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  },
  placeholderStyle: {width: 70, height: 70, borderRadius: 30},
  btnPress: {
    width: width / 6,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{scale: 1.01}],
    marginTop: 7,
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    profile: state.auth.profile,
    hospital: state?.auth?.ehealth?.hospital || -1,
  };
}
export default connect(mapStateToProps)(ListProfile);
