<template>
    <div class="left-side" :class="{'collapse':isCollapse}">
        <div class="zoom" @click="collapseMenu">
            <i class="sz-ico ico-list-collapsed"></i>
        </div>
        <v-scrollbar ref="menuWrapper" class="menu-wrapper" :settings="settings">
            <el-menu :default-active="activeMenu" unique-opened class="m-side-menu" :collapse="isCollapse" @select="handleSelect" router>
                <template v-for="item in menus">
                    <sub-menu :menu="item" :key="item.menuCode"></sub-menu>
                </template>
            </el-menu>
        </v-scrollbar>
    </div>
</template>

<script>
import SidebarItem from './sidebar_item';
import perfectScrollbar from '@/components/scrollbar/perfect-scrollbar'
export default {
    components: {
        'sub-menu': SidebarItem,
        'v-scrollbar': perfectScrollbar
    },
    props: {
        menus: {
            type: Array,
            default() {
                return []
            }
        }
    },
    computed: {
        activeMenu: function() {
            return this.$route.path
        }
    },
    data() {
        return {
            isCollapse: false,
            settings: {
                // wheelSpeed: 2,
                // wheelPropagation: true,
                // minScrollbarLength: 20,
                suppressScrollX: true
            }
        };
    },
    methods: {
        collapseMenu() {
            this.isCollapse = !this.isCollapse;
        },
        handleSelect(key, keyPath) {
        }
    },
    mounted() {
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables";
.left-side {
  $zoom-height: 30px;
  position: fixed;
  z-index: $left-sidebar-zindex;
  top: 0;
  bottom: 0;
  left: 0;
  width: $left-sidebar-w;
  padding-top: $head-height + $zoom-height; // overflow: hidden;
  transition: all 0.28s ease-out;
  background: $side-bg;
  &.collapse {
    width: $left-sidebar-w-c;
    .ps {
      overflow: visible !important;
    }
  }
  .zoom {
    height: $zoom-height;
    margin-top: -$zoom-height;
    line-height: $zoom-height;
    text-align: center;
    color: #fff;
    background-color: $side-zoom-bg;
  }

  .m-side-menu {
    // min-height: 100%;
    background-color: $side-bg;
  }
  .menu-wrapper {
    position: relative;
    height: 100%;
    max-height: 100%;
    overflow: auto;
  }
}
</style>
