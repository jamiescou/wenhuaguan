<template>
    <section class="preset-result" ref="wrapper" :style="{height:wrapperHeight +'px'}">
        <div class="preset-state">
            <i class="preset-img icon icon-check-circle"></i>
            <div class="preset-msg">{{msg}}</div>
        </div>
        <nuxt-link :to="to.path" class="to-link" replace>{{to.title}}
            <i class="icon icon-angle-left"></i>
        </nuxt-link>
    </section>
</template>

<script>
const TYPES = {
    'activity': '活动报名',
    'train': '培训报名',
    'venue': '活动室预订',
    'volunteer': '志愿者报名',
    'collect': '提交作品'
}
export default {
    head() {
        return {
            title: this.title
        }
    },
    data() {
        return {
            title: TYPES[this.$route.query.id] || '预约成功',
            msg: '',
            to: {
                path: '/',
                title: '前往我的订单'
            },
            wrapperHeight: 0
        };
    },
    async asyncData({ params, error, redirect, query }) {
        switch (query.id) {
            case 'venue':
                return {
                    msg: '您的活动室预定成功!',
                    to: {
                        path: '/zoe/venue',
                        title: '前往我的活动室订单'
                    }
                };
                break;
            case 'activity':
                return {
                    msg: '您的活动预定成功!',
                    to: {
                        path: '/zoe/activity',
                        title: '前往我的活动订单'
                    }
                };
                break;
            case 'train':
                return {
                    msg: '您的培训预定成功!',
                    to: {
                        path: '/zoe/train',
                        title: '前往我的培训报名'
                    }
                };
                break;
            case 'collect':
                return {
                    msg: '您的作品提交成功!',
                    to: {
                        path: '/zoe/work',
                        title: '前往我的作品'
                    }
                };
                break;
            case 'volunteer':
                return {
                    msg: '志愿者活动报名成功!',
                    to: {
                        path: '/zoe/volunteer',
                        title: '前往我的志愿者活动'
                    }
                };
                break;
            default:
                redirect('/');
                break;
        }
    },
    mounted() {
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    }
};
</script>

<style type="text/css" lang="scss" scoped>
@import "~static/styles/pages/preset-result.scss";
</style>