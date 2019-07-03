<template>
    <div class="loadmore-wrapper" ref="loadMoreWrapper" :style="{ height: wrapperHeight + 'px' }">
        <div ref="wrapper" class="list-wrapper">
            <div class="scroll-content">
                <div ref="listWrapper">
                    <slot>
                    </slot>
                </div>
                <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
                    <div class="pullup-wrapper" v-if="pullUpLoad">
                        <div class="before-trigger" v-if="!isPullUpLoad">
                            <span>{{pullUpTxt}}</span>
                        </div>
                        <div class="after-trigger" v-else>
                            <div class="mf-loading-container">
                                <img src="./loading.gif">
                            </div>
                        </div>
                    </div>
                </slot>
            </div>
            <slot name="pulldown" :pullDownRefresh="pullDownRefresh" :pullDownStyle="pullDownStyle" :beforePullDown="beforePullDown" :isPullingDown="isPullingDown" :bubbleY="bubbleY">
                <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
                    <div class="before-trigger" v-if="beforePullDown">
                        <bubble :y="bubbleY"></bubble>
                    </div>
                    <div class="after-trigger" v-else>
                        <div v-if="isPullingDown" class="loading">
                            <div class="mf-loading-container">
                                <img src="./loading.gif">
                            </div>
                        </div>
                        <div v-else>
                            <span>{{refreshTxt}}</span>
                        </div>
                    </div>
                </div>
            </slot>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
let BScroll
if (process.browser) {
    BScroll = require('better-scroll').default;
}
import Bubble from '../bubble/bubble.vue'
import { getRect } from './dom'

