import React from 'react';
import ModalComponent from '@components/modal';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
const ModalConfirm = ({onBackdropPress, isVisible, onSend}) => {
  return (
    <ModalComponent
      isVisible={isVisible}
      //   onBackdropPress={onBackdropPress}
      backdropOpacity={0.5}
      animationInTiming={500}
      animationOutTiming={500}
      style={styles.modal}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}>
      <View style={styles.container}>
        <Text style={styles.txtLabel}>Bạn đã gửi câu hỏi thành công !</Text>
        <Text style={styles.txtLabel}>
          Các bác sĩ sẽ trả lời câu hỏi của bạn trong thời gian sớm nhất.
        </Text>
        <View style={styles.groupButton}>
          <TouchableOpacity
            onPress={onSend}
            style={[
              styles.buttonOk,
              {marginRight: 10, backgroundColor: '#00CBA7'},
            ]}>
            <Text style={styles.txtOk}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalComponent>
  );
};

const styles = StyleSheet.create({
  txtCancel: {
    color: '#FC4A5F',
  },
  txtOk: {
    color: '#FFF',
    fontWeight: '500',
  },
  buttonOk: {
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
  },
  groupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  txtLabel: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
  },
});

export default ModalConfirm;
