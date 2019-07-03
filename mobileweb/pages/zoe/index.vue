<template>
  <section class="container my-zoe">
    <div class="user flex-item">
      <div class="cell fixed avatar">
        <v-uploadimg ref="handCardImg" @changeFiles="changeFiles">
          <img :src="user?user.pic:'/images/portrait.png'" onerror="this.onerror=null;this.src='/images/portrait.png'">
        </v-uploadimg>
        <!-- <div class="avatar" @click.stop="sheetVisible = true"> -->
        <!-- <v-cropper :upload="handleUpload" ref="avatarCropper">
          <img :src="user?user.pic:'/images/portrait.png'" onerror="this.onerror=null;this.src='/images/portrait.png'">
        </v-cropper> -->

        <div class="sex">
          <i class="icon" :class="'icon-'+(user&&user.sex)"></i>
        </div>
      </div>
      <div class="cell nickname">
        <div @click="modifyNickName">{{user&&user.nickname}}</div>
        <div class="volunteer">
          <span class="tag" v-if="volunteerPersonal">{{volunteerPersonal}}</span>
          <span class="tag" v-if="volunteerTeam">{{volunteerTeam}}</span>
        </div>
      </div>
      <div class="head-opers">
        <nuxt-link to="/zoe/message" class="oper-item">
          <i class="icon icon-comment-alt"></i>
        </nuxt-link>
        <nuxt-link to="/" class="oper-item">
          <i class="icon icon-home"></i>
        </nuxt-link>
      </div>

    </div>
    <section class="order-act-wrapper">
      <ul class="order-acts">
        <li>
          <nuxt-link to="/zoe/activity">
            <p>
              <i class="act-icon icon icon-activity"></i>
            </p>
            <p class="act-title">我的活动</p>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/zoe/train">
            <p>
              <i class="act-icon icon icon-train"></i>
            </p>
            <p class="act-title">我的培训</p>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/zoe/venue">
            <p>
              <i class="act-icon icon icon-venue"></i>
            </p>
            <p class="act-title">我的场馆</p>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/zoe/volunteer">
            <p>
              <i class="act-icon icon icon-collect"></i>
            </p>
            <p class="act-title">志愿服务</p>
          </nuxt-link>
        </li>
      </ul>
    </section>
    <div class="split"></div>
    <section class="core-entry">
      <nuxt-link to="/zoe/work" class="flex-item core-item border-bottom">
        <div class="cell">
          <i class="icon icon-barrage"></i>我的作品</div>
        <div class="cell fixed right-addon">
          <i class="icon icon-angle-left"></i>
        </div>
      </nuxt-link>
      <nuxt-link to="/zoe/favorite" class="flex-item core-item border-bottom">
        <div class="cell">
          <i class="icon icon-like"></i>我的收藏</div>
        <div class="cell fixed right-addon">
          <i class="icon icon-angle-left"></i>
        </div>
      </nuxt-link>
      <nuxt-link :to="user&&user.identifyStatus=='Not'?'/zoe/authentication':'/zoe/auth'" class="flex-item core-item border-bottom" v-if="user&&user.mobile">
        <div class="cell">
          <i class="icon icon-businesscard"></i>实名认证</div>
        <div class="cell fixed right-addon">
          {{user && user.authStatus}}
          <i class="icon icon-angle-left"></i>
        </div>
      </nuxt-link>
      <nuxt-link to="/zoe/contacts" class="flex-item core-item">
        <div class="cell">
          <i class="icon icon-group"></i>常用联系人</div>
        <div class="cell fixed right-addon">
          <i class="icon icon-angle-left"></i>
        </div>
      </nuxt-link>
    </section>
    <div class="split"></div>
    <section class="core-entry">
      <nuxt-link :to="user&&user.mobile?'/zoe/modifyMobile':'/login/forget?type=bind'" class="flex-item core-item border-bottom">
        <div class="cell">
          <i class="icon icon-mobilephone"></i>手机绑定</div>
        <div class="cell fixed right-addon">
          {{user&&user.mobile?'已绑定':'未绑定'}}
          <i class="icon icon-angle-left"></i>
        </div>
      </nuxt-link>
      <nuxt-link to="/zoe/resetpwd" class="flex-item core-item border-bottom" v-if='user && user.mobile'>
        <div class="cell">
          <i class="icon icon-brush"></i>修改密码</div>
        <div class="cell fixed right-addon">
          <i class="icon icon-angle-left"></i>
        </div>
      </nuxt-link>
      <nuxt-link to="/zoe/feedback" class="flex-item core-item border-bottom">
        <div class="cell">
          <i class="icon icon-interactive"></i>意见反馈</div>
        <div class="cell fixed right-addon">
          <i class="icon icon-angle-left"></i>
        </div>
      </nuxt-link>
      <nuxt-link to="/zoe/about" class="flex-item core-item">
        <div class="cell">
          <i class="icon icon-manage"></i>关于我们</div>
        <div class="cell fixed right-addon">
          <i class="icon icon-angle-left"></i>
        </div>
      </nuxt-link>
    </section>
    <div class="split"></div>
    <div class="split"></div>
    <div class="opters">
      <mt-button class="btn" @click="loginOut">退出登录</mt-button>
    </div>
    <div class="split"></div>
    <div class="split"></div>
    <!-- <mt-actionsheet :actions='actions' v-model="sheetVisible"></mt-actionsheet> -->
  </section>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
