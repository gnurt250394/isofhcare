import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ImageLoad from 'mainam-react-native-image-loader';
import StarRating from 'react-native-star-rating';
import ScaleImage from 'mainam-react-native-scaleimage';
import ReadMoreText from '@components/ReadMoreText';
const {width, height} = Dimensions.get('window');
const DetailServiceScreen = ({navigation}) => {
  const item = navigation.getParam('item', {});
  const hospital = navigation.getParam('hospital', {});
  console.log('hospital: ', hospital);
  console.log('item: ', item);
  const _text = useRef(null);
  const [description, setDescription] = useState('');
  const [state, setState] = useState({
    data: [],
    measured: false,
    shouldShowReadMore: false,
    showAllText: false,
  });
  const onSelected = () => {
    navigation.navigate('addBooking1', {
      listServicesSelected: [item],
      hospital: hospital,
    });
  };

  const renderDescription = item => {
    return (
      <ReadMoreText numberOfLines={4}>
        <Text style={styles.txtDescription}>{item.description}</Text>
      </ReadMoreText>
    );
  };
  const keyExtractor = (item, index) => `${index}`;
  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          paddingVertical: 10,
        }}>
        <View style={styles.lineTop} />
        <Text style={styles.txtNameRating}>{item.name}</Text>
        <StarRating
          disabled={true}
          starSize={11}
          containerStyle={{width: '20%'}}
          maxStars={5}
          rating={item.rating}
          starStyle={{margin: 1, marginVertical: 7}}
          fullStarColor={'#fbbd04'}
          emptyStarColor={'#fbbd04'}
          fullStar={require('@images/ic_star.png')}
          emptyStar={require('@images/ic_empty_star.png')}
          halfStar={require('@images/half_star.png')}
        />
        <Text numberOfLines={3}>{item.comment}</Text>
      </View>
    );
  };
  const goToHospital = () => {
    navigation.navigate('profileHospital', {
      item: item.hospital,
      disableBooking: true,
    });
  };
  const disablePromotion = promotion => {
    let dayOfWeek = {
      0: 6,
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5,
    };
    let startDate = new Date(promotion.startDate);
    let endDate = new Date(promotion.endDate);
    let day = new Date();
    let isDayOfWeek =
      promotion.dateRepeat | Math.pow(2, dayOfWeek[day.getDay()]);
    if (startDate < day && endDate > day && isDayOfWeek != 0) {
      return true;
    }
    return false;
  };
  const renderPromotion = promotion => {
    let text = '';
    if (promotion.type == 'PERCENT') {
      text = promotion.value + '%';
    } else {
      // let value = (promotion?.value || 0).toString()
      // if (value.length > 5) {
      //     text = value.substring(0, value.length - 3) + 'K'
      // } else {
      text = promotion.value.formatPrice() + 'đ';

      // }
    }
    return text;
  };
  const renderPricePromotion = item => {
    let text = 0;
    if (item.promotion.type == 'PERCENT') {
      text =
        item.monetaryAmount.value -
        (item.monetaryAmount.value * (item.promotion.value / 100) || 0);
    } else {
      text = item.monetaryAmount.value - item.promotion.value || 0;
    }
    if (text < 0) {
      return 0;
    }
    return text.formatPrice();
  };
  const url = item.image
    ? {uri: item.image}
    : require('@images/new/ic_default_service.png');
  const source = item.hospital.imagePath
    ? {uri: item.hospital.imagePath}
    : require('@images/new/user.png');
  return (
    <ActivityPanel title="Chi tiết dịch vụ khám">
      <ScrollView>
        <View style={{paddingLeft: 25}}>
          <View style={styles.ContainerNameService}>
            <View style={styles.flex}>
              <Text style={styles.txtService}>{item?.name}</Text>
              <Text onPress={goToHospital} style={styles.txtHospital}>
                {item?.hospital?.name}
              </Text>
            </View>
            <TouchableOpacity onPress={goToHospital}>
              <ImageLoad
                resizeMode="cover"
                imageStyle={styles.borderImgProfile}
                borderRadius={25}
                customImagePlaceholderDefaultStyle={[
                  styles.avatar,
                  styles.placeHolderImgProfile,
                ]}
                placeholderSource={require('@images/new/user.png')}
                resizeMode="cover"
                loadingStyle={{size: 'small', color: 'gray'}}
                source={source}
                style={styles.imgProfile}
                defaultImage={() => {
                  return (
                    <ScaleImage
                      resizeMode="cover"
                      source={require('@images/new/user.png')}
                      width={40}
                      height={40}
                    />
                  );
                }}
              />
            </TouchableOpacity>
          </View>
          <Image source={url} style={styles.imgService} />
          {item?.promotion?.value && disablePromotion(item.promotion) ? (
            <View style={styles.groupPrice}>
              <Text style={styles.txtPriceFinal}>
                {renderPricePromotion(item)} đ
              </Text>
              <Text style={styles.txtPriceUnit}>
                {item?.monetaryAmount?.value?.formatPrice()} đ
              </Text>

              <Text style={styles.txtVoucher}>
                Giảm {renderPromotion(item.promotion)}
              </Text>
            </View>
          ) : (
            <View style={styles.groupPrice}>
              <Text style={styles.txtPriceFinal}>
                {item?.monetaryAmount?.value?.formatPrice()} đ
              </Text>
            </View>
          )}

          {/* <Text style={[styles.txtlabel, { paddingTop: 0 }]}>Khuyến mại</Text>
                    <Text>Thời gian hiệu lực: <Text style={{
                        color: "#00000080"
                    }}>12h -14h các ngày 20/12/2019 - 22/12/2019</Text></Text>
                    <Text>Các ngày áp dụng trong tuần: <Text style={{
                        color: "#00BA99",
                        fontWeight: 'bold'
                    }}>T2, T3, T4, T5, T6, T7, CN</Text></Text> */}
        </View>

        {/** rating */}
        {/* <View style={styles.groupBookingRating}>
                    <View style={styles.groupBooking}>
                        <Text style={styles.txtBooking}>Lượt đặt khám</Text>
                        <Text>100</Text>
                    </View>
                    <View style={styles.groupBooking}>
                        <Text style={styles.txtBooking}>Lượt tư vấn</Text>
                        <Text>100</Text>
                    </View>
                    <View style={styles.groupRating}>
                        <Text style={styles.txtBooking}>Đánh giá</Text>
                        <Text style={styles.txtNumbberRating}>100</Text>
                    </View>
                </View> */}
        <View style={styles.containerDetail}>
          <Text style={styles.txtlabel}>Mô tả chi tiết</Text>
          {renderDescription(item)}
        </View>

        {/** rating */}
        {/* <View style={{
                    padding: 20,
                    borderTopColor: '#f2f2f2',
                    borderBottomColor: '#f2f2f2',
                    borderTopWidth: 10,
                    borderBottomWidth: 10,
                    marginTop: 20
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{
                            color: '#00BA99',
                            fontWeight: 'bold',
                            fontSize: 15
                        }}>ĐÁNH GIÁ</Text>
                        <Text>22 luot</Text>
                    </View>
                    <FlatList
                        data={state.data}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                    />
                </View> */}
      </ScrollView>
      <View style={styles.containerButtonSelect}>
        <Text style={styles.txtTitleSelect}>
          Bạn muốn chọn dịch vụ khám này?
        </Text>
        <TouchableOpacity onPress={onSelected} style={styles.buttonSelect}>
          <Text style={styles.txtSelect}>CHỌN</Text>
        </TouchableOpacity>
      </View>
    </ActivityPanel>
  );
};

