<template>
  <section class="container zoe-auth">
    <div class="field-wrapper">
      <mt-field label="姓 名" placeholder="请输入姓名" v-model="member.name" class="form-field border-bottom"></mt-field>
      <mt-field label="身份证号" placeholder="请输入身份证号码" v-model="member.idNumber" class="form-field"></mt-field>
    </div>
    <div class="split"></div>
    <div class="card-box">
      <div class="flex-item">
        <div class="cell up-file">
          <v-uploadimg class="import-btn" ref="handCardImg" @loadimg="loadimg" @changeFiles="changeFiles">
            <img :src="handCardImg" alt="" class="preview-img" v-if="handCardImg">
            <span v-if="!handCardImg">点击上传</span>
            <p v-if="!handCardImg">(手持身份证正面)</p>
          </v-uploadimg>
        </div>
        <div class="cell fixed example">
          <img src="/images/IDCard.png" alt="">
        </div>
      </div>
      <div class="hint">
        <p>请确保身份证上的信息清晰可见</p>
        <p>身份证号码必须清晰可识别</p>
        <p>图片大小不超过5M</p>
      </div>
    </div>
    <div class="split"></div>
    <footer class="footer pre-footer" ref="footWrapper">
      <mt-button class="btn" @click="addContactor">确定</mt-button>
    </footer>
  </section>
</template>
<script>
import axios from 'axios';
import rules from '~/util/validateRules';
import uploadImg from '~/components/uploadImg.vue';
import { toastMixin } from '~/components/mixins';

export default {
  mixins: [toastMixin],
  middleware: 'auth',
  head: {
    title: '实名认证'
  },
  components: {
    'v-uploadimg': uploadImg
  },
  data() {
    return {
      member: {
        name: '',
        idNumber: '',
      },
      handCardImg: ''
    };
  },
  async mounted() {
    let search = 'isSelf:true,identifyStatus:Wait&sort=createTime~desc';
    let identifyInfo = await axios.get("/user/identify", { params: { search: search } });
    if (identifyInfo.data) {
      this.$router.push({ path: '/zoe/' });
    }
  },
  methods: {
    loadimg(url) {
      this.handCardImg = url;
    },
    changeFiles(file) {
      this.member.handpic = file;
    },
    async addContactor() {
      if (!rules.required(this.member.name, '请输入姓名！')) return false;
      if (!rules.required(this.member.idNumber, '请输入身份证号码！')) return false;
      if (!rules.checkPersonIDNo(this.member.idNumber)) return false;
      if (!rules.required(this.handCardImg, '请上传手持照片')) return false;
      let user = this.$store.state.user;

      // 上传图片
      let formData = new FormData();
      formData.append('handpic', this.member.handpic);
      formData.append('realname', this.member.name);
      formData.append('idnumber', this.member.idNumber);
      formData.append('nickname', user.nickname);
      formData.append('userId', user.id);
      formData.append('mobile', user.mobile);
      formData.append('isSelf', true);
      let { status, data } = await axios.post('/user/auth', formData);
      if (data.success) {
        this.showMsg('已提交认证！');
        this.$router.push('/zoe/auth');
      } else {
        this.showMsg(data.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/zoe.scss";
</style>
       
        