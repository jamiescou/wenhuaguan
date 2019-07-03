let axios = require('axios');
const config = require('../config')
const logUtil = require('../util/log-util');

const PREFIX = config.apiServer.host;

function fetch(options) {

   
    let urlPrefix = PREFIX;
    if (!options.isLogin) urlPrefix += '/api/v1';
    return new Promise((resolve, reject) => {
        let headers = options.headers ? options.headers : {
            'Content-Type': 'application/json'
        };
        const token = global['szwhg_token'];
        if (token && token.accesstoken) {
            headers['Authorization'] = token.tokenType + ' ' + token.accesstoken;
        }
        const instance = axios.create({
            baseURL: urlPrefix,
            timeout: 10000, // 超时
            headers: headers
        });
        instance(options)
            .then(response => {
                const res = response.data;
                resolve(res);
            })
            .catch(error => {
                logUtil.logError(error.config, error); // 记录异常日志

                if (error.response) {
                    // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                    let response = error.response;
                    switch (response.status) {
                        case 401:
                            global['szwhg_token'] = null;
                            break;
                    }
                }
              
                reject(error);
            });
    });
}
module.exports = fetch
