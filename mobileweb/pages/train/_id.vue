<template>
    <section class="container train-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="detailInfo.picture" onerror="this.onerror=null;this.src='/images/default.png'">
                <div class="tag-wrap" v-html="detailInfo.artType">
                </div>
            </div>
            <div class="card-bd">
                <!--<div class="flex-item">-->
                    <!--<div class="cell reserve-tip">-->
                        <h4 class="card-title"> {{detailInfo.title}}</h4>
                        <div class="card-scan"><span class="iconNew-scan"></span>{{detailInfo.pageView}}</div>
                        <span class="remain-type" v-if="detailInfo.reserve!==1">{{detailInfo.reserveMsg}}</span>
                        <template v-else>
                            <span class="remain">
                                <em class="remain-num">{{detailInfo.remain}}</em> /{{detailInfo.allLimitPeoples}}人 </span>
                        </template>
                    <!--</div>-->
                    <!--<v-favorite class="cell fixed favorited" v-model="detailInfo.favorited" favType="Train" :objectId="detailInfo.id"></v-favorite>-->
                <!--</div>-->
            </div>
        </div>
        <div class="split"></div>
        <div class="flex-item desc-list border-bottom">
            <div class="cell fixed addon">
                <i class="icon icon-clock"></i>
            </div>
            <div class="cell">
                {{detailInfo.enrolStartTime}}&nbsp;-&nbsp;{{detailInfo.enrolEndTime}}（报名）
            </div>
        </div>

        <nuxt-link :to="`/train/course?id=${detailInfo.id}`" class="flex-item desc-list border-bottom">
            <div class="cell fixed addon">
                <i class="icon icon-calendar"></i>
            </div>
            <div class="cell">{{detailInfo.startDate}} - {{detailInfo.endDate}}</div>
            <div class="cell fixed right-addon">
                <i class="icon icon-angle-left"></i>
            </div>
        </nuxt-link>
        <div class="flex-item desc-list border-bottom" v-if="detailInfo.address" @click="openMapCallback">
            <div class="cell fixed addon">
                <i class="icon icon-position"></i>
            </div>
            <div class="cell">{{detailInfo.address}}</div>
            <div class="cell fixed right-addon">
                <i class="icon icon-angle-left"></i>
            </div>
        </div>

        <div class="flex-item desc-list" v-if="detailInfo.contactNumber" @click="callPhone(detailInfo.contactNumber)">
            <div class="cell fixed addon">
                <i class="icon icon-phone"></i>
            </div>
            <div class="cell">{{detailInfo.contactNumber}}</div>
            <div class="cell fixed right-addon">
                <i class="icon icon-angle-left"></i>
            </div>
        </div>
        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">报名条件</h4>
        </div>
        <div class="brief">
            <div>1. 当前培训要求实名认证</div>
            <div>2. 本次培训最多可以为{{detailInfo.userLimitPeoples}}人报名</div>
            <div v-if="detailInfo.limitsStr">3. {{detailInfo.limitsStr}}</div>
        </div>

        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">培训详情</h4>
        </div>
        <div class="brief" v-html="detailInfo.introduce"></div>

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
                <nuxt-link :to="{path: '/comments/'+detailInfo.id,query:{type:'train'}}">
                    <i class="icon icon-comment"></i>&nbsp;评论</nuxt-link>
            </div>-->
        </div>
        <div class="split"></div>
        
        <!--<div class="fixed-btn-bottom">
            <mt-button class="btn" v-if="detailInfo.reserve === 1" @click='onConfirmClick'>{{detailInfo.reserveMsg}}</mt-button>
            <mt-button class="btn end" v-else>{{detailInfo.reserveMsg}}</mt-button>
        </div>-->
        <div class="footBtnWrapWc" style="height: 0;">
		    <div class="footBtnWrap clearfix">
		    	<v-favorite class="fBtn" v-model="detailInfo.favorited" favType="Demands" :objectId="detailInfo.id"></v-favorite>
		    	<v-share></v-share>
		    	<nuxt-link class="fBtn" :to="{path: '/comments/'+detailInfo.id,query:{type:'train'}}"><span class="iconNew iconNew-comment"></span>评论</nuxt-link>
		    	<div class="fOrder" v-if="detailInfo.reserve === 1" @click='onConfirmClick'>{{detailInfo.reserveMsg}}</div>
		    	<div class="fOrder end" v-else>{{detailInfo.reserveMsg}}</div>
		    </div>
	    </div>
        
    </section>
</template>

<script>
import axios from "axios";
import { toastMixin } from '~/components/mixins'
import wechat, { openMap } from '~/util/wechat.js'
import favorite from '~/components/favorite.vue'
import share from '~/components/share.vue';
export default {
    layout: 'detail',
    mixins: [toastMixin, wechat],
    head: {
        title: '培训详情'
    },
    components: {
        'v-favorite': favorite,
        'v-share': share
    },
    async asyncData({ params, error, req, query }) {
        let detailInfo = await axios.get('/train/detail/' + params.id);
        let comments = await axios.get('/comments/train/' + params.id + '/0?size=1')
        return {
            detailInfo: detailInfo.data,
            comments: comments.data.content
        };
    },
    data() {
        return {

        }
    },
    async mounted() {
        this.shareOpts.imgUrl = this.detailInfo.picture
        this.shareOpts.title = this.detailInfo.title
        this.shareOpts.desc = this.detailInfo.brief
        console.log('this.shareOpts 培训=========》》》', this.shareOpts)
        await this.wechatInit()
    },
    methods: {
        onConfirmClick() {
            this.$router.push('/train/enroll/' + this.detailInfo.id)
        },
        openMapCallback() {
            var href = window.location.href;
            var lat = this.detailInfo.coordinate.latitude;
            var lng = this.detailInfo.coordinate.longitude;
            openMap({
                latitude: lat,
                longitude: lng,
                name: this.detailInfo.title,
                address: this.detailInfo.address,
                href: href
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/train.scss";
</style>
