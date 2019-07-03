<template>
  <div class="c-tab-wrap" :class="barPosition === 'top' ? 'c-tab-bar-top' : ''">
    <div class="c-tab-container">
      <div class="c-tab" :class="[{'c-tab-no-animate': !animate},{ scrollable }]" ref="nav">
        <slot></slot>
        <div v-if="animate" class="c-tab-ink-bar" :class="barClass" :style="barStyle">
          <span class="c-tab-bar-inner" :style="innerBarStyle" v-if="customBarWidth"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parentMixin } from './multi-items'

export default {
  name: 'tab',
  mixins: [parentMixin],
  mounted() {
    // stop bar anmination on first loading
    this.$nextTick(() => {
      setTimeout(() => {
        this.hasReady = true
      }, 0)
    })
  },
  props: {
    lineWidth: {
      type: Number,
      default: 3
    },
    activeColor: String,
    barActiveColor: String,
    defaultColor: String,
    disabledColor: String,
    animate: {
      type: Boolean,
      default: true
    },
    customBarWidth: [Function, String],
    preventDefault: Boolean,
    scrollThreshold: {
      type: Number,
      default: 4
    },
    barPosition: {
      type: String,
      default: 'bottom',
      validator(val) {
        return ['bottom', 'top'].indexOf(val) !== -1
      }
    }
  },
  computed: {
    barLeft() {
      if (this.hasReady) {
        const count = this.scrollable ? (window.innerWidth / this.$children[this.currentIndex || 0].$el.getBoundingClientRect().width) : this.number
        return `${this.currentIndex * (100 / count)}%`
      }
    },
    barRight() {
      if (this.hasReady) {
        const count = this.scrollable ? (window.innerWidth / this.$children[this.currentIndex || 0].$el.getBoundingClientRect().width) : this.number
        return `${(count - this.currentIndex - 1) * (100 / count)}%`
      }
    },
    // when prop:custom-bar-width
    innerBarStyle() {
      return {
        width: typeof this.customBarWidth === 'function' ? this.customBarWidth(this.currentIndex) : this.customBarWidth,
        backgroundColor: this.barActiveColor || this.activeColor
      }
    },
    // end
    barStyle() {
      const commonStyle = {
        left: this.barLeft,
        right: this.barRight,
        display: 'block',
        height: this.lineWidth + 'px',
        transition: !this.hasReady ? 'none' : null
      }
      if (!this.customBarWidth) {
        commonStyle.backgroundColor = this.barActiveColor || this.activeColor
      } else {
        commonStyle.backgroundColor = 'transparent' // when=prop:custom-bar-width
      }
      return commonStyle
    },
    barClass() {
      return {
        't-forward': this.direction === 'forward',
        't-backward': this.direction === 'backward'
      }
    },
    scrollable() {
      return this.number > this.scrollThreshold
    }
  },
  watch: {
    currentIndex(newIndex, oldIndex) {
      this.direction = newIndex > oldIndex ? 'forward' : 'backward'
      this.$emit('on-index-change', newIndex, oldIndex)
      this.hasReady && this.scrollToActiveTab()
    }
  },
  data() {
    return {
      direction: 'forward',
      right: '100%',
      hasReady: false
    }
  },
  methods: {
    scrollToActiveTab() {
      if (!this.scrollable || !this.$children || !this.$children.length) {
        return
      }
      const currentIndexTab = this.$children[this.currentIndex].$el
      let count = 0
      // scroll animation
      const step = () => {
        const scrollDuration = 15
        const nav = this.$refs.nav
        nav.scrollLeft += (currentIndexTab.offsetLeft - (nav.offsetWidth - currentIndexTab.offsetWidth) / 2 - nav.scrollLeft) / scrollDuration
        if (++count < scrollDuration) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }
  }
}
</script>


<style lang="scss">
@import "~static/styles/base/_variable.scss";
$tab-bar-active-color: $tab-bar-active-color;
$effect-duration: 0.3s;
$easing-in-out: cubic-bezier(0.35, 0, 0.25, 1);
$tab-text-default-color: $tab-text-default-color;
$tab-text-active-color: $tab-active-color;
$tab-text-disabled-color: #ddd;
.c-tab {
  .c-tab-ink-bar {
    position: absolute;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: $tab-bar-active-color;
    text-align: center;

    &.t-forward {
      transition: right $effect-duration $easing-in-out,
        left $effect-duration $easing-in-out $effect-duration * 0.3;
    }
    &.t-backward {
      transition: right $effect-duration $easing-in-out $effect-duration * 0.3,
        left $effect-duration $easing-in-out;
    }
  }
}

.c-tab-bar-top .c-tab {
  .c-tab-ink-bar {
    top: 0;
  }
}

.c-tab {
  display: flex;
  background-color: #fff;
  height: $tab-heigth;
  position: relative;
}

.c-tab button {
  padding: 0;
  border: 0;
  outline: 0;
  background: 0 0;
  appearance: none;
}

.c-tab .c-tab-item {
  display: block;
  flex: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-size: 100% 1px;
  font-size: $tab-font-size;
  text-align: center;
  height: $tab-heigth;
  line-height: $tab-heigth;
  color: $tab-text-default-color;
}

.c-tab .c-tab-item.c-tab-selected {
  color: $tab-text-active-color;
  border-bottom: 3px solid $tab-text-active-color;
}

.c-tab-bar-top {
  .c-tab .c-tab-item {
    background-size: 100% 1px;
  }
  .c-tab .c-tab-item.c-tab-selected {
    border-bottom: none;
    border-top: 3px solid $tab-text-active-color;
  }
}

.c-tab .c-tab-item.c-tab-disabled {
  $olor: $tab-text-disabled-color;
}

.c-tab.c-tab-no-animate .c-tab-item.c-tab-selected {
  background: 0 0;
}

/** when=prop:custom-bar-width **/
.c-tab-bar-inner {
  display: block;
  background-color: $tab-text-active-color;
  margin: auto;
  height: 100%;
  transition: width 0.3s $easing-in-out;
}

.c-tab-item-badge {
  position: absolute;
  top: 0;
  bottom: 0;
  box-sizing: border-box;
  display: inline-block;
  height: $tab-badge-wh;
  min-width: $tab-badge-wh;
  padding: 0 4px;
  border-radius: $tab-badge-wh / 2;
  margin: auto 0 auto 4px;
   line-height: $tab-badge-wh;
    font-size: $tab-badge-fs;
  background-clip: padding-box;
  vertical-align: middle;
}

.c-tab-wrap {
  background-color:$content-bg;
  position: relative;
  height: $tab-heigth;
}

.c-tab-container {
  height: $tab-heigth;
  top: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  position: absolute;
}

.scrollable {
  overflow-y: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 17px;
  box-sizing: content-box;
}

.scrollable::-webkit-scrollbar {
  display: none;
}

.scrollable .c-tab-ink-bar {
  bottom: 17px;
  position: absolute;
}

.scrollable .c-tab-item {
  flex: 0 0 22%;
}
</style>
