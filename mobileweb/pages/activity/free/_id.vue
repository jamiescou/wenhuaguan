<template>
    <section class="container activity-pre">
        <div class="flex-item media-box detail">
            <div class="cell fixed media-object left">
                <img :src="detail.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
            </div>
            <div class="cell  media-bd">
                <h4 class="media-title">{{detail.name}}</h4>
                <div class="media-info">
                    <p>
                        <i class="icon icon-clock"></i>{{currentItm.itmDateTime}}</p>
                    <p>
                        <i class="icon icon-position"></i>{{detail.address}}</p>
                </div>
            </div>
        </div>

        <div class="split"></div>
        <mt-tab-container v-model="active">
            <mt-tab-container-item id="preInfo">
                <section class="pre-info">
                    <div class="flex-item border-bottom reserve-type">
                        <div class="cell fixed title">在线选座：</div>
                        <div class="cell txt-right type">该活动不支持在线选座</div>
                    </div>
                    <div class="flex-item tick-count">
                        <div class="cell fixed title">数量：</div>
                        <div class="cell txt-right">
                            <v-numcontrol v-model="tickCount" :min="0" class="counts" :max="detail.perAllow - reservedCount"></v-numcontrol>
                            <div class="tick-hint">该活动该场次每个用户只能购买{{detail.perAllow}}张</div>
                            <div class="tick-hint" v-if="reservedCount>0">当前您已购买{{reservedCount}}张，还可购买{{detail.perAllow - reservedCount}}张</div>
                        </div>
                    </div>
                </section>
                <div class="split"></div>
                <section class="pre-info">
                    <div class="field-wrapper bg">
                        <mt-field label="手机号" placeholder="请输入手机号" v-model="mobile" type="tel" class="form-field" :attr="{ maxlength: 11 }"></mt-field>
                    </div>
                </section>
                <div class="split"></div>
                <section class="pre-info protocol">
                    <div class="block-heading border-bottom">
                        <h4 class="title">预约须知</h4>
                    </div>
                    <ul>
                        <li>订票后未入场票数满5张，将被取消当年预订资格</li>
                        <li>如需退票，请至“个人中心-活动订单”，退票截止到活动前一天（活动当天不可退票）</li>
                        <li>如因不可控因素导致活动无法正常进行，举办方有权延期或取消活动，并以短信方式通知订票人</li>
                        <li>活动最终解释权归举办方所有</li>
                    </ul>
                    <label for="protocol" class="checkbox-label">
                        <input type="checkbox" class="cbx-input" v-model="protocol" name="protocol" id="protocol">
                        <span class="cbx"></span>我已阅读并接收以上相关条款
                    </label>
                </section>
            </mt-tab-container-item>
            <mt-tab-container-item id="confirm">
                <section class="pre-info">
                    <div class="flex-item border-bottom confirm-item">
                        <div class="cell fixed title">预订人</div>
                        <div class="cell txt-right">{{user.name || user.nickname}}</div>
                    </div>
                    <div class="flex-item border-bottom  confirm-item">
                        <div class="cell fixed title">预订电话</div>
                        <div class="cell txt-right">{{mobile}}</div>
                    </div>
                    <div class="flex-item confirm-item">
                        <div class="cell fixed title">订票数量</div>
                        <div class="cell txt-right">{{tickCount}}</div>
                    </div>
                </section>
            </mt-tab-container-item>
        </mt-tab-container>

        <footer class="footer pre-footer" ref="footWrapper">
            <div class="flex-item next-opreations" v-if="active==='preInfo'">
                <div class="cell reserve-tip">
                    <span class="remain">
                        <em class="remain-num">{{currentItm.remainTicket}}</em> 余票 </span>
                </div>
                <div class="cell btn" @click="handleNextStep">下一步</div>
            </div>
            <div class="operations" v-else>
                <mt-button class="btn" @click='handleConfirm'>确定</mt-button>
            </div>
        </footer>
    </section>
</template>
<script>
import axios from "axios";
import { toastMixin } from '~/components/mixins';
import numcontrol from '~/components/numcontrol';
import { mapState } from 'vuex'
import rules from '~/util/validateRules';
export default {
    middleware: 'auth',
    mixins: [toastMixin],
    head: {
        title: '活动预约'
    },
    components: {
        'v-numcontrol': numcontrol
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    async asyncData({ params, error, query }) {
        let detailInfo = await axios.get('/activity/detail/' + params.id);
        let reservedCount = await axios.get('/activity/reserved?itmId=' + query.id + '&id=' + params.id);
        let currentItm = detailInfo.data.itms.find(x => x.id === query.id);
        return {
            detail: detailInfo.data,
            currentItm: currentItm,
            reservedCount: reservedCount.data
        }
    },
    mixins: [toastMixin],
    data() {
        return {
            detail: {},
            currentItm: {},
            tickCount: 0,
            protocol: true,
            mobile: '',
            active: 'preInfo',
            reservedCount: 0
        }
    },
    methods: {
        handleNextStep() {
            if (!rules.required(this.mobile, '请输入手机号码！')) return false;
            if (!rules.checkPhone(this.mobile)) return false;
            if (!this.protocol) {
                this.showMsg('请仔细阅读订票须知，并同意');
                return;
            }
            if (this.tickCount === 0) {
                this.showMsg('至少预定1张票');
                return;
            }

            if (this.tickCount > this.currentItm.remainTicket) {
                this.showMsg('该活动的当前场次余票不足');
                return;
            }

            if (this.active === 'preInfo') {
                let self = this;
                setTimeout(() => {
                    self.active = 'confirm';
                }, 200);
            }

            if (this.active === 'preInfo') return;
        },
        async handleConfirm() {
            let orderInfo = {
                mobile: this.mobile,
                activityId: this.detail.id,
                activityName: this.detail.name,
                reserveType: this.detail.reserveType,
                itmId: this.currentItm.id,
                itmDate: this.currentItm.itmDate,
                itmStarttime: this.currentItm.startTime,
                itmEndtime: this.currentItm.endTime,
                reserveSum: this.tickCount,
                seats: []
            }

            let { status, data } = await axios.post('/activity/order', orderInfo);
            if (data.success) {
                this.showMsg('预约成功');
                this.$router.replace('/preset?id=' + 'activity');
            } else {
                this.showMsg('预约失败');
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/activity.scss";
</style>