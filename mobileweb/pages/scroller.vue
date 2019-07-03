<template>
    <div class="wrapper" ref="wrapper">
        <v-overlayer v-model="visible"></v-overlayer>
        <!-- <mt-button class="btn" size="large" @click="visible=true">提交</mt-button> -->
        <mt-button class="btn" size="large" @click="getLocal">获取当前地理位置1</mt-button>
        <mt-button class="btn" size="large" @click="getLocal2">获取当前地理位置2</mt-button>
        <!-- <scroll ref="scroll" :freeScroll="freeScroll" :scrollbar="scrollbar" :mouseWheel="mouseWheel">
            <table>
                <tbody>
                    <tr v-for="row in 100" :key="row">
                        <td v-for="col in 300" :key="col" style="width:40px;border:1px solid red;">{{row}}-{{col}}</td>
                    </tr>
                </tbody>
            </table>
        </scroll> -->
        <!-- <scroll ref="scroll" :data="items" :scrollbar="scrollbarObj" :pullDownRefresh="pullDownRefreshObj" :pullUpLoad="pullUpLoadObj" :startY="parseInt(startY)" @pullingDown="onPullingDown" @pullingUp="onPullingUp" @click="clickItem">
            <ul class="list-content">
                <li @click="clickItem($event,item)" class="list-item" v-for="item in items" :key="item">{{item}}</li>
            </ul>
        </scroll> -->

    </div>
</template>

<script>
// import Scroll from '~/components/scroll'
import Scroll from '~/components/scroll/scroll'
import wechat, { getLocation } from '~/util/wechat.js'
export default {
    mixins: [wechat],
    components: {
        Scroll
    },
    // data() {
    //     return {
    //         freeScroll: true,
    //         scrollbar: {
    //             fade: false,
    //             interactive: true
    //         },
    //         mouseWheel: true
    //     }
    // }
    data() {
        return {
            visible: false,
            scrollbar: true, // 开启滚动条
            scrollbarFade: true, // 当滚动停止的时候滚动条是否需要渐隐
            pullDownRefresh: true,
            pullDownRefreshThreshold: 90, //  顶部下拉的距离
            pullDownRefreshStop: 100, // // 刷新时机以及回弹停留的距离
            pullUpLoad: true,
            pullUpLoadThreshold: 0,      // 上划离底部距离
            pullUpLoadMoreTxt: '加载更多',
            pullUpLoadNoMoreTxt: '没有更多数据了',
            startY: 0,
            items: [],
            itemIndex: 0
        }
    },
    async mounted() {
        await this.wechatInit()
    },
    created() {
        for (let i = 0; i < 2; i++) {
            this.items.push('我是第 ' + ++this.itemIndex + '行')
        }
    },
    watch: {
        scrollbarObj: {
            handler() {
                this.rebuildScroll()
            },
            deep: true
        },
        pullDownRefreshObj: {
            handler(val) {
                const scroll = this.$refs.scroll.scroll
                if (val) {
                    scroll.openPullDown()
                } else {
                    scroll.closePullDown()
                }
            },
            deep: true
        },
        pullUpLoadObj: {
            handler(val) {
                const scroll = this.$refs.scroll.scroll
                if (val) {
                    scroll.openPullUp()
                } else {
                    scroll.closePullUp()
                }
            },
            deep: true
        },
        startY() {
            this.rebuildScroll()
        }
    },
    computed: {
        scrollbarObj: function() {
            return this.scrollbar ? { fade: this.scrollbarFade } : false
        },
        pullDownRefreshObj: function() {
            return this.pullDownRefresh ? {
                threshold: parseInt(this.pullDownRefreshThreshold), // 顶部下拉的距离
                stop: parseInt(this.pullDownRefreshStop) // 刷新时机以及回弹停留的距离
            } : false
        },
        pullUpLoadObj: function() {
            return this.pullUpLoad ? {
                threshold: parseInt(this.pullUpLoadThreshold), // 上划离底部距离
                txt: { more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt }
            } : false
        }
    },
    methods: {
        getLocal() {
            window.wx.getLocation({
                success: function(res) {
                    alert(JSON.stringify(res));
                },
                cancel: function(res) {
                    alert('用户拒绝授权获取地理位置');
                }
            })
        },
        getLocal2() {
            wx.ready(async () => {
                alert('我准备好了')
                await getLocation(async (location) => {
                    alert(location)
                });
            })
        },
        showOver() {
            this.$overlayer.open();
        },
        onPullingDown() {
            // 模拟更新数据
            console.log('pulling down and load data')
            setTimeout(() => {
                if (this._isDestroyed) {
                    return
                }
                if (Math.random() > 0.5) {
                    // 如果有新数据
                    this.items.unshift('我是新数据:' + +new Date())
                } else {
                    // 如果没有新数据
                    this.$refs.scroll.forceUpdate()
                }
            }, 2000)
        },
        onPullingUp() {
            // 更新数据
            console.log('pulling up and load data')
            setTimeout(() => {
                if (this._isDestroyed) {
                    return
                }
                if (Math.random() > 0.5) {
                    // 如果有新数据
                    let newPage = []
                    for (let i = 0; i < 10; i++) {
                        newPage.push('我是第 ' + ++this.itemIndex + ' 行')
                    }

                    this.items = this.items.concat(newPage)
                } else {
                    // 如果没有新数据
                    this.$refs.scroll.forceUpdate()
                }
            }, 1500)
        },
        clickItem() {
            this.$router.back()
        },
        rebuildScroll() {
            Vue.nextTick(() => {
                this.$refs.scroll.destroy()
                this.$refs.scroll.initScroll()
            })
        }
    }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.wrapper {
  position: relative;
  //   height: 500px;
  overflow: hidden;
  background: pink;
  .scroll-content {
    display: inline-block;
    min-width: 100%;
  }
}
</style>