export default DetailServiceScreen;

const styles = StyleSheet.create({
  txtLabelRating: {
    color: '#00BA99',
    fontWeight: 'bold',
    fontSize: 15,
  },
  groupLabelRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerRating: {
    padding: 20,
    borderTopColor: '#f2f2f2',
    borderBottomColor: '#f2f2f2',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    marginTop: 20,
  },
  txtNameRating: {
    color: '#000',
    fontWeight: 'bold',
    paddingTop: 10,
  },
  lineTop: {
    height: 0.5,
    width: '98%',
    alignSelf: 'center',
    backgroundColor: '#00000070',
  },
  txtDescription: {
    color: '#00000090',
  },
  txtNumbberRating: {
    color: '#00BA99',
    fontWeight: 'bold',
  },
  groupBookingRating: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  txtVoucher: {
    paddingLeft: 10,
    color: '#FF7A00',
    fontWeight: 'bold',
  },
  txtPriceUnit: {
    color: '#000000',
    paddingLeft: 10,
    textDecorationLine: 'line-through',
  },
  txtPriceFinal: {
    color: '#00BA99',
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  txtHospital: {
    textDecorationLine: 'underline',
    color: '#00000090',
    paddingBottom: 10,
  },
  ContainerNameService: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  txtBooking: {
    color: '#00000090',
  },
  groupRating: {
    alignItems: 'center',
    flex: 1,
  },
  groupBooking: {
    alignItems: 'center',
    flex: 1,
    borderRightColor: '#00000050',
    borderRightWidth: 1,
  },
  flex: {
    flex: 1,
  },
  imgProfile: {
    alignSelf: 'center',
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  placeHolderImgProfile: {width: 50, height: 50},
  borderImgProfile: {
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: 'rgba(151, 151, 151, 0.29)',
  },
  imgService: {
    height: 200,
    width: width - 50,
    resizeMode: 'contain',
  },
  txtlabel: {
    color: '#000',
    paddingTop: 20,
    fontWeight: 'bold',
  },
  containerDetail: {
    paddingHorizontal: 25,
  },
  txtPrice: {
    color: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: 15,
  },
  txtService: {
    color: '#3161AD',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 6,
    paddingTop: 25,
  },
  txtSelect: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSelect: {
    backgroundColor: '#00CBA7',
    height: 42,
    alignSelf: 'center',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginBottom: 10,
  },
  txtTitleSelect: {
    color: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: 12,
    paddingLeft: 21,
    fontStyle: 'italic',
  },
  containerButtonSelect: {
    backgroundColor: '#FFF',
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
});
