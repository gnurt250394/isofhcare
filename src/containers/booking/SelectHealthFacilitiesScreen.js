import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { IndicatorViewPager } from "mainam-react-native-viewpager";
import GetNewNumber from './GetNewNumber'
import GetHistoryNumber from './GetHistoryNumber'

export default class SelectHealthFacilitiesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGetNewNumber: true,
      tabIndex: 0,

    };
  }
  onGetNewNumber = () => {   
      if (this.viewPager) this.viewPager.setPage(0);
  }
  onGetHistory = () => {
      if (this.viewPager) this.viewPager.setPage(1);
  }
  swipe(targetIndex) {
    if (this.viewPager) this.viewPager.setPage(targetIndex);
   
  }
  onPageScroll(e) {
    var tabIndex = e.position;
    var offset = e.offset * 100;
    if (tabIndex == -1 || (tabIndex == 1 && offset > 0)) return;
    this.setState({
      isGetNewNumber: tabIndex==0
    });
    }
  render() {
    return (
      <ActivityPanel
        style={styles.AcPanel}
        title="Chọn CSYT"
        // titleStyle={{ marginRight: -10 }}

        containerStyle={{
          backgroundColor: "#f7f9fb"
        }}
        actionbarStyle={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.06)'
        }}
      // menuButton={
      //     <View style ={{width:15,marginLeft: 10
      //     }}>
      //     </View>
      //   }
      >
        <View style={styles.viewBtn}>
          <TouchableOpacity onPress={this.onGetNewNumber} style={[styles.btnGetNumber, this.state.isGetNewNumber ? { backgroundColor: '#27AE60' } : { backgroundColor: '#fff' }]}>
            <Text style={this.state.isGetNewNumber ? { color: '#fff' } : { color: '#27AE60' }}>Lấy số mới</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onGetHistory} style={[styles.btnGetNumber, , this.state.isGetNewNumber ? { backgroundColor: '#fff' } : { backgroundColor: '#27AE60' }]}>
            <Text style={this.state.isGetNewNumber ? { color: '#27AE60' } : { color: '#fff' }}>Lịch sử lấy số</Text>
          </TouchableOpacity>
        </View>
        <IndicatorViewPager style={{ flex: 1 }}
          ref={viewPager => {
            this.viewPager = viewPager;
          }}
          onPageScroll={this.onPageScroll.bind(this)}>
          <View style={{ flex: 1 }}>
            <GetNewNumber></GetNewNumber>
          </View>
          <View style={{ flex: 1 }}>
            <GetHistoryNumber></GetHistoryNumber>
          </View>

        </IndicatorViewPager>
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  AcPanel: {
    flex: 1,
    backgroundColor: '#cacaca',
  },
  viewBtn: { flexDirection: 'row', justifyContent: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: '#27AE60', borderRadius: 8, marginVertical: 20,},
  btnGetNumber: { alignItems: 'center', paddingVertical: 8, justifyContent: 'center', backgroundColor: '#27AE60', flex: 1 / 2, borderRadius: 8 }
})
