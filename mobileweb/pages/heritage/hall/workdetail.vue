<template>
  <section class="container issue-detail ">
    <div class="alt">
      <div v-swiper:barSwiper="swiperOption">
        <div class="swiper-wrapper ">
          <div class="swiper-slide photo-altas" v-for="(item,index) in products.content" :key="index">
            <div class="alt-pic">
              <img :src="item.coverPic">
            </div>
            <div class="desc">
              <p class="index">
                <span class="cur">{{index+1}}</span>/{{products.content.length}}</p>
              <p class="title">{{item.title}}</p>
              <p class="contents">{{item.brief}}</p>
            </div>

          </div>
        </div>
      </div>

    </div>

  </section>
</template>
<script>
import axios from "axios";
export default {
  layout: "detail",
  data() {
    return {
      products: {},
      activityId: "",
      looppic: [],
      swiperOption: {
        loop: true,
        // autoplay: true,
        initialSlide: 0,
        pagination: {
          el: ".j-loop",
          bulletActiveClass: "bullet-active"
        }
      }
    };
  },

  head: {
    title: "作品详情"
  },
  async asyncData({ params, error, req, query }) {
    let workId = query.workId;
    let hallId = query.hallId;
    let products = await axios.get("/heritage/unit/products/" + hallId + '/0?size=-1');
    let curIndex = 0;
    products.data.content.forEach(function(item, index) {
      if (item.id == workId) {
        curIndex = index;
      }

    });
    return {
      hallId: hallId,
      products: products.data,
      swiperOption: {
        initialSlide: curIndex      }
    };
  }

};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/collect.scss";
</style>
