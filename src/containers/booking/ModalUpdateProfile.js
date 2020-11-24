import ModalComponent from '@components/modal';
import ScaledImage from 'mainam-react-native-scaleimage';
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

const ModalUpdateProfile = ({isVisible, onBackdropPress, onSend}) => {
  return (
    <ModalComponent
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.5}
      animationInTiming={500}
      animationOutTiming={500}
      style={styles.modal}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}>
      <View style={styles.containerModal}>
        <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
          }}
          onPress={onBackdropPress}>
          <ScaledImage
            source={require('@images/ic_close.png')}
            height={15}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.txt}>
          Bạn cần hoàn thiện thông tin cá nhân để tiếp tục đặt khám.
        </Text>
        <TouchableOpacity onPress={onSend} style={styles.buttonOk}>
          <Text style={styles.txtOk}>Đồng ý</Text>
        </TouchableOpacity>
      </View>
    </ModalComponent>
  );
};
const styles = StyleSheet.create({
  txtOk: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonOk: {
    backgroundColor: '#00CBA7',
    borderRadius: 5,
    paddingVertical: 8,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  txt: {
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingBottom: 15,
    paddingTop: 10,
  },
  icon: {
    tintColor: '#00000070',
    alignSelf: 'flex-end',
  },
  containerModal: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ModalUpdateProfile;
