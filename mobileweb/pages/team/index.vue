<template>
  <section class="container team-container">
    <v-filter :filters="filters" :defaultSelect="selectedOptions" @selectChange="selectChange"></v-filter>
    <div class="split"></div>
    <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
      <v-nodata v-if="loaded && !dataList.length"></v-nodata>
      <div class="list-wraper" v-else>
        <nuxt-link :to="`/team/${item.id}`" class="card" v-for="item in dataList" :key="item.id">
          <div class="card-hd">
            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            <div class="tag-wrap" v-if="item.artType && item.artType.length">
              <span class="tag" v-for="tag in item.artType" :key="tag">{{convertType(tag)}}</span>
            </div>
          </div>
          <div class="card-bd">
            <h4 class="card-title"> {{item.name}}</h4>
            <p class="card-info">
              <i class="icon icon-phone"></i>{{item.contactPhone}}
            </p>
            <p class="card-info">
              <i class="icon icon-position"></i>{{item.address}}
            </p>
            <div class="card-info border-top favorite-reserve">
              <v-favorite v-model="item.favorited" favType="ArtTeam" :objectId="item.id"></v-favorite>
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
    title: '文艺团队'
  },
  mixins: [paginationMixin, wechat],
  components: {
    'v-filter': filterPanel,
    'v-loadmore': loadmore,
    'v-favorite': favorite
  },
  async asyncData({ req, params, store }) {
    let dicts = await axios.get("/teamDicts")
    return {
      artists: dicts.data.artists
    }
  },
  data() {
    return {
      filters: [],
      selectedOptions: {},
      loadPath: '/teams/'
    }
  },
  watch: {
    '$store.getters.regions'(val) {
      this.filters[1].options = val;
    }
  },
  created() {
    this.filters = [
      { name: '类型', key: 'type', options: this.artists },
      { name: '区域', key: 'regionType', options: this.$store.getters.regions }];
    this.loadData(0);
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
  },
  mounted() {
    this.wechatInit()
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/team.scss";
</style>
 