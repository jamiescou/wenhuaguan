<template>
  <div class="bind-way">
    <div class="tip">
      <i class="icon icon-unkown"></i>是否绑定已有帐号?</div>
    <div class="operate-btns">
      <nuxt-link to="/login/bind" class="btn">绑定帐号</nuxt-link>
      <a href='#' @click='wechartRegist' class="btn">直接登录</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from "vuex";
import { toastMixin } from '~/components/mixins';
export default {
  mixins: [toastMixin],
  computed: {
    ...mapState(['weAuth'])
  },
  asyncData({ store, redirect }) {
    if (!store.state.weAuth) {
      redirect('/login');
      return;
    }
  },
  methods: {
    async  wechartRegist() {
      let authInfo = this.weAuth;
      let signInfo = {
        sex: ['unkown', 'male', 'female'][parseInt(authInfo.sex, 10)],
        nickname: authInfo.nickname,
        pic: authInfo.headimgurl,
        bindWeixin: true,
        binds: [{
          type: 'weixin',
          account: authInfo.unionid
        }]
      }

      let { status, data } = await axios.post('/register', signInfo);
      let msg = status === 200 ? '微信登录成功' : data.message || '微信登录失败';
      this.showMsg(msg);
      if (status === 200) {
        let res = await this.$store.dispatch('wxlogin', { uid: authInfo.unionid })
        if (res.success) {
          this.$router.replace('/zoe');
        }
      }
    }
  }
}


</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/login.scss";
</style>