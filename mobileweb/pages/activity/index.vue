<template>
  <section class="container activity-container">
    <v-filter :filters="filters" :defaultSelect="selectedOptions" @selectChange="selectChange"></v-filter>
    <div class="split"></div>
    <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
      <v-nodata v-if="loaded && !dataList.length" msg="当前还没有发布活动~"></v-nodata>
      <div class="list-wraper" v-else>
        <nuxt-link :to="`/activity/${item.id}`" class="card" v-for="item in dataList" :key="item.id">
          <div class="card-hd">
            <img v-lazy="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            <div class="tag-wrap" v-if="item.activityType && item.activityType.length">
              <span class="tag" v-for="tag in item.activityType" :key="tag">{{convertType(tag)}}</span>
            </div>
          </div>
          <div class="card-bd">
            <h4 class="card-title">{{item.name}}</h4>
            <p class="card-info">
              <i class="icon icon-clock"></i>
              {{item.holdStartDate}}&nbsp;至&nbsp;{{item.holdEndDate}}
            </p>
            <p class="card-info">
              <i class="icon icon-position"></i>{{item.address}}
            </p>
            <div class="card-info border-top favorite-reserve">
              <div class="flex-item">
                <v-favorite class="cell fixed" v-model="item.favorited" favType="Activity" :objectId="item.id"></v-favorite>
                <div class="cell reserve-tip">
                  <template v-if="item.reserve!==1">{{item.reserveMsg}}</template>
                  <template v-else>
                    <span class="remain">
                      <em class="remain-num">{{item.remainTicket}}</em> 余票 </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </v-loadmore>
    <div class="split"></div>
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
    title: '活动预约'
  },
  mixins: [paginationMixin, wechat],
  components: {
    'v-filter': filterPanel,
    'v-loadmore': loadmore,
    'v-favorite': favorite
  },
  async asyncData({ req, params, query, store }) {
    let dicts = await axios.get("/activityDicts");
    console.log(dicts.data.activityForm);
    return {
      activityForm: dicts.data.activityForm
    }
  },
  data() {
    return {
      filters: [],
      selectedOptions: {},
      loadPath: '/activitys/'
    }
  },
  watch: {
    '$store.getters.regions'(val) {
      this.filters[1].options = val;
    }
  },
  created() {
    let sorts = [
      { code: '0', value: '智能排序' },
      { code: '1', value: '可预约' },
      { code: '2', value: '即将开始' },
      { code: '3', value: '已经结束' }]
    this.filters = [
      { name: '类型', key: 'type', options: this.activityForm },
      { name: '区域', key: 'regionType', options: this.$store.getters.regions },
      { name: '排序', key: 'sort', options: sorts }];
    this.selectedOptions = { sort: { code: "0", value: "智能排序" } };
    let brand = this.$route.query.brand
    if (brand) {
      this.selectedOptions.brand = { code: brand }
      this.search = 'brand=' + brand
    }
    this.loadData(0);
  },
  mounted() {
    this.wechatInit()
  },
  methods: {
    convertType(code) {
      let type = this.activityForm.find(item => item.code === code);
      if (type) {
        return type.value;
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


<style scoped lang="scss">
@import "~static/styles/pages/activity.scss";
</style>
