const _ = require('lodash')
let custConf = {};
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV) {
    let configPath = './' + process.env.NODE_ENV;
    custConf = require(configPath.trim());
}
const defaultConfig = {
    port: 3333,
    app: {
        proxyTable: {},
        base: {}
    },
    base: {
        rootDir: '', // 初始位置
        UrlPrefix: '' /* 访问路径前缀 */
    }
};

let configs = _.merge(defaultConfig, custConf); // 相同的属性会覆盖
module.exports = configs;
