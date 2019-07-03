import request from 'request-promise'

const base = 'https://api.weixin.qq.com/sns/'
const api = {
  authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
  accessToken: base + 'oauth2/access_token?',
  userInfo: base + 'userinfo?'
}

/**
 * 微信授权相关内容
 * 
 * @export
 * @class WechatOAuth
 */
export default class WechatOAuth {
  constructor(opts) {
    this.appID = opts.appID
    this.appSecret = opts.appSecret
  }

  async request(options) {
    options = Object.assign({}, options, {
      json: true
    })

    try {
      const response = await request(options)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 微信网页授权
   * 
   * @param {string} [scope='snsapi_base'] 应用授权作用域，snsapi_base、snsapi_userinfo
   * @param {any} target 回调地址
   * @param {any} state 
   * @returns url
   */
  getAuthorizeURL(scope = 'snsapi_base', target, state) {
    // 【必须】 baseUrl:https://open.weixin.qq.com/connect/oauth2/authorize?
    // 【必须】 redirect_uri	授权后重定向的回调链接地址，请使用urlEncode对链接进行处理
    // 【必须】 response_type 返回类型，请填写code
    // 【必须】 scope 应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取其信息）
    // state 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
    // 【必须】 #wechat_redirect	无论直接打开还是做页面302重定向时候，必须带此参数
    const url = `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`

    return url
  }

  async fetchAccessToken(code) {
    const url = `${api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`
    const data = await this.request({
      url: url
    })

    return data
  }

  async getUserInfo(token, openID, lang = 'zh_CN') {
    const url = `${api.userInfo}access_token=${token}&openid=${openID}&lang=${lang}`

    const data = await this.request({
      url: url
    })

    return data
  }
}