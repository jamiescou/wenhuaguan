// ************************************************
// 后端接口请求axios配置
// ************************************************
import config from '../../config'
import axios from 'axios'
const logUtil = require('./log-util');

const PREFIX = config.apiServer;

export default function fetch(options) {
    let urlPrefix = PREFIX;
    // console.log('路径：' + urlPrefix)
    if (!options.isLogin) urlPrefix += config.prefix; // '/api/v1';

    return new Promise((resolve, reject) => {
        const instance = axios.create({
            baseURL: urlPrefix,
            timeout: 10000, // 超时
            headers: {
                'accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json'
            }
        });
        // http request 拦截器
        instance.interceptors.request.use(config => {
            const token = global['szwhg_token'];
            if (token && token.accesstoken) {
                Object.assign(config.headers, { 'Authorization': token.tokenType + ' ' + token.accesstoken })
            }
            return config;
        }, err => {
            return Promise.reject(err);
        });

        instance(options)
            .then(response => {
                const res = response.data;
                resolve(res);
            })
            .catch(error => {
                logUtil.logError(error.config, error); // 记录异常日志
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            global['szwhg_token'] = null;
                            break;
                    }
                }
                reject(error);
            });
    });
}
