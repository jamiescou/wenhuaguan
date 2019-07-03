<template>
  <section class="container vod-container">
    <v-filter :filters="filters" :defaultSelect="selectedOptions" @selectChange="selectChange"></v-filter>
    <div class="split"></div>
    <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
      <v-nodata v-if="loaded && !dataList.length"></v-nodata>
      <div class="list-wraper" v-else>
        <nuxt-link :to="`/vod/${selectedOptions.vodClass.code}?id=${item.id}`" class="card" v-for="item in dataList" :key="item.id">
          <div class="card-hd">
            <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            <div class="tag-wrap">
              <span class="tag">{{convertType(item.artistTypes)}}</span>
            </div>
          </div>
          <div class="card-bd">
            <h4 class="card-title">{{item.name}}</h4>
            <div class="card-scan"><span class="iconNew-scan"></span>{{item.pageView}}</div>
            <p class="card-info">
              <i class="icon icon-clock"></i>
              {{selectedOptions.vodClass.code==='live'?item.startTime:item.createTime}}
            </p>
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
import wechat from '~/util/wechat.js';

export default {
  head: {
    title: '百姓舞台'
  },
  mixins: [paginationMixin, wechat],
  components: {
    'v-filter': filterPanel,
    'v-loadmore': loadmore
  },
  data() {
    return {
      filters: [],
      selectedOptions: {},
      loadPath: '/vods/'
    }
  },
  async asyncData() {
    return {
      selectedOptions: {
        vodClass: {
          code: "demand",
          value: "点播"
        }
      }
    }
  },
  async created() {
    let videoType = await axios.get("/videoType")
    this.videoTypes = videoType.data
    this.filters = [
      { name: '分类', key: 'type', options: videoType.data },
      { name: '是否直播', key: 'vodClass', options: [{ code: "demand", value: "点播" }, { code: "live", value: "直播" }] }];
    this.loadData(0);
  },
  computed: {
    vodClass() {
      return this.selectedOptions.vodClass.code;
    }
  },
  mounted() {
    this.wechatInit()
  },
  methods: {
    convertType(code) {
      let codeName = '';
      if (code.length) {
        for (const c of code) {
          let type = this.videoTypes.find(item => item.code === c);
          if (type) {
            codeName += type.value + ' ';
          }
        }
      }
      return codeName;
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
@import "~static/styles/pages/vod.scss";
</style>
