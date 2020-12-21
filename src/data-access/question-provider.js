import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

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
  listQuestionSocial(value, specialId, page, size) {
    return new Promise((resolve, reject) => {
      let params =
        '?page=' +
        page +
        '&size=' +
        size +
        (value ? '&searchValue=' + value : '') +
        (specialId ? '&specializationId=' + specialId : '');
      // reject();
      client.requestApi(
        'get',
        client.serviceChats +
          constants.api.question.list_question_social +
          params,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  sendMessage(id, content, images) {
    return new Promise((resolve, reject) => {
      // reject();
      let params = {};
      if (content) params.content = content;
      if (images) params.images = images;
      client.requestApi(
        'put',
        client.serviceChats +
          constants.api.question.list_anwser +
          `/${id}/commentary`,
        params,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  listAnwser(id, direction, page, size) {
    return new Promise((resolve, reject) => {
      // reject();
      let params =
        `?page=${page}&size=${size}` + (direction ? '&orderBy=id&direction=ASC' : '');
      client.requestApi(
        'get',
        client.serviceChats +
          constants.api.question.list_anwser +
          `/${id}/comments` +
          params,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  readQuestion(id) {
    return new Promise((resolve, reject) => {
      // reject();
      client.requestApi(
        'put',
        client.serviceChats +
          constants.api.question.list_anwser +
          `/${id}/ping`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getDetailQuestion(id) {
    return new Promise((resolve, reject) => {
      // reject();
      client.requestApi(
        'get',
        client.serviceChats + constants.api.question.list_anwser + `/${id}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getResultReview(userId) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        constants.api.question.get_result_review + '/' + userId,
        {},
        (s, e) => {
          if (s) resolve(s);
          if (e) reject(e);
        },
      );
    });
  },
  getListMyQuestion(page, size) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        client.serviceChats +
          constants.api.question.list_my_question +
          `?page=${page}&size=${size}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          if (e) reject(e);
        },
      );
    });
  },
  deleteMessage(idQuestion, idMessage) {
    return new Promise((resolve, reject) => {
      // reject();
      client.requestApi(
        'delete',
        client.serviceChats +
          constants.api.question.list_anwser +
          `/${idQuestion}/comments/${idMessage}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  setThanks(idQuestion) {
    return new Promise((resolve, reject) => {
      // reject();
      client.requestApi(
        'put',
        client.serviceChats +
          constants.api.question.list_anwser +
          `/${idQuestion}/thanks`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
};
