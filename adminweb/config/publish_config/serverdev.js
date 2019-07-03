let config = {
    port: 3111,
    env: 'dev',
    proxyTable: {
        '/oauth/token': {
            target: 'http://119.23.14.134:3411',
            changeOrigin: true,
            pathRewrite: {
                '^/oauth/token': '/oauth/token'
            }
        },
        '/api/v1': {
            target: 'http://119.23.14.134:3411',
            changeOrigin: true
        }
    },
    base: {
        'baseAuth': {
            'username': 'admin-client',
            'password': '123'
        },
        rootDir: 'c:/hnimg', // 初始位置
        UrlPrefix: 'http://192.168.0.244:3111' /* 访问路径前缀 */
    }
}
module.exports = config;
