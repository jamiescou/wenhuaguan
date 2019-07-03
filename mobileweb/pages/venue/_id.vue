<template>
    <section class="container venue-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                <div class="tag-wrap">
                    <span class="tag red">{{detailInfo.enableName}}</span>
                    <span class="tag">{{detailInfo.typeName}}</span>
                </div>
            </div>
            <div class="card-bd">
                <!--<div class="flex-item">-->
                <!--<div class="cell reserve-tip">-->
                <h4 class="card-title">{{detailInfo.venue.name}}&minus; {{detailInfo.name}}</h4>
                <div class="card-scan"><span class="iconNew-scan"></span>{{detailInfo.pageView}}</div>
                <!--</div>-->
                <!--<v-favorite class="cell fixed favorited" v-model="detailInfo.favorited" favType="VenueRoom" :objectId="detailInfo.id"></v-favorite>-->
                <!--</div>-->

            </div>
        </div>
        <div class="split"></div>
        <div class="flex-item desc-list border-bottom" v-if="detailInfo.venue && detailInfo.venue.openDateTime">
            <div class="cell fixed addon">
                <i class="icon icon-clock"></i>
            </div>
            <div class="cell">
                {{detailInfo.venue.openDateTime}} 场馆开放
            </div>
        </div>

        <div class="flex-item desc-list border-bottom" v-if="detailInfo.venue && detailInfo.venue.address" @click="openMapCallback">
            <div class="cell fixed addon">
                <i class="icon icon-position"></i>
            </div>
            <div class="cell">{{detailInfo.venue.address}}</div>
            <div class="cell fixed right-addon">
                <i class="icon icon-angle-left"></i>
            </div>
        </div>

        <div class="flex-item desc-list" v-if="detailInfo.telephone" @click="callPhone(detailInfo.telephone)">
            <div class="cell fixed addon">
                <i class="icon icon-phone"></i>
            </div>
            <div class="cell">{{detailInfo.telephone}}</div>
            <div class="cell fixed right-addon">
                <i class="icon icon-angle-left"></i>
            </div>
        </div>
        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">活动室详情</h4>
        </div>
        <div class="brief" v-html="detailInfo.desc"></div>

        <div class="split"></div>
        <div class="block-heading">
            <h4 class="title">活动室设施</h4>
        </div>
        <div class="brief">
            {{detailInfo.facilities}}
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
                <nuxt-link :to="{path: '/comments/'+detailInfo.id,query:{type:'venueroom'}}">
                    <i class="icon icon-comment"></i>&nbsp;评论</nuxt-link>
            </div>-->
        </div>
        <div class="split"></div>
        <!--<div class="fixed-btn-bottom">
            <mt-button class="btn" v-if="user&&user.identifyStatus!='Yes'">请先实名认证</mt-button>
            <mt-button class="btn" v-else-if="detailInfo.itmDef.isEnable" @click="showPopup">立即预订</mt-button>
            <mt-button class="btn end" v-else>不可预定</mt-button>
        </div>-->

        <div class="footBtnWrapWc" style="height: 0;">
            <div class="footBtnWrap clearfix">
                <v-favorite class="fBtn" v-model="detailInfo.favorited" favType="VenueRoom" :objectId="detailInfo.id"></v-favorite>
                <v-share></v-share>
                <nuxt-link class="fBtn" :to="{path: '/comments/'+detailInfo.id,query:{type:'venueroom'}}"><span class="iconNew iconNew-comment"></span>评论</nuxt-link>
                <div class="fOrder real" v-if="user&&user.identifyStatus!='Yes'">请先完成实名认证</div>
                <div class="fOrder" v-else-if="detailInfo.itmDef.isEnable" @click="showPopup">立即预订</div>
                <div class="fOrder end" v-else>不可预订</div>
            </div>
        </div>

        <mt-popup v-model="isShow" position="bottom" class="pre-schedule">
            <div class="curDate">{{currentDate.month}}</div>
            <div v-swiper:barSwiper="swiperOption" v-if="schedule  && schedule.length" class="date-wrapper border-bottom">
                <div class="swiper-wrapper">
                    <div class="swiper-slide dt-item" v-for="(item,index) in schedule" :key="index" @click="onDateChange(item)" :class="{'current':currentDate.date===item.date}">
                        <p class="week">{{item.week}}</p>
                        <p class="date">{{item.day}}</p>
                    </div>
                </div>
            </div>
            <div class="time-wrapper" ref="timeWrapper">
                <div class="time-items">
                    <div class="col-3" v-for="(item,index) in currentDate.data" :key="index">
                        <div @click="onTimeSelected(item)" class="item" :class="{'reserve':item.isReserve,'active':item.checked}">
                            {{item.itmStarttime + ' - ' + item.itmEndtime}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="operations">
                <mt-button class="btn" @click='onConfirmClick'>立即预订</mt-button>
            </div>
        </mt-popup>
    </section>
</template>

<script>
import axios from "axios";
import slice from 'lodash/slice';
import { toastMixin } from '~/components/mixins';
import { mapState } from 'vuex'
import wechat, { openMap } from '~/util/wechat.js';
import favorite from '~/components/favorite.vue';
import share from '~/components/share.vue';

let BScroll
if (process.browser) {
    BScroll = require('better-scroll').default;
}
export default {
    layout: 'detail',
    mixins: [toastMixin, wechat],
    head: {
        title: '活动室详情'
    },
    components: {
        'v-favorite': favorite,
        'v-share': share
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    async asyncData({ params, error, req, query }) {

        let detailInfo = await axios.get('/venueroom/detail/' + params.id);
        let comments = await axios.get('/comments/venueroom/' + params.id + '/0?size=1')
        let schedule = detailInfo.data.schedule;
        return {
            detailInfo: detailInfo.data,
            comments: comments.data.content,
            schedule: schedule
        };
    },
    data() {
        return {
            isShow: false,
            schedule: [],  // 场次安排表
            currentDate: {}, //当前选中的日期，默认第一天
            swiperOption: {
                slidesPerView: 7
            },
        }
    },
    methods: {
        openMapCallback() {
            var href = window.location.href;
            var lat = this.detailInfo.venue.coordinate.latitude;
            var lng = this.detailInfo.venue.coordinate.longitude;
            openMap({
                latitude: lat,
                longitude: lng,
                name: this.detailInfo.name,
                address: this.detailInfo.address,
                href: href
            })
        },
        showPopup() {
            if (!this.$store.state.user) {
                this.$router.replace({ path: "/login", query: { redirect: this.$route.fullPath } });
                return;
            }

            this.isShow = true;
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.timeWrapper, {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            });
        },
        /**选中日期 */
        onDateChange(item) {
            // 清除掉已经选中的
            let schedule = this.schedule.find(x => x.date === this.currentDate.date);
            if (schedule) {
                for (const i of schedule.data) {
                    i.checked = false;
                }
            }
            this.currentDate = item;
        },
        onConfirmClick() {
            if (!this.$store.state.user) {
                this.$router.push({ path: "/login", query: { redirect: this.$route.fullPath } });
                return;
            }
            let checkItms = this.currentDate.data.filter(x => x.checked === true);
            if (!checkItms.length) {
                this.showMsg('请选择预定时段');
                return;
            }
            this.$store.commit('SELECTED_ROOM_TIME', checkItms);
            this.$router.push('/venue/booking/' + this.detailInfo.id);
        },
        onTimeSelected(item) {
            if (item.isReserve) {
                return;
            }
            item.checked = !item.checked;
        }
    },
    async beforeMount() {
        if (this.schedule && this.schedule.length) {
            this.currentDate = this.schedule[0];
        }
        this.shareOpts.imgUrl = this.detailInfo.coverPic
        this.shareOpts.title = this.detailInfo.name
        this.shareOpts.desc = this.detailInfo.brief
        await this.wechatInit()
    },
    // async mounted() {
    //     this.shareOpts.imgUrl = this.detailInfo.coverPic
    //     this.shareOpts.title = this.detailInfo.name
    //     this.shareOpts.desc = this.detailInfo.brief
    //     await this.wechatInit()
    // }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/venue.scss";
</style>
