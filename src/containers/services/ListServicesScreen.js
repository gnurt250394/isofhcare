import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  PixelRatio,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import serviceProvider from '@data-access/service-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import ImageUtils from 'mainam-react-native-image-utils';
import firebaseUtils from '@utils/firebase-utils';
const {height, width} = Dimensions.get('screen');
const ListServicesScreen = ({navigation}) => {
  const [state, setState] = useState({
    isLoading: true,
    page: 0,
    size: 20,
    data: [],
    refreshing: false,
  });

  useEffect(() => {
      firebaseUtils.sendEvent('Service_screen')
  },[])
  async function getData() {
    try {
      let res = await serviceProvider.searchCategory(
        null,
        state.page,
        state.size,
      );
      if (res.length) {
        // res.forEach(async(e) => {
        //     let img = await ImageUtils.cachingImage(e.image, 50, 50, 'PNG', 0, 0)
        //     e.image = img.path

        // })
        formatData(res);
      } else {
        formatData([]);
      }
    } catch (error) {
      formatData([]);
    }
  }
  const formatData = data => {
    if (data.length == 0) {
      if (state.page == 0) {
        setState({...state, data: [], isLoading: false, refreshing: false});
      } else {
      }
    } else {
      if (state.page == 0) {
        setState({...state, data, isLoading: false, refreshing: false});
      } else {
        setState({
          ...state,
          data: [...state.data, ...data],
          isLoading: false,
          refreshing: false,
        });
      }
    }
  };

  const loadMore = () => {
    if (state.data.length >= (state.page + 1) * state.size) {
      setState({...state, page: state.page + 1});
    }
  };
  useEffect(() => {
    if (state.refreshing || state.isLoading) getData();
  }, [state.page, state.refreshing]);
  const goToDetailService = item => () => {
    navigation.navigate('listServicesDetail', {item});
  };
  const onRefresh = () => {
    setState({...state, refreshing: true, page: 0});
  };
  const keyExtractor = (item, index) => `${index}`;
  const renderItem = ({item, index}) => {
    let source = item.image
      ? {uri: item.image}
      : require('@images/new/user.png');
    return (
      <TouchableOpacity
        onPress={goToDetailService(item)}
        style={styles.containerItem}>
        {/* <Image source={{ uri: item.image }} style={styles.imageItem} /> */}
        <ImageLoad
          imageStyle={styles.imageItem}
          borderRadius={10}
          customImagePlaceholderDefaultStyle={[
            {
              width: '100%',
              height: '100%',
            },
          ]}
          placeholderSource={require('@images/new/user.png')}
          resizeMode="cover"
          loadingStyle={{size: 'small', color: 'white'}}
          source={source}
          style={styles.imageItem}
        />
        <View style={styles.groupName}>
          <Text style={styles.txtName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ActivityPanel isLoading={state.isLoading} title="Dịch vụ">
      <FlatList
        data={state.data}
        contentContainerStyle={{
          paddingTop: '6%',
          paddingBottom: 10,
        }}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.6}
        onRefresh={onRefresh}
        refreshing={state.refreshing}
      />
    </ActivityPanel>
  );
};

export default ListServicesScreen;

const styles = StyleSheet.create({
  txtName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: PixelRatio.get() < 2 ? 14 : 15,
  },
  groupName: {
    backgroundColor: '#3161AD',
    borderRadius: 30,
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginTop: 15,
    marginLeft: 15,
    maxWidth: '40%',
  },
  imageItem: {
    position: 'absolute',
    borderRadius: 10,
    height: '100%',
    width: '100%',
    padding: 0,
    resizeMode: 'stretch',
  },
  containerItem: {
    borderRadius: 10,
    width: width - 30,
    alignSelf: 'center',
    height: (width - 30) / 3,
    marginTop: 10,
    // marginBottom: 12,
    // marginHorizontal: 17,
    // shadowColor: '#000',
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 0.3,
    // elevation: 3,
    backgroundColor: '#FFF',
  },
});
