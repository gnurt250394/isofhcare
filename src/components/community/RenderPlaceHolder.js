import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
  ShineOverlay,
} from 'rn-placeholder';
import {Card} from 'native-base';
const RenderPlaceHolder = ({data = [...new Array(10).fill({})]}) => {
  return data.map((e, i) => {
    return (
      <Card style={styles.card}>
        <Placeholder Animation={ShineOverlay} style={styles.placeContainer}>
          <View style={styles.row}>
            <PlaceholderMedia style={[styles.placeMedia]} />
            <View style={{flex: 1, paddingLeft: 5}}>
              <PlaceholderLine width={30} height={10} />
              <PlaceholderLine width={15} height={10} />
            </View>
          </View>
          <PlaceholderLine width={'95%'} />
          <PlaceholderLine width={'95%'} />
          <PlaceholderLine width={50} />
        </Placeholder>
      </Card>
    );
  });
};

export default RenderPlaceHolder;

const styles = StyleSheet.create({
  card: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  placeContainer: {
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 10,
  },
  placeMedia: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
