<template>
    <div class="list-wrapper">
        <v-pageheader :breadcrumbs="[{ name: '学会年审' }]"></v-pageheader>
        <div class="table-container">
            <section class="search-wrapper">
                <el-form :inline="true" :model="searchForm" label-width="0">
                    <el-form-item>
                        <el-input v-model="searchForm.name" placeholder="请输入学会名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="loadData">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>
        </div>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading">
                <el-table-column prop="masOrgName" label="学会名称">
                    <template scope="scope">
                        <router-link :to="{path:'viewmassorglearnannual', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.masOrgName}}
                        </router-link>
                    </template>
                </el-table-column>               
                <el-table-column prop="contactPhone" label="联系电话"></el-table-column>                
                <el-table-column prop="contact" label="联系人"></el-table-column>                
                <el-table-column prop="createTime" label="资料提交时间"></el-table-column>
                 <el-table-column label="操作" width="400px" align="center">
                    <template scope="scope" >                                             
                        <span class="btn-act" @click.stop.prevent="down(scope.row)" >下载</span>                   
                        <a class="btn-act" @click="handleDel(scope.row)" >删除</a>
                    </template>
                </el-table-column>
            </el-table>
            
        </div>
    </div>
</template>

<script>
import BaseTable from "@/mixins/base-table";
import Api from "@/api";
export default {
  mixins: [BaseTable],
  data() {
    return {
      searchForm: { name: "" },
      dataList: [],
      areaOption: []
    };
  },
  created() {},
  methods: {
    //格式化区域
    convertRegion(row, column, cellValue) {
      return this.dicts.regionName(cellValue);
    },
    // 下载附件
    down(row) {
      let filename = row.attachName;
      let fileUrl = Api.system.getFileUrl(row.attach);      
        this.downloadFile(filename, fileUrl);
    },
    loadData() {
      let name = this.searchForm.name;
      let str = "";
      let user = this.$store.getters.user;
      if (name !== "") str += ",masOrgName~" + name;
      this.showLoading();
      str += "&sort=createTime~desc";
      Api.massorg
        .learnannual(str, this.page, this.size)
        .then(res => {
          this.dataList = res.content;
          this.total = res.totalElements;
        })
        .finally(this.closeLoading);
    },
    handleDel(row) {
         let self = this;
            self.delConfirm('学会', () => {
                Api.massorg.delLearnannual(row.id).then((res) => {
                    this.showTip();
                    this.loadData();
                });
            });
    }
  },
  mounted() {
    // this.loadData();
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
