<template>
    <section class="container resource-container">
        <v-filter :filters="filters" :defaultSelect="selectedOptions" @selectChange="selectChange"></v-filter>
        <div class="split"></div>
        <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
            <v-nodata v-if="loaded && !dataList.length" msg="暂无非遗资源"></v-nodata>
            <div class="list-wraper" v-else>
                <nuxt-link :to="`/heritage/resource/${currentType}?id=${item.id}`" class="card" v-for="item in dataList" :key="item.id">
                    <div class="card-hd">
                        <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                        <div class="tag-wrap">
                            <span class="tag" v-if="item.type">{{ convertType(item.type,'type') }}</span>
                        </div>
                    </div>
                    <div class="card-bd">
                        <h4 class="card-title">{{item.name}}</h4>
                        <p class="card-info" v-if="item.level">
                            {{ convertType(item.level,'level') }}&nbsp;&nbsp;&sdot;&nbsp;&nbsp;{{convertType(item.batch,'batch')}}
                        </p>
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
        title: '非遗资源'
    },
    mixins: [paginationMixin, wechat],
    components: {
        'v-filter': filterPanel,
        'v-loadmore': loadmore
    },
    async asyncData({ req, params }) {
        let dicts = await axios.get("/heritageDicts");
        return {
            heritageLevel: dicts.data.heritageLevel,
            heritageBatch: dicts.data.heritageBatch,
            heritageType: dicts.data.heritageType
        }
    },
    data() {
        return {
            filters: [],
            selectedOptions: {},
            currentType: 'project',
            loadPath: '/heritagePrj/'
        }
    },
    watch: {
        '$store.getters.regions'(val) {
            this.filters[1].options = val;
        }
    },
    async created() {
        this.filters = [
            { name: '名录', key: 'heritagePrj', options: [{ code: "project", value: "名录" }, { code: "successor", value: "传承人" }, { code: "protection", value: "保护区" }] },
            { name: '区域', key: 'regionType', options: this.$store.getters.regions },
            { name: '分类', key: 'type', options: this.heritageType },
            { name: '级别', key: 'level', options: this.heritageLevel }];
        this.selectedOptions = { heritagePrj: { code: "project", value: "名录" } };
        let code = this.$route.query.code;
        if (code && code !== '') {
            this.selectedOptions['regionType'] = { code: code, value: this.$route.query.city };
            this.search = 'regionType=' + code;
        }
        let type = this.$route.query.type;
        if (type && type !== '') {
            this.selectedOptions['heritagePrj'] = { code: "successor", value: "传承人" };
            this.search += (this.search != '' ? '&' : '') + '&heritagePrj=' + type;
        }
        await this.loadData(0);
    },
    methods: {
        convertType(code, type) {
            let dictCode;
            if (type === 'type') {
                dictCode = this.heritageType.find(item => item.code === code);
            } else if (type === 'level') {
                dictCode = this.heritageLevel.find(item => item.code === code);
            } else if (type === 'batch') {
                dictCode = this.heritageBatch.find(item => item.code === code);
            }
            if (dictCode) {
                return dictCode.value;
            }
        },
        // 选择分类等过滤条件
        selectChange(items) {
            this.selectedOptions = items;

            if (this.selectedOptions['heritagePrj']) {
                this.currentType = this.selectedOptions['heritagePrj'].code;
            }

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
}
</script>


<style scoped lang="scss">
@import "~static/styles/pages/heritage.scss";
</style>
