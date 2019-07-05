import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
import { connect } from 'react-redux';
import { Card } from 'native-base';
import drugProvider from '@data-access/drug-provider'
import StarRating from 'react-native-star-rating';
import DrugItem from './DrugItem'
import HeaderLine from '@components/home/HeaderLine'
import NavigationService from "@navigators/NavigationService";

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
      this.setState(
        {
          dataDrug: res
        }
      )
    }).catch(err => {
      console.log(err)
    })
  }
  renderItem = (item, index) => {
    return (
      <DrugItem widthImg={180} item={item} index={index} key={index} />
    )
  }
  showAllDrug = () => {
    NavigationService.navigate('drug')
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.countReset) {
      this.getListData()
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.viewTitle}><View>       */}
        <HeaderLine onPress={this.showAllDrug} title={Dimensions.get("window").width < 375 ? 'SẢN PHẨM\nTHUỐC BÁN CHẠY' : 'SẢN PHẨM THUỐC BÁN CHẠY'} isShowViewAll={true} />
        {/* <Text style={{color:'#000',fontWeight:'600'}}>{'Sản phẩm thuốc bán chạy'.toUpperCase()}</Text>
        </View><Text style={{color:'#4BBA7B'}}>Xem tất cả>></Text></View> */}
        {this.state.dataDrug ? (<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ width: 190 * Math.round(this.state.dataDrug.length / 2), flexWrap: 'wrap', flexDirection: 'row' }}>
            {this.state.dataDrug && this.state.dataDrug.slice(0, 20).map((item, index) => this.renderItem(item, index))}
          </View>
        </ScrollView>) : (<ActivityIndicator></ActivityIndicator>)}


      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff'
  },
  viewTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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