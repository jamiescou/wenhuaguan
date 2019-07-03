const Redis = require('ioredis')
const { Store } = require('koa-session2')
const uuid = require('uuid')

function RedisStore(cfg) {
    this.redis = new Redis(cfg);
}
RedisStore.prototype = Store;
RedisStore.prototype.get = async function(sid, ctx) {
    let data = await this.redis.get(`SESSION:${sid}`);
    return JSON.parse(data);
};

RedisStore.prototype.set = async function(session, { sid = uuid.v1(), maxAge = 1000000 } = {}, ctx) {
    try {
        await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
        return sid;
    } catch (e) {
        return false;
    }
}

RedisStore.prototype.destroy = async function(sid, ctx) {
    return await this.redis.del(`SESSION:${sid}`);
}

module.exports = RedisStore;
