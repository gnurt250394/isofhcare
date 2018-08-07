import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import Button from 'react-native-button';
import ScalingDrawer from 'react-native-scaling-drawer';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'red',
  },
});
let defaultScalingDrawerConfig = {
  scalingFactor: 0.6,
  minimizeFactor: 0.6,
  swipeOffset: 20
};
class DrawerContent extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  }

  static contextTypes = {
    drawer: PropTypes.object,
  }

  
  render() {
    return (
      <ScalingDrawer
        ref={ref => this._drawer = ref}
        content={ <View style={[styles.container, { backgroundColor: '#000' }]}>
        {/* <Text>Drawer Content</Text>
      <Button onPress={Actions.closeDrawer}>Back</Button> */}
        <Text>Title: {this.props.title}</Text>
        <Button onPress={Actions.tab_1} onPress={() => { Actions.login3() }}>Switch to tab1</Button>
        <Button onPress={Actions.tab_2} onPress={() => { Actions.login4() }}>Switch to tab2</Button>
      </View >}
        {...defaultScalingDrawerConfig}
        onClose={() => console.log('close')}
        onOpen={() => console.log('open')}
      >
        <View style={[styles.container, { backgroundColor: '#000' }]}>
          {/* <Text>Drawer Content</Text>
        <Button onPress={Actions.closeDrawer}>Back</Button> */}
          <Text>Title: {this.props.title}</Text>
          <Button onPress={Actions.tab_1} onPress={() => { Actions.login3() }}>Switch to tab1</Button>
          <Button onPress={Actions.tab_2} onPress={() => { Actions.login4() }}>Switch to tab2</Button>
        </View >
      </ScalingDrawer>
    );
  }
}

export default DrawerContent;