const COMPONENT_NAME = 'scroll'
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
    name: COMPONENT_NAME,
    props: {
        data: {
            type: Array,
            default: function() {
                return []
            }
        },
        height: {
            type: Number,
            default: 0
        },
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        listenScroll: {
            type: Boolean,
            default: false
        },
        listenBeforeScroll: {
            type: Boolean,
            default: false
        },
        direction: {
            type: String,
            default: DIRECTION_V
        },
        scrollbar: {
            type: null,
            default: false
        },
        pullDownRefresh: {
            type: null,
            default() {
                return {
                    threshold: 90, // 顶部下拉的距离(px)
                    stop: 100 // 刷新时机以及回弹停留的距离(px)
                }
            }
        },
        pullUpLoad: {
            type: null,
            default() {
                return {
                    threshold: 100, // 上划离底部距离
                    txt: { more: '加载更多', noMore: '没有更多数据了' }
                }
            }
        },
        startY: {
            type: Number,
            default: 0
        },
        refreshDelay: {
            type: Number,
            default: 20
        },
        freeScroll: {
            type: Boolean,
            default: false
        },
        mouseWheel: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            beforePullDown: true,
            isRebounding: false,
            isPullingDown: false,
            isPullUpLoad: false,
            pullUpDirty: true,
            pullDownStyle: '',
            bubbleY: 0,
            wrapperHeight: 0   // 容器高度
        }
    },
    computed: {
        pullUpTxt() {
            const moreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more || '加载更多'

            const noMoreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore || '没有更多数据了'

            return this.pullUpDirty ? moreTxt : noMoreTxt
        },
        refreshTxt() {
            return this.pullDownRefresh && this.pullDownRefresh.txt || '刷新成功'
        }
    },
    created() {
        this.pullDownInitTop = -50
    },
    mounted() {
        setTimeout(() => {
            this.initScroll()
        }, 20)
        this.$nextTick(() => {
            this.updateHeight();
        })
    },
    methods: {
        updateHeight() {
            if (this.height !== 0) {
                this.wrapperHeight = this.height;
            } else {
                this.wrapperHeight = document.documentElement.clientHeight - this.$refs.loadMoreWrapper.getBoundingClientRect().top;
            }
        },
        rebuildScroll() {
            this.$nextTick(() => {
                this.destroy()
                this.initScroll()
            })
        },
        initScroll() {
            if (!this.$refs.wrapper) {
                return
            }
            if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
                this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`
            }

            let options = {
                probeType: this.probeType,
                click: this.click,
                scrollY: this.freeScroll || this.direction === DIRECTION_V,
                scrollX: this.freeScroll || this.direction === DIRECTION_H,
                scrollbar: this.scrollbar,
                pullDownRefresh: this.pullDownRefresh,
                pullUpLoad: this.pullUpLoad,
                startY: this.startY,
                freeScroll: this.freeScroll,
                mouseWheel: this.mouseWheel
            }

            this.scroll = new BScroll(this.$refs.wrapper, options)

            if (this.listenScroll) {
                // 监听当前实例上的Scroll事件
                this.scroll.on('scroll', (pos) => {
                    this.$emit('scroll', pos)
                })
            }

            if (this.listenBeforeScroll) {
                // 监听当前实例上的beforeScrollStart事件
                this.scroll.on('beforeScrollStart', () => {
                    this.$emit('beforeScrollStart')
                })
            }

            // 下拉刷新
            if (this.pullDownRefresh) {
                this._initPullDownRefresh()
            }

            // 上划加载更多
            if (this.pullUpLoad) {
                this._initPullUpLoad()
            }
        },
        // 禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
        disable() {
            this.scroll && this.scroll.disable()
        },
        // 启用 better-scroll, 默认 开启。
        enable() {
            this.scroll && this.scroll.enable()
        },
        // 重新计算 better-scroll
        refresh() {
            this.scroll && this.scroll.refresh()
        },
        // 滚动到指定的位置x,y,time
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        // 滚动到指定的目标元素。
        scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
        // 销毁 better-scroll，解绑事件。
        destroy() {
            this.scroll.destroy()
        },
        forceUpdate(dirty) {
            if (this.pullDownRefresh && this.isPullingDown) {
                this.isPullingDown = false
                this._reboundPullDown().then(() => {
                    this._afterPullDown()
                })
            } else if (this.pullUpLoad && this.isPullUpLoad) {
                this.isPullUpLoad = false
                this.scroll.finishPullUp() // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
                this.pullUpDirty = dirty
                this.refresh()
            } else {
                this.refresh()
            }
        },
        _initPullDownRefresh() {
            this.scroll.on('pullingDown', () => {
                this.beforePullDown = false
                this.isPullingDown = true
                this.$emit('pullDownRefresh')
            })

            this.scroll.on('scroll', (pos) => {
                if (!this.pullDownRefresh) {
                    return
                }
                if (this.beforePullDown) {
                    this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
                    this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
                } else {
                    this.bubbleY = 0
                }

                if (this.isRebounding) {
                    this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
                }
            })
        },
        _initPullUpLoad() {
            this.scroll.on('pullingUp', () => {
                this.isPullUpLoad = true
                this.$emit('pullUpLoad')
            })
        },
        // 下拉回弹
        _reboundPullDown() {
            const { stopTime = 600 } = this.pullDownRefresh
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.isRebounding = true
                    this.scroll.finishPullDown() // 当下拉刷新数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
                    resolve()
                }, stopTime)
            })
        },
        _afterPullDown() {
            setTimeout(() => {
                this.pullDownStyle = `top:${this.pullDownInitTop}px`
                this.beforePullDown = true
                this.isRebounding = false
                this.refresh()
            }, this.scroll.options.bounceTime)
        }
    },
    watch: {
        data() {
            setTimeout(() => {
                this.forceUpdate(true)
            }, this.refreshDelay)
        },
        startY() {
            this.rebuildScroll()
        }
    },
    components: {
        Bubble
    }
}

</script>

<style lang="scss" rel="stylesheet/scss">
.list-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
  /* position: absolute */
  /* left: 0 */
  /* top: 0 */
  /* right: 0 */
  /* bottom: 0 */

  .scroll-content {
    position: relative;
    z-index: 1;
  }
}

.pulldown-wrapper {
  position: absolute;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all;

  .after-trigger {
    margin-top: 10px;
  }
}

.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}

.mf-loading-container {
  img {
    width: 20px;
    height: 20px;
    display: block;
    [data-dpr="2"] & {
      width: 40px;
      height: 40px;
    }
    [data-dpr="3"] & {
      width: 60px;
      height: 60px;
    }
  }
}
</style>
