<template>
  <section class="container block-container">
    <div class="flex-item media-box detail">
      <div class="cell fixed media-object">
        <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
      <div class="cell media-bd">
        <h4 class="media-title">{{detailInfo.name}}</h4>
        <div class="media-info">
          <p>
            <i class="icon icon-clock"></i>{{detailInfo.startTime}}</p>
          <p>
            <i class="icon icon-position"></i>{{detailInfo.address}}</p>
        </div>
      </div>

    </div>

    <div class="split"></div>

    <div>
      <div class="flex-item desc-list border-bottom">
        <div class="cell">
          名称
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.name}}</span>
        </div>
      </div>
      <div class="flex-item desc-list border-bottom" v-if='applyType=="team"'>
        <div class="cell">
          团队人数
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.teamCount}}</span>
        </div>
      </div>

      <div class="flex-item desc-list border-bottom">
        <div class="cell">
          联系电话
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.telephone}}</span>
        </div>
      </div>
      <div class="flex-item desc-list border-bottom">
        <div class="cell">
          区域
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.region}}</span>
        </div>
      </div>
      <div class="flex-item desc-list border-bottom">
        <div class="cell">
          详细地址
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.address}}</span>
        </div>
      </div>
      <div class="flex-item desc-list border-bottom">
        <div class="cell">
          籍贯
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.holdAddress}}</span>
        </div>
      </div>

      <div class="flex-item desc-list border-bottom">
        <div class="cell">
          服务类型
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.serviceTypesName}}</span>
        </div>
      </div>
      <div class="flex-item desc-list border-bottom">
        <div class="cell">
          从业情况
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.occupationName}}</span>
        </div>
      </div>
      <div class="flex-item desc-list border-bottom">
        <div class="cell">
          最高学历
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.educationName}}</span>
        </div>
      </div>
      <div class="flex-item desc-list border-bottom">
        <div class="cell">
          政治面貌
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.politicalStatusName}}</span>
        </div>
      </div>
      <div class="flex-item desc-list border-bottom">
        <div class="cell">
          简介
        </div>
        <div class="cell fixed right-addon">
          <span> {{userInfo.brief}}</span>
        </div>
      </div>

    </div>
<div class="split"></div>
    <footer class="footer pre-footer" ref="footWrapper">
      <div class="flex-item next-opreations">
        <mt-button class="btn go" @click="actApply">确定报名</mt-button>
      </div>

    </footer>

    

  </section>
</template>
<script>
import axios from "axios";
import { toastMixin } from '~/components/mixins';
export default {
  middleware: "auth",
  mixins: [toastMixin],
  async asyncData({ params, error, query }) {
    let applyType = query.type;
    let detailInfo = await axios.get('/volunteer/detail/' + query.activityId);
    let userInfo = await axios.get('/volunteer/voluninfo?type=' + applyType);
    return {
      userInfo: userInfo.data,
      applyType: applyType,
      detailInfo: detailInfo.data
    };
  },

  data() {
    return {
      applyType: '',
      detailInfo: {},
      userInfo: {}
    };
  },

  head() {
    return {
      title: "志愿者报名"
    };
  },

  mounted() {

  },

  methods: {

    async actApply() {
      var volInfo = {
        type: this.applyType,
        volunteerName: this.userInfo.name,
        userId: this.$store.state.user.id,
        idNumber: this.userInfo.idNumber,
        recruitName: this.detailInfo.name,
        recruitId: this.detailInfo.id,
        endTime: this.detailInfo.endTime,
        startTime: this.detailInfo.startTime
      }
      let res = await axios.post('/volunteer/actOrder', volInfo);
      
      if(res.data.success){
            this.showMsg('报名成功');
            this.$router.replace('/preset?id=volunteer');
      }

    }
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/volunteer.scss";
</style>