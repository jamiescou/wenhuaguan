import config from '../../config';
import WechatOAuth from '../wechat-lib/oauth'
import Wechat from '../wechat-lib'
import path from 'path'
import fs from 'fs-extra'

let wechat_file = path.resolve(__dirname, '../../config/wechat.txt')
let tick_file = path.resolve(__dirname, '../../config/tick.txt')
fs.ensureFileSync(wechat_file)
fs.ensureFileSync(tick_file)

async function getAccessToken() {
    let token = await fs.readFile(wechat_file, 'utf8')
    try {
        token = JSON.parse(token)
        token.access_token = token.token
        return token
    } catch (error) {
        return null;
    }

}

async function saveAccessToken(data) {
    let token = await fs.readFile(wechat_file, 'utf8')

    let tokenInfo = {
        name: 'access_token',
        token: data.access_token,
        expires_in: data.expires_in
    }
    await fs.writeFile(wechat_file, JSON.stringify(tokenInfo))
}

async function getTicket() {
    try {
        let ticket = await fs.readFile(tick_file, 'utf8')
        ticket = JSON.parse(ticket)
        ticket.ticket = ticket.ticket
        return ticket
    } catch (error) {
        return null;
    }
}

async function saveTicket(data) {
    let TicketInfo = {
        name: 'ticket',
        ticket: data.ticket,
        expires_in: data.expires_in
    }
    await fs.writeFile(tick_file, JSON.stringify(TicketInfo))
}

// wechat配置
const wechatConfig = {
    wechat: {
        appID: config.wechat.appID,
        appSecret: config.wechat.appSecret,
        token: config.wechat.token,
        getAccessToken: async () => await getAccessToken(),
            saveAccessToken: async (data) => await saveAccessToken(data),
                getTicket: async () => await getTicket(),
                    saveTicket: async (data) => await saveTicket(data)
    }
}

const getOAuth = () => {
    const oauth = new WechatOAuth(wechatConfig.wechat)
    return oauth
}

const getWechat = () => {
    const wechatClient = new Wechat(wechatConfig.wechat)

    return wechatClient
}

// =================================================================================================

export function getAuthorizeURL(...args) {
    const oauth = getOAuth()

    return oauth.getAuthorizeURL(...args)
}

export async function getUserByCode(code) {
    const oauth = getOAuth()
    const data = await oauth.fetchAccessToken(code)
    const user = await oauth.getUserInfo(data.access_token, data.unionid)

    return {
        nickname: user.nickname,
        province: user.province,
        country: user.country,
        city: user.city,
        unionid: user.unionid,
        headimgurl: user.headimgurl,
        sex: user.sex
    }
}

let client = null;
// 获取签名
export async function getSignatureAsync(url) {
    if (!client) {
        client = getWechat()
    }
    const data = await client.fetchAccessToken()
    const token = data.access_token
    const ticketData = await client.fetchTicket(token)
    const ticket = ticketData.ticket

    let params = client.sign(ticket, url)
    params.appId = client.appID
    params.url = url

    return params
}
