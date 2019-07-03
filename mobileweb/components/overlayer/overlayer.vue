<template>
    <transition name="fade">
        <div class="overlayer" v-show="visible" @click="hidePopup" @touchmove.prevent :style="styles">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        isTransparent: {
            type: Boolean,
            default: false
        },
        overStyle: Object,
        bg: String,
    },
    data() {
        return {
            visible: false,
            bodyOverflow: null,
        };
    },
    computed: {
        styles() {
            const styles = {}
            this.isTransparent && (styles['background'] = 'transparent')
            if (this.overStyle) {
                for (let i in this.overStyle) {
                    styles[i] = this.overStyle[i]
                }
            }
            return styles
        }
    },
    watch: {
        value(val) {
            this.visible = val
        }
    },

    methods: {
        hidePopup() {
            this.visible = false;
            this.$emit('input', this.visible)
        }
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
// 遮罩
$overlayer-bg: rgba(0, 0, 0, 0.7) !default;
.overlayer {
  z-index: 50;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  backface-visibility: hidden;
  background: $overlayer-bg;
  backdrop-filter: blur(10px);
  &.fade-enter-active,
  &.fade-leave-active {
    transition: all 0.5s;
  }
  &.fade-enter,
  &.fade-leave-active {
    opacity: 0;
  }
}
</style>
