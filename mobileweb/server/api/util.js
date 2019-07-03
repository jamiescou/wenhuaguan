import config from '../../config'
import crypto from 'crypto';
const ioredis = require('ioredis') //引入 ioredis

/**
 * 获取文件的完整路径
 * @param {String} url 文件地址
 */
export function getFileUrl(url) {
    if (url === null || url === undefined || url === '') return '';
    else if (url.indexOf('http') === 0) return url;
    return config.cloudinary.image + url;
}

// ======================   枚举常量   ======================
// 性别
export const SEX = { 'male': '男', 'female': '女', 'unkown': '保密' }

// 关系
export const RELATION = {
    'children': '子女',
    'parent': '父母',
    'mate': '夫妻',
    'friend': '朋友',
    'self': '本人'
};

// 认证状态
export const IDENTIFY_STATUS = {
    'Not': '未认证',
    'Wait': '审核中',
    'Yes': '已认证',
    'Fail': '认证失败'
};

// 场馆预定状态
export const VENUE_ORDER_STATUS = {
    'created': '待审核',
    'success': '预定成功',
    'reject': '审核不通过',
    'cancel': '已取消'
}

// 培训报名状态
export const TRAIN_ORDER_STATUS = {
    'WaitAudit': '待审核',
    'Success': '审核通过',
    'Rejected': '审核不通过',
    'Canceled': '已取消'
}

// 活动订单状态
export const ORDER_STATUS = {
    'reserved': '未验票',
    'drawn': '已取票',
    'canceled': '已退订'
}

export function getFullAddress(region, address) {
    if (region) {
        address = region.fullName.substr(3).replace(/,/g, '') + ' ' + address
    }
    return address
}

/**
 * @aes192加密模块
 * @param str string 要加密的字符串
 * @param secret string 要使用的加密密钥(要记住,不然就解不了密啦)
 * @retrun string 加密后的字符串
 * */
export function getEncAse192(str, secret) {
    var cipher = crypto.createCipher("aes192", secret); //设置加密类型 和 要使用的加密密钥
    var enc = cipher.update(str, "utf8", "hex"); //编码方式从utf-8转为hex;
    enc += cipher.final("hex"); //编码方式从转为hex;
    return enc; //返回加密后的字符串
}

//连接redis 
let clientCreate = (config, callback_) => {
    let redis = new ioredis(config)
    redis.on('connect', () => { //根据 connect 事件判断连接成功
        callback_(null, redis) //链接成功， 返回 redis 连接对象
    })
    redis.on('error', (err) => { //根据 error 事件判断连接失败
        callback_(err, null) //捕捉异常， 返回 error
    })
}
export const redisConn = (options) => {
    let conf = options || config.redis
    return new Promise((resolve, reject) => { //返回API调用方 一个 promise 对象
        clientCreate(conf, (err, conn) => {
            if (err) {
                reject(err) //返回 err
            }
            resolve(conn) //返回连接对象
        })
    })
}

export class RedisStore {
    constructor() {
        this.redis = null;
    }
    /**
     * 创建连接对象
     */
    async connection() {
        try {
            this.redis = await redisConn()
            return true;
        } catch (error) {
            // console.log('redis连接错误:', error)
            return false;
        }
        // if (this.redis) {

        //     return true;
        // } else {
        //     try {
        //         this.redis = await redisConn()
        //         return true;
        //     } catch (error) {
        //         // console.log('redis连接错误:', error)
        //         return false;
        //     }
        // }
    }
    /**
     * 存入redis
     * 
     * @param {any} id 唯一key
     * @param {any} data 存入的数据
     * @returns 返回key 异常返回false
     */
    async setData(id, data, expire) {
        try {
            await this.redis.set(`${id}`, JSON.stringify(data))
            return `${id}`;
        } catch (error) {
            return false;
        }
    }

    /**
     * 存入redis，有过期时间
     * 
     * @param {any} id 唯一key
     * @param {any} data 存入的数据
     * @param {any} expire 过期时间长度，单位秒
     * @returns 返回key 异常返回false
     */
    async setDataExpire(id, data, expire) {
        try {
            await this.redis.set(`${id}`, JSON.stringify(data), 'ex', expire) // ex 为过期时间，单位为秒
            return `${id}`;
        } catch (error) {
            // console.log('redis设置错误:', error)
            return false;
        }
    }

    /**
     * 存入redis，格式为散列map格式
     * 
     * @param {any} id map的key
     * @param {any} data json格式或map格式
     * @param {any} expire 过期时间
     * @returns 保存成功返回map的key，异常返回false
     */
    async setHashData(id, data, expire) {
        try {
            await this.redis.hmset(`${id}`, data)
        } catch (error) {
            // console.log('redis设置错误:', error)
            return false;
        }
        if (expire && expire > 0) {
            try {
                this.redis.expire(`${id}`, expire)
            } catch (error) {
                // console.log('过期时间设置错误：', error)
                return false;
            }
        }
        return `${id}`;
    }
    /**
     * 根据key从redis中获取值
     * 
     * @param {any} id key
     * @returns 内容，异常返回false
     */
    async getData(id) {
        try {
            let data = await this.redis.get(`${id}`)
            return JSON.parse(data)
        } catch (error) {
            // console.log('redis获取值err', error)
            return false
        }
    }
    /**
     * 获取指定散列键的值
     * 
     * @param {any} id 散列key
     * @param {any} dataKey 键key
     * @returns 
     * @memberof RedisStore
     */
    async getHashData(id, dataKey) {
        try {
            let data = await this.redis.hget(`${id}`, dataKey);
            return data
        } catch (error) {
            // console.log('redis获取值err', error)
            return false
        }
    }
    /**
     * 根据key删除redis对应的键值对
     * 
     * @param {any} id 
     * @returns 删除成功返回true，删除失败返回falas
     */
    async delData(id) {
        try {
            await this.redis.del(`${id}`)
            return true
        } catch (error) {
            return false
        }
    }
    /**
     * 根据key验证是否存在
     * 
     * @param {any} key 
     * @returns true存在，false不存在
     */
    async exists(key) {
        try {
            let result = await this.redis.exists(key)
            return result === 1; // 1 key存在  0 key不存在
        } catch (error) {
            return false
        }
    }
}
