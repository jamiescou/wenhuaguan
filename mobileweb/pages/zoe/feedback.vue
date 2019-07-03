<template>
  <section class="container zoe-feedback">
    <div class="feedback-content">
      <mt-field placeholder="请输入意见反馈" type="textarea" rows="12" :attr="{ maxlength: 300 }" v-model="content"></mt-field>
      <span>300字以内</span>
    </div>
    <div class="feedback-submit">
      <mt-button class="btn" size="large" type="danger" @click="feedbackSubmit">提交</mt-button>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex'
import { toastMixin } from '~/components/mixins';
export default {
  middleware: "auth",
  mixins: [toastMixin],
  head: {
    title: '意见反馈'
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  data() {
    return {
      content: "",
      feedbackFromData: {}
    };
  },
  methods: {
    async feedbackSubmit() {
      if (this.content.trim() === '') {
        this.showMsg('请输入意见反馈')
        return;
      }
      this.feedbackFromData.content = this.content;
      this.feedbackFromData.unitId = this.$store.state.user.unitId;
      this.feedbackFromData.mobile = this.$store.state.user.mobile;
      this.feedbackFromData.name = this.$store.state.user.name || this.$store.state.user.nickname;
      let res = await axios.post("/sys/suggestions", this.feedbackFromData);
      if (res.data.id) {
        this.showMsg('提交成功')
        setTimeout(() => {
          this.$router.push({
            path: '/zoe'
          })
        }, 2000);
      }
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "~static/styles/pages/zoe.scss";
</style>
