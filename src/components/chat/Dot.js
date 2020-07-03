import React from "react";
import { View ,StyleSheet} from "react-native";
import PropTypes from 'prop-types';


const getStyles = ({ x, y, radius, dotColor }) => ({
  left: x,
  top: y,
  width: radius * 2,
  height: radius * 2,
  borderRadius: radius,
  backgroundColor: dotColor
});

const Dot = (props) => (
  <View style={[styles.container, props.dotStyles, getStyles(props)]} />
);

const styles = StyleSheet.create({
  container: {
    position: "absolute"
  }
})


export default Dot;
