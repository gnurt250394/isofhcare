import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import StarRating from 'react-native-star-rating';
import ImageLoad from 'mainam-react-native-image-loader';
import {Card} from 'native-base';
import ItemDoctor from '@components/booking/doctor/ItemDoctor';
import ScaleImage from 'mainam-react-native-scaleimage';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import ActionBar from '@components/Actionbar';
import constants from '@resources/strings';
import ItemService from '@components/services/ItemService';
import serviceProvider from '@data-access/service-provider';
import locationUtils from '@utils/location-utils';
import firebaseUtils from '@utils/firebase-utils';

const {width, height} = Dimensions.get('window');
const TYPE = {
  SEARCH: 'SEARCH',
  HOSPITAL: 'HOSPITAL',
  SPECIALIST: 'SPECIALIST',
};
const ListServiceDetailScreen = ({navigation}) => {
  const [state, setState] = useState({
    isLoading: true,
    data: [],
    keyword: '',
    infoDoctor: {},
    page: 0,
    size: 20,
    refreshing: false,
    category: navigation.getParam('item', {}),
    item: {},
    type: '',
    latitude: null,
    longitude: null,
    getLocation: false,
  });
  const getData = async () => {
    try {
      let res = await serviceProvider.getListServices(
        null,
        false,
        state.keyword,
        state?.category?.id,
        'APPROVED',
        state?.latitude,
        state?.longitude,
        state.page,
        state.size,
        true,
      );
      if (res?.content?.length > 0) {
        formatData(res.content);
      } else {
        formatData([]);
      }
    } catch (error) {
      formatData([]);
    }
  };
  useEffect(() => {
    let timeout = setTimeout(() => {
      // if (state.isLoading || state.refreshing)
      getData();
    }, 500);
    return () => clearTimeout(timeout);
  }, [state.keyword, state.page, state.refreshing]);
  useEffect(() => {
    if (state.getLocation) getData();
  }, [state.getLocation]);

  const formatData = data => {
    if (data.length == 0) {
      if (state.page == 0) {
        setState({
          ...state,
          data,
          isLoading: false,
          refreshing: false,
          getLocation: false,
        });
      }
    } else {
      if (state.page == 0) {
        setState({
          ...state,
          data,
          isLoading: false,
          refreshing: false,
          getLocation: false,
        });
      } else {
        setState(preState => {
          return {
            ...state,
            data: [...preState.data, ...data],
            isLoading: false,
            refreshing: false,
            getLocation: false,
          };
        });
      }
    }
  };
  const gotoDetailService = item => () => {
    navigation.navigate('listOfServices', {item});
  };
  const renderItem = ({item}) => {
    return <ItemService item={item} onPress={gotoDetailService(item)} />;
  };
  const onChangeText = state2 => value => {
    setState({...state, [state2]: value, refreshing: true});
  };

  const keyExtractor = (item, index) => index.toString();
  const listEmpty = () =>
    !state.isLoading && <Text style={styles.none_data}>Không có dữ liệu</Text>;
  const loadMore = () => {
    if (state.data.length >= (state.page + 1) * state.size) {
      setState({...state, page: state.page + 1});
    }
  };
  const getDataWithLocation = async () => {
    try {
      firebaseUtils.sendEvent('Service_nearme')
      setState({...state, isLoading: true});
      let res = await locationUtils.getLocation();

      if (res.latitude || res.longitude) {
        setState({
          ...state,
          latitude: res.latitude,
          longitude: res.longitude,
          getLocation: true,
        });
      }
    } catch (error) {}
  };
  const onRefresh = () => {
    setState({
      ...state,
      keyword: '',
      latitude: null,
      longitude: null,
      page: 0,
      refreshing: true,
    });
  };
  return (
    <ActivityPanel
      title={navigation?.state?.params?.item?.name}
      transparent={true}
      isLoading={state.isLoading}>
      <View style={styles.groupSearch}>
        <TextInput
          value={state.keyword}
          onChangeText={onChangeText('keyword')}
          onSubmitEditing={() => {
            getData();
          }}
          returnKeyType="search"
          style={styles.inputSearch}
          placeholder={'Tìm kiếm…'}
          underlineColorAndroid={'transparent'}
        />
        {state.keyword ? (
          <TouchableOpacity
            style={[
              styles.buttonSearch,
              {borderLeftColor: '#BBB', borderLeftWidth: 0.7},
            ]}
            onPress={onRefresh}>
            <ScaleImage source={require('@images/ic_close.png')} height={16} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.buttonSearch]}
            // onPress={onSearch}
          >
            <ScaleImage
              source={require('@images/new/hospital/ic_search.png')}
              height={16}
            />
          </TouchableOpacity>
        )}
        <View style={styles.containerLocation} />
        <TouchableOpacity
          style={[styles.buttonLocation]}
          onPress={getDataWithLocation}>
          <ScaleImage
            source={require('@images/ic_location.png')}
            height={16}
            style={{
              tintColor: '#000',
            }}
          />
          <Text style={styles.txtLocation}>Gần tôi</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={state.data}
        renderItem={renderItem}
        // style={{paddingTop:height/4}}
        keyExtractor={keyExtractor}
        ListEmptyComponent={listEmpty}
        onEndReached={loadMore}
        onEndReachedThreshold={0.8}
        onRefresh={onRefresh}
        refreshing={state.refreshing}
      />
      {/* </ScrollView> */}
    </ActivityPanel>
  );
};

export default ListServiceDetailScreen;

const styles = StyleSheet.create({
  txtLocation: {
    paddingLeft: 5,
  },
  buttonLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  containerLocation: {
    height: '80%',
    width: 1,
    backgroundColor: '#00000060',
  },

  flex: {
    flex: 1,
  },
  buttonSearch: {
    marginRight: -2,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  inputSearch: {
    flex: 1,
    height: 41,
    marginLeft: -10,
    fontWeight: 'bold',
    paddingLeft: 9,
    color: '#000',
  },
  groupSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 7,
    borderTopWidth: 0.5,
    height: 41,
    borderStyle: 'solid',
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.26)',
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 7,
  },
  none_data: {
    fontStyle: 'italic',
    marginTop: '50%',
    alignSelf: 'center',
    fontSize: 17,
  },
});
