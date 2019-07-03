<template>
    <section class="container search-container">
        <mt-search v-model="srchkey" cancel-text="取消" placeholder="搜索" autofocus @keyup.enter.native="_search()"></mt-search>
        <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
            <h1 class="search-count" v-if="srchkeyH1">平台为您找到相关“
                <span>{{srchkey}}</span>”数据为
                <span> {{totalElements}} </span>条</h1>
            <v-nodata v-if="loaded && !dataList.length" msg="没有查询到数据"></v-nodata>
            <div class="search-list-wraper" v-else>
                <!-- {{dataList.length}} -->
                <div class="list" v-for="item in dataList" :key="item.type + '_' + item.targetId ">
                    <nuxt-link :to="`${PATH_ENUM[item.type].path}${item.targetId}`">
                        <h4 class="list-title">{{item.title}}
                            <span>{{' - ' + PATH_ENUM[item.type].label}}</span>
                        </h4>
                    </nuxt-link>
                </div>
            </div>
            <div class="split"></div>
        </v-loadmore>
    </section>

</template>
<script>
import loadmore from "~/components/loadmore";
import { paginationMixin } from "~/components/mixins";
// 'ArtTalent': 'talent', // 文艺人才
// 'CultureSupply': 'supply', // 文化配送
// 'ArtOpus': 'opus' // 艺术作品
export default {
    head: {
        title: "全站搜索"
    },
    mixins: [paginationMixin],
    components: {
        "v-loadmore": loadmore
    },
    data() {
        return {
            srchkey: '',
            srchkeyH1: false,
            loadPath: '/searchlist/',
            PATH_ENUM: {
                'Activity': { path: '/activity/', label: '活动' },
                'Train': { path: '/train/', label: '培训' },
                'Information': { path: '/information/article/', label: '资讯' },
                'ArtTeam': { path: '/team/', label: '文化团队' },
                'ArtWorks': { path: '/collect/', label: '征集作品' },
                'DigitalShow': { path: '/exhibition/', label: '数字展览' },
                'CultureBrand': { path: '/brand/', label: '文化品牌' },
                'heritageDirectory': { path: '/heritage/resource/project?id=', label: '非遗名录' },
                'heritageSuccessor': { path: '/heritage/resource/successor?id=', label: '传承人' },
                'heritageProtectArea': { path: '/heritage/resource/protection?id=', label: '非遗保护区' },
                'VenueRoom': { path: '/venue/', label: '场馆活动室' },
                'VolunteerRecruit': { path: '/volunteer/', label: '招募活动' },
                'LiveVideos': { path: '/vod/live?id=', label: '直播' },
                'Demands': { path: '/vod/demand?id=', label: '录播' },
                'CultureSupply': { path: '#', label: '文化配送' }
            },
        };
    },
    methods: {
        async _search() {
            if (this.srchkey.trim() !== '') {
                this.search = 'srchkey=' + this.srchkey;
                this.srchkeyH1 = true;
                await this.loadData(0);
                let searchResult = {
                    dataList: this.dataList,
                    totalPages: this.totalPages,
                    totalElements: this.totalElements,
                    search: this.search,
                    page: this.page,
                    loaded: this.loaded,
                    srchkey: this.srchkey.trim()
                }
                this.$store.dispatch('setSearch', searchResult)
            } else {
                this.srchkeyH1 = false;
                this.dataList = [];
                this.$store.dispatch('setSearch', null)
            }
        }
    },
    created() {
        if (this.$store.getters.search) {
            let searchResult = this.$store.getters.search;
            this.totalElements = searchResult.totalElements;
            this.dataList = searchResult.dataList;
            this.search = searchResult.search;
            this.page = searchResult.page;
            this.loaded = searchResult.loaded;
            this.srchkey = searchResult.srchkey;
            this.srchkeyH1 = true
        }
    }
}
</script>
<style lang="scss">
@import "~static/styles/pages/search.scss";
</style>
