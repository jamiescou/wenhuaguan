// let fileServer = 'http://119.23.14.134:3108';
let fileServer = 'http://139.196.160.251:8001';
// target: 'http://139.196.160.251:4412',

let config = {
    port: 3108,
    env: 'local',
    proxyTable: {
        '/oauth/token': {
            target: 'http://139.196.160.251:4412',

            // target: 'http://192.168.0.48:3411',
            changeOrigin: true,
            pathRewrite: {
                '^/oauth/token': '/oauth/token'
            }
        },
        '/api/v1': {
            // target: 'http://192.168.0.48:3411',
            target: 'http://139.196.160.251:4412',
            // target: 'http://119.23.14.134:3411',
            changeOrigin: true
        },
        '/ueditor': {
            target: fileServer,
            changeOrigin: true,
            pathRewrite: {
                '^/ueditor': '/ueditor'
            }
        },
        '/resource': {
            target: fileServer,
            changeOrigin: true,
            pathRewrite: {
                '^/resource': ''
            }
        }
    }
}
module.exports = config;