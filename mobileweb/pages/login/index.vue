<template>
  <section class="container login-container">
    <div class="logo">
      <img :src="unit.logoPic" alt="logo" onerror="this.onerror=null;this.src='/images/logo.png'" />
    </div>
    <div class="sign-up">
      <nuxt-link to="/login/register">注册</nuxt-link>
    </div>
    <div class="field-wrapper bg">
      <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="loginForm.mobile" class="form-field"></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="loginForm.password" class="form-field"></mt-field>
      <div class="forget-pwd">
        <nuxt-link to="/login/forget">忘记密码？</nuxt-link>
      </div>
      <div class="operate-btns">
        <mt-button class="btn" type="primary" size="large" @click="login">登录</mt-button>
      </div>
    </div>
    <div class="login-sns-wrap">
      <div class="sns-title">
        <span class="text">&nbsp;&nbsp;第三方登录&nbsp;&nbsp;</span>
      </div>
      <div class="login-sns">
        <!-- <a href="">
            <i class="jdfont ico-qq"></i>
            <span class="sns-name">QQ登录</span>
        </a> -->
        <a href="javascript:void(0)" @click="wechatLogin" class="sns-item">
          <i class="icon icon-weixin"></i>
          <span class="sns-name">微信</span>
        </a>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import { mapState } from 'vuex'
import { toastMixin } from '~/components/mixins';
export default {
  mixins: [toastMixin],
  head: {
    title: '用户登录'
  },
  computed: {
    ...mapState([
      'unit'
    ])
  },
  data() {
    return {
      loginForm: {
        mobile: "",
        password: ""
      }
    };
  },
  methods: {
    async login() {
      if (!this.loginForm.mobile || !this.loginForm.password) {
        this.showMsg('请输入手机号或密码');
        return;
      }
      let res = await this.$store.dispatch('login', this.loginForm)
      if (res.success) {
        this.showMsg(res.msg);
        let redirect = this.$route.query.redirect || "/zoe";
        this.$router.replace(redirect);
      } else {
        this.showMsg(res.msg);
      }
    },

    async wechatLogin() {
      let redirect = this.$route.query.redirect || "/zoe";
      redirect = encodeURIComponent(redirect.substr(1))
      let { data } = await axios.get(`/wechat/redirect?visit=${redirect}`);
      window.location.href = data;
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/login.scss";
</style>