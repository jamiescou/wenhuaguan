// ************************************************
// 后台配置文件
// ************************************************

import assign from 'lodash/assign'
import { resolve } from 'path'
// import {
//     resolve
// } from 'path'

function getIpdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

const env = process.env.__ENV || 'development'
const conf = require('./' + env + '.json');
// console.log('当前环境变量：' + process.env.__ENV)
// console.log('配置文件：' + env + '.json')
// const conf = require(resolve(__dirname, `./${env}.json`))

let host = getIpdress();
// const host = process.env.HOST || (getIpdress() || 'localhost')
// let env = process.env.NODE_ENV || "development";
// let configPath = './' + env;
// const conf = require(configPath.trim());

export default assign({
    env,
    host
}, conf)
