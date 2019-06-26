import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
import { connect } from 'react-redux';
import { Card } from 'native-base';
import drugProvider from '@data-access/drug-provider'
import StarRating from 'react-native-star-rating';
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
        <Image
          resizeMode="cover"
          //   source={require('@images/new/home/banner_drug_test.png')}
          source={{ uri: item.image.absoluteUrl() }}

          style={[styles.customImg, { width: 180, height: 100 }]}
        />
        <Card style={styles.viewDetails}>
          <View style={styles.viewContents}><Text style={styles.txName}>{item.name}</Text><Text style={styles.underLine}><Text style={styles.txPriceOld}>{item.priceOld}đ</Text></Text></View>
          <View style={styles.viewContents}><StarRating
            disabled={true}
            starSize={12}
            maxStars={5}
            rating={item.rate}
            starStyle={{ margin: 2 }}
            fullStarColor={"#fbbd04"}
            emptyStarColor={"#fbbd04"}
          /><Text style={styles.txPriceNew}>{item.priceNew}đ</Text></View>
          <View style={styles.viewContents}>
            <TouchableOpacity style={styles.btnStore}>
              <ScaledImage height={14} source={require('@images/new/home/ic_store.png')}></ScaledImage>
              <Text style={styles.txStore}>Đặt hàng ngay</Text>
              <ScaledImage height={4} style={{marginLeft:2}} source={require('@images/new/home/ic_next2.png')}></ScaledImage>
            </TouchableOpacity>
            {
              item.isPropose ?
                <ScaledImage height={15} source={require('@images/new/home/ic_hearth.png')}></ScaledImage> : null
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
    height: 200,
  },
  viewDetails: {
    borderRadius: 4,
    marginHorizontal: 5,
    padding: 5,
    position: 'relative',
    bottom: 30,
    width: 170
  },
  viewContents: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btnStore: {
    flexDirection: 'row',
    backgroundColor: '#4BBA7B',
    justifyContent: 'center',
    alignItems: 'center',
    height: 31,
    borderRadius: 4,
    padding: 5
  },
  txStore: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 5
  },
  txName: {
    fontSize: 18,
    color: '#4BBA7B',
    fontWeight: '500',
  },
  txPriceNew: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FF0000'
  },
  txPriceOld: {
    color: '#929292',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#FF0000'
  },
  underLine: {

  },
});
export default DrugItem;