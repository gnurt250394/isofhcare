import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ModalComponent from '@components/modal';

const ModalConfirmSend = ({isVisible, onBackdropPress, onSend}) => {
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
      <View style={styles.container}>
        <Text style={styles.txtLabel}>
          Bạn có chắc chắn gửi câu trả lời này?
        </Text>
        <View style={styles.groupButton}>
          <TouchableOpacity
            onPress={onSend}
            style={[
              styles.buttonOk,
              {marginRight: 10, backgroundColor: '#00CBA7'},
            ]}>
            <Text style={styles.txtOk}>Đồng ý</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onBackdropPress}
            style={[styles.buttonOk, {backgroundColor: '#BBB'}]}>
            <Text style={styles.txtCancel}>Huỷ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalComponent>
  );
};

export default ModalConfirmSend;

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
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
  },
});
