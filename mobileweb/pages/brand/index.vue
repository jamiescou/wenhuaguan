<template>
    <section class="container brand-container">
        <v-filter :filters="filters" @selectChange="selectChange"></v-filter>
        <div class="split"></div>
        <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
            <v-nodata v-if="loaded && !dataList.length"></v-nodata>
            <div class="list-wraper" v-else>
                <nuxt-link :to="`/brand/${item.id}`" class="card" v-for="item in dataList" :key="item.id">
                    <div class="card-hd">
                        <img v-lazy="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                    </div>
                    <div class="card-bd">
                        <h4 class="card-title"> {{item.name}}</h4>
                        <p class="card-info desc">{{item.brief}}</p>
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
import wechat from '~/util/wechat.js';

export default {
    head: {
        title: '文化品牌'
    },
    mixins: [paginationMixin, wechat],
    components: {
        'v-filter': filterPanel,
        'v-loadmore': loadmore
    },
    data() {
        return {
            filters: [],
            loadPath: '/brands/'
        }
    },
    watch: {
        '$store.getters.regions'(val) {
            this.filters[0].options = val;
        }
    },
    created() {
        this.filters = [{ name: '区域', key: 'regionType', options: this.$store.getters.regions }]
        this.loadData(0);
    },
    methods: {
        // 选择分类等过滤条件
        selectChange(items) {
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
@import "~static/styles/pages/brand.scss";
</style>
 