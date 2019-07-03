<template>
    <div class="venueManage">
        <v-pageheader :breadcrumbs="[{ name: '活动室管理' }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加活动室</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="venue-tabs">
            <el-tab-pane label="活动室编辑列表" name="first">
                <roomsTable :flag="1" :notInit="false" key="1"></roomsTable>
            </el-tab-pane>
            <el-tab-pane label="活动室审核列表" name="second">
                <roomsTable :flag="2" key="2"></roomsTable>
            </el-tab-pane>
            <el-tab-pane label="活动室发布列表" name="third">
                <roomsTable :flag="3" key="3"></roomsTable>
            </el-tab-pane>
            <el-tab-pane label="回收站" name="fourth">
                <roomsTable :flag="4" key="4"></roomsTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import roomsTable from './modules/roomsTable';
export default {
    components: {
        roomsTable
    },
    data() {
        return {
            activeName: 'first'
        }
    },
    methods: {
        _ShowTip(msg, type = 'success') {
            this.$message({
                message: msg,
                type: type
            });
        },

        handleAdd() {
            this.$router.push('room');
        },
        handleClick(tab, event) {
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.venueManage {
  position: relative;
  .right-opers {
    position: absolute;
    z-index: 10;
    text-align: right;
    right: 0;
    margin-top: 20px;
  }
  .venue-tabs {
    margin-top: 20px;
  }
}
</style>