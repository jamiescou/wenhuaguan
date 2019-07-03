<template>
    <section class="container volun-activity-detail">
        <div class="card base-info">
            <div class="card-hd">
                <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
                <div class="tag-wrap" v-html="detailInfo.serviceTypes"></div>
            </div>
            <div class="card-bd">
                <div class="flex-item">
                    <div class="cell reserve-tip">
                        <h4 class="card-title"> {{detailInfo.name}}</h4>

                        <span class="remain">招募
                            <em class="remain-num">{{detailInfo.limitNum}}</em>人 </span>
                    </div>
                    <v-favorite class="cell fixed favorited" v-model="detailInfo.favorited" favType="Activity" :objectId="detailInfo.id"></v-favorite>
                </div>

            </div>
        </div>
        <div class="split"></div>
        <div class="flex-item desc-list border-bottom">
            <div class="cell fixed addon">
                <i class="icon icon-clock"></i>
            </div>
            <div class="cell">
                {{detailInfo.startTime.substr(0,16)}} 至 {{detailInfo.endTime.substr(0,16)}}
            </div>

        </div>

        <div class="flex-item desc-list border-bottom">
            <div class="cell fixed addon">
                <i class="icon icon-works"></i>
            </div>
            <div class="cell">
                {{detailInfo.permitSubject.join(',').replace('team','团队').replace('personal','个人')}}
            </div>

        </div>

        <div class="flex-item desc-list border-bottom" v-if="detailInfo.address" @click="openMapCallback">
            <div class="cell fixed addon">
                <i class="icon icon-position"></i>
            </div>
            <div class="cell">{{detailInfo.address}}</div>
            <div class="cell fixed right-addon">
                <i class="icon icon-angle-left"></i>
            </div>
        </div>
        <div class="flex-item desc-list" v-if="detailInfo.contactPhone" @click="callPhone(detailInfo.contactPhone)">
            <div class="cell fixed addon">
                <i class="icon icon-phone"></i>
            </div>
            <div class="cell">{{detailInfo.contactPhone}}</div>
            <div class="cell fixed right-addon">
                <i class="icon icon-angle-left"></i>
            </div>
        </div>
        <template v-if="detailInfo.attach && detailInfo.attachName">
            <div class="split"></div>
            <div class="block-heading">
                <h4 class="title">相关附件</h4>
            </div>
            <div class="flex-item desc-list" @click="dowload(detailInfo.attach)">
                <div class="cell attach-name">{{detailInfo.attachName}}</div>
                <a class="cell fixed">
                    <i class="icon icon-angle-left"></i>
                </a>
            </div>
        </template>

        <div class="split"></div>
        <mt-navbar v-model="currentTab" class="border-bottom project-nav">
            <mt-tab-item id="1" class="v-line">活动详情</mt-tab-item>
            <mt-tab-item id="2" class="v-line">活动纪实</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="currentTab" class="activity-content">
            <mt-tab-container-item id="1">
                <div class="remark" v-html="detailInfo.desc"></div>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <div class="digits-list card-col-2" v-if="detailInfo.digits && detailInfo.digits.length">
                    <div class="card col-2" v-for="(item,index) in detailInfo.digits" :key="'digits_'+index">
                        <div class="card-hd">
                            <template v-if="item.type=='audio'">
                                <audio :src="item.file" controls>
                                </audio>
                            </template>
                            <template v-if="item.type=='video'">
                                <video :poster="item.pic" controls>
                                    <source :src="item.file">
                                </video>
                            </template>
                            <template v-if="item.type=='pic'">
                                <img :src="item.pic" onerror="this.onerror=null;this.src='/images/default.png'">
                            </template>
                        </div>
                        <div class="card-bd">
                            <h4 class="card-title">{{item.name}}</h4>
                        </div>
                    </div>
                </div>
                <v-nodata msg="暂无活动纪实" v-else></v-nodata>
            </mt-tab-container-item>
        </mt-tab-container>

        <div class="split"></div>
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
            <div class="more border-top">
                <nuxt-link :to="{path: '/comments/'+detailInfo.id,query:{type:'volunteer'}}">
                    <i class="icon icon-comment"></i>&nbsp;评论</nuxt-link>
            </div>
        </div>

        <footer class="footer pre-footer" ref="footWrapper">
            <div class="flex-item">
                <div class="cell btn v-line" :class="{end:!enrollInfo.personal.enable }" @click='volunApply("personal")' v-if='!detailInfo.isStop&&detailInfo.permitSubject.indexOf("personal")>=0'>{{enrollInfo.personal.msg}}</div>
                <div class="cell btn " :class="{end:!enrollInfo.team.enable }" @click='volunApply("team")' v-if='!detailInfo.isStop&&detailInfo.permitSubject.indexOf("team")>=0'>{{enrollInfo.team.msg}}</div>
                <div class="cell btn end" v-if=' detailInfo.isStop'>停止招募</div>
            </div>
        </footer>
        <v-overlayer v-model="isShowTip" :overStyle="{zIndex:200}">
            <div class="shareHelp" style=" text-align:right;padding-right:60px;">
                <img src="/images/mask.png" alt="提示">
            </div>
        </v-overlayer>
    </section>
