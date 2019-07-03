let config = {
    multiMediaServer: {
        host: 'http://file.hns-whg.cn/',
        filePath: '/mnt/smb/website-storage'
    },
    apiServer: {
        host: 'http://172.168.10.7:8181',
    },
    wechart: {
        "appID": "wx5f87705e62c31cb7",
        "appSecret": "83399f2993ce1e4c36da6dd026238762",
        "domain": "www.hns-whg.cn"
    },
    redis: {
        port: 6379,
        host: '172.168.10.7',
        db: 12,
        options: {
            return_buffers: false,
            auth_pass: ''
        }
    },
    serverPort: 3000
}
module.exports = config;