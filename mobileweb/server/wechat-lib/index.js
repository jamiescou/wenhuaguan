import request from 'request-promise'
import fs from 'fs'
import * as _ from 'lodash'
import path from 'path'
import { sign } from './util'

const base = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
    accessToken: base + 'token?grant_type=client_credential',
    ticket: {
        get: base + 'ticket/getticket?'
    }
}

export default class Wechat {
    constructor(opts) {
        this.opts = Object.assign({}, opts)
        this.appID = opts.appID
        this.appSecret = opts.appSecret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        this.getTicket = opts.getTicket
        this.saveTicket = opts.saveTicket

        this.fetchAccessToken()
    }

    async request(options) {
        options = Object.assign({}, options, { json: true })

        try {
            const response = await request(options)
            return response
        } catch (error) {
            console.error(error)
        }
    }

    // 获取Token
    async fetchAccessToken() {
        let data = await this.getAccessToken()

        if (!this.isValidToken(data, 'access_token')) {
            data = await this.updateAccessToken()
        }

        await this.saveAccessToken(data)

        return data
    }

    // 更新token
    async updateAccessToken() {
        const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret

        const data = await this.request({ url: url })
        const now = (new Date().getTime())
        const expiresIn = now + (data.expires_in - 20) * 1000 // 过期时间，因网络延迟等，将实际过期时间提前20秒，以防止临界点

        data.expires_in = expiresIn

        return data
    }

    // 验证token是否过期
    isValidToken(data, name) {
        if (!data || !data[name] || !data.expires_in) {
            return false
        }

        const expiresIn = data.expires_in
        const now = (new Date().getTime())

        if (now < expiresIn) {
            return true
        } else {
            return false
        }
    }

    // 获取微信JS接口的临时票据
    async fetchTicket(token) {
        let data = await this.getTicket()

        if (!this.isValidToken(data, 'ticket')) {
            data = await this.updateTicket(token)
        }

        await this.saveTicket(data)

        return data
    }

    // 更新临时票据
    async updateTicket(token) {
        const url = api.ticket.get + '&access_token=' + token + '&type=jsapi'

        let data = await this.request({ url: url })
        const now = (new Date().getTime())
        const expiresIn = now + (data.expires_in - 20) * 1000

        data.expires_in = expiresIn

        return data
    }

    async handle(operation, ...args) {
        const tokenData = await this.fetchAccessToken()
        const options = this[operation](tokenData.access_token, ...args)
        const data = await this.request(options)

        return data
    }

    sign(ticket, url) {
        return sign(ticket, url)
    }
}
