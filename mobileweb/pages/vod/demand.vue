<template>
  <section class="container vod-detail">
    <div class="card base-info">
      <div class="card-hd">
        <!-- <video id="my_video" class="video-js vjs-sublime-skin video" controls preload="none" :poster='detail.curDrama.pic' v-if="detail.curDrama && detail.curDrama.file">
          <source :src="detail.curDrama.file" type='video/mp4' id='videoPlayer' />
        </video> -->
        <div class="video-player vjs-custom-skin video" :playsinline="true" v-video-player:myVideoPlayer="playerOptions" v-if="detail.curDrama && detail.curDrama.file">
        </div>
        <div v-else>
          <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'" class="video">
          <div class="tag-wrap">
            <span class="tag">视频地址不存在</span>
          </div>
        </div>
      </div>
      <div class="card-bd">
        <h4 class="card-title"> {{detail.name}}</h4>
        <div class="card-scan"><span class="iconNew-scan"></span>{{detail.pageView}}</div>
        <p class="card-info" v-if="detail.resource">
          来源： {{ detail.resource }}
        </p>
        <p class="card-info" v-if="detail.artistTypes">
          视频分类：{{detail.artistTypeNames}}
        </p>
      </div>
    </div>
    <div class="split"></div>
    <div class="block-heading">
      <h4 class="title">视频分集</h4>
    </div>
    <div class="drama-swiper">
      <div v-swiper:barSwiper="swiperOption" v-if="detail.dramas && detail.dramas.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(drama,index) in detail.dramas" :key='index'>
            <div class="card drama-card" @click="changeEpisodes(drama)">
              <div class="card-hd">
                <img :src="drama.pic" class="item-img" onerror="this.onerror=null;this.src='/images/default.png'">
              </div>
              <div class="card-bd">
                <h4 class="card-title f-nowrap title">{{drama.title}}</h4>
                <p class="card-info time">
                  <i class="icon icon-clock"></i>{{drama.createTime}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-nodata msg="没有相关视频分集" v-else></v-nodata>
    </div>

    <div class="split"></div>
    <div class="block-heading">
      <h4 class="title">视频介绍</h4>
    </div>
    <div class="video-content">{{ detail.brief }}</div>

    <template v-if="detail.content && detail.content.length>0">
      <div class="split"></div>
      <div class="block-heading">
        <h4 class="title">视频详情</h4>
      </div>
      <div v-html="detail.content" class="video-content"></div>
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
      <!-- <div class="more border-top">
        <nuxt-link :to="{path: '/comments/'+detail.id,query:{type:type}}">
          <i class="icon icon-comment"></i>&nbsp;评论</nuxt-link>
      </div> -->
    </div>
    <div class="split"></div>

    <div class="footBtnWrapWc">
      <div class="footBtnWrap clearfix">
        <v-favorite class="fBtn" v-model="detail.favorited" favType="Demands" :objectId="detail.id"></v-favorite>
        <v-share></v-share>
        <nuxt-link class="fTxt" :to="{path: '/comments/'+detail.id,query:{type:'demand'}}">说点什么</nuxt-link>
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
  mixins: [wechat],
  layout: 'detail',
  head: {
    title: '百姓舞台'
  },
  components: {
    'v-favorite': favorite,
    'v-share': share
  },
  data() {
    return {
      detail: [],
      comments: [],
      type: '',
      swiperOption: {
        lazyLoading: true,
        slidesPerView: 2.5,
        slideActiveClass: 'swiper-slide-active'
      },
      playerOptions: {

        autoplay: false, //如果true,浏览器准备好时开始回放。

        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        // aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        // sources: [{
        //   type: 'video/mp4',
        //   src: 'http://119.23.14.134:8001/0/7/5/2/0752f3c3-f497-4695-b41b-564894f27c77.mp4'
        // }],
        height: 800,
        // poster: "poster.jpg", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试' //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      }
    };
  },
  async asyncData({ params, error, query, req, route }) {

    let detailInfo = await axios.get('/demand/detail/' + query.id);
    console.log('--->', detailInfo.data)
    let comments = await axios.get('/comments/demand/' + query.id + '/0?size=1');
    return {

      detail: detailInfo.data,
      comments: comments.data.content
    };
  },
  mounted() {
    if(this.detail.curDrama){
      this.playerOptions = {
        sources: [{ type: 'video/mp4', src: this.detail.curDrama.file }],
        poster: this.detail.curDrama.pic,
        height: 700
      }
    }
    this.shareOpts.imgUrl = this.detail.coverPic;
    this.shareOpts.title = this.detail.name;
    this.wechatInit()
  },
  methods: {
    //播放第几集
    changeEpisodes(item) {

      this.detail.curDrama = item;

      this.detail.dramas.forEach(function(itm) {
        if (itm.title == item.title) {
          itm.active = true;
        } else {
          itm.active = false;
        }
      });

      this.playerOptions = {
        sources: [{ type: 'video/mp4', src: this.detail.curDrama.file }],
        poster: this.detail.curDrama.pic,
        height: 700
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/vod.scss";
</style>