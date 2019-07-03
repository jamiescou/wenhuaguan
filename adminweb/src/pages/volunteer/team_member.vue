<template>
  <div class="list-wrapper">
    <v-pageheader :breadcrumbs="[{ to:'index',name: '志愿者团队管理' },{name:'志愿者成员列表'}]"></v-pageheader>
    <div class="table-container" style="margin-top:20px;">
      <el-table :data="dataList" border stripe v-loading.body="loading">
        <el-table-column label="姓名">
          <template scope="scope">
            <router-link :to="{path:'person_detail', query: {id: scope.row.id,did:objid,flag:'team'}}" class="u-link">
              {{scope.row.name}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template scope="scope">
            {{formatSex(scope.row.user.sex)}}
          </template>
        </el-table-column>
        <el-table-column prop="user.mobile" label="联系电话"></el-table-column>
        <el-table-column prop="user.birthday" label="出生日期"></el-table-column>
        <el-table-column prop="education" label="学历"></el-table-column>
        <el-table-column prop="holdAddress" label="籍贯"></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template scope="scope">
            <a class="btn-act" @click="del(scope.$index, scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="foot-opers">
      <el-button @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';
export default {
  data() {
    return {
      dataList: [],
      objid: '',
      loading: false
    };
  },
  methods: {
    back() {
      this.$router.replace('index');
    },
    loadData() {
      this.loading = true;
      // 获取成员列表
      Api.nouns.getTeamMembers(this.objid).then((res) => {
        this.dataList = res;
        this.loading = false;
      }).catch(() => { this.loading = false; })
    },
    // 查看
    detail(index, row) {
      this.$router.push({ path: 'person_detail', query: { objid: this.objid, id: row.id, flag: 'team' } })
    },
    del(index, row) {
      let self = this;
      self.delConfirm('团队成员', () => {
        Api.nouns.delTeamMember(this.objid, row.id).then(self.callback);
      });
    },
    callback() {
      this.showTip();
      this.loadData();
    },
  },
  mounted() {
    this.objid = this.$route.query.id;
    this.loadData();
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
