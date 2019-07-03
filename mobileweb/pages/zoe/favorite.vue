<template>
    <section class="container zoe-favorite">

        <div class="favorite-tabs">
            <div class="tabs">
                <nuxt-link :to="`/zoe/favorite${item.value}`" exact tag="div" v-for="item in favoriteType" :key="item.value" class="tab-item">
                    <a>{{item.label}}</a>
                </nuxt-link>
            </div>
        </div>
        <div class="split"></div>
        <!-- :keepAlive="true" -->
        <nuxt-child />
    </section>
</template>

<script>
export default {
    data() {
        return {
            favoriteType: [
                { value: '/', label: '活动' },
                { value: '/train', label: '培训' },
                { value: '/venue', label: '场馆' },
                { value: '/team', label: '文艺团队' },
                { value: '/work', label: '作品征集' },
                { value: '/demand', label: '点播' },
                // { value: '/liveVideos', label: '直播' },
                { value: '/volunteer', label: '志愿者' },
                { value: '/information', label: '资讯' },
                { value: '/exhibition', label: '数字展览' }
            ]
        }
    }
}
</script>

<style type="text/css" lang="scss" scoped>
@import "~static/styles/pages/zoe.scss";
</style>