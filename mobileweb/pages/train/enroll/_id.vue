<template>
    <section class="container train-pre">
        <div class="flex-item media-box detail">
            <div class="cell fixed media-object left">
                <img :src="detail.picture" onerror="this.onerror=null;this.src='/images/default.png'">
            </div>
            <div class="cell  media-bd">
                <h4 class="media-title">{{detail.title}}</h4>
                <div class="media-info">
                    <i class="icon icon-calendar"></i> {{detail.startDate}}&nbsp;-&nbsp;{{detail.endDate}}
                </div>
            </div>
        </div>

        <div class="split"></div>
        <div class="members">
            <div class="block-heading">
                <h4 class="title">报名人员</h4>
            </div>
            <div class="member border-bottom" v-for="(member,index) in selectedMember" :key="index">
                <div class="flex-item">
                    <div class="cell name">{{member.name||member.nickname}}</div>
                    <div class="cell profile">{{member.relationName}}</div>
                    <div class="cell profile">{{member.sexName}}</div>
                    <div class="cell profile">{{getAge(member.birthday)}}</div>
                </div>
            </div>
            <div class="add-member" @click="showMemberPop">
                <i class="icon icon-plus"></i>&nbsp;点我，选择报名人员</div>
        </div>
        <div class="split"></div>
        <div class="protocol-wrapper">
            <div class="block-heading border-bottom">
                <h4 class="title">报名须知</h4>
            </div>
            <ul>
                <li>1. 当前培训要求实名认证</li>
                <li>2. 2. 本次培训最多可以为{{detail.userLimitPeoples}}人报名</li>
                <li v-if="detail.limitsStr">3. {{detail.limitsStr}}</li>
            </ul>
        </div>

        <footer class="footer pre-footer" ref="footWrapper">
            <mt-button class="btn" @click='handleConfirm'>确定</mt-button>
        </footer>

        <mt-popup v-model="isShow" position="bottom" class="members">
            <div class="members-content">
                <scroll ref="memberScroll" :click="true">
                    <div class="flex-item member border-bottom" @click.stop.prevent="handleSelected(member)" v-for="(member,index) in members" :key="'mb_'+index">
                        <div class="cell fixed checked">
                            <i class="icon" :class=" member.checked?'icon-round-check-fill checked':'icon-round'"></i>
                        </div>
                        <div class="cell name">{{member.name}}</div>
                        <div class="cell profile">{{member.relationName}}</div>
                        <div class="cell profile">{{member.sexName}}</div>
                        <div class="cell profile">{{getAge(member.birthday)}}</div>
                    </div>
                </scroll>
            </div>
            <nuxt-link to="/zoe/contacts/contact" class="add-member">
                <i class="icon icon-friend-add"></i> 添加其他报名人员</nuxt-link>
            <div class="operations">
                <mt-button class="btn" @click='confirmSelected'>确定</mt-button>
            </div>
        </mt-popup>
    </section>
</template>
<script>
import axios from "axios";
import { toastMixin } from '~/components/mixins';
import { getAge } from '~/util/assist';
import { mapState } from 'vuex'
import Scroll from '~/components/scroll'
export default {
    middleware: 'auth',
    mixins: [toastMixin],
    components: {
        Scroll
    },
    head: {
        title: '培训报名'
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    async created() {
        let id = this.$route.params.id;
        await this.$store.dispatch('fetchUsers')
        let detailInfo = await axios.get('/train/detail/' + id);
        let data = await axios.get('/train/require/' + id);
        data = data.data;
        this.detail = detailInfo.data;
        this.enrolledMember = data.enrolledMember;
        this.initMembers(data.members);
    },
    data() {
        return {
            detail: {},
            members: [],
            enrolledMember: [],
            limits: null,
            selectedMember: [],
            isShow: false
        }
    },
    methods: {
        showMemberPop() {
            this.isShow = true;
            this.$nextTick(() => {
                this.$refs.memberScroll.refresh();
            })
        },
        getAge(key) {
            let age = getAge(key);
            return age == '' ? '保密' : age + '岁'
        },
        handleSelected(member) {
            if (member.limited) {
                this.showMsg(member.limitedMsg);
                return;
            }
            member.checked = member.checked ? false : true;
        },
        confirmSelected() {
            let selected = this.members.filter(x => x.checked);
            if (selected.length > this.detail.userLimitPeoples) {
                this.showMsg('最多可为' + this.detail.userLimitPeoples + '个人报名');
                return;
            }
            this.selectedMember = selected;
            this.isShow = false;
        },
        async handleConfirm() {
            if (!this.selectedMember.length) {
                this.showMsg('请选择报名人员');
                return;
            }

            let enrolUsers = [];
            enrolUsers = this.selectedMember.map((x) => {
                let user = {
                    userName: x.name,
                    phoneNo: x.mobile,
                    idnumber: x.idNumber,
                    sex: x.sex
                }
                return user;
            });

            let orderInfo = {
                trainId: this.detail.id,
                enrolUsers: enrolUsers,
                userId: this.user.id,
                nickname: this.user.nickname,
                mobile: this.user.mobile,
                address: this.detail.address
            }

            let { status, data } = await axios.post('/train/order', orderInfo);
            if (data.success) {
                this.showMsg('报名成功');
                this.$router.replace('/preset?id=train');
            } else {
                this.showMsg(data.message || '报名失败');
            }
        },
        initMembers(members) {
            let limits = this.detail.limits;
            if (members && members.length) {
                let enrolledIds = this.enrolledMember ? this.enrolledMember.map(x => x.idnumber) : []; // 已报名的人员
                members = members.map((x) => {
                    x.limited = false;
                    x.limitedMsg = '';
                    x.checked = false;
                    if (x.identifyStatus !== 'Yes') {
                        x.limited = true;
                        x.limitedMsg += x.identifyStatusName;
                    }

                    if (enrolledIds.indexOf(x.idNumber) > -1) {
                        x.limited = true;
                        x.limitedMsg += '  已报名  ';
                    }
                    if (limits.sex && x.sex != limits.sex) {
                        x.limited = true;
                        x.limitedMsg += '  性别不符  ';
                    }
                    if(x.birthday) {
                      let age = getAge(x.birthday);
                      if ((limits.minAge && age < limits.minAge) || (limits.maxAge && age > limits.maxAge)) {
                        x.limited = true;
                        x.limitedMsg += '  年龄不符  ';
                      }
                    }
                    return x;
                })
            }

            this.members = members;
        }
    }
}
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/train.scss";
</style>
