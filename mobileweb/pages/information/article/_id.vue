<template>
  <section class="container issue-detail">
    <div class="content">
      <h3 class="news-title">{{information.title}}</h3>
      <p class="news-desc">
        {{information.publishTime}}&nbsp;&nbsp;&sdot;&nbsp;&nbsp;{{information.source}}
      </p>
      <div v-html="information.content"></div>
    </div>
    <template v-if="information.attach && information.attachName">
      <div class="split"></div>
      <div class="block-heading">
        <h4 class="title">附件</h4>
      </div>
      <div class="flex-item desc-list" @click="dowload(information.attach)">
        <div class="cell attach-name">{{information.attachName}}</div>
        <a class="cell fixed">
          <i class="icon icon-angle-left"></i>
        </a>
      </div>
    </template>
    <div class="split"></div>
    <div class="comments">
      <div class="block-heading">
        <h4 class="title">评论列表</h4>
      </div>
      <div class="comment" v-if="comments.length">
        <div class="flex-item">
          <div class="cell fixed">
            <img :src='comments[0].pic' onerror="this.onerror=null;this.src='/images/portrait.png'" class="avatar" />
          </div>
          <h4 class="cell nickname">{{comments[0].nickname}}</h4>
          <span class="cell fixed time">{{comments[0].time}}</span>
        </div>
        <p class="c-content">{{comments[0].content}}</p>
      </div>
      <v-nodata msg="还没有评论，快去评论吧(☄⊙ω⊙)☄" class="no-data" v-else></v-nodata>
      <!--<div class="more border-top">
        <nuxt-link :to="{path: '/comments/'+information.id,query:{type:'information'}}">
          <i class="icon icon-comment"></i>&nbsp;评论</nuxt-link>
      </div>-->
    </div>
    <v-overlayer v-model="isShowTip" :overStyle="{zIndex:200}">
      <div class="shareHelp" style=" text-align:right;padding-right:60px;">
        <img src="/images/mask.png" alt="提示">
      </div>
    </v-overlayer>

    <div class="footBtnWrapWc">
      <div class="footBtnWrap clearfix">
        <v-favorite class="fBtn" v-model="information.favorited" favType="Information" :objectId="information.id"></v-favorite>
        <v-share></v-share>
        <nuxt-link class="fTxt" :to="{path: '/comments/'+information.id,query:{type:'information'}}">说点什么</nuxt-link>
      </div>
    </div>

  </section>
</template>
<script>
import axios from "axios";
import favorite from '~/components/favorite.vue';
import share from '~/components/share.vue';
import wechat from '~/util/wechat.js';

export default {
  layout: 'detail',
  mixins: [wechat],
  head: {
    title: '资讯详情'
  },
  components: {
    'v-favorite': favorite,
    'v-share': share
  },
  data() {
    return {
      isShowTip: false
    }
  },
  async asyncData({ params, error, req }) {
    let information = await axios.get('/information/detail/' + params.id);
    let comments = await axios.get('/comments/information/' + params.id + '/0?size=1');
    return {
      information: information.data,
      comments: comments.data.content
    };
  },
  methods: {
    dowload(url) {
      let ua = navigator.userAgent.toLowerCase();
      ua = ua.indexOf('micromessenger') !== -1;
      if (ua) {
        this.isShowTip = true;
      } else {
        window.location.href = url;
      }
    }
  },
  mounted() {
    this.shareOpts.imgUrl = this.information.coverPic
    this.shareOpts.title = this.information.title
    this.shareOpts.desc = this.information.source
    this.wechatInit()
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/issue.scss";
</style>