</template>

<script>
import axios from "axios";
import favorite from '~/components/favorite.vue';
import { toastMixin } from '~/components/mixins';
import { mapState } from 'vuex';
import wechat, { openMap } from '~/util/wechat.js';
export default {
    layout: 'detail',
    mixins: [toastMixin, wechat],
    head: {
        title: '活动详情'
    },
    components: {
        'v-favorite': favorite
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    async asyncData({ params, error, req, query }) {


        let detailInfo = await axios.get('/volunteer/detail/' + params.id);
        let comments = await axios.get('/comments/volunteer/' + params.id + '/0?size=1')
        return {
            detailInfo: detailInfo.data,
            comments: comments.data.content
        };
    },
    data() {
        return {
            currentTab: '1',
            isShow: false,
            isShowTip: false,
            enrollInfo: {
                team: {
                    enable: true,
                    msg: '团队报名'
                },
                personal: {
                    enable: true,
                    msg: '个人报名'
                }            },
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'm-picker-slot',
                    textAlign: 'center'
                }
            ],
            selectedItm: undefined
        }
    },
    methods: {
        volunApply(type) {
            if (!this.$store.state.user) {
                this.$router.replace({ path: "/login", query: { redirect: this.$route.fullPath } });
                return;
            }
            if (this.enrollInfo[type].enable) {
                this.$router.replace({ path: "/volunteer/actapply", query: { type: type, activityId: this.detailInfo.id } });
            }
        },
        openMapCallback() {
            var href = window.location.href;
            var lat = this.detailInfo.coordinate.latitude;
            var lng = this.detailInfo.coordinate.longitude;
            openMap({
                latitude: lat,
                longitude: lng,
                name: this.detailInfo.name,
                address: this.detailInfo.address,
                href: href
            })
        },
        dowload(url) {
            let ua = navigator.userAgent.toLowerCase();
            ua = ua.indexOf('micromessenger') !== -1;
            if (ua) {
                this.isShowTip = true;
            } else {
                window.location.href = url;
            }
        }
    },
    async created() {
        this.slots[0].values = this.detailInfo.itms;
        if (this.$store.state.user && this.$store.state.user.id) {
            await this.$store.dispatch('fetchUsers'); // 更新用户新
        }

        let enroll = {
            team: {
                enable: true,
                msg: '团队报名'
            },
            personal: {
                enable: true,
                msg: '个人报名'
            }
        }
        if (this.detailInfo.enrolled.indexOf('team') >= 0) {
            enroll.team = {
                enable: false,
                msg: '团队已报名'
            }
        }
        if (this.detailInfo.enrolled.indexOf('personal') >= 0) {
            enroll.personal = {
                enable: false,
                msg: '个人已报名'
            }
        }
        let user = this.$store.state.user;
        if (user) {
            if (!user.roles || user.roles.indexOf('volunteerPersonal') == -1) {
                enroll.personal = {
                    enable: false,
                    msg: '不是个人志愿者'
                }
            }
            if (!user.roles || user.roles.indexOf('volunteerTeam') == -1) {
                enroll.team = {
                    enable: false,
                    msg: '不是团队志愿者'
                }
            }
        }
        this.enrollInfo = enroll;
        this.shareOpts.imgUrl = this.detailInfo.coverPic
        this.shareOpts.title = this.detailInfo.name
        this.shareOpts.desc = this.detailInfo.brief
        await this.wechatInit()
    },
    async mounted() {
        // this.shareOpts.imgUrl = this.detailInfo.coverPic
        // this.shareOpts.title = this.detailInfo.name
        // this.shareOpts.desc = this.detailInfo.brief
        // await this.wechatInit()
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss" >
@import "~static/styles/pages/volunteer.scss";
</style>
