<template>
    <!-- 有子级元素 -->
    <el-submenu :index="menu.path" v-if="!menu.hidden && menu.children && menu.children.length>0" class="u-sub-menu">
        <template slot="title">
            <i class="sz-ico " :class="menu.icon?'ico-'+ menu.icon:'ico-list'"></i>
            <span>{{menu.menuName}}</span>
        </template>
        <template v-for="child in menu.children" v-if='!child.hidden'>
            <sidebar-item v-if="child.children && child.children.length>0" :menu="child" :key="child.menuCode">
            </sidebar-item>
            <el-menu-item :index="child.fullpath" :key="child.menuCode" class="u-menu-item" v-else>
                <i class="sz-ico " :class="child.icon?'ico-'+child.icon:'ico-point'"></i>
                <span>{{child.menuName}}</span>
            </el-menu-item>
        </template>
    </el-submenu>
    <!-- 没有子集元素 -->
    <el-menu-item :index="menu.fullpath || menu.path" class="u-menu-item" v-else-if="!menu.hidden && (!menu.children || menu.children.length==0)">
        <i class="sz-ico " :class="menu.icon?'ico-'+menu.icon:'ico-point'"></i>
        <span>{{menu.menuName}}</span>
    </el-menu-item>
</template>
<script>
export default {
    name: 'SidebarItem',
    props: {
        menu: {
            type: Object
        }
    },
    mounted() {
    }
}
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
@import '../../styles/variables';
.m-side-menu {
    .el-menu-item:hover,
    .el-submenu__title:hover {
        color: $side-fc;
        background-color: darken($side-bg, 5%);
    }
    .u-sub-menu {
        .el-submenu__title {
            color: darken($side-fc, 5%);
            font-size: $side-fs;
            span {
                display: inline-block;
                vertical-align: middle;
            }
        }
        .el-menu {
            background-color: $side-leaf-menu-bg;
            .uict-menustyle {
                border-color: $side-leaf-menu-bg;
            }
        }
    }

    .u-menu-item {
        font-size: $side-fs;
        color: #fff;
        &.is-active {
            background-color: $side-menu-item-active-bg;
        }
    }
    .sz-ico {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        font-size: 20px;
    }
}
</style>
