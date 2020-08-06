import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import LoadingTest from './LoadingTest';
import TestCovid from './TestCovid';
const TestCovidScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  return (
    <View style={styles.container}>
      {isLoading ? <LoadingTest /> : <TestCovid navigation={navigation} />}
    </View>
  );
};

export default TestCovidScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
