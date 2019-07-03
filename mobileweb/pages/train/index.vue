<template>
  <section class="container train-container">
    <v-filter :filters="filters" :defaultSelect="selectedOptions" @selectChange="selectChange"></v-filter>
    <div class="split"></div>
    <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
      <v-nodata v-if="loaded && !dataList.length"></v-nodata>
      <div class="list-wraper" v-else>
        <nuxt-link :to="`/train/${item.id}`" class="card" v-for="item in dataList" :key="item.id">
          <div class="card-hd">
            <img v-lazy="item.picture" onerror="this.onerror=null;this.src='/images/default.png'">
            <div class="tag-wrap" v-if="item.artType && item.artType.length">
              <span class="tag" v-for="tag in item.artType" :key="tag">{{convertType(tag)}}</span>
            </div>
          </div>
          <div class="card-bd">
            <h4 class="card-title">{{item.title}}</h4>
            <p class="card-info">
              <i class="icon icon-clock"></i>
              {{item.enrolStartTime}}&nbsp;至&nbsp;{{item.enrolEndTime}}（报名时间）
            </p>
            <p class="card-info">
              <i class="icon icon-position"></i>{{item.address}}
            </p>
            <div class="card-info border-top favorite-reserve">
              <div class="flex-item">
                <v-favorite class="cell fixed" v-model="item.favorited" favType="Train" :objectId="item.id"></v-favorite>
                <div class="cell reserve-tip">
                  <template v-if="item.reserve!==1">{{item.reserveMsg}}</template>
                  <template v-else>
                    <span class="remain">
                      <em class="remain-num">{{item.remain}}</em> /{{item.allLimitPeoples}}人 </span>
                  </template>
                </div>
              </div>
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
  mixins: [paginationMixin, wechat],
  components: {
    'v-filter': filterPanel,
    'v-loadmore': loadmore,
    'v-favorite': favorite
  },
  async asyncData({ req, params, store }) {
    let dicts = await axios.get("/trainDicts")
    console.log(dicts);
    return {
      artists: dicts.data.artists
    }
  },
  data() {
    return {
      filters: [],
      selectedOptions: {},
      loadPath: '/trains/'
    }
  },
  watch: {
    '$store.getters.regions'(val) {
      this.filters[1].options = val;
    }
  },
  created() {
    let sorts = [
      { code: 'all', value: '默认排序' },
      { code: '1', value: '可报名' },
      { code: '2', value: '即将开始' },
      { code: '3', value: '已结束' }]
    this.filters = [
      { name: '类型', key: 'type', options: this.artists },
      { name: '区域', key: 'regionType', options: this.$store.getters.regions },
      { name: '排序', key: 'sort', options: sorts }];
    this.loadData(0);
  },
  mounted() {
    this.wechatInit()
  },
  methods: {
    convertType(code) {
      let type = this.artists.find(item => item.code === code);
      if (type) {
        return type.value
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
}
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/train.scss";
</style>
 