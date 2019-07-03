const Koa = require('koa')
const { Nuxt, Builder } = require('nuxt')
const R = require('ramda')
const { resolve } = require('path')
import conf from '../config'

let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const resolvePath = path => resolve(__dirname, path)
const port = process.env.PORT || conf.port
const MIDDLEWARES = ['common', 'router']

class Server {
    constructor() {
        this.app = new Koa()
        const { addBody, addSession, addToken, addUnit, handlerError } = require('./middlewares/common');
        const { router } = require('./middlewares/router');
        addBody(this.app);
        addSession(this.app);
        handlerError(this.app);
        addToken(this.app);
        addUnit(this.app);
        router(this.app);
        //this.useMiddleWares(this.app)(MIDDLEWARES)

    }

    // 中间件
    // useMiddleWares(app) {
    //     return R.map(R.compose(
    //         R.map(i => i(app)),
    //         require,
    //         i => `${resolvePath('./middlewares')}/${i}`
    //     ))
    // }

    async start() {
        // 实例化Nuxt.js
        const nuxt = await new Nuxt(config)

        // 开发构建
        if (config.dev) {
            try {
                const builder = new Builder(nuxt)
                await builder.build()
            } catch (e) {
                console.error(e) // eslint-disable-line no-console
                process.exit(1)
            }
        }

        this.app.use(async (ctx, next) => {
            ctx.status = 200
            ctx.req.session = ctx.session
            ctx.req.state = ctx.state
            ctx.req.curUnit = ctx.curUnit
            return new Promise((resolve, reject) => {
                ctx.res.on('close', resolve)
                ctx.res.on('finish', resolve)

                nuxt.render(ctx.req, ctx.res, promise => {
                    promise.then(resolve).catch(reject)
                })
            })
        })
        const serv = this.app.listen(port);
        /**
         * 聊天室
         */
        var ioredis = require('ioredis')
        var io = require('socket.io')(serv);

        var redisPubConn = new ioredis(conf.redis);
        var redisSubConn = new ioredis(conf.redis);
        var msgTopic = "live_chat"; //直播间消息主题名称
        redisSubConn.subscribe(msgTopic);
        redisSubConn.on("message", function(channel, message) {
            var msg = JSON.parse(message);
            var roomId = msg.roomId;
            if (roomId != 'test') {
                io.sockets.to(roomId).emit('message', msg);
            }
        });

        io.on('connection', function(socket, params) {
            var roomid = socket.handshake.query.roomid;
            socket.join(roomid);
            socket.on('message', function(message) {
                redisPubConn.publish(msgTopic, message, function(res) {});
            })
        });
    }
}

const app = new Server()

app.start()
