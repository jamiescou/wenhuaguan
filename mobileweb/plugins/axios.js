// ********************************************************************
// 页面（vue路由）请求，axios配置
// ********************************************************************
import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'
const PREFIX = '/api'
axios.defaults.baseURL = PREFIX;
axios.defaults.timeout = 10000;

let pending = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (config, f, urlPrefix) => {
    let flagUrl = (urlPrefix || '') + config.url + '&' + config.method
    if (pending.indexOf(flagUrl) !== -1) { // 当当前请求在数组中存在时执行函数体
        if (f) {
            f('操作被用户取消') // 执行取消操作
        } else {
            pending.splice(pending.indexOf(flagUrl), 1) // 把这条记录从数组中移除
        }
    } else {
        if (f) {
            pending.push(flagUrl)
        }
    }
}

export default ({ req }) => {
    const client = process.client
    const headers = req && req.headers
    axios.defaults.headers = headers
    if (process.server) {
        let baseUrl = `http://${req.headers.host}${PREFIX}`; // 服务端需要一个完整的url来工作
        axios.defaults.baseURL = baseUrl;
    }

    // 请求拦截，request 拦截
    axios.interceptors.request.use(config => {
      
        if (client&&config.url.indexOf('loading=false')<0) {
            Indicator.open()
        }

        if (config.method === 'post') {
            config.cancelToken = new cancelToken((c) => {
                removePending(config, c, PREFIX)
            });
        }
        return config
    }, err => {
        if (client) {
            Indicator.close();
        }
        // console.log('in requeset err');
        Toast({
            message: '加载超时',
            className: 'toast-tip',
            duration: 3000
        });

        return Promise.reject(err)
    })

    // 响应拦截
    axios.interceptors.response.use(response => {
        if (client) {
            Indicator.close();
        }
        if (response.config.method === 'post') {
            removePending(response.config);
        }
        return response
    }, error => {
        if (client) {
            Indicator.close();
        }
        // console.log(error.response && error.response.data ? error.response.data : '出错了')
        pending = [];
        return Promise.reject(error)
    })
}
