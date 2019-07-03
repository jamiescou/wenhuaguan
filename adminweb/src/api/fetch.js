import axios from 'axios'
import store from '@/stores';
import router from '@/routes';
import { LOGOUT } from '@/stores/types';
import { Message } from 'element-ui'

/**
 *  错误返回码
 */
const STATUS = {
    SUCCESS: 200,
    /**
     * 系统错误
     */
    SYS_ERR: 500,
    /**
     * 业务请求异常
     */
    BIZ_ERR: 400,
    /**
     * 未授权
     */
    NO_AUTH: 401,
    /**
     * 服务连接异常
     */
    SEVER_ERR: 504
}

/**
 * 错误提示
 */
const MSG = {
    /**
     * 未知错误提示
     */
    unknown_error: '发生异常错误,请刷新页面重试,或联系程序员',
    /**
     * 未授权
     */
    no_auth: '账号授权信息已过期，请重新登录',
    /**
     * 服务连接异常提示
     */
    sever_error: '服务器不可用，请联系管理员'
}

function showTip(msg) {
    Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
    });
}

const PREFIX = '/api/v1'
export default function _fetch(options) {
    let urlPrefix = PREFIX;
    if (options.isLogin || options.isLocal) urlPrefix = '';
    // if (options.isLocal) urlPrefix = '/local';
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            baseURL: urlPrefix,
            timeout: 20000,
            headers: { 'Content-Type': 'application/json' }
        });

        // http request 拦截器
        instance.interceptors.request.use(config => {
            const user = store.getters.user;
            let allchildren = sessionStorage.getItem('allchildren');
            // let orgchildren = sessionStorage.getItem('orgchildren');
            let url = config.url;
            if (url.indexOf('/packageDownloadWorks?worksIds') !== -1) {
                // 作品导出 延时1分钟
                config.timeout = 60000
            }
            if (config.method === 'get') {
                if (user.username === 'admin') {
                    url = url.replace(/searchDataDeptId/g, '');
                    url = url.replace(/searchUnitId/g, '');
                } else if (user && user.id) {
                    // url = url.replace(/searchDataDeptId/g, 'dataDeptId:' + allchildren);
                    // url = url.replace(/searchUnitId/g, 'unitId:' + orgchildren);
                    // url = url.replace(/searchDataDeptId/g, 'dataDeptId:' + user.unit.id + '-allchildren');
                    if (url.indexOf('searchDataDeptId') > 0) {
                        Object.assign(config.headers, { 'dataDeptId': allchildren });
                    }
                    url = url.replace(/searchDataDeptId/g, '');
                    url = url.replace(/searchUnitId/g, 'unitId:' + user.orgUnit.id);
                }
            };
            config.url = url;
            // console.log(url)
            const token = store.getters.token;
            if (token && token.accesstoken) {
                Object.assign(config.headers, { 'Authorization': token.tokenType + ' ' + token.accesstoken })
            }
            if (user && user.username) {
                Object.assign(config.headers, { 'creatorId': user.username })
            }
            // console.log('--config',config)
            // console.log('configconfigconfigconfig', config)
            return config;
        }, err => {
            return Promise.reject(err);
        });
        instance(options).then(response => {
            // console.log('responseresponseresponseresponse', response)
            const curUrl = response.config.url
            if (curUrl.indexOf('/packageDownloadWorks?worksIds') !== -1) {
                resolve(response);
                return
            }
            const res = response.data;
            resolve(res);
        }).catch(error => {
            if (error.response) {
                const status = error.response.status;
                switch (status) {
                    case STATUS.NO_AUTH:
                        showTip(MSG.no_auth);
                        store.commit(LOGOUT); // 401 清除token信息并跳转到登录页面
                        router.replace({
                            path: '/login',
                            query: { from: router.currentRoute.fullPath }
                        })
                        break;
                    case STATUS.SYS_ERR:
                        showTip(MSG.unknown_error);
                        break;
                    case STATUS.BIZ_ERR:
                        if (error.response.data.error === 'invalid_grant') {
                            Message({
                                message: '用户名或密码错误',
                                type: 'error',
                                duration: 5 * 1000
                            });
                        } else {
                            showTip(error.response.data.message);
                        }
                        break;
                    case STATUS.SEVER_ERR:
                        showTip(MSG.sever_error);
                        break;
                    default:
                        showTip(error.response.statusText);
                        break;
                }
                console.info(error.response)
                reject(error.response.data);
            } else {
                showTip(MSG.unknown_error);
                reject(error)
            }
        });
    });
}

export function pageInfo(page, size) {
    return '&page=' + (page - 1) + '&size=' + size;
}
