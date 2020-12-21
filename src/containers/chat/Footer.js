import questionProvider from '@data-access/question-provider';
import ScaledImage from 'mainam-react-native-scaleimage';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';

const Footer = ({navigation, item}) => {
  const [thanks, setThanks] = useState(false);
  useEffect(() => {
    setThanks(item?.thanked);
  }, [item?.thanked]);
  const onSetThanks = async () => {
    try {
      setThanks(true);
      if (!thanks) {
        let res = await questionProvider.setThanks(item.id);
      }
    } catch (error) {}
  };
  const onViewProfileDoctor = () => {
    if (item?.doctorInfo?.id)
      navigation.navigate('detailsDoctor', {
        item: {id: item?.doctorInfo?.doctorId},
      });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={thanks || !item?.doctorInfo?.doctorId}
        onPress={onSetThanks}
        style={styles.buttonThanks}>
        {thanks ? (
          <ScaledImage
            source={require('@images/new/ic_thanks.png')}
            height={18}
          />
        ) : (
          <ScaledImage
            source={require('@images/new/ic_ehealth.png')}
            height={18}
          />
        )}
        <Text style={styles.txtThanks}>{thanks ? 'Đã cảm ơn' : 'Cảm ơn'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!item?.doctorInfo?.doctorId}
        onPress={onViewProfileDoctor}
        style={styles.buttonViewProfile}>
        <Text style={styles.txtDoctor}>Xem hồ sơ bác sĩ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default withNavigation(Footer);

const styles = StyleSheet.create({
  txtThanks: {
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  txtDoctor: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonViewProfile: {
    borderRadius: 20,
    padding: 10,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#00CBA7',
  },
  buttonThanks: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: '#00000050',
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 5,
    borderTopColor: '#00000010',
    borderTopWidth: 1,
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#00000050',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    backgroundColor: '#FFF',
  },
});
