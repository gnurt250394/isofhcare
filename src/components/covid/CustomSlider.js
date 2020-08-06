import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Slider from "react-native-slider";
import {useState} from 'react';

const CustomSlider = ({max, min, onValueChange}) => {
  const [minDistance, setMinDistance] = useState(() => min);
  const [maxDistance, setMaxDistance] = useState(() => max);
  const [distance, setDistance] = useState(20);
  const onChangeDistance = val => {
    onValueChange(val);
    setDistance(val);
  };
  return (
    <View style={styles.container}>
      <Slider
        style={{width: 300}}
        step={1}
        minimumValue={minDistance}
        maximumValue={maxDistance}
        value={distance}
        onValueChange={onChangeDistance}
        thumbTintColor="#EB5569"
        animateTransitions={true}
        maximumTrackTintColor="#d3d3d3"
        minimumTrackTintColor="#FEB692"
      />
      <View style={styles.textCon}>
        <Text style={styles.colorGrey}>{minDistance} tuổi</Text>
        <Text style={styles.colorYellow}>{distance + ' tuổi'}</Text>
        <Text style={styles.colorGrey}>{maxDistance} tuổi</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height:100,
  },
  textCon: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorGrey: {
    color: '#000',
  },
  colorYellow: {
    color: '#EB5569',
  },
});
export default CustomSlider;
