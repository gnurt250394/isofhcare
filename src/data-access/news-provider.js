import client from '@utils/client-utils';
import constants from '@resources/strings';
import dataCacheProvider from "@data-access/datacache-provider";

export default  {
    listNews(page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', client.serviceNews + constants.api.news.list_news + `?page=${page}&size=${size}&orderBy`, {}, (s, e) => {
                if (s) {
                    resolve(s)

                } else {
                    reject(e)
                }
            })
        })
    },
    listNewsByTopic(page, size, topicId) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', client.serviceNews + constants.api.news.list_news_by_topics + `/${topicId}/news?page=${page}&size=${size}&orderBy`, {}, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    detailNews(newsId) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', client.serviceNews + constants.api.news.details.replace('newsId', newsId), {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    listTopNews(topicId) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', client.serviceNews + constants.api.news.list_top_news.replace('topicId', topicId), {}, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    listKeyword(page, size, topicId) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', client.serviceNews + constants.api.news.list_keyword_news + `/${topicId}/keywords?page=${page}&size=${size}&orderBy`, {}, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    listTopics(page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', client.serviceNews + constants.api.news.list_topics + `?page=${page}&size=${size}&orderBy`, {}, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    searchNewsByTopic(id, page, size) {

        return new Promise((resolve, reject) => {
            client.requestApi('get', client.serviceNews + constants.api.news.search_news_by_topic + id + `/news?page=${page}&size=${size}&orderBy`, {}, (s, e) => {
                if (s) {
                    resolve(s)
                } else {
                    reject(e)
                }
            })
        })
    },
    saveCategories(data) {

    }
}
