import React from 'react';
import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import AddMonitoringScreen from '@containers/ehealth/healthMonitoring/AddMonitoringScreen';
import ChartComponent from './ChartComponent';
import monitoringProvider from '@data-access/monitoring-provider';
const BmiAndBsa = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dataBmi, setDataBmi] = useState([]);
  const [listInit, setListInit] = useState([]);
  const [dataBsa, setDataBsa] = useState([]);
  const [data, setData] = useState([]);
  const [timeCharts, setTimeCharts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [nearestData, setNearestData] = useState({});

  const onBackdropPress = () => {
    setIsVisible(false);
  };
  const splitDate = date => {
    var tzOffset = '+07:00';
    let date2 = new Date(date.split('+')[0] + tzOffset);
    return date2;
  };
  const getHeightWeight = async () => {
    try {
      let res = await monitoringProvider.getHeightWeight(page, size);

      if (res?.content?.length) {
        formatData(res.content);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (listInit.length) {
      let resultBmi = listInit.reduce((r, a) => {
        r['values'] = r['values'] || [];
        r['values'].unshift({
          y: a.bmi,
          marker: `${splitDate(a.date).format(
            'dd/MM/yyyy',
          )}\n BMI: ${parseFloat(a.bmi).toFixed(1)}`,
        });
        r.label = 'Chỉ số khối (BMI)';
        r.color = '#FFAAAA';
        return r;
      }, Object.create(null));
      let resultBsa = listInit.reduce((r, a) => {
        r['values'] = r['values'] || [];
        r['values'].unshift({
          y: a.bsa,
          marker: `${splitDate(a.date).format(
            'dd/MM/yyyy',
          )}\n BSA: ${parseFloat(a.bsa).toFixed(1)}`,
        });
        r.label = 'Chỉ số diện tích bề mặt cơ thể (BSA)';
        r.color = '#D6D6D6';
        return r;
      }, Object.create(null));
      let time = listInit.map(e => splitDate(e.date).format('dd/MM')).reverse();
      setTimeCharts(time);
      setDataBmi([resultBmi]);
      setDataBsa([resultBsa]);

      setNearestData(listInit[0]);
    }
  }, [listInit]);
  const formatData = data => {
    if (data.length == 0) {
      setListInit([]);
    } else {
      if (page == 0) {
        setListInit(data);
      } else {
        setListInit(state => [...state, ...data]);
      }
    }
  };
  useEffect(() => {
    getHeightWeight();
  }, [page]);
  const onCreateSuccess = data => {
    if (page == 0) {
      getHeightWeight();
    } else {
      setPage(0);
    }
  };
  const onLoadMore = () => {
    if ((page + 1) * size <= listInit.length) {
      setPage(state => state + 1);
    }
  };
  const renderStatus = () => {
    let bmi = nearestData.bmi;
    let params = {
      label: '',
      status: '',
      color: '',
    };
    if (bmi > 0 && bmi < 16) {
      params.label = 'Gầy độ III';
      params.color = '#7F121F';
      params.status =
        'Bạn nên bổ sung dinh dưỡng để tăng chuyển hóa trao đổi chất hoặc đi khám tại CSYT gần nhất.';
    } else if (bmi >= 16 && bmi < 17) {
      params.label = 'Gầy độ II';
      params.color = '#7F121F';
      params.status =
        'Bạn nên bổ sung dinh dưỡng để tăng chuyển hóa trao đổi chất hoặc đi khám tại CSYT gần nhất.';
    } else if (bmi >= 17 && bmi < 18.5) {
      params.label = 'Gầy độ I';
      params.color = '#FF8A00';
      params.status =
        'Bạn nên bổ sung dinh dưỡng để tăng chuyển hóa trao đổi chất hoặc đi khám tại CSYT gần nhất.';
    } else if (bmi >= 18.5 && bmi < 25) {
      params.label = 'Chỉ số BMI bình thường';
      params.color = '#3161AD';
      params.status =
        'Tuy nhiên, bạn vẫn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (bmi >= 25 && bmi < 30) {
      params.label = 'Thừa cân';
      params.color = '#FF8A00';
      params.status =
        'Bạn cần phải điều chỉnh chế độ ăn hợp lí, theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (bmi >= 30 && bmi < 35) {
      params.label = 'Béo phì độ I';
      params.color = '#FF8A00';
      params.status =
        'Bạn cần phải điều chỉnh chế độ ăn hợp lí, theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (bmi >= 35 && bmi < 40) {
      params.label = 'Béo phì độ II';
      params.color = '#7F121F';
      params.status =
        'Bạn cần phải điều chỉnh chế độ ăn hợp lí, theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (bmi >= 40) {
      params.label = 'Béo phì độ III';
      params.color = '#7F121F';
      params.status =
        'Bạn cần phải điều chỉnh chế độ ăn hợp lí, theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    }
    return params;
  };
  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
        }}>
        <Text style={styles.txtTitle}>Chỉ số gần đây</Text>
        {/** Chỉ số  */}
        <View style={styles.containerPoint}>
          <View style={styles.groupPoint}>
            <View style={[styles.groupImg, {paddingHorizontal: 9}]}>
              <ScaledImage
                source={require('@images/new/ehealth/monitoringHealth/ic_rule.png')}
                height={19}
              />
            </View>
            <View style={styles.conntainerTextPoint}>
              <Text style={styles.txtPoint}>{nearestData?.height || 0} cm</Text>
              <Text>Chiều cao</Text>
            </View>
          </View>
          <View style={styles.groupPoint}>
            <View style={styles.groupImg}>
              <ScaledImage
                source={require('@images/new/ehealth/monitoringHealth/ic_weight.png')}
                height={19}
              />
            </View>
            <View style={styles.conntainerTextPoint}>
              <Text style={styles.txtPoint}>{nearestData?.weight || 0} kg</Text>
              <Text>Cân nặng</Text>
            </View>
          </View>
          <View style={styles.groupPoint}>
            <TouchableOpacity
              onPress={() => setIsVisible(true)}
              style={styles.buttonAdd}>
              <ScaledImage
                source={require('@images/new/profile/ic_add.png')}
                height={22}
              />
            </TouchableOpacity>
          </View>
        </View>
        {renderStatus().label ? (
          <View
            style={[
              styles.containerDescription,
              {backgroundColor: renderStatus().color},
            ]}>
            <Text style={styles.txtTitleDescription}>
              {renderStatus().label}
            </Text>
            <Text style={styles.txtContentDescription}>
              {renderStatus().status}
            </Text>
          </View>
        ) : null}
        {dataBmi.length ? (
          <View>
            <Text style={styles.txtLabelChart}>Biểu đồ BMI</Text>
            <ChartComponent
              time={timeCharts}
              data={dataBmi}
              loadMore={onLoadMore}
              page={page}
            />
          </View>
        ) : null}
        {dataBsa.length ? (
          <View>
            <Text style={styles.txtLabelChart}>Biểu đồ BSA</Text>
            <ChartComponent
              time={timeCharts}
              data={dataBsa}
              loadMore={onLoadMore}
              page={page}
            />
          </View>
        ) : null}
        <View style={[styles.containerGuide, {marginTop: 20}]}>
          <View style={styles.groupTxtGuide}>
            <Text style={styles.txtGuide}>BMI</Text>
          </View>
          <Text style={styles.txtContentGuide}>
            <Text
              style={{
                fontWeight: 'bold',
              }}>
              BMI
            </Text>{' '}
            là chỉ số khối của cơ thể, dùng để đánh giá cơ thể của bạn đang
            thiếu cân, bình thường, thừa cân hay béo phì.
          </Text>
        </View>
        <View style={styles.containerGuide}>
          <View style={styles.groupTxtGuide}>
            <Text style={styles.txtGuide}>BSA</Text>
          </View>
          <Text style={styles.txtContentGuide}>
            <Text
              style={{
                fontWeight: 'bold',
              }}>
              BSA
            </Text>{' '}
            là diện tích bề mặt cơ thể trên cơ sở diện tích bề mặt thân thể
            người, dùng để tính toán liều lượng thuốc gây độc tế bào trong phác
            đồ hóa trị liệu.
          </Text>
        </View>
      </View>
      <AddMonitoringScreen
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
        type={'BMI'}
        onCreateSuccess={onCreateSuccess}
        label="CHỈ SỐ BMI"
        label2="Chiều cao (cm)"
        label3="Cân nặng (kg)"
      />
    </ScrollView>
  );
};

export default BmiAndBsa;

const styles = StyleSheet.create({
  txtContentGuide: {
    flex: 1,
    paddingLeft: 10,
    color: '#372B7B',
  },
  txtGuide: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  groupTxtGuide: {
    backgroundColor: '#372B7B',
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerGuide: {
    backgroundColor: '#372B7B30',
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    marginBottom: 5,
  },
  txtLabelChart: {
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  txtContentDescription: {
    textAlign: 'center',
    color: '#FFF',
    paddingTop: 5,
  },
  txtTitleDescription: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  containerDescription: {
    backgroundColor: '#FF8A00',
    padding: 20,
    marginBottom: 15,
    marginTop: 20,
  },
  buttonAdd: {
    backgroundColor: '#00CBA7',
    paddingVertical: 13,
    paddingHorizontal: 3,
    borderRadius: 20,
  },
  txtPoint: {
    color: '#00BA99',
    fontWeight: 'bold',
    fontSize: 16,
  },
  conntainerTextPoint: {
    paddingLeft: 5,
  },
  groupImg: {
    backgroundColor: '#00CBA730',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 20,
  },
  groupPoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  txtTitle: {
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingTop: 15,
  },
});
