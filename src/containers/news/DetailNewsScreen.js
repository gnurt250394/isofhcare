import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import HTML from 'react-native-render-html';
import snackbar from '@utils/snackbar-utils';
import ReadMoreText from '@components/ReadMoreText';
import homeProvider from '@data-access/home-provider';
import ScaledImage from 'mainam-react-native-scaleimage';
import FastImage from 'react-native-fast-image';
import Webview from 'react-native-webview';
import newsProvider from '@data-access/news-provider';
import {IGNORED_TAGS} from 'react-native-render-html/src/HTMLUtils';
import _ from 'lodash';
import {ShareDialog} from 'react-native-fbsdk';
import moment from 'moment';
const {width, height} = Dimensions.get('window');
const DetailNewsScreen = ({navigation}) => {
  const item = navigation.getParam('item', {});
  const [data, setData] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [detail, setDetail] = useState(item);
  console.log('detail: ', detail);

  const [content, setContent] = useState('');
  const [idCategories, setIdCategories] = useState(detail?.topic?.topicId);
  useEffect(() => {
    // getServiceHighLight()
    getNews();
    getList();
  }, [detail.newsId]);

  const getNews = () => {
    newsProvider
      .detailNews(detail?.newsId)
      .then(res => {
        setContent(res.content.rawText);
        setDetail(res);
      })
      .catch(err => {});
  };
  const getList = () => {
    setLoading(true);
    if (!idCategories) {
      newsProvider
        .listNews(0, 6)
        .then(res => {
          if (res?.content?.length) {
            var dataNews = res.content;
            let indexOld = res.content?.findIndex(
              obj => obj.newsId == detail.newsId,
            );
            dataNews.splice(indexOld, 1);

            setData(dataNews);
          }
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        });
    } else {
      newsProvider
        .searchNewsByTopic(idCategories, 0, 6)
        .then(res => {
          if (res?.content?.length) {
            var dataNews = res.content;
            let indexOld = res.content?.findIndex(
              obj => obj.newsId == detail.newsId,
            );
            dataNews.splice(indexOld, 1);
            setData(dataNews);
          }
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        });
    }
  };

  const getTime = () => {
    if (detail?.createdAt) {
      let time = detail?.createdAt?.substring(0, 10);
      return new Date(time).format('dd/MM/yyyy');
    } else {
      return '';
    }
  };
  const goToDetailService = item => () => {
    navigation.replace('detailNews', {item, idCategories});
  };
  const tags = _.without(
    IGNORED_TAGS,
    'table',
    'caption',
    'col',
    'colgroup',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
  );

  const tableDefaultStyle = {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 0.4,
  };

  const tableColumnStyle = {
    ...tableDefaultStyle,
    flexDirection: 'column',
    alignItems: 'stretch',
  };

  const tableRowStyle = {
    ...tableDefaultStyle,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderColor: '#000000',
  };

  const tdStyle = {
    ...tableDefaultStyle,
    padding: 2,
    flexDirection: 'row',
  };

  const thStyle = {
    ...tdStyle,
    backgroundColor: '#CCCCCC',
    alignItems: 'flex-end',
    borderColor: 'orange',
  };
  const renderItem = ({item, index}) => {
    let date = item?.alias?.createdAt
      ? new Date(item?.alias?.createdAt.replace('+0000', ''))
      : '';

    let urlImage = item?.images[0].downloadUri;

    return (
      <TouchableOpacity
        onPress={goToDetailService(item)}
        style={styles.viewItem}>
        <FastImage
          style={{resizeMode: 'contain', height: 70, width: 133}}
          source={{uri: `${urlImage}`}}
        />
        <View style={styles.viewTitle}>
          <Text style={styles.txTitle} numberOfLines={2}>
            {item?.shortTitle?.rawText}
          </Text>
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
                {item?.estimatedReadingTime || 1} phút đọc
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const onGoToTest = () => {
    // snackbar.show('Tính năng đang phát triển')
    navigation.navigate('introCovid');
  };
  const shareLinkContent = {
    contentType: 'link',
    contentUrl: 'https://isofhcare.com/' + detail?.identity,
  };

  const onShare = () => {
    ShareDialog.canShow(shareLinkContent)
      .then(function(canShow) {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }
      })
      .then(
        function(result) {
          if (result.isCancelled) {
          } else {
          }
        },
        function(error) {},
      );
  };
  const showImage = (urls, index) => () => {
    navigation.navigate('photoViewer', {
      index,
      urls,
    });
  };
  return (
    <ActivityPanel isLoading={isLoading} title="Nội dung chi tiết">
      <ScrollView style={styles.container}>
        <View style={styles.flex}>
          <View style={styles.containerTitle}>
            <Text style={styles.txtTitle}>{detail?.title?.rawText}</Text>
            <View style={styles.containerTime}>
              <Text style={[styles.txtTime, {paddingRight: 20}]}>
                {getTime()}
              </Text>
              <Text style={styles.txtTime}>
                {detail?.estimatedReadingTime} phút đọc
              </Text>
            </View>
            <TouchableOpacity
              onPress={showImage(
                [{uri: detail?.images?.[0]?.downloadUri?.absoluteUrl()}],
                0,
              )}>
              <FastImage
                source={{
                  uri: detail?.images?.[0]?.downloadUri?.absoluteUrl() || '',
                }}
                style={styles.imageNews}
              />
            </TouchableOpacity>
            {content ? (
              <HTML
                html={'<div style="color: black">' + content + '</div>'}
                allowFontScaling={false}
                ignoredTags={tags}
                renderers={{
                  img: (
                    htmlAttribs,
                    children,
                    convertedCSSStyles,
                    passProps,
                  ) => {
                    return (
                      <TouchableOpacity
                        onPress={showImage(
                          [
                            {
                              uri: htmlAttribs.src,
                            },
                          ],
                          0,
                        )}>
                        <FastImage
                          resizeMode={'contain'}
                          source={{uri: htmlAttribs.src}}
                          style={{
                            width: width - 30,
                            height: parseInt(htmlAttribs.height) || 150,
                            resizeMode: 'contain',
                          }}
                        />
                      </TouchableOpacity>
                    );
                  },
                  table: (x, c) => <View style={tableColumnStyle}>{c}</View>,
                  col: (x, c) => <View style={tableColumnStyle}>{c}</View>,
                  colgroup: (x, c) => <View style={tableRowStyle}>{c}</View>,
                  tbody: (x, c) => <View style={tableColumnStyle}>{c}</View>,
                  tfoot: (x, c) => <View style={tableRowStyle}>{c}</View>,
                  th: (x, c) => <View style={thStyle}>{c}</View>,
                  thead: (x, c) => <View style={tableRowStyle}>{c}</View>,
                  caption: (x, c) => <View style={tableColumnStyle}>{c}</View>,
                  tr: (x, c) => <View style={tableRowStyle}>{c}</View>,
                  td: (x, c) => <View style={tdStyle}>{c}</View>,
                }}
              />
            ) : null}
          </View>
          <TouchableOpacity onPress={onShare} style={styles.buttonShare}>
            <ScaledImage
              source={require('@images/new/news/ic_share.png')}
              height={20}
              width={20}
            />
            <Text>Chia sẻ</Text>
          </TouchableOpacity>
          <View style={{paddingLeft: 10}}>
            <Text style={{paddingTop: 5}}>
              Chuyên mục:{' '}
              <Text style={styles.txtTopicName}>
                {detail.topic?.name?.rawText}
              </Text>
            </Text>
            <Text style={{paddingTop: 5}}>
              <Text style={{color: '#00CBA7', fontWeight: 'bold'}}>
                iSofHcare{' '}
              </Text>
              <Text>
                | Ngày đăng {moment(detail?.createdAt).format('DD/MM/YYYY')}
              </Text>
            </Text>
            <Text style={{paddingTop: 5}}>
              Cập nhật lần cuối:{' '}
              {moment(detail?.lastUpdated).format('DD/MM/yyyy')}
            </Text>
            {detail?.authorRef?.fullName ? (
              <View>
                <Text style={styles.txtConsultation}>Tham vấn y khoa:</Text>
                <View style={styles.containerConsultation}>
                  <FastImage
                    source={
                      detail?.authorRef?.avatar
                        ? {
                            uri: detail?.authorRef?.avatar?.absoluteUrl() || '',
                          }
                        : require('@images/new/user.png')
                    }
                    style={styles.imgConsultation}
                  />
                  <View style={{flex: 1, paddingLeft: 10, paddingRight: 10}}>
                    <Text style={styles.txtNameConsultation}>
                      {detail?.authorRef?.fullName}
                    </Text>
                    <Text style={{color: '#00000060'}}>
                      {detail?.authorRef?.description}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
          {data.length ? (
            <View style={{backgroundColor: '#fff', marginTop: 10}}>
              <View style={styles.viewAds}>
                <Text style={styles.txAds}>Cùng chuyên mục</Text>
              </View>
              <FlatList
                contentContainerStyle={styles.listAds}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${item.newsId || index}`}
                data={data}
                style={{paddingBottom: 30}}
                ListFooterComponent={<View style={styles.viewFooter} />}
                renderItem={renderItem}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ActivityPanel>
  );
};
const styles = StyleSheet.create({
  readingTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    flexWrap: 'wrap',
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
    fontSize: 13,
  },
  containerTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtTime: {
    color: '#00000070',
    paddingBottom: 10,
  },
  txtNameConsultation: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  imgConsultation: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  containerConsultation: {
    backgroundColor: '#E3EBF7',
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    flexDirection: 'row',
    borderBottomLeftRadius: 40,
    marginRight: 15,
    padding: 10,
  },
  txtConsultation: {
    color: '#000',
    fontWeight: 'bold',
    paddingTop: 20,
    paddingBottom: 5,
    fontSize: 15,
  },
  txtTopicName: {
    fontWeight: 'bold',
    color: '#3161AD',
    textDecorationLine: 'underline',
  },
  buttonShare: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#00000050',
    alignSelf: 'flex-end',
    padding: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    marginRight: 10,
  },
  btxtTest: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonTest: {
    backgroundColor: '#3161AD',
    borderRadius: 6,
    alignSelf: 'center',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  txtLabel: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#00000070',
  },
  containerButton: {
    backgroundColor: '#FFF',
    margin: 15,
    borderRadius: 5,
    padding: 15,
  },
  imageNews: {
    height: 200,
    width: '100%',
    alignSelf: 'center',
  },
  txtTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  containerTitle: {
    backgroundColor: '#FFF',
    padding: 15,
  },
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: '#FFF',
  },
  viewAds: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txAds: {
    padding: 12,
    paddingLeft: 20,
    paddingBottom: 5,
    color: '#000',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 16,
  },
  listAds: {paddingHorizontal: 20},
  viewFooter: {width: 35},
  cardView: {
    borderRadius: 6,
    marginRight: 10,
    borderColor: '#9B9B9B',
    borderWidth: 0.5,
    backgroundColor: '#fff',
    height: 134,
    width: 259,
  },
  txContensHospital: {color: '#000', margin: 13, marginLeft: 5, maxWidth: 259},
});
export default DetailNewsScreen;
