let config = {
    port: 3001,
    env: 'product',
    proxyTable: {
        '/oauth/token': {
            target: 'http://172.168.10.7:8181',
            changeOrigin: true,
            pathRewrite: {
                '^/oauth/token': '/oauth/token'
            }
        },
        '/api/v1': {
            target: 'http://172.168.10.7:8181',
            changeOrigin: true
        }
    },
    base: {
        'baseAuth': {
            'username': 'admin-client',
            'password': '123'
        },
        // 'resource': 'http://file.creatoo.cn/',
        rootDir: '/mnt/smb/website-storage', // 初始位置
        UrlPrefix: 'http://file.hns-whg.cn/' /* 访问路径前缀 */
    }
}
module.exports = config;
