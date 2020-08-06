import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';

// const Realm = require('realm');
import realmModel from '@models/realm-models';
export default {
  create(content, gender, age, specializations, images) {
    let params = {};
    if (content) params.content = content;
    if (gender || gender == 0) params.gender = gender;
    if (age) params.age = age;
    if (specializations) params.specializations = specializations;
    if (images) params.images = images;
    // alert(images);
    return new Promise((resolve, reject) => {
      // reject();
      client.requestApi(
        'post',
        client.serviceChats + constants.api.question.create,
        params,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getListLabel() {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        client.serviceCovid + constants.api.covid.surveys + '?label=covid19',
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getListQuestion(surveyId) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        client.serviceCovid +
          constants.api.covid.surveys +
          `/${surveyId}/questionnaires`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  createAnswer(questionnaireId, params) {
    return new Promise((resolve, reject) => {
      let url = constants.api.covid.annswer.replace(
        'questionnaireId',
        questionnaireId,
      );
      client.requestApi('put', client.serviceCovid + url, params, (s, e) => {
        if (s) resolve(s);
        else reject(e);
      });
    });
  },
};
