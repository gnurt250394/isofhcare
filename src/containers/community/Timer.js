import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import dateUtils from 'mainam-react-native-date-utils';
import objectUtils from '@utils/object-utils';
export default function Timer(props) {
  const WARNING_TIME = 25 * 60 * 1000;
  const TOTAL_TIME = 31 * 60 * 1000;
  const inteval = useRef(null);
  const time = useRef(0);
  const timeout = useRef(null);
  const [state, _setState] = useState({});
  const setState = (
    data = {
      warn: false,
      time: 0,
      timeRemain,
    },
  ) => {
    _setState(state => {
      return {...state, ...data};
    });
  };
  const countUpTimer = () => {
    if (!inteval.current)
      inteval.current = setInterval(() => {
        time.current += 1000;
        let warn = state.warn;
        let timeRemain = TOTAL_TIME - time.current;
        if (time.current > WARNING_TIME) {
          warn = true;
        }
        setState({
          time: time.current,
          warn,
          timeRemain,
        });
      }, 1000);
  };

  useEffect(() => {
    setState(props.data);

    if (props.data.mediaConnected) {
      countUpTimer();
    } else {
    }

    return () => {
      if (inteval.current) {
        try {
          clearInterval(inteval.current);
          inteval.current = null;
        } catch (error) {}
      }
    };
  }, [props.data]);

  const renderAcademic = academicDegree => {
    if (academicDegree) {
      switch (academicDegree) {
        case 'BS':
          return 'BS.';
        case 'ThS':
          return 'Ths.';
        case 'TS':
          return 'TS.';
        case 'PGS':
          return 'PGS.';
        case 'GS':
          return 'GS.';
        case 'BSCKI':
          return 'BSCKI.';
        case 'BSCKII':
          return 'BSCKII.';
        case 'GSTS':
          return 'GS.TS.';
        case 'PGSTS':
          return 'PGS.TS.';
        case 'ThsBS':
          return 'Ths.BS.';
        case 'ThsBSCKII':
          return 'Ths.BSCKII.';
        case 'TSBS':
          return 'TS.BS.';
        default:
          return '';
      }
    } else {
      return '';
    }
  };
  return (
    <View style={{}}>
      <Text style={styles.userId}>
        {state?.booking?.name
          ? state.booking.name
          :objectUtils.renderAcademic(state?.booking?.doctor?.academicDegree)
          }
        {state.booking?.doctor?.name || ''}
      </Text>
      {state.mediaConnected ? (
        <Text style={styles.callState}>
          {state.time?.toDateObject().format('mm:ss')}
        </Text>
      ) : null}
      {state.warn ? (
        <Text
          style={{
            color: '#FFF',
            fontSize: 20,
            textAlign: 'center',
            paddingHorizontal: 20,
          }}>
          Thời gian gọi còn lại của bạn là{' '}
          {state.timeRemain?.toDateObject().format('mm')} phút
        </Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  userId: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  callState: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
});
