import React, {useState, useEffect} from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  Dimensions,
  View,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
  Platform,
  Image,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import snackbar from '@utils/snackbar-utils';
const DEVICE_HEIGHT = Dimensions.get('window').height;
import Modal from '@components/modal';
import ScaledImage from 'mainam-react-native-scaleimage';
import ehealthProvider from '@data-access/ehealth-provider';

const ModalSelectTime = ({isVisible, onCloseModal, item, itemEhealth}) => {
  const [indexSelect, setIndexSelect] = useState(0);
  const [data, setData] = useState([]);
  const getTimeUnits = async () => {
    try {
      let res = await ehealthProvider.getTimeUnits();
      console.log('res: ', res);
      setData(res);
    } catch (error) {
      console.log('error: ', error);
    }
  };
  useEffect(() => {
    getTimeUnits();
  }, []);
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.viewItem}>
        <TouchableOpacity
          onPress={() => setIndexSelect(index)}
          style={styles.btnSelect}>
          {index == indexSelect ? (
            <ScaledImage
              height={18}
              source={require('@images/new/profile/ic_checkbox_checked.png')}
            />
          ) : (
            <ScaledImage
              source={require('@images/new/profile/ic_checkbox_uncheck.png')}
              height={18}
            />
          )}
          <Text style={styles.txRole}>{item.day} ngày</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const onAcepted = async () => {
    try {
      console.log('item: ', item);
      let res = await ehealthProvider.createShare(
        item.id,
        itemEhealth?.patientHistoryId,
        data[indexSelect].name,
      );
    } catch (error) {}
  };
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCloseModal}
      backdropOpacity={0.5}
      animationInTiming={500}
      animationOutTiming={500}
      style={styles.modalRelation}
      avoidKeyboard={true}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}>
      <View style={styles.scroll}>
        <View style={styles.viewTxTittle}>
          <Text style={styles.txPhone}>Chia sẻ hồ sơ của tôi trong:</Text>
        </View>
        <View style={styles.form}>
          <FlatList
            data={data}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            paddingBottom: 20,
          }}>
          <TouchableOpacity
            onPress={onAcepted}
            style={[
              styles.updatePass,
              {
                backgroundColor: '#FFF',
                borderColor: '#00000060',
                borderWidth: 1,
              },
            ]}>
            <Text style={[styles.txbtnUpdate, {color: '#000'}]}>{'HUỶ'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onAcepted} style={styles.updatePass}>
            <Text style={styles.txbtnUpdate}>{'XÁC NHẬN'}</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={{ height: 50 }}></View> */}
      </View>
    </Modal>
  );
};
const DEVICE_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  modalRelation: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  form: {marginTop: 20, alignItems: 'center'},
  placeholderStyle: {fontSize: 16, fontWeight: '300'},
  txPhone: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  viewTxTittle: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext: {
    color: '#3161AD',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 0,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 49,
    alignSelf: 'center',
    padding: 5,
  },
  header: {paddingHorizontal: 0},
  txbtnUpdate: {color: '#FFF', fontSize: 17},
  updatePass: {
    backgroundColor: 'rgb(2,195,154)',
    alignSelf: 'center',
    borderRadius: 6,
    height: 48,
    width: '35%',
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  container: {flex: 1, backgroundColor: '#000', height: DEVICE_HEIGHT},
  btnEye: {
    position: 'absolute',
    right: 25,
    top: 18,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
  inputPass: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  input: {
    maxWidth: 300,
    paddingRight: 30,
    backgroundColor: '#FFF',
    width: DEVICE_WIDTH - 40,
    height: 42,
    marginHorizontal: 20,
    paddingLeft: 15,
    borderRadius: 6,
    color: '#006ac6',
    borderWidth: 1,
    borderColor: 'rgba(155,155,155,0.7)',
  },
  errorStyle: {
    color: 'red',
    marginTop: 10,
  },
  textInputStyle: {
    color: '#000',
    fontWeight: '300',
    height: 51,
    marginLeft: 0,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderColor: '#CCCCCC',
    fontSize: 20,
    paddingLeft: 15,
    paddingRight: 45,
  },
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  scroll: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    width: '100%',
  },
  txContent: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000000',
    marginTop: 15,
  },
  btnSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 5,
    width: '50%',
  },
  txRole: {
    marginLeft: 10,
  },
  viewItem: {
    width: '50%',
    alignItems: 'center',
  },
});

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    navigation: state.navigation,
  };
}
export default connect(mapStateToProps)(ModalSelectTime);
