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

componentDidMount(){
    console.log('renderrrrrrrrr');
}

  render() {
    const item = this.props.item
    const index= this.props.index
    return (
      <View key = {index} style={styles.viewItem}>
        <Image
          resizeMode="cover"
          //   source={require('@images/new/home/banner_drug_test.png')}
          source={{ uri: item.imageHome ? item.imageHome.absoluteUrl() : ''}}

          style={[styles.customImg, { width:this.props.widthImg, height: 100 }]}
        />
        <Card style={[styles.viewDetails,{width:this.props.widthCard}]}>
        <Text style={styles.nameHospital}>{item.name}</Text>
        <View style={styles.viewStar}>
        <StarRating
            disabled={true}
            starSize={12}
            maxStars={5}
            rating={item.rankHospital}
            starStyle={{ margin: 2 }}
            fullStarColor={"#fbbd04"}
            emptyStarColor={"#fbbd04"}
          />
          <Text style={{fontSize:12,color:'#000'}}>Xem thêm</Text>
        </View>
        </Card>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
  },
  viewStar:{
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between'
  },
  customImg: {
    borderRadius: 4
  },
  nameHospital:{
    fontSize:15,
    fontWeight:'600',
    color:'#4BBA7B'

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
export default HospitalItem;