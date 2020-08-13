import * as React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import BloodPressure from './BloodPressure';
import BmiAndBsa from './BmiAndBsa';
import Temperature from './Temperature';

export default class TabMonitoringHealth extends React.Component {
  state = {
    index: 0,
    routes: [
      {key: 'bmiAndBsa', title: 'BMI & BSA'},
      {key: 'bloodPressure', title: 'HUYẾT ÁP'},
      {key: 'temperature', title: 'NHIỆT ĐỘ'},
    ],
  };

  _handleIndexChange = index => this.setState({index});

  _renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    const currentIndex = props.navigationState.index;

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity key={i} onPress={() => this.setState({index: i})}>
              <Animated.View
                style={[
                  styles.buttonTab,
                  {
                    borderBottomColor:
                      currentIndex == i ? '#3161AD' : '#00000000',
                  },
                ]}>
                <Animated.Text
                  style={[
                    currentIndex == i
                      ? {color: '#3161AD', fontWeight: 'bold'}
                      : {color: '#000000'},
                  ]}>
                  {route.title}
                </Animated.Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = SceneMap({
    bloodPressure: BloodPressure,
    bmiAndBsa: BmiAndBsa,
    temperature: Temperature,
  });

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        swipeEnabled={false}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  buttonTab: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginRight: 15,
  },
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomColor: '#00000060',
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});
