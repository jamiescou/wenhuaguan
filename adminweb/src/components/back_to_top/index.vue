<template>
    <transition :name="transitionName">
        <div class="back-to-ceiling" @click="backToTop" v-show="visible" :style="customStyle">
            <svg width="16" height="16" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg" class="Icon Icon--backToTopArrow" aria-hidden="true" style="height: 16px; width: 16px;">
                <title>回到顶部</title>
                <g>
                    <path d="M12.036 15.59c0 .55-.453.995-.997.995H5.032c-.55 0-.997-.445-.997-.996V8.584H1.03c-1.1 0-1.36-.633-.578-1.416L7.33.29c.39-.39 1.026-.385 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.004z" fill-rule="evenodd"></path>
                </g>
            </svg>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'BackToTop',
    props: {
        // 滚动条在什么位置，显示“回到顶部”
        visibilityHeight: {
            type: Number,
            default: 400
        },
        // 滚动条回到顶部位置
        backPosition: {
            type: Number,
            default: 0
        },
        // 自定义样式
        customStyle: {
            type: Object,
            default() {
                return {
                    // right: '50px',
                    // bottom: '50px',
                    // width: '40px',
                    // height: '40px',
                    // 'border-radius': '4px',
                    // 'line-height': '45px',
                    // background: '#e7eaf1'
                }
            }
        },
        // 过渡动画名称
        transitionName: {
            type: String,
            default: 'fade'
        }
    },
    data() {
        return {
            visible: false,
            interval: null
        }
    },
    mounted() {
        // 监听滚动
        window.addEventListener('scroll', this.handleScroll)
        this.handleScroll();
    },
    beforeDestroy() {
        // 移除监听
        window.removeEventListener('scroll', this.handleScroll)
        if (this.interval) {
            clearInterval(this.interval)
        }
    },
    methods: {
        handleScroll() {
            // 判断滚动区域大于多少的时候显示返回顶部的按钮
            this.visible = window.pageYOffset > this.visibilityHeight
        },
        // 回到顶部
        backToTop() {
            const start = window.pageYOffset
            let i = 0
            this.interval = setInterval(() => {
                const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500))
                if (next <= this.backPosition) {
                    window.scrollTo(0, this.backPosition)
                    clearInterval(this.interval)
                } else {
                    window.scrollTo(0, next)
                }
                i++
            }, 16.7)
        },
        // 加速到一半,然后减速
        /**
         * t: current time（当前时间）
         * b: beginning value（初始值）
         * c: change in value（变化量）
         * d: duration（持续时间）
         */
        easeInOutQuad(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b
            return -c / 2 * (--t * (t - 2) - 1) + b
        }
    }
}
</script>

<style scoped>
.back-to-ceiling {
    position: fixed;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    right: 50px;
    bottom: 50px;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    line-height: 45px;
    background: #e7eaf1
}

.back-to-ceiling:hover {
    background: #d5dbe7;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0
}

.back-to-ceiling .Icon {
    fill: #9aaabf;
    background: none;
}
</style>