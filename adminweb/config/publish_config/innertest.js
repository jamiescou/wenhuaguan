let config = {
    port: 4101,
    env: 'innertest',
    proxyTable: {
        '/oauth/token': {
            target: 'http://10.30.32.238:4412',
            changeOrigin: true,
            pathRewrite: {
                '^/oauth/token': '/oauth/token'
            }
        },
        '/api/v1': {
            target: 'http://10.30.32.238:4412',
            changeOrigin: true
        }
    },
    base: {
        'baseAuth': {
            'username': 'admin-client',
            'password': '123'
        },
    // 'resource': 'http://file.creatoo.cn/',
        rootDir: '/data/filestorage', // 初始位置
        UrlPrefix: 'http://106.14.79.145:8001/' /* 访问路径前缀 */
    }
}
module.exports = config;
