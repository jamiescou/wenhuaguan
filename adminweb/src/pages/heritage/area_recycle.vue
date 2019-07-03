<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入非遗保护区名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <v-table flag="recycle" :search="searchStr" key="RECYCLED"></v-table>
    </div>
</template>

<script>
import table from './modules/areatable';
import _status, { AREA_NAME } from './modules/heritage_status';
export default {
    components: {
        'v-table': table
    },
    data() {
        return {
            titleInfo: AREA_NAME['recycle'],
            searchForm: { name: '', type: '', level: '', status: '' },
            statusOpts: _status.STATUS_OPTION,
            initSearchStr: 'onlineStatus:' + _status.STATUS.RECYCLED,
            searchStr: 'onlineStatus:' + _status.STATUS.RECYCLED
        }
    },
    methods: {
        // 查询
        loadData() {
            let name = this.searchForm.name; // 名称
            let str = [];
            str.push(this.initSearchStr);
            if (name !== '') str.push('name~' + name);
            this.searchStr = str.join(',');
        }
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
