let path = require('path')
const fs = require('fs');

//日志根目录
let baseLogPath = path.resolve(__dirname, '../../pc_logs');
var errorLogPath = path.join(baseLogPath, 'error'); // 错误日志输出完整路径
var responseLogPath = path.join(baseLogPath, 'info.log'); // 响应日志输出完整路径
var busLogPath = path.join(baseLogPath, 'bus.log'); // 响应日志输出完整路径

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
let isexist = void 0;
isexist = fs.existsSync(baseLogPath);
if (!isexist) {
    fs.mkdirSync(baseLogPath, '0777');
}

const productLogConfig = {
    pm2: true, // 如果是用pm2启动程序，需要设置true
    // 配置输出源
    appenders: {
        // 响应日志
        resLogger: {
            type: 'file',
            filename: responseLogPath,
            maxLogSize: 10 * 1024 * 1024, // = 10Mb
            numBackups: 5, // keep five backup files
            encoding: 'utf-8',
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p][%c]%n%m%n'
            }
        },
        // 错误日志
        errorLogger: {
            'type': 'dateFile', // 日志类型
            'filename': errorLogPath, // 日志输出位置
            'alwaysIncludePattern': true, // 只在type:datefile模式有效
            'pattern': '-yyyy-MM-dd.log', // datefile模式有效.表示一个文件的时间命名模式.
            'encoding': 'utf-8',
            'daysToKeep': 10, // 保留天数
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p][%c]%n%m%n'
            }
        },
        // 错误日志
        busLogger: {
            'type': 'dateFile', // 日志类型
            'filename': busLogPath, // 日志输出位置
            'alwaysIncludePattern': true, // 只在type:datefile模式有效
            'pattern': '-yyyy-MM-dd.log', // datefile模式有效.表示一个文件的时间命名模式.
            'encoding': 'utf-8',
            // 'daysToKeep': 10, // 保留天数
            layout: {
                type: 'pattern',
                pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p][%c]%n%m%n'
            }
        },
        out: {
            type: 'stdout'
        },
        console: {
            type: 'console'
        }
    },
    // 供外部调用的名称和对应设置定义
    categories: {
        default: {
            appenders: ['console', 'out'],
            level: 'all'
        },
        errorLogs: {
            appenders: ['errorLogger'],
            level: 'error'
        },
        resLogs: {
            'appenders': ['resLogger'],
            'level': 'info'
        },
        busLogs:{
            'appenders': ['busLogger'],
            'level': 'info'
        }
    }
}

const devLogConfig = {
    appenders: {
        out: {
            type: 'stdout'
        },
        console: {
            type: 'console'
        },
        // 响应日志
        resLogger: {
            'type': 'console',
            layout: {
                type: 'pattern',
                pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}]%] [%p]%n%m%n'
            }
        },
        // 错误日志
        errorLogger: {
            'type': 'console',
            layout: {
                type: 'pattern',
                pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}]%] [%p]%n%m%n'
            }
        },
        busLogger: {
            'type': 'console',
            layout: {
                type: 'pattern',
                pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}]%] [%p]%n%m%n'
            }
        },
    },
    categories: {
        default: {
            appenders: ['console', 'out'],
            level: 'all'
        },
        errorLogs: {
            appenders: ['errorLogger'],
            level: 'error'
        },
        resLogs: {
            'appenders': ['resLogger'],
            'level': 'info'
        },
        busLogs:{
            'appenders': ['busLogger'],
            'level': 'info'
        }
    }
}

let isDevEnv = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? true : false;
 
// module.exports = isDevEnv ? devLogConfig : productLogConfig
module.exports = isDevEnv ? productLogConfig : productLogConfig