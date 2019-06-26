import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
import { connect } from 'react-redux';
import { Card } from 'native-base';
import drugProvider from '@data-access/drug-provider'
import StarRating from 'react-native-star-rating';
import DrugItem from './DrugItem'


class TopDrug extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDrug: [],
      dataDrug2: []
    };
  }
  componentDidMount() {
    this.getListData()
  }
  getListData = () => {
    drugProvider.getListDrug().then(res => {
      if (res.code == 0) {
        this.setState(
          {
            dataDrug: res.data.medicines
          }
        )
      }
    }).catch(err => {
      console.log(err)
    })
  }
  renderItem = (item, index) => {
    console.log(item, index, 'item,index)')
    return (
      <DrugItem item={item} index={index} />
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.viewTitle}><Text style={{color:'#000'}}>{'Sản phẩm thuốc bán chạy'.toUpperCase()}</Text><Text style={{color:'#4BBA7B'}}>Xem tất cả>></Text></View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
          <View style={{ width: 190 * this.state.dataDrug.length / 2, flexWrap: 'wrap', flexDirection: 'row' }}>
            {this.state.dataDrug && this.state.dataDrug.map((item, index) => this.renderItem(item, index))}
          </View>
        </ScrollView>
        {/*         
        <FlatList
          style={styles.flatList}
          data={this.state.dataDrug}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}          
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
        </FlatList> */}

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
  },
  viewTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  flatList: {
    top: 0
  },
  flatList2: {
  }
})
function mapStateToProps(state) {
  return {
    userApp: state.userApp,
    navigation: state.navigation
  };
}

export default connect(mapStateToProps, null, null, { withRef: true })(TopDrug);