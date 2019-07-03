<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <div class="right-opers">
            <el-button type="primary" @click="handleAdd">添加非遗名录</el-button>
        </div>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入非遗资源名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.type" placeholder="非遗名录类型" clearable>
                        <v-option typeName="heritageType"></v-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.level" placeholder="非遗名录级别" clearable>
                        <v-option typeName="heritageLevel"></v-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <v-table flag="index" :search="searchStr" key="WAITCOMMIT"></v-table>
    </div>
</template>

<script>
import table from './modules/table';
import _status, { PARENT_NAME } from './modules/heritage_status';
export default {
    components: {
        'v-table': table
    },
    data() {
        return {
            titleInfo: PARENT_NAME['index'],
            searchForm: { name: '', type: '', level: '', status: 'onlineStatus!Recycled' },
            statusOpts: _status.STATUS_OPTION,
            searchStr: 'onlineStatus!Recycled'
        }
    },
    methods: {
        handleAdd() {
            this.$router.push('heritage');
        },
        // 查询
        loadData() {
            let user = this.$store.getters.user;
            let unitid = user.unit.id; 
            let name = this.searchForm.name; // 名称
            let type = this.searchForm.type; // 类型
            let level = this.searchForm.level; // 级别
            let status = this.searchForm.status; // 状态

            let str = [];            
            if (name !== '') str.push('name~' + name);
            if (status !== '') str.push(status);
            // if (status !== '') str.push('onlineStatus:' + status);
            if (level !== '') str.push('level:' + level);
            if (type !== '') str.push('type:' + type);
            this.searchStr = str.join(',');
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
