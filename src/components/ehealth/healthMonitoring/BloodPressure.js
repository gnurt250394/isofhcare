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
const BloodPressure = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeCharts, setTimeCharts] = useState([]);
  const [listInit, setListInit] = useState([]);
  const [data, setData] = useState([]);
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
  const groupData = (data, key) => {
    data.map((e, i) => {});
  };
  const getBloodPressure = async () => {
    try {
      // r['values'] = r['values'] || [];
      // r['values'].push({
      //   y: a.bmi,
      //   marker: `${a.date.toDateObject().format('dd/MM/yyyy')}\n BMI: ${a.bmi}`,
      // });
      // r.label = 'Chỉ số khối (BMI)';
      // r.color = '#FFAAAA';
      let res = await monitoringProvider.getBloodPressure(page, size);

      if (res?.content?.length) {
        formatData(res.content);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (listInit.length) {
      let group = [];

      let dataSystolic = listInit
        .map(item => ({
          y: item.systolic,
          marker: `${splitDate(item.date).format('dd/MM/yyyy')}\n Tâm thu: ${
            item.systolic
          }`,
        }))
        .reverse();

      let dataDiastolic = listInit
        .map(item => ({
          y: item.diastolic,
          marker: `${splitDate(item.date).format('dd/MM/yyyy')}\n Tâm trương: ${
            item.diastolic
          }`,
        }))
        .reverse();
      group.push({
        values: dataSystolic,
        label: 'HA tâm thu',
        color: '#D6D6D6',
      });
      group.push({
        values: dataDiastolic,
        label: 'HA tâm trương',
        color: '#FFAAAA',
      });
      let time = listInit.map(e => splitDate(e.date).format('dd/MM')).reverse();

      setTimeCharts(time);
      setData(group);
      setNearestData(listInit[0]);
    }
  }, [listInit]);
  const onCreateSuccess = data => {
    if (page == 0) {
      getBloodPressure();
    } else {
      setPage(0);
    }
  };
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
  const onLoadMore = () => {
    if ((page + 1) * size <= listInit.length) {
      setPage(state => state + 1);
    }
  };
  useEffect(() => {
    getBloodPressure();
  }, []);
  const renderStatus = () => {
    let diastolic = nearestData.diastolic;
    let systolic = nearestData.systolic;
    let params = {
      label: '',
      status: '',
      color: '#7F121F',
    };
    if (systolic >= 180 || diastolic >= 110) {
      params.label = 'Cao huyết áp cấp độ 3';
      params.color = '#7F121F';
      params.status =
        'Bạn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (
      (systolic >= 160 && systolic < 180) ||
      (diastolic >= 100 && diastolic < 110)
    ) {
      params.label = 'Cao huyết áp cấp độ 2';
      params.color = '#7F121F';
      params.status =
        'Bạn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (
      (systolic >= 140 && systolic < 160) ||
      (diastolic >= 90 && diastolic < 100)
    ) {
      params.label = 'Cao huyết áp cấp độ 1';
      params.color = '#7F121F';
      params.status =
        'Bạn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (
      (systolic >= 120 && systolic < 140) ||
      (diastolic >= 80 && diastolic < 90)
    ) {
      params.label = 'Tiền cao huyết áp ';
      params.color = '#FF8A00';
      params.status =
        'Bạn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (diastolic < 60 || systolic < 90) {
      params.label = 'Huyết áp thấp';
      params.color = '#FF8A00';
      params.status =
        'Bạn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else if (
      systolic >= 90 &&
      systolic < 120 &&
      (diastolic >= 60 && diastolic < 80)
    ) {
      params.label = 'Huyết áp bình thường';
      params.color = '#3161AD';
      params.status =
        'Tuy nhiên, bạn vẫn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
    } else {
      params.label = 'Cao huyết áp cấp độ 3';
      params.color = '#7F121F';
      params.status =
        'Bạn cần phải theo dõi thường xuyên hoặc đi khám tại CSYT gần nhất.';
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
                {nearestData?.systolic || 0} mmHg
              </Text>
              <Text>Tâm thu</Text>
            </View>
          </View>
          <View style={styles.groupPoint}>
            <View style={styles.groupImg}>
              <ScaledImage
                source={require('@images/new/ehealth/monitoringHealth/ic_health_up.png')}
                height={19}
              />
            </View>
            <View style={styles.conntainerTextPoint}>
              <Text style={styles.txtPoint}>
                {nearestData?.diastolic || 0} mmHg
              </Text>
              <Text>Tâm trương</Text>
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
        {data.length ? (
          <View>
            <Text style={styles.txtLabelChart}>Biểu đồ huyết áp</Text>
            <ChartComponent
              time={timeCharts}
              data={data}
              loadMore={onLoadMore}
              page={page}
            />
          </View>
        ) : null}
        <View
          style={[
            styles.containerSuggest,
            {
              marginTop: 15,
              marginBottom: 5,
            },
          ]}>
          <View style={styles.dots} />
          <Text style={styles.txtSuggest}>
            <Text
              style={{
                fontWeight: 'bold',
              }}>
              Huyết áp tâm thu{' '}
            </Text>
            là mức huyết áp cao nhất trong mạch máu, xảy ra khi tim co bóp.
          </Text>
        </View>
        <View style={[styles.containerSuggest, {marginBottom: 20}]}>
          <View style={styles.dots} />
          <Text style={styles.txtSuggest}>
            <Text
              style={{
                fontWeight: 'bold',
              }}>
              Huyết áp tâm trương{' '}
            </Text>
            là mức huyết áp thấp nhất trong mạch máu và xảy ra giữa các lần tim
            co bóp, khi cơ tim được thả lỏng.
          </Text>
        </View>
      </View>
      <AddMonitoringScreen
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
        type={'BLOOD'}
        onCreateSuccess={onCreateSuccess}
        label="CHỈ SỐ HUYẾT ÁP"
        label2="Tâm thu mmHg (Huyết áp tối đa)"
        label3="Tâm trương mmHg (Huyết áp tối thiểu)"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  txtSuggest: {
    color: '#372B7B',
    paddingLeft: 10,
    flex: 1,
  },
  dots: {
    backgroundColor: '#372B7B',
    height: 10,
    width: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  containerSuggest: {
    backgroundColor: '#372B7B30',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    backgroundColor: '#3161AD',
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

export default BloodPressure;
