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
const Temperature = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);
  const [timeCharts, setTimeCharts] = useState([]);
  const [page, setPage] = useState([]);
  const [size, setSize] = useState([]);
  const [nearestData, setNearestData] = useState({});
  const onBackdropPress = () => {
    setIsVisible(false);
  };
  const splitDate = date => {
    var tzOffset = '+07:00';
    let date2 = new Date(date.split('+')[0] + tzOffset);
    return date2;
  };
  const getBodyTemperature = async () => {
    try {
      let res = await monitoringProvider.getBodyTemperature(0, 20);

      if (res?.content?.length) {
        let group = [];

        let dataBodyTemperature = res.content
          .map(item => ({
            y: item.bodyTemperature,
            marker: `${splitDate(item.date).format(
              'HH:mm, dd/MM/yyyy',
            )}\n Nhiệt độ: ${item.bodyTemperature} °C`,
          }))
          .reverse();

        group.push({
          values: dataBodyTemperature,
          label: 'Nhiệt độ',
          color: '#D6D6D6',
        });
        let time = res.content
          .map(e => splitDate(e.date).format('dd/MM'))
          .reverse();
        setTimeCharts(time);
        setData(group);
        setNearestData(res.content[0]);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getBodyTemperature();
  }, []);
  const onCreateSuccess = data => {
    getBodyTemperature();
  };
  const renderStatus = () => {
    let temp = nearestData.bodyTemperature;
    let params = {
      label: '',
      status: '',
      color: '',
    };
    if (temp < 36) {
      params.label = 'Hạ thân nhiệt';
      params.color = '#7F121F';
      params.status =
        'Bạn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (temp >= 36 && temp < 37.5) {
      params.label = 'Nhiệt độ bình thường';
      params.color = '#3161AD';
      params.status =
        'Tuy nhiên, bạn vẫn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (temp >= 38 && temp < 39) {
      params.label = 'Sốt nhẹ';
      params.color = '#FF8A00';
      params.status =
        'Bạn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (temp >= 39 && temp < 40) {
      params.label = 'Sốt vừa';
      params.color = '#FF8A00';
      params.status =
        'Hãy lấy thân nhiệt mỗi 1-2h khi cơ thể còn sốt cao. Uống thuốc hạ sốt theo đơn của bác sĩ.';
    } else if (temp >= 40 && temp < 41.1) {
      params.label = 'Sốt cao';
      params.color = '#7F121F';
      params.status = 'Cần đến khám ngay tại cơ sở y tế gần nhất.	';
    } else if (temp > 41.1) {
      params.label = 'Sốt kịch phát';
      params.color = '#7F121F';
      params.status = 'Cần đến khám ngay tại cơ sở y tế gần nhất.	';
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
            <View style={styles.groupImg}>
              <ScaledImage
                source={require('@images/new/ehealth/monitoringHealth/ic_health_down.png')}
                height={19}
              />
            </View>
            <View style={styles.conntainerTextPoint}>
              <Text style={styles.txtPoint}>
                {nearestData?.bodyTemperature || 0} °C
              </Text>
              <Text>Nhiệt độ</Text>
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
          <View style={[styles.containerDescription,{backgroundColor:renderStatus().color}]}>
            <Text style={styles.txtTitleDescription}>
              {renderStatus().label}
            </Text>
            <Text style={styles.txtContentDescription}>
              {renderStatus().status}
            </Text>
          </View>
        ) : null}
        {data.length ? (
          <View>
            <Text style={styles.txtLabelChart}>Biểu đồ nhiệt độ</Text>
            <ChartComponent data={data} time={timeCharts} />
          </View>
        ) : null}
      </View>
      <AddMonitoringScreen
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
        type={'TEMP'}
        onCreateSuccess={onCreateSuccess}
        label="CHỈ SỐ NHIỆT ĐỘ"
        label2="Giờ đo"
        label3="Nhiệt độ (°C)"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#7F121F',
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

export default Temperature;
