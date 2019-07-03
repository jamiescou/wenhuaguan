<template>
  <section class="container issue-detail ">
    <div class="alt">
      <div v-swiper:barSwiper="swiperOption">
        <div class="swiper-wrapper ">
          <div class="swiper-slide photo-altas" v-for="(item,index) in products.content" :key="index">
            <div class="alt-pic">
              <img :src="item.files[0].filePath">
            </div>
            <div class="desc">
              <scroll ref="memberScroll" :click="true">
                <p class="index">
                  <span class="cur">{{index+1}}</span>/{{products.content.length}}</p>
                <p class="title">{{item.title}}</p>
                <p class="contents">{{item.brief}}</p>
              </scroll>
            </div>
            <div class="comments-alt">
              <div class="more border-top alt-c">
                <i class="icon icon-thumb-up" @click="onThumbUp(item)"></i>&nbsp;| 赞({{item.vote?item.vote:0}})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from 'axios';
import { toastMixin } from "~/components/mixins"
import Scroll from '~/components/scroll'
export default {
  layout: 'detail',
  mixins: [toastMixin],
  components: {
    Scroll
  },
  data() {
    return {
      products: {},
      activityId: '',
      swiperOption: {
        loop: true,
        initialSlide: 0
      }
    };
  },

  head: {
    title: '作品详情'
  },
  async asyncData({ params, error, req, query }) {
    let workId = query.workId;
    let activityId = query.activityId;
    let products = await axios.get('/collect/works/lst/0?size=-1&id=' + query.activityId);
    let curIndex = 0;
    products.data.content.forEach(function(item, index) {
      if (item.id == workId) {
        curIndex = index;
      }
    });
    return {
      activityId: activityId,
      products: products.data,
      swiperOption: { initialSlide: curIndex }
    };
  },
  methods: {
    async onThumbUp(work) {
      if (!this.$store.state.user) {
        this.$router.replace({ path: "/login", query: { redirect: this.$route.fullPath } });
        return;
      }
      let res = await axios.get("/collect/thum/" + work.id);
      if (res.data.status === 400) {
        this.showMsg(res.data.message)
      } else {
        this.showMsg('投票成功')
        ++work.vote;
        // let products = await axios.get('/collect/works/lst/0?size=-1&id=' + this.activityId);
        // this.products = products.data;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/collect.scss";
</style>
