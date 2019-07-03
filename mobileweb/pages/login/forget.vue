<template >
  <section class="container signup-container">
    <transition name="fade-vright">
      <div class="field-wrapper bg first" v-show="!verify">
        <mt-field label="手机号 +86" type="tel" v-model="pswdForm.mobile" class="form-field">
          <mt-button type="primary" class="captcha-btn" :disabled="disabled" @click.native.prevent="handleSendCode">
            <countdown :start="disabled" @on-finish="disabled = false"></countdown>
          </mt-button>
        </mt-field>
        <mt-field label="验证码" v-model="pswdForm.captcha" class="form-field"></mt-field>
        <div class="operate-btns">
          <mt-button class="btn" type="primary" size="large" @click="verifyCode">下一步</mt-button>
        </div>
      </div>
    </transition>
    <transition name="fade-right">
      <div class="field-wrapper bg second" v-show="verify">
        <mt-field label="密 码" type="password" v-model="pswdForm.pswd" class="form-field"></mt-field>
        <mt-field label="重复密码" type="password" v-model="pswdForm.confirmpwd" class="form-field"></mt-field>
        <div class="hint">
          <span class="emphasize">*</span>密码为6-8位数字字母符号组合</div>
        <div class="operate-btns">
          <mt-button class="btn" type="primary" size="large" @click="resetPsw">确认修改</mt-button>
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import axios from 'axios';
import md5 from 'md5';
import rules from '~/util/validateRules';
import countdown from '~/components/countdown'
import { toastMixin } from '~/components/mixins';
export default {
  mixins: [toastMixin],
  head() {
    return {
      title: this.title
    }
  },
  components: {
    countdown
  },
  data() {
    return {
      title: this.$route.query.type ? '绑定手机号' : '找回密码',  //bind 绑定账号(微信登录后) or 修改密码（忘记密码)
      pswdForm: {
        mobile: '',
        captcha: '',
        pswd: '',
        confirmpwd: ''
      },
      disabled: false,
      verify: false,
      type: this.$route.query.type || 'edit'
    };
  },
  created() {
    if (this.type === 'bind' && !this.$store.state.user) {
      this.$router.replace({ path: "/login", query: { redirect: this.$route.fullPath } });
    }
  },
  methods: {
    validate() {
      if (!rules.required(this.pswdForm.password, '请输入密码！')) return false;
      if (!rules.required(this.pswdForm.repassword, '请确认密码！')) return false;
      if (!rules.checkPass(this.pswdForm.password, this.pswdForm.repassword)) return false;
      if (!rules.checkPassConfirm(this.pswdForm.password, this.pswdForm.repassword)) return false;
      return true;
    },

    async resetPsw() {
      if (!rules.required(this.pswdForm.pswd, '请输入密码！')) return false;
      if (!rules.checkPass(this.pswdForm.pswd, this.pswdForm.confirmpwd)) return false;
      if (!rules.checkPassConfirm(this.pswdForm.pswd, this.pswdForm.confirmpwd)) return false;

      let mobile = this.pswdForm.mobile;
      let data = {
        mobile: mobile,
        newPwd: this.pswdForm.pswd
      };

      let res = {};
      if (this.type == 'edit') {
        res = await axios.post('/user/editpassword', data);
        if (res.data == '') {
          this.$router.push({ path: '/login' });
        } else {
          this.showMsg('操作失败');
        }
      } else {  //绑定手机号
        res = await axios.post('/user/bindmobile/' + this.$store.state.user.id, data);
        if (!res.data) {
          this.$router.push({ path: '/zoe' });
        } else {
          this.showMsg('操作失败');
        }
      }
    },

    async verifyCode() {
      if (!rules.required(this.pswdForm.mobile, '请输入手机号码！')) return false;
      if (!rules.required(this.pswdForm.captcha, '请输入验证码！')) return false;
      let { status, data } = await axios.post('/verifyVcodes', { mobile: this.pswdForm.mobile, code: this.pswdForm.captcha });
      if (status === 200 && data.success) {
        this.verify = true;
      } else {
        this.showMsg(data.message || '验证码错误')
      }
    },

    async handleSendCode() {
      if (!rules.required(this.pswdForm.mobile, '请输入手机号码！')) return false;
      if (!rules.checkPhone(this.pswdForm.mobile)) return false;
      var signStr = `mobile=${this.pswdForm.mobile}&flag=register` // md5校验
      console.log('signStr======', md5(signStr))
      let data = { mobile: this.pswdForm.mobile, state: (this.type == 'edit' ? 'registedMobile' : 'newMobile'), signStr: md5(signStr) };
      let code = await axios.post('/vcodes', data);
      if (code.data.success) {
        this.disabled = true;
        this.showMsg('验证码已发送至手机,请查收');
      } else {
        this.showMsg(code.data.message);
      }
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/login.scss";
</style>