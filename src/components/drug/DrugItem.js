import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
import { connect } from 'react-redux';
import { Card } from 'native-base';
import drugProvider from '@data-access/drug-provider'
import StarRating from 'react-native-star-rating';
import stringUtils from "mainam-react-native-string-utils";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
class DrugItem extends Component {
  constructor(props) {
    super(props)

  }



  render() {
    const item = this.props.item
    const index = this.props.index
    return (
      <View key={index} style={styles.viewItem}>
        <View style={styles.view_image}>
          <Image
            resizeMode="cover"
            source={{ uri: item.image.absoluteUrl() }}
            style={[styles.customImg, { width: 180, height: 120 }]}
          />
        </View>
        <Card style={styles.viewDetails}>
          <View style={[styles.viewContents,{justifyContent:'space-between'}]}><Text  style={styles.txName}>{item.name && item.name.length > 30 ? item.name.substring(0,29) + "..."
                        : item.name}</Text><Text style={styles.underLine}><Text style={styles.txPriceOld}>{item.priceOld.formatPrice()}đ</Text></Text></View>
          <View style={[styles.viewContents,{justifyContent:'space-between'}]}><StarRating
            disabled={true}
            starSize={12}
            maxStars={5}
            rating={item.rate}
            starStyle={{ margin: 1 }}
            fullStarColor={"#fbbd04"}
            emptyStarColor={"#fbbd04"}
          /><Text style={styles.txPriceNew}>{item.priceNew.formatPrice()}đ</Text></View>
          <View style={styles.viewContents}>
            <TouchableOpacity style={styles.btnStore}>
              <ScaledImage height={14} source={require('@images/new/home/ic_store.png')}></ScaledImage>
              <Text style={styles.txStore}>Đặt hàng ngay</Text>
              <ScaledImage height={4} style={{ marginLeft: 5,marginTop:5 }} source={require('@images/new/home/ic_next2.png')}></ScaledImage>
            </TouchableOpacity>
            {
              item.isPropose ?
                <ScaledImage style={{marginHorizontal:12}} height={15} source={require('@images/new/home/ic_hearth.png')}></ScaledImage> : null
            }
          </View>
        </Card>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
  },
  flatList: {
  },
  customImg: {
    borderRadius: 4
  },
  imgStyle: { borderRadius: 4, backgroundColor: '#fff', },
  viewItem: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  viewDetails: {
    borderRadius: 4,
    marginHorizontal: 5,
    padding: 5,
    position: 'absolute',
    left: 8, right: 8,
    bottom: 0
  },
  viewContents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnStore: {
    flexDirection: 'row',
    backgroundColor: '#4BBA7B',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 31,
    borderRadius: 4,
    padding: 5,
    marginTop: 5,
  },
  txStore: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 5
  },
  txName: {
    flex: 1,
    fontSize: 14,
    color: '#4BBA7B',
    fontWeight: '500',
  },
  txPriceNew: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF0000'
  },
  txPriceOld: {
    fontSize: 11,
    color: '#929292',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#FF0000'
  },
  underLine: {

  },
  view_image: {
    width: 180, height: 120,
    borderRadius: 2,
    marginBottom: 70,
  }
});
export default DrugItem;