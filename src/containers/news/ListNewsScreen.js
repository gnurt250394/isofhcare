import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import newsProvider from '@data-access/news-provider';
import ScaledImage from 'mainam-react-native-scaleimage';
import dateUtils from 'mainam-react-native-date-utils';
import Modal from '@components/modal';
import CategoriesNews from '@components/news/CategoriesNews';
import ListCategories from '@components/news/ListCategories';
import redux from '@redux-store';
import {connect} from 'react-redux';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
const ListNews = ({navigation, props}) => {
  const [listNews, setListNews] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [idCategories, setIdCategories] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const dispatch = useDispatch();
  const timeout = useRef();
  useEffect(() => {
    timeout.current = setTimeout(() => {
      getList();
    }, 500);
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [page, idCategories, keyword]);

  const onRefresh = () => {
    setPage(0);
    setKeyword('');
    setType('');
    // getList(page, size)
  };
  const getList = async () => {
    try {
      let res;
      if (keyword.trim()) {
        res = await newsProvider.searchNews(keyword, page, size);
      } else if (!idCategories) {
        res = await newsProvider.listNews(page, size);
      } else {
        res = await newsProvider.searchNewsByTopic(idCategories, page, size);
      }
      if (res) {
        formatData(res.content);
      } else {
        formatData([]);
      }
      setLoading(false);
    } catch (error) {
      formatData([]);
      setLoading(false);
    }
  };

  const formatData = data => {
    if (data?.length == 0) {
      if (page == 0) {
        setListNews(data);
      }
    } else {
      if (page == 0) {
        setListNews(data);
      } else {
        setListNews(listNews => [...listNews, ...data]);
      }
    }
  };
  const loadMore = () => {
    if (listNews.length >= (page + 1) * size) {
      setPage(page => page + 1);
      // getList(page, size)
    }
  };
  const onBackdropPress = () => {
    setIsVisible(false);
  };
  const onShowDetails = (item, index) => {
    navigation.navigate('detailNews', {
      item,
    });
  };
  const onSelectTopics = () => {
    setIsVisible(true);
  };
  const onSelectNew = async () => {
    setIsNew(true);
    setPage(0);
    setIdCategories(null);
  };
  const footerComponent = () => {
    if (listNews.length >= (page + 1) * size) {
      return <ActivityIndicator color="#00CBA7" size="small" />;
    } else {
      return null;
    }
  };
  const onSelectCategories = item => {
    setIsNew(false);
    setIsVisible(false);
    setPage(0);
    setIdCategories(item?.topicId);
  };
  const renderItem = ({item, index}) => {
    let date = item?.alias?.createdAt
      ? new Date(item?.alias?.createdAt.replace('+0000', ''))
      : '';

    let urlImage = item?.images[0].downloadUri;

    return (
      <TouchableOpacity
        onPress={() => onShowDetails(item, index)}
        style={styles.viewItem}>
        <FastImage
          style={{resizeMode: 'contain', height: 70, width: 133}}
          source={{uri: `${urlImage}`}}
        />
        <View style={styles.viewTitle}>
          <Text style={styles.txTitle}>{item?.shortTitle?.rawText}</Text>
          <View style={styles.readingTime}>
            <View style={styles.viewTime}>
              <ScaledImage
                source={require('@images/new/news/ic_time.png')}
                height={15}
              />
              <Text style={styles.txTime}>
                {item?.createdAt
                  ? moment(item?.createdAt)?.format('DD/MM/YYYY')
                  : ''}
              </Text>
            </View>
            <View style={styles.viewTime}>
              <ScaledImage
                source={require('@images/new/news/ic_time_reading.png')}
                height={15}
              />
              <Text style={styles.txTime}>
                {item?.estimatedReadingTime || 1} ph??t ?????c
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onSearch = async () => {
    if (keyword.trim()) getList();
  };
  const onChangeText = value => {
    setPage(0);
    setKeyword(value);
  };
  return (
    <ActivityPanel
      title="C???m nang y t???"
      transparent={true}
      isLoading={loading}
      style={styles.container}>
      <View style={styles.groupSearch}>
        <TextInput
          value={keyword}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          style={styles.inputSearch}
          placeholder={'T??m b??i vi???t'}
          underlineColorAndroid={'transparent'}
        />
        {keyword.trim() ? (
          <TouchableOpacity
            style={[
              styles.buttonSearch,
              {borderLeftColor: '#BBB', borderLeftWidth: 0.7},
            ]}
            onPress={onRefresh}>
            <ScaledImage source={require('@images/ic_close.png')} height={16} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.buttonSearch]} onPress={onSearch}>
            <ScaledImage
              source={require('@images/new/hospital/ic_search.png')}
              height={16}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          backgroundColor: '#FFF',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        <View style={styles.viewHeader}>
          <TouchableOpacity
            disabled={isNew}
            onPress={onSelectNew}
            style={[
              styles.btnItem,
              isNew ? styles.btnSelect : styles.btnUnselect,
            ]}>
            <Text
              style={[
                styles.txItem,
                isNew ? styles.txSelect : styles.txUnSelect,
              ]}>
              M???i nh???t
            </Text>
          </TouchableOpacity>
          <ListCategories
            idCategories={idCategories}
            isNew={isNew}
            onSelectCategories={item => onSelectCategories(item)}
          />
          <TouchableOpacity onPress={onSelectTopics} style={styles.btnTopics}>
            <ScaledImage
              style={styles.imagesDown}
              height={20}
              source={require('@images/new/news/ic_dots.png')}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          data={listNews}
          onRefresh={onRefresh}
          refreshing={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.7}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={footerComponent}
        />
      </View>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
        backdropOpacity={0.5}
        animationInTiming={500}
        animationOutTiming={500}
        style={styles.modal}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={1000}>
        <CategoriesNews
          isNew={isNew}
          idCategories={idCategories}
          onSelectCategories={item => onSelectCategories(item)}
          onCancel={onBackdropPress}
        />
      </Modal>
    </ActivityPanel>
  );
};
const styles = StyleSheet.create({
  buttonSearch: {
    marginRight: -2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: '100%',
  },
  groupSearch: {
    backgroundColor: '#FFF',
    margin: 10,
    borderRadius: 7,
    flexDirection: 'row',
    height: 41,
    alignItems: 'center',
  },
  inputSearch: {
    flex: 1,
    height: 41,
    fontWeight: 'bold',
    paddingLeft: 9,
    color: '#000',
  },
  container: {
    flex: 1,
  },
  txSelect: {
    color: '#fff',
  },
  txUnSelect: {
    color: '#3161AD',
  },
  txItem: {
    fontSize: 14,
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  viewItem: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    width: '95%',
    textAlign: 'left',
  },
  viewTitle: {
    paddingHorizontal: 10,
    width: '70%',
    justifyContent: 'space-between',
  },
  viewTime: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txTime: {
    marginLeft: 5,
    color: '#2F3035',
  },
  btnTopics: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    margin: 10,
    height: 42,
    width: 42,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagesDown: {},
  modal: {
    flex: 1,
  },
  readingTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  viewHeight: {height: 50},
  btnItem: {
    padding: 10,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSelect: {
    backgroundColor: '#3161AD',
  },
  btnUnselect: {
    backgroundColor: '#DEE6F2',
  },
});

export default ListNews;
