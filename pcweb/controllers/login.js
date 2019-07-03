const router = require('koa-router')()
const users = require('../models/users')
const activity = require('../models/activity')
const venues = require('../models/venues')
const train = require('../models/train')
const config = require('../config')
const test = require('../util/filter')
const assist = require('../util/assist')
const axios = require('axios')
const md5 = require('md5')
const logUtil = require('../util/log-util')
const LRU =require('lru-cache')
var UUID = require('uuid');

router.prefix('/login')

const CACHED =new LRU({
    max: 1000,
    maxAge: 1000*60*30
   })


router.post("/login", async (ctx, next) => {
  let data = ctx.request.body;
  let res = '';
  try {
    res = await users.login('mobile', data);
    ctx.session.user = res;
    var ID = UUID.v1();
    ctx.session.token=ID; 
    CACHED.set(ID,{id:res.id,name:res.nickname,mobile:res.mobile});
    ctx.body = {
      data: res
    }
  } catch (ex) {
    res = ex.response.data
    ctx.body = {
      data: res
    }
  }
  logUtil.logbusiness([data.mobile,'login','']);
});

router.get('/', async (ctx, next) => {
  let callbackurl = config.wechart.callbackurl;
  await ctx.render('login/index', {})
})
router.get('/register', async (ctx, next) => {
  await ctx.render('login/register', {
    content: ''
  })
})

router.get('/pswdforget', async (ctx, next) => {
  await ctx.render('login/pswdforget', {
    content: ''
  })
})

router.get('/pswdcomfirm/:mobile', async (ctx, next) => {
  await ctx.render('login/pswdcomfirm', {
    mobile: ctx.params.mobile
  })
})
router.get('/success', async (ctx, next) => {
  await ctx.render('login/success', {
    content: ''
  })
})



/**
 * 修改密码，发送验证码，需要先验证手机号有没有注册
 */
router.post('/vcodes', async (ctx, next) => {
  let mobile = ctx.request.body.mobile;
  let state = ctx.request.body.state; //newMobile:用户注册，必须是未注册手机号；registedMobile:忘记密码，必须是已经注册的手机号码;mobile:可以是任意手机号码;unbindMobile:微信绑定的时候，必须是没有绑定过微信的已有账号
  let signStrs = `mobile=${mobile}&flag=register`
  let signStrMd5 = ctx.request.body.signStr;
  let res = {};
  if (signStrMd5 !== md5(signStrs)){
      res.message = '非法操作！';
      ctx.body = res;
      return;
  }
  try {
    if (state != 'mobile') {
      let userList = await users.searchUserList('mobile:' + mobile);

      /**
       * 检验当前账号是否已经绑定已有账号
       */
      let wechartBind = false;
      if (userList.content.length > 0) {
        let user = userList.content[0];
        if (user.binds) {
          let wbind = user.binds.filter(item => item.type == 'weixin')
          if (wbind.length > 0) {
            wechartBind = true;
          }
        }
      }

      /**
       * 有三种情况可发送验证码
       * 分别对应于新账号注册；绑定已有账号；没有绑定微信的账号
       */
      if ((userList.content.length == 0 && state == 'newMobile') || (userList.content.length != 0 && state == 'registedMobile') || (!wechartBind && state == 'unbindMobile' && userList.content.length > 0)) {
        await users.sendVcodes(mobile);
        res = {
          status: 200,
          message: '验证码已下发到您手机，请注意查收!'
        }
      } else if (userList.content.length > 0 && wechartBind && state == 'unbindMobile') {
        res = {
          status: 400,
          message: '手机号' + mobile + '已绑定微信号,不能重复绑定'
        }
      }  else if ((state == 'registedMobile' && userList.content.length == 0)||(!wechartBind && state == 'unbindMobile')) {
        res = {
          status: 400,
          message: '手机号' + mobile + '未注册'
        }
      } else if (state == 'newMobile' && userList.content.length > 0) {
        res = {
          status: 400,
          message: '手机号' + mobile + '已注册'
        }
      }
    } else {
      await users.sendVcodes(mobile);
      res = {
        status: 200,
        message: '验证码发送成功，请注意查收!'
      }
    }
  } catch (ex) {
    res = ex.response.data;
  }
  ctx.body = res;
})

/**
 * 
 * 发送验证码
 */
