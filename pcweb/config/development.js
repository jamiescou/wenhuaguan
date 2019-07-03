let config = {
    multiMediaServer: {
        //    host: 'http://120.77.85.181:9000/resource/',
        // host: 'http://139.196.160.251:8001/',
        //   host: 'http://192.168.0.45:3411',
        // filePath: 'C:/hnimg'
        host: 'http://106.14.79.145:8001/',
        // host: 'http://192.168.0.48:8001',
        filePath: '/data/filestorage'
    },
    apiServer: {
        // host: 'http://192.168.3.33:3411',
        // host: 'http://139.196.160.251:4412',
        // host: 'http://192.168.0.48:3411',
        host: 'http://139.196.160.251:4412',
    },
    wechart: {
        "appID": "wx664cf9116e062982",
        // "appSecret": "9fd088597fa9fd02619fb8443f89d277",
        "appSecret": "29e196beac5c143f1c3bbdc7d4a35083",
         "domain": "hnsgtest.fm918.top"
     
    },
    redis: {
        port: 6379,
        host: '192.168.0.123',
        db: 10,
        options: {
            return_buffers: false,
        }
    },
    serverPort: 3107
}
module.exports = config;