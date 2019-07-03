<template>
    <div class="page-header">
        <el-breadcrumb separator="/" class="u-breadcrumb">
            <template v-for="(item,index) in breadcrumbs">
                <el-breadcrumb-item :key="index" :to="item.to">{{item.name}}</el-breadcrumb-item>
            </template>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    props: {
        breadcrumbs: {
            type: Array,
            default: []
        }
    },
    created() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.page-header {
  padding: 10px 15px;
  color: #333;
  border: 1px solid #d4d4d4;
  background-color: #f2f2f2;
  .u-breadcrumb {
    line-height: 20px;
    font-size: 14px;
    .el-breadcrumb__item__inner,
    .el-breadcrumb__item__inner a {
      color: inherit;
      &:hover {
        color: #20a0ff;
      }
    }
    .el-breadcrumb__item:last-child {
      .el-breadcrumb__item__inner {
        &,
        a,
        a:hover,
        &:hover {
          color: #999;
        }
      }
    }
    .el-breadcrumb__separator {
      color: #666;
    }
  }
}

.u-heading {
  $breadcrumb-color: #333;
  $breadcrumb-active: #20a0ff;
  $breadcrumb-last: #827a7a;
  height: 36px;
  padding-left: 15px;
  line-height: 36px;
  overflow: hidden;
  font-size: 12pt;
  border: 1px solid #ccd6de;
  background-color: #eef1f6;
  border-radius: 4px;
  .u-title {
    color: $breadcrumb-color;
    &.u-to {
      &:hover {
        color: $breadcrumb-active;
        cursor: pointer;
      }
    }
  }
  .last-title {
    color: $breadcrumb-last;
    cursor: text;
  }
  .heading-split {
    padding: 0 5px;
    color: $breadcrumb-color;
  }
}
</style>