<template>
    <span>{{text}}</span>
</template>

<script>
export default {
    name: 'countdown',
    props: {
        value: {
            type: Number,
            default: 60
        },
        start: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        text: function () {
            return this.currentTime > 0 ? this.currentTime + 's 后重获取' : '获取验证码';
        }
    },
    created() {
        this.second = this.time
        if (this.value) this.second = this.value
    },
    methods: {
        tick() {
            this.currentTime = this.second
            let _this = this
            this.interval = setInterval(function () {
                if (_this.currentTime > 0) {
                    _this.currentTime--
                } else {
                    _this.stop()
                    _this.$emit('on-finish', _this.index)
                }
            }, 1000)
        },
        stop() {
            this.currentTime = 0;
            clearInterval(this.interval)
        }
    },
    watch: {
        start(newVal, oldVal) {
            if (newVal === true && oldVal === false && this.second > 0) {
                this.tick()
            }
            if (newVal === false && oldVal === true) {
                this.stop()
            }
        }
    },
    mounted() {
        if (this.start) {
            this.tick()
        }
    },
    data() {
        return {
            interval: null,
            currentTime: 0,
            second: 60
        }
    }
}
</script>