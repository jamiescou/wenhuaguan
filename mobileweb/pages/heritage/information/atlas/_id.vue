<template>
  <section class="container issue-detail ">
    <div class="alt">
      <div v-swiper:barSwiper="swiperOption">
        <div class="swiper-wrapper ">
          <div class="swiper-slide photo-altas" v-for="(item,index) in information.picList" :key="index">
            <div class="alt-pic">
              <img :src="item.pictureFile">
            </div>
            <div class="desc">
              <p class="index">
                <span class="cur">{{index+1}}</span>/{{information.picList.length}}</p>
              <p class="title">{{information.title}}</p>
              <p class="contents">{{item.content}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="comments comments-alt">
      <div class="more border-top alt-c">
        <nuxt-link :to="{path: '/comments/'+information.id,query:{type:'information'}}">
          <i class="icon icon-comment"></i>&nbsp;| 评论{{comments.totalElements}}条</nuxt-link>
      </div>
    </div>

  </section>
</template>
<script>
import axios from "axios";
import wechat from '~/util/wechat.js';

export default {
  layout: 'detail',
  mixins: [wechat],
  data() {
    return {
      information: {},
      comments: [],
      looppic: [],
      swiperOption: {
        loop: true,
        // autoplay: true,
        pagination: {
          el: '.j-loop',
          bulletActiveClass: 'bullet-active'
        }
      }
    }
  },

  head: {
    title: "资讯详情"
  },
  async asyncData({ params, error, req }) {
    let information = await axios.get("/information/detail/" + params.id);
    let comments = await axios.get("/comments/information/" + params.id + "/0?size=1");
    return {
      information: information.data,
      comments: comments.data
    };
  },
  mounted() {
    this.shareOpts.imgUrl = this.information.coverPic
    this.shareOpts.title = this.information.title
    this.shareOpts.desc = this.information.brief
    this.wechatInit()
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/issue.scss";
</style>
