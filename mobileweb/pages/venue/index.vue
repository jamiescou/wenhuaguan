<template>
  <section class="container venue-container">
    <v-filter :filters="filters" :defaultSelect="selectedOptions" @selectChange="selectChange"></v-filter>
    <div class="split"></div>
    <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
      <v-nodata v-if="loaded && !dataList.length"></v-nodata>
      <div class="list-wraper" v-else>
        <nuxt-link :to="`/venue/${item.id}`" class="card" v-for="item in dataList" :key="item.id">
          <div class="card-hd">
            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            <div class="tag-wrap">
              <span class="tag red">{{item.enableName}}</span>
              <span class="tag">{{convertType(item.type)}}</span>
            </div>
          </div>
          <div class="card-bd">
            <h4 class="card-title"> {{item.venue.name}}&minus; {{item.name}}</h4>
            <p class="card-info desc">{{item.brief}}</p>
            <div class="card-info border-top favorite-reserve">
              <v-favorite v-model="item.favorited" favType="VenueRoom" :objectId="item.id"></v-favorite>
            </div>
          </div>
        </nuxt-link>
      </div>
      <div class="split"></div>
    </v-loadmore>
  </section>

</template>
<script>
import axios from "axios";
import filterPanel from '~/components/filter-panel';
import loadmore from '~/components/loadmore';
import { paginationMixin } from '~/components/mixins';
import favorite from '~/components/favorite.vue';
import wechat from '~/util/wechat.js';

export default {
  head: {
    title: '场馆预订'
  },
  mixins: [paginationMixin, wechat],
  components: {
    'v-filter': filterPanel,
    'v-loadmore': loadmore,
    'v-favorite': favorite
  },
  async asyncData({ req, params, store }) {
    let dicts = await axios.get("/venueDicts")
    return {
      RoomTypes: dicts.data.RoomTypes
    }
  },
  data() {
    return {
      filters: [],
      selectedOptions: {},
      loadPath: '/venues/'
    }
  },
  watch: {
    '$store.getters.regions'(val) {
      this.filters[1].options = val;
    }
  },
  created() {
    let reserveOptions = [
      { code: 'all', value: '全部' },
      { code: '1', value: '可预订' },
      { code: '2', value: '不可预订' }]
    this.filters = [
      { name: '类型', key: 'type', options: this.RoomTypes },
      { name: '区域', key: 'regionType', options: this.$store.getters.regions },
      { name: '可否预订', key: 'enable', options: reserveOptions }];
    this.loadData(0);
  },
  mounted() {
    this.wechatInit()
  },
  methods: {
    convertType(code) {
      if (code) {
        let type = this.RoomTypes.find(item => item.code === code);
        if (type) {
          return type.value;
        }
      }
    },
    // 选择分类等过滤条件
    selectChange(items) {
      this.selectedOptions = items;
      let searchCondition = [];
      for (var item in items) {
        if (items[item]) {
          searchCondition.push(item + '=' + items[item].code);
        }
      }
      this.search = searchCondition.join('&');
      this.loadData(0);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/venue.scss";
</style>
