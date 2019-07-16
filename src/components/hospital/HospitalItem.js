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
class HospitalItem extends Component {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    console.log('renderrrrrrrrr');
  }

  render() {
    const item = this.props.item;
    const index = this.props.index;
    let imageWidth = this.props.widthImg;
    let imageHeight = imageWidth / 1.5;
    return (
      <View key={index} style={styles.viewItem}>
        <View style={[{
          width: imageWidth, height: imageHeight,
          borderRadius: 4, marginBottom: 50
        }, item.imageHome ? {} : { borderColor: 'rgba(151, 151, 151, 0.29)', borderWidth: 0.5, }]}>
          <Image
            resizeMode="cover"
            //   source={require('@images/new/home/banner_drug_test.png')}
            source={{ uri: item.imageHome ? item.imageHome.absoluteUrl() : '' }}

            style={[styles.customImg, { width: imageWidth, height: imageHeight }]}
          />
          {this.props.isHopitalNear ? (
            parseFloat(item.distance) < 1 ? <View style ={styles.viewDistance}><Text style={{color:'#fff',fontSize:12}}>{(parseFloat(item.distance).toFixed(2) * 1000)+' m'}</Text></View> : <View style ={styles.viewDistance}><Text style={{color:'#fff',fontSize:12}}>{parseFloat(item.distance).toFixed(1) + 'km'}</Text></View> )
           : (null)}
        </View>
        <Card style={[styles.viewDetails]}>
          <Text style={styles.nameHospital} numberOfLines={2}>{item.name}</Text>
      
          <View style={styles.viewStar}>
            <StarRating
              disabled={true}
              starSize={12}
              maxStars={5}
              rating={item.rankHospital}
              starStyle={{ margin: 1 }}
              fullStarColor={"#fbbd04"}
              emptyStarColor={"#fbbd04"}
            />
            <Text style={{ fontSize: 12, color: '#000' }}>Xem thêm</Text>
          </View>
        </Card>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
  },
  viewStar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewDistance:{position: 'absolute',top:10,right:10,backgroundColor:'rgba(0, 0, 0, 0.5)',borderRadius:2,paddingHorizontal:2},
  customImg: {
    borderRadius: 4, borderColor: 'rgba(151, 151, 151, 0.29)', borderWidth: 0.5,
  },
  nameHospital: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4BBA7B',
    minHeight: 40

  },

  imgStyle: { borderRadius: 4, backgroundColor: '#fff', },
  viewItem: {
    padding: 5,
    alignItems: 'center',
    position: 'relative'
  },
  viewDetails: {
    borderRadius: 4,
    marginHorizontal: 5,
    padding: 5,
    position: 'absolute',
    bottom: 0,
    left: 8, right: 8
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

  }
});
export default HospitalItem;