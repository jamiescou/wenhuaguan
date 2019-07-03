<template>
    <section class="container hall-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                <div class="tag-wrap">
                    <span class="tag">{{ detailInfo.typeName }}</span>
                </div>
            </div>
            <div class="card-bd">
                <h4 class="card-title"> {{detailInfo.name}}</h4>
            </div>
        </div>
        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">单元简介</h4>
        </div>
        <div class="remark" v-html="detailInfo.brief"></div>

        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">单元作品</h4>
        </div>
        <div class="products">
            <div class="card-col-2" v-if="products.content.length>0">
                <div class="card col-2" v-for="(item,index) in products.content" :key="'product_'+index">
                    <div class="card-hd" @click="navWorkDetail(item.id)">
                        <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                    </div>
                    <div class="card-bd">
                        <h4 class="card-title">{{item.title}}</h4>
                    </div>
                </div>
            </div>
            <v-nodata msg="暂无展览作品" v-else></v-nodata>
            <div class="more border-top" v-if="products.totalElements>4">
                <nuxt-link :to="`/heritage/hall/products?id=${detailInfo.id}`">查看更多&nbsp;&nbsp;&rarr;</nuxt-link>
            </div>
        </div>
        <div class="split"></div>
    </section>
</template>

<script>
import axios from "axios";
import wechat from '~/util/wechat.js';
export default {
    layout: "detail",
    mixins: [wechat],
    head: {
        title: "资源详情"
    },
    async asyncData({ params, error, req, query }) {
        let detailInfo = await axios.get("/heritage/unit/" + params.id);
        return {
            detailInfo: detailInfo.data,
            products: detailInfo.data.works
        };
    },
    data() {
        return {
        };
    },
    methods: {
        navWorkDetail(workId) {
            this.$router.push({
                path: "/heritage/hall/workdetail",
                query: { workId: workId, hallId: this.detailInfo.id }
            });
        }
    },
    mounted() {
        this.shareOpts.imgUrl = this.detailInfo.coverPic
        this.shareOpts.title = this.detailInfo.name
        this.shareOpts.desc = this.detailInfo.brief
        this.wechatInit()
    }
};
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/heritage.scss";
</style>