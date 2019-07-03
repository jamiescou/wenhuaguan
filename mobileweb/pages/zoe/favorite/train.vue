<template>
    <v-loadmore ref="loadMore" @pullUpLoad="handleLoadMore" @pullDownRefresh="handleRefresh">
        <v-nodata v-if="loaded && !dataList.length" msg="您还没收藏过任何培训~"></v-nodata>
        <div class="favorite-content" v-else>
            <mt-cell-swipe :right="[{content: '删除',style: { background: '#ea525c', color: '#fff' },handler(){delHandle(item,index)}}]" v-for="(item,index) in dataList" :key="item.id">
                <div class="flex-item media-box detail" slot="title">
                    <nuxt-link class="cell fixed media-object left" :to="`/train/${item.objectId}`">
                              <img :src="item.picAddress" onerror="this.onerror=null;this.src='/images/default.png'">
                    </nuxt-link>
                    <div class="cell  media-bd">
                        <h4 class="media-title">{{item.title}}</h4>
                        <div class="media-info">
                            <p>
                                <i class="icon icon-clock"></i>{{item.object.enrolStartTime}}&nbsp;-&nbsp;{{item.object.enrolEndTime}}（报名）</p>
                            <p>
                                <i class="icon icon-position"></i>{{item.object.address}}</p>
                        </div>
                    </div>
                </div>
            </mt-cell-swipe>
        </div>
    </v-loadmore>
</template>

<script>
import favMixin from './favorite';
import loadmore from '~/components/loadmore';
export default {
    mixins: [favMixin],
    components: {
        'v-loadmore': loadmore
    },
    async beforeMount() {
        this.type = 'Train';
        await this.loadData(0);
        this.loaded = true;
    }
}
</script>

<style type="text/css" lang="scss" scoped>
@import "~static/styles/pages/zoe.scss";
</style>