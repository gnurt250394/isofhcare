import client from '@utils/client-utils';
import constants from '@resources/strings';
export default {
  uploadEhealth(params, id) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        params ? 'post' : 'get',
        `${constants.api.ehealth.upload_ehealth}${id ? `/${id}` : ''}`,
        params ? params : {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  updateEhealth(params, id) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        `${constants.api.ehealth.upload_ehealth}/` + Number(id),
        params,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getGroupPatient(hospitalId) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        `${constants.api.ehealth.get_group_patient}?hospitalId=${hospitalId}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id) {
    var body = {
      note: note,
      suggestions: suggestions,
      time: time,
      medicineTime: medicineTime,
      isMedicineTime: isMedicineTime ? isMedicineTime : 0,
    };
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        `${constants.api.ehealth.update_data_user}/${id}`,
        body,
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  search(page, size, queryString) {
    let active = 1;
    let specialistId = -1;
    let type = 2;
    let roleId = -1;
    let style = -1;
    let name = queryString && queryString.isPhoneNumber() ? 'phone' : 'name';
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        `${
          constants.api.ehealth.search_profile_user
        }?page=${page}&size=${size}&${name}=${queryString}&active=${active}&specialistId=${specialistId}&type=${type}&roleId=${roleId}&style=${style}`,
        {},
        (s, e) => {
          if (s) {
            resolve(s);
          }
          reject(e);
        },
      );
    });
  },
  shareWithProfile(
    recieveUserId,
    hospitalId,
    patientHistoryId,
    fromDate,
    toDate,
  ) {
    let body = {
      recieveUserId: recieveUserId,
      hospitalId: hospitalId,
      patientHistoryId: patientHistoryId,
      fromDate,
      toDate,
    };
    return new Promise((resolve, reject) => {
      client.requestApi(
        'post',
        constants.api.ehealth.share_with_profile,
        body,
        (s, e) => {
          if (s) resolve(s);
          else {
            reject(e);
          }
        },
      );
    });
  },
  getListShareUser(hospitalId) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        `${constants.api.booking.get_list_share_user}?hospitalId=${hospitalId}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else {
            reject(e);
          }
        },
      );
    });
  },
  addEhealthWithCode(hospitalId, patientHistoryId) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'put',
        `${
          constants.api.ehealth.add_ehealth_with_code
        }/${hospitalId}/${patientHistoryId}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },

  getListEhelthWithProfile(userProfileId) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        `${
          constants.api.ehealth.get_list_ehealth_with_profile
        }/${userProfileId}/patient-histories`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
  getDetail(id) {
    return new Promise((resolve, reject) => {
      client.requestApi(
        'get',
        `${constants.api.ehealth.get_detail_ehealth}/${id}`,
        {},
        (s, e) => {
          if (s) resolve(s);
          else reject(e);
        },
      );
    });
  },
};
