<template>
  <section class="container volunteer-container">

    <div class="volun-header">

      <div class="swipe-loop" v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(banner,index) in volunteers.looppic" :key="index">
            <!-- <a :href="banner.url"> -->
            <img :src="banner.coverPic">
            <!-- </a> -->
          </div>
        </div>
        <div class="j-loop swiper-pagination round-bullets"></div>
      </div>

      <!-- <div class="overlayer"></div> -->
      <h1>成为志愿者</h1>
      <span class="btn" @click='enrollClick' :class="{end:!enroll.enable}">{{enroll.msg}}</span>
    </div>

    <div class="list-wraper index-wrapper" v-if="volunteers.content.length">
      <nuxt-link :to="`/volunteer/${item.id}`" class="card" v-for="(item,index) in volunteers.content" :key="'volunteer_'+index">
        <div class="card-hd">
          <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
          <div class="tag-wrap" v-if="item.serviceTypes && item.serviceTypes.length">
            <span class="tag" v-for="tag in item.serviceTypes" :key="tag">{{convertType(tag)}}</span>
          </div>
        </div>
        <div class="card-bd">
          <h4 class="card-title">{{item.name}}</h4>
          <p class="card-info">
            <i class="icon icon-clock"></i>
            {{item.startTime}}
          </p>
          <p class="card-info">
            <i class="icon icon-position"></i>{{item.address}}
          </p>
          <div class="card-info border-top favorite-reserve">
            <div class="flex-item">
              <v-favorite class="cell fixed" v-model="item.favorited" favType="VolunteerRecruit" :objectId="item.id"></v-favorite>
              <div class="cell reserve-tip">
                <template v-if="item.isStop">停止招募</template>
                <template v-else>
                  <span class="remain">
                    招募
                    <em class="remain-num">{{item.limitNum}}</em> 人 </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>
      <div class="split"></div>
      <div class="more">
        <nuxt-link to="/volunteer/list">查看更多&nbsp;&nbsp;&rarr;</nuxt-link>
      </div>
      <div class="split"></div>
    </div>
    <v-nodata v-else></v-nodata>

  </section>

</template>
<script>
import axios from 'axios';
import favorite from '~/components/favorite.vue';
import wechat from '~/util/wechat.js';

export default {
  mixins: [wechat],
  head: {
    title: '志愿服务'
  },
  components: {
    'v-favorite': favorite
  },
  data() {
    return {
      ActTypes: [],
      volunteers: { content: [], totalPages: 0, looppic: [] },
      enroll: {
        enable: true,
        msg: '立即报名'
      },

      swiperOption: {
        loop: true,
        autoplay: true,
        pagination: {
          el: '.j-loop',
          bulletActiveClass: 'bullet-active'
        }
      },

    }
  },
  async asyncData({ params, error, req }) {
    let [volunteers, dicts] = await Promise.all([
      axios.get('/volunteers/0?size=3'),
      axios.get('/volunDicts')
    ]);

    return {
      ActTypes: dicts.data.ActTypes,
      volunteers: volunteers.data    }
  },
  // beforeCreate() {
  //   debugger;

  //   if (this.$store.state.user && this.$store.state.user.identifyStatus != 'Yes') {
  //     this.enroll = {
  //       enable: false,
  //       msg: '请先完成实名认证'
  //     }
  //     console.log('enrollenrollenroll=====>', this.enroll)
  //   }
  // },
  mounted() {
    if (this.$store.state.user && this.$store.state.user.identifyStatus != 'Yes') {
      this.enroll = {
        enable: false,
        msg: '请先完成实名认证'
      }
    }
    this.wechatInit()
  },
  methods: {
    enrollClick() {

      if (!this.$store.state.user) {
        this.$router.replace({ path: "/login", query: { redirect: this.$route.fullPath } });
        return;
      }
      else if (this.enroll.enable) {
        this.$router.replace({ path: "/volunteer/enroll" });
      }

    },

    convertType(code) {
      let type = this.ActTypes.find(item => item.code === code);
      if (type) {
        return type.value;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/volunteer.scss";
</style>
 