import React from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import NavigationService from '@navigators/NavigationService';

const {width, height} = Dimensions.get('screen');
const IntroCovidScreen = ({}) => {
  const goToTest=()=>{
    NavigationService.navigate('testCovid')
  }
  return (
    <ActivityPanel
      showBackgroundHeader={true}
      buttonBackStyle={{
        alignSelf: 'flex-start',
      }}
      icBack={require('@images/new/covid/ic_back_black.png')}
      actionbarStyle={{
        height: height / 4,
      }}
      backgroundHeader={require('@images/new/covid/ic_intro_covid.png')}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View style={styles.flex}>
          <Text style={styles.txtIntro}>Giới thiệu về tính năng</Text>
          <View style={styles.containerIntro}>
            <Text style={styles.txtTitle}>Test COVID-19</Text>
            <Text style={styles.txtContent}>
              Test COVID-19 là một bài test nhanh sử dụng những câu hỏi lựa
              chọn, giúp người dùng có thể nhanh chóng biết được mình có khả
              năng bị lây nhiễm virus COVID-19 hay không. Tính năng được phát
              triển dựa trên nguồn tài liệu từ Tổ chức Y tế Thế giới (WHO) và
              Trung tâm kiểm soát và Phòng ngừa dịch bệnh của Mỹ (CDC) nên đảm
              bảo độ chính xác tiêu chuẩn.
            </Text>
            <Text style={styles.txtTitle}>
              Bạn có thể làm bài test mà không cần đăng ký tài khoản.
            </Text>
            <Text style={styles.txtContent}>
              Chúng tôi khuyến nghị bạn làm theo các hướng dẫn ngăn ngừa dịch đã
              được khuyến cáo bởi WHO và CDC để đảm bảo an toàn cho mình và cho
              toàn xã hội.
            </Text>
          </View>
          <TouchableOpacity  onPress={goToTest}style={styles.buttonStart}>
            <Text style={styles.txtStart}>BẮT ĐẦU TEST</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ActivityPanel>
  );
};

export default IntroCovidScreen;

const styles = StyleSheet.create({
  flex: {flex: 1},
  txtStart: {color: '#FFF', fontSize: 17, fontWeight: 'bold'},
  buttonStart: {
    backgroundColor: '#00CBA7',
    alignSelf: 'center',
    height: 42,
    marginTop: 20,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  txtContent: {
    paddingBottom: 24,
    color: '#444',
    fontSize: 16,
  },
  txtTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingBottom: 5,
  },
  containerIntro: {
    padding: 20,
  },
  txtIntro: {
    color: '#00BA99',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 24,
  },
});
