<template>
    <section class="container zoe-auth">
        <div v-if="identifyInfo.identifyStatus=='Wait'" class="auth-content">
            <div class="head-img border-bottom">
                <i class="icon icon-wait"></i>
                <p> 实名质料上传成功<br>正在审核，请耐心等待...</p>
            </div>
            <nuxt-link class="link" to="/zoe/">去往个人中心>></nuxt-link>
        </div>

        <div v-else-if="identifyInfo.identifyStatus=='Yes'" class="auth-content">
            <div class="head-img">
                <i class="icon icon-check-circle"></i>
                <p>实名认证成功</p>
            </div>
            <div class="identify-info border-bottom">
                <div>
                    <label>用户姓名：&nbsp;</label>{{identifyInfo.realname}}</div>
                <div>
                    <label>身份证号：&nbsp;</label>{{identifyInfo.idnumber}}</div>
                <div>
                    <label>认证时间：&nbsp;</label>{{identifyInfo.auditTime}}</div>
                <div>
                    <label>备注信息：&nbsp;</label>{{identifyInfo.auditComment}}</div>
            </div>
            <nuxt-link class="link" to="/zoe/">去往个人中心>></nuxt-link>
        </div>

        <div v-else-if="identifyInfo.identifyStatus=='Fail'" class="auth-content">
            <div class="head-img">
                <i class="icon icon-times-circle"></i>
                <p>实名认证失败</p>
            </div>
            <div class="identify-info border-bottom">
                <div>
                    <label>用户姓名：&nbsp;</label>{{identifyInfo.realname}}</div>
                <div>
                    <label>身份证号：&nbsp;</label>{{identifyInfo.idnumber}}</div>
                <div>
                    <label>认证时间：&nbsp;</label>{{identifyInfo.auditTime}}</div>
                <div>
                    <label>备注信息：&nbsp;</label>{{identifyInfo.auditComment}}</div>
            </div>
            <nuxt-link class="link" :to="identifyInfo.isSelf?'/zoe/authentication':'/zoe/members/addmember'">重新认证>></nuxt-link>
        </div>
    </section>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
import { toastMixin } from '~/components/mixins';
export default {
    mixins: [toastMixin],
    middleware: "auth",
    head: {
        title: '实名认证'
    },
    computed: {
        ...mapState(['user'])
    },
    async asyncData({ params, error, req, query }) {
        let search = 'isSelf:true&sort=createTime~desc';
        let identifyInfo = await axios.get("/user/identify", { params: { search: search } });
        return {
            identifyInfo: identifyInfo.data
        };
    },
    data() {
        return {
            identifyInfo: {}
        };
    },
    async beforeMount() {
        await this.$store.dispatch('fetchUsers')
    }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/zoe.scss";
</style>