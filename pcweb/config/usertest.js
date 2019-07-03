let config = {
    multiMediaServer: {
        host: 'http://119.23.14.134:8001/',
        filePath: '/data/filestorage'
    },
    apiServer: {
        host: 'http://119.23.14.134:3413',
    },
    wechart: {
        "appID": "wx664cf9116e062982",
        "appSecret": "29e196beac5c143f1c3bbdc7d4a35083",
        "domain": "hnsgtest.fm918.top"
    },
    redis: {
        port: 7813,
        host: "172.18.91.114",
        db: 2,
        options: {
            return_buffers: false,
            auth_pass: ''
        }
    },
    serverPort: 3103
}
module.exports = config;