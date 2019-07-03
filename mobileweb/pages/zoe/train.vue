<template>
    <section class="container zoe-orders">
        <mt-navbar v-model="currentTab" class="dd">
            <mt-tab-item id="current">当前培训</mt-tab-item>
            <mt-tab-item id="history">历史培训</mt-tab-item>
        </mt-navbar>
        <div class="split"></div>
        <mt-tab-container v-model="currentTab">
            <mt-tab-container-item id="current">
                <v-nodata msg="您还没有培训订单！" v-if="!currentOrders.length && currentLoaded"></v-nodata>
                <div class="list-wraper" v-else>
                    <div v-for="item in currentOrders" :key="'cur_ord_'+item.id" class="order">
                        <div class="order-number clearfix">
                            <span class="pull-left">订单号:{{item.orderCode}}</span>
                            <span class="pull-right time">{{item.createTime}}</span>
                        </div>
                        <nuxt-link :to="`/train/${item.trainId}`" class="flex-item media-box">
                            <div class="cell fixed media-object">
                                <img :src="item.picture" onerror="this.onerror=null;this.src='/images/default.png'">
                            </div>
                            <div class="cell media-bd">
                                <h4 class="media-title">{{item.trainName}}</h4>
                                <div class="media-info">
                                    <p>
                                        <i class="icon icon-clock"></i>{{ item.trainStartTime + ' 至 ' + item.trainEndTime }}</p>
                                    <p>
                                        <i class="icon icon-position"></i>{{item.address}}</p>
                                </div>
                            </div>
                        </nuxt-link>
                        <div class="pre-info border-top border-bottom">
                            <span v-for="(enrol, i) in item.enrolUsers" :key="'pre_'+i" class="tag">{{ enrol.userName?enrol.userName:user.nickname }}</span>
                        </div>
                        <div class="order-status flex-item">
                            <div class="cell fixed status">{{item.orderStatusName}}</div>
                            <div class="cell operate-btns">
                                <mt-button class="btn" v-if="item.hasCancel" @click="showDialog(item)">退订</mt-button>
                                <mt-button class="btn outline" v-if="item.hasDel" @click="orderDel(item)">删除</mt-button>
                                <mt-button class="btn outline" @click='onInrollClick(item)' v-if="item.orderStatus === 'Success'">签到</mt-button>
                            </div>
                        </div>
                    </div>
                </div>

            </mt-tab-container-item>
            <mt-tab-container-item id="history" class="history">
                <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
                    <v-nodata v-if="loaded && !dataList.length" msg="您没有历史订单！"></v-nodata>
                    <div class="list-wraper" v-else>
                        <div v-for="item in dataList" :key="'his_ord_'+item.id" class="order">
                            <div class="order-number clearfix">
                                <span class="pull-left">订单号:{{item.orderCode}}</span>
                                <span class="pull-right time">{{item.createTime}}</span>
                            </div>
                            <nuxt-link :to="`/train/${item.trainId}`" class="flex-item media-box">
                                <div class="cell fixed media-object">
                                    <img :src="item.picture" onerror="this.onerror=null;this.src='/images/default.png'">
                                </div>
                                <div class="cell media-bd">
                                    <h4 class="media-title">{{item.trainName}}</h4>
                                    <div class="media-info">
                                        <p>
                                            <i class="icon icon-clock"></i>{{ item.trainStartTime + ' 至 ' + item.trainEndTime }}</p>
                                        <p>
                                            <i class="icon icon-position"></i>{{item.address}}</p>
                                    </div>
                                </div>
                            </nuxt-link>
                            <div class="pre-info border-top border-bottom">
                                <span v-for="(enrol, i) in item.enrolUsers" :key="'pre_'+i" class="tag">{{ enrol.userName?enrol.userName:user.nickname }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="split"></div>
                </v-loadmore>
            </mt-tab-container-item>
        </mt-tab-container>
        <mt-popup v-model="popupRefund" position="bottom" popup-transition="popup-fade" class="popup-refund">
            <div class="edit-wrapper">
                <div class="resion-eidt">
                    <textarea rows="8" v-model="cancelOrder.reason" placeholder="请输入退订理由" class="form-textarea"></textarea>
                    <mt-button class="btn" @click="orderCancel">退订</mt-button>
                    <mt-button class="btn outline" @click="popupRefund=false">取消</mt-button>
                </div>
            </div>
        </mt-popup>
    </section>
</template>

<script>
import axios from "axios";
import loadmore from "~/components/loadmore";
import { toastMixin, paginationMixin } from "~/components/mixins";
import rules from "~/util/validateRules";
export default {
    middleware: 'auth',
    head: {
        title: '我的培训'
    },
    mixins: [toastMixin, paginationMixin],
    components: {
        "v-loadmore": loadmore
    },
    async created() {
        await this.loadCurrent();
        await this.loadData(0)
        this.currentLoaded = true;
    },
    watch: {
        currentTab(val) {
            this.$nextTick(() => {
                if (val === 'history') {
                    this.$refs.loadMore.rebuildScroll();
                }
            })
        }
    },
    data() {
        return {
            currentTab: 'current',
            currentOrders: [],
            popupRefund: false,
            cancelOrder: { id: "", reason: "" },
            loadPath: '/user/train/history/',
            currentLoaded: false
        };
    },
    methods: {
        async loadCurrent() {
            let currentOrders = await axios.get('/user/train/current');
            this.currentOrders = currentOrders.data
        },
        showDialog(order) {
            this.cancelOrder = {
                id: order.id,
                reason: ""
            };
            this.popupRefund = true;
        },
        // 退订
        async orderCancel(item) {
            if (!rules.required(this.cancelOrder.reason, '请输入退订理由')) return;
            let info = {
                orderid: this.cancelOrder.id,
                reason: this.cancelOrder.reason
            };

            let { status, data } = await axios.post('/train/cancel', info);
            if (data.success) {
                this.showMsg('退订成功');
                if (this.currentTab === 'current') {
                    await this.loadCurrent();
                } else {
                    this.loadData(this.page);
                }
            } else {
                this.showMsg(data.message);
            }
            this.popupRefund = false;
        },
        async orderDel(order) {
            this.confirm('是否删除该订单？', async () => {
                let { status, data } = await axios.post('/train/del/' + order.id);
                if (data.success) {
                    this.showMsg('删除成功');
                    if (this.currentTab === 'current') {
                        await this.loadCurrent();
                    } else {
                        this.loadData(this.page);
                    }
                } else {
                    this.showMsg(data.message);
                }
            });
        },
        async onInrollClick(item) {
            let trainInfo = {
                id: item.id,
                trainId:item.trainId,
                users: item.enrolUsers,
                coordinate: item.coordinate
            };
            await this.$store.dispatch('fetchCurrentTrain', trainInfo)
            this.$router.push('/zoe/sign?id=' + item.trainId);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~static/styles/pages/zoe.scss";
</style>