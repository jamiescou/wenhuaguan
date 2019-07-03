<template>
  <section class="container volunteer-container">
    <v-filter :filters="filters" :defaultSelect="selectedOptions" @selectChange="selectChange"></v-filter>
    <div class="split"></div>
    <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
      <v-nodata v-if="loaded && !dataList.length"></v-nodata>
      <div class="list-wraper" v-else>
        <nuxt-link :to="`/volunteer/${item.id}`" class="card" v-for="item in dataList" :key="item.id">
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
      </div>
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
    title: '志愿服务'
  },
  mixins: [paginationMixin, wechat],
  components: {
    'v-filter': filterPanel,
    'v-loadmore': loadmore,
    'v-favorite': favorite
  },
  async asyncData({ params, error, req, store }) {
    let dicts = await axios.get('/volunDicts')
    return {
      ActTypes: dicts.data.ActTypes
    }
  },
  data() {
    return {
      filters: [],
      ActTypes: [],
      selectedOptions: {},
      loadPath: '/volunteers/'
    }
  },
  watch: {
    '$store.getters.regions'(val) {
      this.filters[1].options = val;
    }
  },
  async created() {
    let sorts = [
      { code: 'all', value: '全部' },
      { code: '1', value: '招募中' },
      { code: '2', value: '停止招募' }]
    this.filters = [
      { name: '类型', key: 'type', options: this.ActTypes },
      { name: '区域', key: 'regionType', isTree: true, options: this.$store.getters.regions },
      { name: '是否招募', key: 'isStop', options: sorts }];
    await this.loadData(0)
  },
  mounted() {
    this.wechatInit()
  },
  methods: {
    convertType(code) {
      let type = this.ActTypes.find(item => item.code === code);
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
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/volunteer.scss";
</style>
 