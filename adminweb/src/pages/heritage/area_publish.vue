<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: titleInfo.name }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入非遗资源名称"></el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-select v-model="searchForm.status" placeholder="请选择状态">
                        <el-option v-for="item in statusOpts" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <v-table flag="publish" :search="searchStr" key="PUBLISHED"></v-table>
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
            titleInfo: AREA_NAME['publish'],
            searchForm: { name: '', type: '', level: '', status: '' },
            statusOpts: _status.STATUS_SEARCH,
            initSearchStr: 'onlineStatus:' + _status.STATUS.AUDITED + '~' + _status.STATUS.PUBLISHED + '~' + _status.STATUS.OFFLINE,
            searchStr: 'onlineStatus:' + _status.STATUS.AUDITED + '~' + _status.STATUS.PUBLISHED + '~' + _status.STATUS.OFFLINE
        }
    },
    methods: {
        // 查询
        loadData() {
            let name = this.searchForm.name; // 名称
            // let status = this.searchForm.status; // 状态
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