// import cropper from "~/components/cropper-img.vue";
import uploadImg from '~/components/uploadImg.vue';
import { toastMixin } from '~/components/mixins';
import rules from '~/util/validateRules';

export default {
  mixins: [toastMixin],
  middleware: "auth",
  head: {
    title: '个人中心'
  },
  computed: {
    ...mapState(['user']),
    volunteerPersonal() {
      return (this.user && this.user.roles && this.user.roles.indexOf('volunteerPersonal') >= 0) ? '个人志愿者' : null
    },
    volunteerTeam() {
      return (this.user && this.user.roles && this.user.roles.indexOf('volunteerTeam') >= 0) ? '团队志愿者' : null
    }
  },
  components: {
    // "v-cropper": cropper
    'v-uploadimg': uploadImg
  },
  data() {
    return {
      // sheetVisible: false,
      // actions: []
    };
  },
  async created() {
    await this.$store.dispatch('fetchUsers')
    // this.actions = [
    //   {
    //     name: '从相册中选择',
    //     method: this.showAlbum
    //   }
    // ]
  },
  methods: {
    async changeFiles(file) {
      let formData = new FormData();
      formData.append('photo', file);
      formData.append('id', this.user.id);
      let { status, data } = await axios.post('/user/photo', formData);
      if (data.success) {
        this.showMsg('修改成功');
        await this.$store.dispatch('fetchUsers')
      } else {
        this.showMsg(data.msg);
      }
    },
    async handleUpload(formData, imageUrl) {
    },
    async loginOut() {
      await this.$store.dispatch('logout')
      this.showMsg('退出成功');
      this.$router.replace('/');
    },
    showAlbum() {
      this.$refs.avatarCropper.handleClick();
    },
    async modifyNickName() {
      this.$messageBox.prompt(' ', '请输入昵称',
        {
          inputPlaceholder: this.user.nickname,
          inputValidator: (val) => {
            let spacePattern = /^\s+$/;
            let hasSpace = spacePattern.test(val);
            return !(val == null || val.length === 0 || hasSpace)
          },
          inputErrorMessage: '请输入昵称'
        }).then(async ({ value, action }) => {
          let { status, data } = await axios.post('/user/userinfo', {
            nickname: value,
            id: this.user.id
          });
          if (status === 200) {
            this.showMsg('昵称修改成功！')
            await this.$store.dispatch('fetchUsers')
          } else {
            this.showMsg('昵称修改失败，请重试！')
          }
        }, () => {
          console.info('cancel')
        });
    }
  }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/zoe.scss";
</style>
