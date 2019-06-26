import React, { Component } from 'react';
import { View, Text,TouchableOpacity,FlatList,StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';

export default class TopDrug extends Component {
  constructor(props) {
    super(props);
    this.state = {
        dataDrug:[{
            name:'Panadol',
            ratting:5,
            price:90000,
            pricePromotion:160000
        }]
    };
  }
  renderItem = ({item,index}) =>{
      return(
          <View>
              <ScaledImage></ScaledImage>
          </View>
      )
  }
  render() {
    return (
      <View>
        <View><Text>Sản phẩm thuốc bán chạy</Text><Text>Xem tất cả>></Text></View>
        <FlatList
        data = {this.state.dataDrug}
        extraData = {this.state}
        renderItem={this.renderItem}
        keyExtractor = {(item,index) => index.toString()}
        horizontal={true}
        >

        </FlatList>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container:{

    }
})