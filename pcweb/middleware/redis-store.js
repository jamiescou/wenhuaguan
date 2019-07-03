const Redis = require('ioredis')
const { Store } = require('koa-session2')
const config =require('../config')

  class RedisStore extends Store {
    constructor(redisConfig) {
        super();
        this.redis = new Redis(redisConfig);
    }
    async get(sid, ctx) {
        let data = await this.redis.get(`SESSION:${sid}`);
        return JSON.parse(data);
    }

    async set(session, {sid = this.getID(24),maxAge = 1000000} = {}, ctx) {
            try { 
            // sid=this.getID(24);
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
            return sid;
        } catch (e) {
            return false;
        }
    }

    async destroy(sid, ctx) {
        return await this.redis.del(`SESSION:${sid}`);
    }
}

//连接redis 
const clientCreate = (config, callback_) => {
    let redis = new Redis(config)
    redis.on('connect', () => { //根据 connect 事件判断连接成功
        callback_(null, redis) //链接成功， 返回 redis 连接对象
    })
    redis.on('error', (err) => { //根据 error 事件判断连接失败
        callback_(err, null) //捕捉异常， 返回 error
    })
}
  const redisConn = (conf) => {
    
    return new Promise((resolve, reject) => { //返回API调用方 一个 promise 对象
        clientCreate(conf, (err, conn) => {
            if (err) {
                reject(err) //返回 err
            }
            resolve(conn) //返回连接对象
        })
    })
}



  class redisObj {
    constructor() {
        this.redis = null;
    }
    /**
     * 创建连接对象
     */
    async connection() {
        
        if (this.redis) {
           
            return true;
        } else {
            try {
                this.redis = await redisConn(config.redis)
                return true;
            } catch (error) {
                console.log('redis连接错误:', error)
                return false;
            }
        }
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
            console.log('redis设置错误:', error)
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
            console.log('redis设置错误:', error)
            return false;
        }
        if (expire && expire > 0) {
            try {
                this.redis.expire(`${id}`, expire)
            } catch (error) {
                console.log('过期时间设置错误：', error)
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

module.exports = {RedisStore,redisObj};