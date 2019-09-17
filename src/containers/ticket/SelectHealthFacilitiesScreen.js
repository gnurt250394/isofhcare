import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { IndicatorViewPager } from "mainam-react-native-viewpager";
import GetNewTicket from '@components/ticket/GetNewTicket'
import TicketHistory from '@components/ticket/TicketHistory'
import constants from '@resources/strings';

export default class SelectHealthFacilitiesScreen extends Component {
  constructor(props) {
    super(props);
    let tabIndex = 0;
    if (this.props.navigation.state.params && this.props.navigation.state.params.selectTab)
      tabIndex = this.props.navigation.state.params.selectTab;
    this.state = {
      isGetNewTicket: true,
      tabIndex,
    };
  }
  onGetNewTicket = () => {
    if (this.viewPager) this.viewPager.setPage(0);
  }
  onGetHistory = () => {
    if (this.viewPager) this.viewPager.setPage(1);
  }
  swipe(targetIndex) {
    if (this.viewPager) this.viewPager.setPage(targetIndex);

  }
  componentWillReceiveProps(props) {
    if (props.navigation.state && props.navigation.state.params && props.navigation.state.params.selectTab && this.state.requestTime != props.navigation.state.params.requestTime) {
      this.setState({ requestTime: props.navigation.state.params.requestTime }, () => {
        if (this.viewPager) {
          this.viewPager.setPage(1);
          if (this.history) {
            try {
              this.history.onRefresh();
            } catch (error) {

            }
          }
        }
      })
    }
  }
  onPageScroll(e) {
    var tabIndex = e.position;
    var offset = e.offset * 100;
    if (tabIndex == -1 || (tabIndex == 1 && offset > 0)) return;
    this.setState({
      isGetNewTicket: tabIndex == 0
    });
  }
  componentDidMount() {
    if (this.viewPager)
      this.viewPager.setPage(this.state.tabIndex);
  }
  render() {
    return (
      <ActivityPanel
        title={constants.title.select_CSYT}
        showFullScreen={true} isLoading={this.state.isLoading}>
        <View style={styles.viewBtn}>
          <View style={styles.separateBackground}></View>
          <TouchableOpacity onPress={this.onGetNewTicket} style={[styles.btnGetNumber, this.state.isGetNewTicket ? { backgroundColor: '#27AE60' } : {}]}>
            <Text style={this.state.isGetNewTicket ? styles.unSelected : styles.selected}>{constants.title.get_new_ticket}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onGetHistory} style={[styles.btnGetNumber, , this.state.isGetNewTicket ? {} : { backgroundColor: '#27AE60' }]}>
            <Text style={this.state.isGetNewTicket ? styles.selected : styles.unSelected}>{constants.title.history_get_ticket}</Text>
          </TouchableOpacity>
        </View>
        <IndicatorViewPager style={styles.flex}
          ref={viewPager => {
            this.viewPager = viewPager;
          }}
          onPageScroll={this.onPageScroll.bind(this)}>
          <View style={styles.flex}>
            <GetNewTicket></GetNewTicket>
          </View>
          <View style={styles.flex}>
            <TicketHistory ref={ref => this.history = ref}></TicketHistory>
          </View>

        </IndicatorViewPager>
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  selected: {
    color: '#27AE60',
    fontWeight: "bold",
  },
  unSelected: {
    color: '#fff',
    fontWeight: "bold",
  },
  AcPanel: {
    flex: 1,
    backgroundColor: '#cacaca',
  },
  viewBtn: {
    flexDirection: 'row',
    height: 40,
    margin: 10,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    position: 'relative'
  },
  separateBackground:
  {
    borderColor: "#27ae60",
    borderWidth: 1,
    borderRadius: 6,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0
  },
  btnGetNumber: {
    alignItems: 'center', paddingVertical: 8, justifyContent: 'center', flex: 1, borderRadius: 6, overflow: 'hidden'
  },
})
