import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Keyboard,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import {Card} from 'native-base';
import ImageLoad from 'mainam-react-native-image-loader';
import CustomMenu from '@components/CustomMenu';
import questionProvider from '@data-access/question-provider';
import {withNavigation} from 'react-navigation';
const icSupport = require('@images/new/user.png');
const {height, width} = Dimensions.get('screen');

const RenderProfile = ({item, navigation}) => {
  const [isShow, setIsShow] = useState(false);
  const [textShow, setTextShow] = useState(false);
  const [data, setData] = useState({});
  const scrollRef = useRef();
  const source = item?.userInfo?.image
    ? {uri: item?.userInfo?.image}
    : icSupport;
  const showMenu = () => {
    setIsShow(true);
  };
  const hideMenu = () => {
    setIsShow(false);
  };
  const reportMessage = () => {
    hideMenu();
  };
  const hideMessage = () => {
    hideMenu();
  };

  const onShowText = () => {
    setTextShow(state => {
      if (state && scrollRef.current) {
        setTimeout(() => {
          scrollRef.current.scrollTo({y: 0});
        }, 500);
      }
      return !state;
    });
  };

  const onLayout = event => {
    const {height} = event.nativeEvent.layout;
    console.log('height: ', height);
    if (height > 80) {
      showMenu();
    }
  };
  const showImage = i => () => {
    navigation.navigate('photoViewer', {
      index: i,
      urls: item.images.map(item => {
        return {uri: item};
      }),
    });
  };
  return (
    <View style={[styles.containerItem]}>
      <View style={styles.containerMessage}>
        <View style={styles.containerName}>
          <ImageLoad
            resizeMode="cover"
            imageStyle={styles.boderImage}
            borderRadius={25}
            customImagePlaceholderDefaultStyle={styles.imgPlaceHoder}
            placeholderSource={icSupport}
            style={styles.avatar}
            loadingStyle={{size: 'small', color: 'gray'}}
            source={source}
            defaultImage={() => {
              return (
                <ScaleImage
                  resizeMode="cover"
                  source={icSupport}
                  width={50}
                  style={styles.imgDefault}
                />
              );
            }}
          />
          <View style={{flex: 1, paddingLeft: 10, paddingTop: 3}}>
            <Text numberOfLines={1} style={styles.txtname}>
              {item?.gender == 1 ? 'Nam' : item.gender == 0 ? 'Nữ' : 'Ẩn danh'},{' '}
              {item?.age} tuổi
            </Text>
            <Text style={styles.txtTime}>
              {item.createdAt.toDateObject('-').format('dd/MM/yyyy')}{' '}
            </Text>
          </View>
          {/* <CustomMenu
            MenuSelectOption={
              <View style={styles.buttonMenu}>
                <ScaleImage
                  source={require('@images/new/ic_more.png')}
                  height={12}
                  style={{resizeMode: 'contain'}}
                />
              </View>
            }
            options={[
              {value: 'Báo cáo bài viết', id: 1},
              {value: 'Ẩn bài viết', id: 2},
            ]}
            onSelected={(e, i) => {
              console.log('i: ', i);
              console.log('e: ', e);
            }}
          /> */}
        </View>

        <View>
          <Text
            // onLayout={onLayout}
            numberOfLines={textShow ? undefined : 3}
            style={styles.txtMessage}>
            {item.content}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            {textShow && item?.images?.length
              ? item.images.map((e, i) => {
                  return (
                    <TouchableOpacity key={i} onPress={showImage(i)}>
                      <Image source={{uri: e}} style={styles.imgQuestion} />
                    </TouchableOpacity>
                  );
                })
              : null}
          </View>
        </View>
        <View style={styles.containerSpecialist}>
          {item.specializations.length ? (
            <Text
              numberOfLines={textShow ? undefined : 1}
              style={styles.groupSpecialist}>
              {item.specializations.length
                ? item.specializations.map((e, i) => {
                    return (
                      <Text
                        key={i}
                        style={styles.txtSpecialist}
                        numberOfLines={1}>
                        {e.specializationName}
                        {i != item.specializations.length - 1 ? ', ' : ''}
                      </Text>
                    );
                  })
                : null}
            </Text>
          ) : (
            <View />
          )}
          <TouchableOpacity onPress={onShowText} style={styles.buttonHide}>
            <Text style={styles.txtHide}>
              {!textShow ? 'Xem thêm' : 'Rút gọn'}
            </Text>
            <ScaleImage
              style={{
                tintColor: '#00000070',
                transform: [{rotate: !textShow ? '0deg' : '180deg'}],
              }}
              source={require('@images/new/down.png')}
              height={9}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imgQuestion: {
    width: width / 4,
    height: width / 4,
    marginTop: 5,
    marginRight: 5,
  },
  txtHide: {
    color: '#00000070',
    fontStyle: 'italic',
    paddingRight: 7,
  },
  buttonHide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupSpecialist: {
    backgroundColor: '#00BA99',
    borderRadius: 4,
    padding: 5,
    maxWidth: '60%',
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  containerSpecialist: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 7,
    paddingBottom: 14,
  },
  buttonAnwser: {
    // alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  containerMenu: {
    backgroundColor: '#FFF',
    elevation: 3,
    position: 'absolute',
    top: 20,
    right: 10,
    paddingLeft: 20,
    paddingRight: 10,
    zIndex: 1000,
  },
  hisSlop: {
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
  },
  buttonMenu: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 10,
  },
  txtAllQuestion: {
    color: '#000',
    fontWeight: 'bold',
    paddingTop: 15,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  containerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  txtTime: {
    color: '#888',
    fontSize: 13,
    fontStyle: 'italic',
  },
  containerName: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 3,
    paddingBottom: 5,
  },
  txtSpecialist: {
    color: '#FFF',
    fontWeight: '500',
  },
  txtMessage: {
    color: '#000',
  },
  txtname: {
    color: '#3161AD',
    fontWeight: 'bold',
    fontSize: 15,
    // flex: 1,
    paddingRight: 10,
  },
  containerMessage: {
    paddingLeft: 10,
    flex: 1,
    flexDirection: 'column',
  },
  containerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: '#ebf1fa',
  },
  imgDefault: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
  boderImage: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatar: {
    width: 50,
    height: 50,
    alignSelf: 'flex-start',
  },
  imgPlaceHoder: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
});
export default withNavigation(RenderProfile);
