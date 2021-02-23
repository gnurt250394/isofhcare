import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
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
const ListNews = ({navigation, props}) => {
  const [listNews, setListNews] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [idCategories, setIdCategories] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getList();
  }, [page, idCategories]);

  const onRefresh = () => {
    setPage(0);
    // getList(page, size)
  };
  const getList = () => {
    setLoading(true);
    if (!idCategories) {
      newsProvider
        .listNews(page, size)
        .then(res => {
          if (res) {
            setListNews(res.content);
          }
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        });
    } else {
      newsProvider
        .searchNewsByTopic(idCategories, page, size)
        .then(res => {
          if (res) {
            setListNews(res.content);
          }
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        });
    }
  };

  const loadMore = () => {
    if (listNews.length >= (page + 1) * size) {
      // setPage(page + 1)
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
        <ScaledImage
          width={133}
          style={{resizeMode: 'contain', height: 70}}
          source={{uri: `${urlImage}`}}
        />
        <View style={styles.viewTitle}>
          <Text style={styles.txTitle}>{item?.title?.rawText}</Text>
          <View style={styles.readingTime}>
            <View style={styles.viewTime}>
              <ScaledImage
                source={require('@images/new/news/ic_time.png')}
                height={15}
              />
              <Text style={styles.txTime}>
                {item?.alias?.createdAt ? date?.format('dd/MM/yyyy') : ''}
              </Text>
            </View>
            <View style={styles.viewTime}>
              <ScaledImage
                source={require('@images/new/news/ic_time_reading.png')}
                height={15}
              />
              <Text style={styles.txTime}>
                {item?.estimatedReadingTime || 1} phút đọc
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ActivityPanel
      title="Cẩm nang y tế"
      isLoading={loading}
      style={styles.container}>
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
            Mới nhất
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
        extraData={listNews}
      />
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
