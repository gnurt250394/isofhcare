import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {Card, Icon} from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import ActivityPanel from '@components/ActivityPanel';
import {connect} from 'react-redux';
const width = Dimensions.get('window').width / 2;
const spacing = 10;
import dateUtils from 'mainam-react-native-date-utils';
import resultUtils from './utils/result-utils';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';
import DateTimePicker from 'mainam-react-native-date-picker';
const DEVICE_WIDTH = Dimensions.get('window').width;
import connectionUtils from '@utils/connection-utils';
import ehealthProvider from '@data-access/ehealth-provider';
import ItemEhealth from '@components/ehealth/ItemEhealth';
import CustomMenu from '@components/CustomMenu';
import ModalSelectTime from '@components/ehealth/ModalSelectTime';
import SearchProfile from '@components/ehealth/SearchProfile';
import ItemSharing from '@components/ehealth/ItemSharing';

const EhealthSharingScreen = ({navigation, ehealth}) => {
  let item = navigation.state?.params?.item;
  const [history, setHistory] = useState({});
  const [positionY, setPositionY] = useState(0);
  const [data, setData] = useState([
    {
      avatar: 'https://media.vov.vn/uploaded/usobwtngx2k/2020_01_01/1_ljtd.jpg',
      name: 'Nguyễn Văn A',
      phone: '0987654321',
    },
    {
      avatar:
        'https://nld.mediacdn.vn/thumb_w/540/2019/8/3/photo-1-15648212499661517922266.jpg',
      name: 'Nguyễn Văn A',
      phone: '0987654321',
    },
    {
      avatar:
        'https://duhocvietglobal.com/wp-content/uploads/2018/12/dat-nuoc-va-con-nguoi-anh-quoc.jpg',
      name: 'Nguyễn Văn A',
      phone: '0987654321',
    },
    {
      avatar: 'https://media.vov.vn/uploaded/usobwtngx2k/2020_01_01/1_ljtd.jpg',
      name: 'Nguyễn Văn A',
      phone: '0987654321',
    },
    {
      avatar: 'https://media.vov.vn/uploaded/usobwtngx2k/2020_01_01/1_ljtd.jpg',
      name: 'Nguyễn Văn A',
      phone: '0987654321',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [typeSearch, setTypeSearch] = useState('');
  const onShare = () => {
    setIsVisible(true);
  };
  const _renderItem = ({item, index}) => {
    return <ItemSharing item={item} />;
  };
  const onSelected = (e, i) => {
    setTypeSearch(e.type);
  };
  const onHistory = () => navigation.navigate('listHistoryShare');
  const _keyExtractor = (item, index) => index.toString();
  const hideSearch = () => {
    setIsVisible(false);
  };
  const showSearch = () => {
    setIsVisible(true);
  };
  const onBack = () => {
    if (isVisible) {
      hideSearch();
    } else {
      navigation.pop();
    }
  };
  return (
    <ActivityPanel
      style={styles.container}
      // title="HỒ SƠ Y BẠ GIA ĐÌNH"
      isLoading={isLoading}
      backButtonClick={onBack}
      title={constants.ehealth.share_ehealth}>
      <ItemEhealth item={item} disabled={true} />
      <View
        onLayout={event => {
          setPositionY(event.nativeEvent.layout.y);
        }}
        style={{flex: 1}}>
        {isVisible ? null : (
          <View>
            <Text style={styles.txtTitleShare}>Chia sẻ với:</Text>
            <View style={styles.containerSearch}>
              <CustomMenu
                MenuSelectOption={
                  <View style={styles.buttonFilter}>
                    <Text style={styles.txtLabelFilter}>
                      {typeSearch == 'user' ? 'Người dùng' : 'Bác sĩ'}
                    </Text>
                    <ScaledImage
                      source={require('@images/new/ehealth/ic_down.png')}
                      height={10}
                      style={styles.imgFilter}
                    />
                  </View>
                }
                options={
                  typeSearch == 'user'
                    ? [{value: 'Bác sĩ', id: 1, type: 'doctor'}]
                    : [{value: 'Người dùng', id: 1, type: 'user'}]
                }
                onSelected={onSelected}
              />

              <View style={styles.containerInput}>
                <TouchableOpacity onPress={showSearch} style={styles.innput}>
                  <Text
                    style={{
                      color: '#00000060',
                    }}>
                    Tìm tên bác sĩ
                  </Text>
                </TouchableOpacity>
                <ScaledImage
                  source={require('@images/new/ic_search.png')}
                  height={18}
                  style={{tintColor: '#86899B'}}
                />
              </View>
            </View>
          </View>
        )}
        <Text style={styles.txtGuide}>Gợi ý cho bạn</Text>
        <FlatList
          data={data}
          renderItem={_renderItem}
          contentContainerStyle={{paddingTop: 15}}
          keyExtractor={_keyExtractor}
        />
        <TouchableOpacity onPress={onHistory} style={styles.buttonHistoryShare}>
          <Text
            style={{
              textDecorationLine: 'underline',
            }}>
            Xem lịch sử chia sẻ
          </Text>
        </TouchableOpacity>
      </View>
      {isVisible &&
        ((
          <SearchProfile
            typeSearch={typeSearch}
            onSelected={onSelected}
            hideSearch={hideSearch}
            positionY={positionY}
          />
        ) ||
          null)}
    </ActivityPanel>
  );
};
const styles = StyleSheet.create({
  buttonHistoryShare: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  buttonShare: {
    padding: 7,
    backgroundColor: 'rgba(49, 97, 173, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  containerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  txtPhone: {color: '#00000070', paddingTop: 3},
  txtName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  containerName: {
    flex: 1,
    paddingHorizontal: 10,
  },
  imgLoad: {
    borderRadius: 20,
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
  },
  defaultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  txtGuide: {
    color: '#00000070',
    fontStyle: 'italic',
    paddingLeft: 10,
  },
  imgFilter: {
    tintColor: '#000',
  },
  txtLabelFilter: {
    marginRight: 7,
  },
  innput: {
    flex: 1,
    justifyContent: 'center',
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    backgroundColor: '#16695020',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 10,
  },
  buttonFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16695040',
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingRight: 15,
  },
  containerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  txtTitleShare: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  imageStyle: {
    borderRadius: 25,
  },
});

function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp,
    ehealth: state.auth.ehealth,
  };
}
export default connect(mapStateToProps)(EhealthSharingScreen);
