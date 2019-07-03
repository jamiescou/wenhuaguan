<template>
    <section class="container exhibition-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            </div>
            <div class="card-bd">
                <h4 class="card-title"> {{detailInfo.title}}</h4>
                <div class="card-scan"><span class="iconNew-scan"></span>{{detailInfo.pageView ? detailInfo.pageView : 1}}</div>
                <p class="card-info">{{detailInfo.brief}}</p>
            </div>
        </div>
        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">展览作品</h4>
        </div>
        <div class="products">
            <div class="card-col-2" v-if="products.content.length>0">
                <div class="card col-2" v-for="(item,index) in products.content" :key="'product_'+index">
                    <div class="card-hd" @click="navWorkDetail(item.id,detailInfo.id)">
                        <img :src="item.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                    </div>
                    <div class="card-bd">
                        <h4 class="card-title">{{item.title}}</h4>
                    </div>
                </div>
            </div>
            <v-nodata msg="暂无展览作品" v-else></v-nodata>
            <div class="more border-top" v-if="products.totalElements>4">
                <nuxt-link :to="`/exhibition/products?id=${detailInfo.id}`">查看更多&nbsp;&nbsp;&rarr;</nuxt-link>
            </div>
        </div>
        <div class="split"></div>
        <div class="comments">
            <div class="block-heading">
                <h4 class="title">评论列表</h4>
            </div>
            <div class="comment" v-if="comments.length">
                <div class="flex-item">
                    <div class="cell fixed">
                        <img :src='comments[0].pic' onerror="this.onerror=null;this.src='/images/portrait.png'" class="avatar" />
                    </div>
                    <h4 class="cell nickname">{{comments[0].nickname}}</h4>
                    <span class="cell fixed time">{{comments[0].time}}</span>
                </div>
                <p class="c-content">{{comments[0].content}}</p>
            </div>
            <v-nodata msg="还没有评论，快去评论吧(☄⊙ω⊙)☄" class="no-data" v-else></v-nodata>
            <!--<div class="more border-top">
                <nuxt-link :to="{path: '/comments/'+detailInfo.id,query:{type:'exhibition'}}">
                    <i class="icon icon-comment"></i>&nbsp;评论</nuxt-link>
            </div>-->
        </div>
        <div class="split"></div>

        <div class="footBtnWrapWc">
            <div class="footBtnWrap clearfix">
                <v-favorite class="fBtn" v-model="detailInfo.favorited" favType="DigitalShow" :objectId="detailInfo.id"></v-favorite>
                <v-share></v-share>
                <nuxt-link class="fTxt" :to="{path: '/comments/'+detailInfo.id,query:{type:'exhibition'}}">说点什么</nuxt-link>
            </div>
        </div>

    </section>
</template>

<script>
import axios from "axios";
import favorite from '~/components/favorite.vue';
import share from '~/components/share.vue';
import wechat from '~/util/wechat.js';

export default {
    layout: "detail",
    mixins: [wechat],
    head: {
        title: "资源详情"
    },
    components: {
        'v-favorite': favorite,
        'v-share': share
    },
    async asyncData({ params, error, req, query }) {
        let detailInfo = await axios.get("/exhibition/detail/" + params.id);
        let products = await axios.get("/exhibition/products/" + params.id + "/0?size=4");
        let comments = await axios.get("/comments/exhibition/" + params.id + "/0?size=1");
        return {
            detailInfo: detailInfo.data,
            comments: comments.data.content,
            products: products.data
        };
    },
    data() {
        return {
            currentTab: "1"
        };
    },
    methods: {
        navWorkDetail(workId) {
            this.$router.push({
                path: "/exhibition/workdetail",
                query: { workId: workId, activityId: this.detailInfo.id }
            });
        }
    },
    mounted() {
        this.shareOpts.imgUrl = this.detailInfo.coverPic
        this.shareOpts.title = this.detailInfo.title
        this.shareOpts.desc = this.detailInfo.brief
        this.wechatInit()
    }
};
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/exhibition.scss";
</style>