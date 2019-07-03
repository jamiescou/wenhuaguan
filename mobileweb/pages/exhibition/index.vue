<template>
  <section class="container exhibition-container">
    <tab>
      <tab-item :selected="index===0" v-for="(item, index) in types" @on-item-click="onItemClick(item)" :key="index">{{item.value}}</tab-item>
    </tab>
    <div class="split"></div>
    <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
      <v-nodata v-if="loaded && !dataList.length"></v-nodata>
      <div class="list-wraper" v-else>
        <nuxt-link :to="`/exhibition/${item.id}`" class="exhibition-item" v-for="item in dataList" :key="item.id">
          <div class="img-card">
            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            <h6 class="card-title">{{item.title}}</h6>
          </div>
        </nuxt-link>
      </div>
      <div class="split"></div>
    </v-loadmore>
  </section>
</template>
<script>
import axios from "axios";
import loadmore from '~/components/loadmore';
import { paginationMixin } from '~/components/mixins';
import { Tab, TabItem } from '~/components/tab'
import wechat from '~/util/wechat.js';

export default {
  head: {
    title: '数字展览'
  },
  mixins: [paginationMixin, wechat],
  components: {
    Tab,
    TabItem,
    'v-loadmore': loadmore
  },
  async asyncData({ params, error, req }) {
    let types = await axios.get("/exhibitionType")
    return {
      types: types.data
    }
  },
  data() {
    return {
      types: [],
      loadPath: '/exhibitions/'
    }
  },
  async created() {
    await this.loadData(0);
  },
  methods: {
    onItemClick(tab) {
      this.search = 'type=' + tab.code;
      this.loadData(0);
    }
  },
  mounted() {
    this.wechatInit()
  }
};
</script>
<style lang="scss">
@import "~static/styles/pages/exhibition.scss";
</style>
 