<template>
    <div class="list-wrapper activity-wrapper">
        <v-pageheader :breadcrumbs="[{ name:'意见反馈管理' }]"></v-pageheader>
       
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.name" placeholder="请输入意见反馈名称"></el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="意见反馈名称" prop="name"  align="center">
                    <template scope="scope">
                        <router-link :to="{path:'viewSuggestion', query: {id: scope.row.id,flag:1}}" class="u-link">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>                       
                <el-table-column prop="content" label="反馈内容" align="center"  ></el-table-column> 
                <el-table-column prop="createTime" label="创建时间" align="center" width="200px"></el-table-column>               
                <el-table-column prop="isReply" label="是否回复" align="center" width="200px" :formatter="isReply"></el-table-column>  
                <!-- <el-table-column prop="" label="操作时间" align="center"></el-table-convertReserveTypecolumn> -->
                <el-table-column label="操作" align="left" width="220px">
                    <template scope="scope">                        
                        <a class="btn-act" @click="handleReply(scope.row)"    >回复</a>                    
                        <a class="btn-act" @click="handleDel(scope.row)" >删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
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
      searchForm: { name: "", status: "" },
      dataList: []
    };
  },
  methods: {
    callback() {
      this.showTip();
      this.loadData();
    },
    // 回复
    handleReply(row) {
      this.$prompt("请输入回复内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: value => {
          let spacePattern = /^\s+$/;
          let hasSpace = spacePattern.test(value);
          if (value == null || value.length === 0 || hasSpace) {
            return false;
          }
          return true;
        },
        inputErrorMessage: "必须输入回复内容"
      }).then(({ value }) => {
        if (value == "" || value == null || value == undefined) return;
        let user = this.$store.getters.user;
        row.replyContent = value;
        row.replyName = user.name;
        row.isReply = true;
        this.changeStatus(row.id, row);
      });
    },
    //.删除意见
    handleDel(row) {
      let self = this;
      self.delConfirm("意见", () => {
        Api.suggestions.delSuggestion(row.id).then(res => {
          this.showTip();
          this.loadData();
        });
      });
    },
    // 改变状态
    changeStatus(id, row) {
      Api.suggestions
        .modifySuggestion(id, row)
        .then(this.callback)
        .catch();
    },
    isReply(row, index, cellValue) {
      return cellValue ? "已回复" : "未回复";
    },
    loadData() {
      let user = this.$store.getters.user;
      let str = "search=searchUnitId";
      if (this.searchForm.name) {
        str += ",name~" + this.searchForm.name;
      }
      if (this.searchForm.status) {
        str += ",onlineStatus:" + this.searchForm.status;
      }
      str += "&sort=createTime~desc";
      this.showLoading();
      Api.suggestions
        .getSuggestionsList(str, this.page, this.size)
        .then(res => {
          this.dataList = res.content;
          this.total = res.totalElements;
        })
        .finally(this.closeLoading);
    }
  },
  mounted() {}
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
