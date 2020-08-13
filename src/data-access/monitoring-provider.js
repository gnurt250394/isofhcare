import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';

export default {
  createHeightWeight(date, height, weight) {
    console.log('date: ', date.format('yyyy-MM-dd'));
    let params = {};
    // new Date().toString()
    if (date) params.date = date.format('yyyy-MM-dd');
    if (height) params.height = Number(height);
    if (weight) params.weight = Number(weight);
    return new Promise((resolve, reject) => {
      client.requestApi(
        'post',
        constants.api.monitoring.height_weight,
        params,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },

  createBodyTemperature(date, bodyTemperature) {
    let params = {};
    if (date) params.date = date;
    if (bodyTemperature) params.bodyTemperature = Number(bodyTemperature);
    return new Promise((resolve, reject) => {
      client.requestApi(
        'post',
        constants.api.monitoring.body_temperature,
        params,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },

  createBloodPressure(date, diastolic, systolic) {
    let params = {};
    if (date) params.date = date.format('yyyy-MM-dd');
    if (systolic) params.systolic = Number(systolic);
    if (diastolic) params.diastolic = Number(diastolic);
    return new Promise((resolve, reject) => {
      client.requestApi(
        'post',
        constants.api.monitoring.blood_pressure,
        params,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getHeightWeight(page, size) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        constants.api.monitoring.height_weight + `?page=${page}&size=${size}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getBloodPressure(page, size) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        constants.api.monitoring.blood_pressure + `?page=${page}&size=${size}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getBodyTemperature(page, size) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        constants.api.monitoring.body_temperature +
          `?page=${page}&size=${size}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
};
