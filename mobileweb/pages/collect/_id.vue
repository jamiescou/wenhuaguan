<template>
    <section class="container collect-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            </div>
            <div class="card-bd">
                <!--<div class="flex-item">-->
                <!--<div class="cell reserve-tip">-->
                <h4 class="card-title">{{detailInfo.name}}</h4>
                <div class="card-scan"><span class="iconNew-scan"></span>{{detailInfo.pageView}}</div>
                <!--</div>-->
                <!--<v-favorite class="cell fixed favorited" v-model="detailInfo.favorited" favType="ArtWorks" :objectId="detailInfo.id"></v-favorite>-->
                <!--</div>-->
            </div>
        </div>
        <div class="split"></div>
        <div class="flex-item desc-list">
            <div class="cell fixed addon">
                <i class="icon icon-clock"></i>
            </div>
            <div class="cell">
                {{detailInfo.startTime}} - {{detailInfo.endTime}}
            </div>
        </div>

        <template v-if="detailInfo.type === 'competition'">
            <div class="split"></div>
            <div class="block-heading">
                <h4 class="title">赛事奖品</h4>
            </div>
            <div class="brief" v-html="detailInfo.award"></div>
        </template>

        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">{{typeName}}简介</h4>
        </div>
        <div class="brief" v-html="detailInfo.brief"></div>

        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">{{typeName}}描述</h4>
        </div>
        <div class="brief" v-html="detailInfo.desc"></div>

        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">{{typeName}}作品</h4>
        </div>
        <div class="products">
            <div class="card-col-2" v-if="products.content.length">
                <div class="card col-2" v-for="(item,index) in products.content" :key="'product_'+index">
                    <div class="card-hd" @click="navWorkDetail(item.id,detailInfo.id)" :style='`background:url(${item.files[0].filePath}) center;background-size:cover`'>
                        <!-- <img :src="item.files[0].filePath" onerror="this.onerror=null;this.src='/images/default.png'"> -->
                    </div>
                    <div class="card-bd">
                        <h4 class="card-title">{{item.title}}</h4>
                    </div>
                </div>
            </div>
            <v-nodata :msg="'暂无'+typeName+'作品'" v-else></v-nodata>
            <div class="more border-top" v-if="products.totalElements>4">
                <nuxt-link :to="`/collect/products?id=${detailInfo.id}`">查看更多&nbsp;&nbsp;&rarr;</nuxt-link>
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
                <nuxt-link :to="{path: '/comments/'+detailInfo.id,query:{type:'collect'}}">
                    <i class="icon icon-comment"></i>&nbsp;评论</nuxt-link>
            </div>-->
        </div>
        <div class="split"></div>

        <!--<footer class="footer pre-footer" ref="footWrapper">
            <mt-button class="btn" v-if="detailInfo.tag=='进行中'" @click="onWorkUpload()">我要参加</mt-button>
            <mt-button class="btn go" v-else-if="detailInfo.tag === '未开始'">{{detailInfo.tag}}</mt-button>
            <mt-button class="btn end" v-else>{{detailInfo.tag}}</mt-button>
        </footer>-->

        <div class="footBtnWrapWc" style="height: 0;">
            <div class="footBtnWrap clearfix">
                <v-favorite class="fBtn" v-model="detailInfo.favorited" favType="ArtWorks" :objectId="detailInfo.id"></v-favorite>
                <v-share></v-share>
                <nuxt-link class="fBtn" :to="{path: '/comments/'+detailInfo.id,query:{type:'collect'}}"><span class="iconNew iconNew-comment"></span>评论</nuxt-link>
                <div class="fOrder" v-if="detailInfo.tag=='进行中'" @click="onWorkUpload()">我要参加</div>
                <div class="fOrder end" v-else-if="detailInfo.tag === '未开始'">{{detailInfo.tag}}</div>
                <div class="fOrder end" v-else>{{detailInfo.tag}}</div>
            </div>
        </div>

    </section>
</template>

<script>
import axios from "axios";
import favorite from "~/components/favorite.vue";
import share from '~/components/share.vue';
import wechat from '~/util/wechat.js';

export default {
    layout: "detail",
    mixins: [wechat],
    head: {
        title: "征集详情"
    },
    components: {
        "v-favorite": favorite,
        'v-share': share
    },
    computed: {
        typeName() {
            return this.detailInfo.type === 'activity' ? '征集' : '赛事';
        }
    },
    async asyncData({ params, error, req, query }) {
        let detailInfo = await axios.get("/collect/detail/" + params.id);
        let comments = await axios.get("/comments/collect/" + params.id + "/0?size=1");
        let products = await axios.get("/collect/works/lst/0?size=4&id=" + params.id);

        return {
            detailInfo: detailInfo.data,
            comments: comments.data.content,
            products: products.data
        };
    },
    methods: {
        navWorkDetail(workId, actId) {
            this.$router.push({
                path: "/collect/workdetail",
                query: { workId: workId, activityId: actId }
            });
        },
        onWorkUpload() {
            if (!this.$store.state.user) {
                this.$router.replace({
                    path: "/login",
                    query: { redirect: this.$route.fullPath }
                });
                return;
            } else {
                this.$router.push({
                    path: "/collect/workupload",
                    query: { activityId: this.detailInfo.id }
                });
            }
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
@import "~static/styles/pages/collect.scss";
.products .card .card-title {
  width: auto;
  height: $card-title-lineheight;
  overflow: hidden;
}
</style>