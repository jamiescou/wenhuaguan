let config = {
    multiMediaServer: {
        host: 'http://106.14.79.145:8001/',
        filePath: '/data/filestorage'
    },
    apiServer: {
        host: 'http://139.196.160.251:4412',
    },
    wechart: {
        "appID": "wx664cf9116e062982",
        "appSecret": "9fd088597fa9fd02619fb8443f89d277",
        "domain": "hnsgtest.fm918.top"
    },
    redis: {
        port: 6379,
        host: "10.30.234.231",
        db: 1,
        options: {
            return_buffers: false,
            auth_pass: ''
        }
    },
    serverPort: 4100
}
module.exports = config;