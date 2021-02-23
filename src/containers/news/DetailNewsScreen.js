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
const {width, height} = Dimensions.get('window');
const DetailNewsScreen = ({navigation}) => {
  const item = navigation.getParam('item', {});
  const [data, setData] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [detail, setDetail] = useState(item);

  const [content, setContent] = useState('');
  const [idCategories, setIdCategories] = useState(detail?.topic?.topicId);
  useEffect(() => {
    // getServiceHighLight()
    getNews();
    getList();
  }, [detail.newsId]);
  console.log('detail: ', detail);
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
    if (detail?.createdDate) {
      let time = detail?.createdDate?.substring(0, 10);
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
    return (
      <TouchableOpacity onPress={goToDetailService(item)} style={{flex: 1}}>
        <View style={styles.cardView}>
          <FastImage
            source={{uri: item?.images?.[0]?.downloadUri?.absoluteUrl() || ''}}
            style={{
              borderRadius: 6,
              resizeMode: 'cover',
              width: 'auto',
              height: 134,
            }}
          />
        </View>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.txContensHospital}>
          {item?.title?.rawText}
        </Text>
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
    console.log('shareLinkContent: ', shareLinkContent);
    ShareDialog.canShow(shareLinkContent)
      .then(function(canShow) {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }
      })
      .then(
        function(result) {
          if (result.isCancelled) {
            console.log('Share cancelled');
          } else {
            console.log('Share success with postId: ' + result.postId);
          }
        },
        function(error) {
          console.log('Share fail with error: ' + error);
        },
      );
  };
  return (
    <ActivityPanel isLoading={isLoading} title="Nội dung chi tiết">
      <ScrollView style={styles.container}>
        <View style={styles.flex}>
          <View style={styles.containerTitle}>
            <Text style={styles.txtTitle}>{detail?.title?.rawText}</Text>
            <Text
              style={{
                color: '#00000070',
                paddingBottom: 10,
              }}>
              {getTime()}
            </Text>
            <FastImage
              source={{
                uri: detail?.images?.[0]?.downloadUri?.absoluteUrl() || '',
              }}
              style={styles.imageNews}
            />
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
                      <FastImage
                        resizeMode={'contain'}
                        source={{uri: htmlAttribs.src}}
                        style={{
                          width: width - 30,
                          height: parseInt(htmlAttribs.height) || 150,
                          resizeMode: 'contain',
                        }}
                      />
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
                | Ngày đăng{' '}
                {detail?.topic?.createdAt
                  ?.toDateObject('-')
                  .format('dd/MM/yyyy')}
              </Text>
            </Text>
            <Text style={{paddingTop: 5}}>
              Cập nhật lần cuối:{' '}
              {detail?.topic?.lastModified
                ?.toDateObject('-')
                .format('dd/MM/yyyy')}
            </Text>
          </View>
          {data.length ? (
            <View style={{backgroundColor: '#fff', marginTop: 10}}>
              <View style={styles.viewAds}>
                <Text style={styles.txAds}>Bài viết liên quan</Text>
              </View>
              <FlatList
                contentContainerStyle={styles.listAds}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${item.newsId || index}`}
                data={data}
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
