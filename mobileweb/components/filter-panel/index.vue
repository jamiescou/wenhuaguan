<template>
  <div class="filter-wrapper">
    <div class="f-nav h-line fixed" @touchmove.prevent>
      <a class="f-nav-item" v-for="(item,index) in filters" :key="'nav_'+index" :class="{ 'current': selected === index }" @click="showPopup(index)">
        <div class="item-label v-line">
          <span>{{selectedItems[item.key]?selectedItems[item.key].value:item.name}}</span>
          <i class="icon" :class="(popupVisible && selected === index) ?'icon-up':'icon-down'"></i>
        </div>
      </a>
    </div>
    <v-overlayer v-model="popupVisible">
      <transition name="bounce-in">
        <div class="f-content fixed" v-show="popupVisible" @touchmove.prevent>
          <div class="f-content-wrapper" :class="{'has-sub':showSub}" ref="contentScroll">
            <div class="f-item">
              <ul v-if="curNav.key && curNav.options && curNav.options.length">
                <li v-for="i in curNav.options" :key="curNav.key + i.code" class="h-line" :class="{'active': firstLevel&&firstLevel.code ===i.code }" @click.stop.prevent="selectItem(curNav.key,i,true)">
                  <div class="item-content">
                    <template v-if="i.children&&i.children.length">
                      <div class="flex-item">
                        <div class="cell">
                          <i class="icon icon-yes selected"></i>
                          <span>{{i.value}}</span>
                        </div>
                        <div class="cell fixed">
                          <i class="icon icon-angle-left"></i>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <i class="icon icon-yes selected"></i>
                      <span>{{i.value}}</span>
                    </template>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="f-content-sub-wrapper" v-show="showSub" ref="subContentWrapper">
            <div class="f-item">
              <ul v-if="sub.key && sub.options && sub.options.length">
                <li v-for="i in sub.options" :key="'sub_'+sub.key +'_' + i.code" class="h-line" :class="{'active': isCurrent(sub.key,i.code) }" @click.stop.prevent="selectItem(sub.key,i)">
                  <div class="item-content">
                    <i class="icon icon-yes selected"></i>
                    <span>{{i.value}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </v-overlayer>
  </div>
</template>

<script>
let BScroll
if (process.browser) {
  BScroll = require('better-scroll').default;
}
export default {
  props: {
    filters: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultSelect: {
      //默认选择
      type: Object,
      default() {
        return {};
      }
    }

  },
  data() {
    return {
      selected: "",
      navs: [],
      popupVisible: false,
      bodyOverflow: null,
      selectedItems: {}, // 结构：{'key':{}}
      curNav: {}, // 结构：{key:'',options:''}
      showSub: false,
      sub: {},
      firstLevel: {}
    };
  },
  methods: {
    hidePopup() {
      this.popupVisible = false;
      this.showSub = false;
      this.sub = {};
      setTimeout(() => {
        if (this.bodyOverflow !== "hidden") {
          document.body.style.overflow = this.bodyOverflow;
        }
        this.bodyOverflow = null;
      }, 200);
    },
    showPopup(index) {
      if (this.selected === index && this.popupVisible) {
        this.hidePopup();
        return;
      }
      this.showSub = false;
      this.curNav = this.filters[index];
      // 设置子级的显示
      let curSelected = this.selectedItems[this.curNav.key];
      this.firstLevel = curSelected;
      if (curSelected && curSelected.parent) {
        let curNode = this.curNav.options.find(x => x.code === curSelected.parentCode);
        if (curNode) {
          this.firstLevel = curNode;
          let options = curNode.children.slice();
          options.splice(0, 0, { code: curNode.code, value: '全部', parent: { code: curNode.code } });
          this.sub = { key: this.curNav.key, options: options };
          this.showSub = true;
        }
      }
      this.selected = index;
      this.popupVisible = true;

      if (!this.bodyOverflow) {
        this.bodyOverflow = document.body.style.overflow;
      }
      let bodyHasOverflow =
        document.documentElement.clientHeight < document.body.scrollHeight;
      document.body.style.overflow = "hidden";
      if (this.contentScroll) {
        setTimeout(() => {
          this.contentScroll.refresh()
        }, 20)
      } else {
        this._initScroll();
      }
    },
    isCurrent(key, code, firstLevel) {
      let curSelected = this.selectedItems[key];
      if (curSelected) {
        if (firstLevel && curSelected.parent) {
          return curSelected.parentCode === code;
        } else {
          return curSelected.code === code;
        }
      }
      return false;
    },
    selectItem(key, item, firstLevel) {
      if (firstLevel) {
        this.firstLevel = item;
      }
      if (firstLevel && item.children && item.children.length) {
        this.showSub = true;
        this.sub = { key: key, options: JSON.parse(JSON.stringify(item.children)) };
        this.sub.options.splice(0, 0, { code: item.code, value: '全部', parent: { code: item.code } });
        if (this.subContentWrapper) {
          this.subContentWrapper.refresh()
        } else {
          this._initSubScroll();
        }
      } else {
        this.showSub = false;
        if (item.code === "all") {
          this.selectedItems[key] = undefined;
        } else {
          this.selectedItems[key] = item;
        }

        this.$emit("selectChange", this.selectedItems);
        this.hidePopup();
      }
    },
    _initSubScroll() {
      this.subContentWrapper = new BScroll(this.$refs.subContentWrapper, {
        scrollX: false,
        scrollY: true,
        click: true
      });
    },
    _initScroll() {
      this.contentScroll = new BScroll(this.$refs.contentScroll, {
        scrollX: false,
        scrollY: true,
        click: true
      });
    }
  },
  created() {

    this.selectedItems = this.$props.defaultSelect;

  }
};
</script>

<style lang="scss" scoped>
@import "~static/styles/components/filterpanel.scss";
</style>