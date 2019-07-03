<template>
    <div class="assign-dept-wrapper" v-clickoutside="handleCloseTree">
        <div class="assign-dept-input" @click.stop="toggleMenu">
            <el-input class="deptName" v-model="depInfo.name" icon="caret-bottom" readonly :disabled="disabled" @click.stop.prevent="handleIconClick"></el-input>
        </div>
        <transition name="fade">
            <el-scrollbar v-if="treeVisible" class="dept-scrollbar" ref="treeScrollbar">
                <div class="dept-tree">
                    <v-orgtree ref='upperTree' @orgClick="clickHandlerDept" :orgId="orgId11" :disabled="disabled" :expanded="false"  orgType="dep"></v-orgtree>
                </div>
            </el-scrollbar>
        </transition>
    </div>
</template>

<script>
import Vue from 'vue';
import Clickoutside from './utils/clickoutside';
import { addClass, removeClass, hasClass } from './utils/dom';
import { Tag, Scrollbar } from 'element-ui';
Vue.component(Scrollbar.name, Scrollbar);
Vue.component(Tag.name, Tag);
import treePanel from './org_tree_panel'

export default {
    components: {
        'v-orgtree': treePanel
    },
    props: {
        orgId: {
            type: String,
            default: ''
        },
        currentNode: {
            type: String,
            default: ''
        },
        currentDept: {
            type: Object,
            default: {}
        },
        disabled: false
    },
    data() {
        return {
            depts: [],
            depInfo: {
                name: ''
            },
            orgId11:this.orgId,
            defaultProps: { children: 'children', label: 'unitName' },
            treeVisible: false
        }
    },
    watch: {
        treeVisible(val) {
            if (!val) {
                this.handleIconHide();
            } else {
                this.handleIconShow();
            }
        },
        currentDept(val, oldVal) {            
            if (val) this.depInfo.name = val.name;
            if (val !== oldVal) {
                this.$emit('deptChange', val);
            }
        }
    },
    methods: {
        handleIconHide() {
            let icon = this.$el.querySelector('.el-input__icon');
            if (icon) {
                removeClass(icon, 'is-reverse');
            }
        },

        handleIconShow() {
            this.orgId11=this.orgId;
            let icon = this.$el.querySelector('.el-input__icon');
            if (icon && !hasClass(icon, 'el-icon-circle-close')) {
                addClass(icon, 'is-reverse');
            }
        },
        clickHandlerDept(data, node, self) {
            this.currentDept = data;
            this.toggleMenu();
        },
        handleCloseTree(val) {
            if (val === undefined) {
                this.treeVisible = false;
            } else {
                this.treeVisible = val;
            }
        },
        handleIconClick() {
            this.toggleMenu();
        },
        toggleMenu() {
            if (!this.disabled) {
                this.treeVisible = !this.treeVisible;
            }
        }
    },
    mounted() {       
        if (this.currentDept) {
            this.depInfo = this.currentDept;
        }

    },
    directives: { Clickoutside }
}
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.assign-dept-wrapper {
  position: relative;
  .dept-scrollbar {
    /*position: absolute;*/
    /*z-index: 2000;*/
    /*top: 40px;*/
    /*left: 0;*/
    /*right: 0;*/
    border: 1px solid #d1dbe5;
    transform-origin: center top 0px;
    /*transition: all .3s linear;*/
    /** 展开动画 **/
    .fade-enter-active,
    .fade-leave-active {
      opacity: 1;
      transform: scaleY(1);
      transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms,
        opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
      transform-origin: center top;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
      transform: scaleY(0);
    }
  }
  .dept-tree {
    max-height: 300px;
    transform-origin: center top 0px;
    z-index: 2000;
    .el-tree {
      border: 0;
    }
  }

  .assign-dept-input {
    position: relative;
    .el-icon-caret-bottom {
      cursor: pointer;
      &.is-reverse {
        transform: rotateZ(180deg);
      }
    }
  }
}
</style>