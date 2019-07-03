<template>
    <div class="accountManage">
        <v-pageheader :breadcrumbs="[{ name: '帐号管理' }]"></v-pageheader>
        <section class="search-wrapper">
            <el-form :inline="true" :model="searchForm" label-width="0">
                <el-form-item>
                    <el-input v-model="searchForm.username" placeholder="请输入管理员帐号"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="loadData">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <div class="table-container">
            <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
                <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                <el-table-column prop="username" label="登录账号" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
              <el-table-column prop="orgUnit.name" label="文化馆" align="center"></el-table-column>
                <el-table-column prop="unit.name" label="部门" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template scope="scope">
                        <el-switch v-model="scope.row.isLocked" class="btn-act" on-text="正常" off-text="锁定" :on-value="false" :off-value="true" @change="handleLock(scope.row)"></el-switch>
                        <a class="btn-act" @click="HandSetRole(scope.row)">分配角色</a>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
            </div>
        </div>
        <el-dialog title="分配角色" v-model="rolesDialog" :close-on-click-modal='false'>
          <div>
            <el-form :model="userRole">
              <el-form-item label-width="0">
                <el-checkbox-group v-model="userRole.roles">
                  <el-checkbox v-for="role in rolesData" :label="role.id" :key="role.id">
                    {{role.name}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
          <div class="dialog-footer">
            <el-button @click="rolesDialog = false">取消</el-button>
            <el-button type="primary" @click="submitRoles">保存</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import BaseTable from '@/mixins/base-table';
import Api from '@/api';

const ACCOUNT_STATUS = [{ value: '1', label: '正常' }, { value: '0', label: '锁定' }];

export default {
    mixins: [BaseTable],
    data() {
        return {
            rolesDialog: false,
            userRole: { unitid: '', username: '', roles: [] },
            rolesData: [],
            searchForm: { username: '', isLocked: '' },
            options: ACCOUNT_STATUS
        }
    },
    methods: {
        _ShowTip(msg, type = 'success') {
            this.$message({
                message: msg,
                type: type
            });
        },
        loadData() {
            this.loading = true;
            let isLocked = this.searchForm.isLocked;
            let username = this.searchForm.username;
            var str = 'search=';
            if (isLocked !== null && isLocked !== '') str += 'isLocked:' + isLocked + ',';
            if (username !== null && username !== '') str += ',username~' + username + '';
            let id = this.$store.getters.user.orgUnit.id;
            this.showLoading();
            str += ',isAccount:true';
            if( this.$store.getters.user.username=="admin")
            {
                Api.system.getAccountListall(id, str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
               }).finally(this.closeLoading);
            }else
            {
                Api.system.getAccountList(id, str, this.page, this.size).then((res) => {
                this.dataList = res.content;
                this.total = res.totalElements;
                }).finally(this.closeLoading);
            }
            
        },
        handleLock(row) {
            if (row.isLocked) {
                Api.system.lockAccount(row.unit.id, row.username).then((res) => {
                    this._ShowTip('操作成功')
                });
            } else {
                Api.system.unlockAccount(row.unit.id, row.username).then((res) => {
                    this._ShowTip('操作成功')
                });
            }
        },

        // 分配角色
        HandSetRole(row) {
          this.userRole.unitid = row.unit.id;
          this.userRole.username = row.username;
          this.userRole.roles = [];
          if (row.roles && row.roles.length > 0) {
            for (let r of row.roles) {
              if (r === null || r === undefined) continue;
              this.userRole.roles.push(r.id);
            }
          }

          let unitid = row.orgUnit.id;
          Api.system.getRoleList(unitid).then((res) => {
            if (!res || !res.length) {
              this.showTip('该用户的所属文化馆还没有角色，请先联系管理员创建角色！', 'error');
            } else {
              this.rolesDialog = true;
              this.rolesData = res;
            }
          });
        },
        callbackManager() {
          this.showTip();
          // this.getManagerFromUnit();
          // this.resetChangeDeptData();
          this.rolesDialog = false;
          this.loadData();
        },
        // 提交角色分配
        submitRoles() {
          let unitid = this.userRole.unitid;
          let username = this.userRole.username;
          let roles = this.userRole.roles;
          Api.system.changeAccountRole(unitid, username, roles).then(this.callbackManager);
        },
    },
    mounted() {
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.accountManage {}
</style>