router.post('/forgetvcodes', async (ctx, next) => {
  let mobile = ctx.request.body.mobile;
  let res = '';
  try {
    let userList = await users.searchUserList('mobile:' + mobile);
    if (userList.content.length == 0) {
      res = '手机号' + mobile + '未注册';
    } else {
      res = await users.sendVcodes(mobile);
    }
    ctx.body = {
      message: res
    }
  } catch (ex) {

    ctx.body = {
      message: ex.response.data
    };
  }


})

/**
 * 
 * 绑定用户账号
 *  1、手机验证码是否正确
 *  2、绑定账号
 */
router.post('/bindAccount', async (ctx, next) => {
  let mobile = ctx.request.body.mobile;
  let vcode = ctx.request.body.vcode;
  let wechartInfo = ctx.request.body.wechartInfo;
  let res = await users.verifyVcodes(mobile, vcode);

  if (res.success) {
    try {
      let userList = await users.searchUserList('mobile:' + mobile);

      let user = userList.content[0];
      let data = await users.modifyUserInfo(user.id, {
        binds: [{
          type: 'weixin',
          account: wechartInfo.binds[0].account
        }]
      });
      let newUserInfo = await users.fetchUserInfo(user.id);
      ctx.session.user = newUserInfo;
      ctx.body = {
        success: true,
        data: data
      };
      logUtil.logbusiness([ data.mobile,'bindWechat', wechartInfo.binds[0].account]);
    } catch (ex) {
      ctx.body = {
        success: false,
        data: ex
      };
      
    }
  } else {
    ctx.body = {
      success: false,
      data: '验证码错误'
    };
  }


})

//修改密码
router.post("/pass/:id", async (ctx) => {
  let content = ctx.request.body;
  let phone = ctx.params.id;
  let status = await users.editpassword(content, phone);
  ctx.body = status;
  logUtil.logbusiness([content.mobile,'modifyPassword', status]);
});

/**
 * 验证证码
 */
router.post('/verifyCode', async (ctx, next) => {
  let verifyInfo = ctx.request.body;
  let res = await users.verifyVcodes(verifyInfo.mobile, verifyInfo.code);
  ctx.body = res;
})


/**
 * 注册
 */
router.post('/registesubmit', async (ctx, next) => {
  let verifyInfo = ctx.request.body;
  let res = '';
  try {
    let verifyStatus = await users.verifyVcodes(verifyInfo.mobile, verifyInfo.vcode);
    if (verifyStatus.success) {
      res = await users.submitRegister({
        password: verifyInfo.password,
        mobile: verifyInfo.mobile,
        sex: 'unkown',
        nickname: verifyInfo.nickname,
        unitId: ctx.curUnit.id
      });

    } else {
      res = {
        id: '',
        message: "验证码错误"
      }
    }
  } catch (ex) {
    res = ex.response.data;
  }

  ctx.body = res;
  logUtil.logbusiness([verifyInfo.mobile, 'regist', res]);
})

/**
 * 忘记密码
 */
router.post('/resetpswd', async (ctx, next) => {
  let verifyInfo = ctx.request.body;
  let userList = await users.searchUserList('mobile:' + verifyInfo.mobile);
  let res = '';
  if (userList.content.length > 0) {
    let userInfo = userList.content[0];
    Object.assign(userInfo, {
      password: verifyInfo.password
    })
    res = await users.updateUserInfo(userList.content[0].id, userInfo)
  } else {
    res = '手机号未注册'
  }
  ctx.body = res;
  logUtil.logbusiness([verifyInfo.mobile,'resetPassword', res]);
})

/**
 * 微信扫码登录流程
 * 1、获取access_token
 * 2、根据access_token 获取微信用户信息（uuid)
 * 3、判断该微信用户有没有注册（通过微信调用登录）
 * 4、有注册直接登录；
 * 5、没有注册----》是否绑定已有账号------否-->调用注册流程--》完成注册--调用登录接口
 *                                 .
 *                                 .是
 *                                 .
 *                                 .-->>绑定账号
 *            
 * 6、完成。
 */
router.get('/wechart', async (ctx, next) => {

  let code = ctx.request.query.code;
  let wechartUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.wechart.appID + '&secret=' + config.wechart.appSecret + '&code=' + code + '&grant_type=authorization_code'
  let resp = await axios.get(wechartUrl);
  if(resp.data.errcode){  //此处获取resp 可能会报错
    ctx.redirect('/login');
    return;
   }
  let access_token = resp.data.access_token;
  let openid = resp.data.openid;
  let userInfoUrl = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid;
  var wechartInfo = await axios.get(userInfoUrl);
  wechartInfo = wechartInfo.data;
  let unionid = wechartInfo.unionid;

  try {
    let res = await users.login('weixin', {
      uid: unionid
    }); //是否绑定已有账号
    ctx.session.user = res;
    var ID = UUID.v1();
    ctx.session.token=ID;
    CACHED.set(ID,res);
    if (ctx.session.previousUrl.indexOf('login') >= 0) {
      ctx.redirect('/user');
    } else {
      ctx.redirect(ctx.session.previousUrl);
    }
    logUtil.logbusiness([ res.mobile,'login','wechart']);
  } catch (res) {
    let registerInfo = {
      sex: wechartInfo.sex == 1 ? 'male' : 'female',
      nickname: wechartInfo.nickname,
      pic: wechartInfo.headimgurl,
      registerMode: 'pcweb',
      bindWeixin: true,
      unitId: ctx.curUnit.id,
      binds: [{
        type: 'weixin',
        account: unionid
      }]
    }
    await ctx.render('login/bindingAccount', {
      data: registerInfo
    })
  }
})


router.post('/wechartRegist', async (ctx, next) => {
  let wechartInfo = ctx.request.body;
  try {
    let regist = await users.submitRegister(wechartInfo);

    let user = await users.login('weixin', {
      uid: wechartInfo.binds[0].account
    });

    ctx.session.user = user;
    var ID = UUID.v1();
    ctx.session.token=ID;
    CACHED.set(ID,{id:res.id,name:res.nickname,mobile:res.mobile});

    ctx.body = {
      data: 'success'
    }
    logUtil.logbusiness([ wechartInfo.binds[0].account,'wechartRegist']);
  } catch (ex) {

    ctx.body = {
      data: 'failure'
    }
    logUtil.logbusiness([ wechartInfo.binds[0].account,'wechartRegist failed']);
  }

})
/**
 * 绑定微信号
 */
router.get('/bindwechart', async (ctx, next) => {
  let code = ctx.request.query.code;
  let wechartUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.wechart.appID + '&secret=' + config.wechart.appSecret + '&code=' + code + '&grant_type=authorization_code'
  let resp = await axios.get(wechartUrl);
  let access_token = resp.data.access_token;
  let openid = resp.data.openid;
  let userInfoUrl = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid;
  var wechartInfo = await axios.get(userInfoUrl);
  wechartInfo = wechartInfo.data;
  let unionid = wechartInfo.unionid;
  let userInfo = JSON.parse(JSON.stringify(ctx.session.user));
  Object.assign(userInfo, {
    bindWeixin: true,
    binds: [{
      "type": "weixin",
      "account": unionid
    }]
  })
  let bind = 0;
  try {
    let user = await users.login('weixin', {
      uid: unionid
    });
    bind = -1; //号码已绑定
  } catch (ex) {
    try {
      let regist = await users.modifyUserInfo(userInfo.id, userInfo);
      ctx.session.user = await users.fetchUserInfo(userInfo.id);
      bind = 1; //绑定成功
    } catch (ex) {
      bind = 0; //绑定失败
    }
  }
  let bindResult = {
    '-1': "号码已绑定",
    '1': '绑定成功',
    '0': '绑定失败'
  }
  logUtil.logbusiness([wechartInfo, 'wechat-bind', bindResult[bind]]);
  ctx.redirect('/user/setprofile?bind=' + bind)
})

/**
 * 注销登录
 */
router.get('/login-on', async (ctx, next) => {
  logUtil.logbusiness([ctx.session.user.mobile,'logout'])
  ctx.session.user = null;
  var id= ctx.session.token;
  CACHED.set(id,null);
   ctx.session.token=null;
  ctx.redirect('/');
})

router.get('/getUserInfo', async (ctx, next) => {
   var token=ctx.query.ssid;
   var res={
     code:0,
     data:null
   }
   if(token&&CACHED.get(token)){
      res.data=CACHED.get(token);
      res.code=1;
   }
    ctx.body=res;
})
router.get('/quit', async (ctx, next) => {
  var token=ctx.query.ssid;
  var res={
    code:0,
    msg:''
  }
  if(token&&CACHED.get(token)){
     CACHED.set(token,null);
     res.code=1;
     res.msg='退出成功'
  }
  
   ctx.body=res;
 
})
module.exports = router