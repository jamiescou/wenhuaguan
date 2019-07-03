<template>
  <div class="roomorders-wrapper">
    <v-pageheader :breadcrumbs="[{ to:'pulish',name: '活动室发布' },{name:'活动室订单'}]"></v-pageheader>
    <section class="search-wrapper">
      <el-form :inline="true" :model="searchForm" label-width="0">
        <el-form-item>
          <el-input v-model="searchForm.orderCode" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="searchForm.itmDate" type="date" :editable="false" placeholder="请输入预定日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.mobile" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option v-for="item in statusOpts" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </section>
    <div class="table-container">
      <el-table :data="dataList" border v-loading.body="loading" tooltip-effect="custom-effect">
        <el-table-column label=" " type="index" align="center"></el-table-column>
        <el-table-column label="订单号" align="center" class-name="linkCell">
          <template scope="scope">
            <div class="u-link" @click="handleDetail(scope.row)">{{scope.row.orderCode}}</div>
          </template>
        </el-table-column>
        <el-table-column label="日期" align="center">
          <template scope="scope">
            <div v-for="(item,key) in groupByDate(scope.row.itms)" :key="key" class="group-item" :style="'height:'+item.length*40+'px;'">{{key}}</div>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template scope="scope">
            <div v-for="(item,key) in groupByDate(scope.row.itms)" :key="key" class="group-item" :style="'height:'+item.length*40+'px;'">
              <div v-for="(i,index) in item" :key="index">
                {{i.itmStarttime}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template scope="scope">
            <div v-for="(item,key) in groupByDate(scope.row.itms)" :key="key" class="group-item" :style="'height:'+item.length*40+'px;'">
              <div v-for="(i,index) in item" :key="index">
                {{i.itmEndtime}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cname" label=" 预订人" align="center"></el-table-column>
        <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" :formatter="convertStatus"></el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template scope="scope">
            <el-button size="small" @click="handlePass(scope.row)" :disabled="!hasPermission(scope.row)">通过</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
      </div>
    </div>
    <el-dialog title="订单详情" v-model="orderDialog">
      <div>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="订单号" :value="viewForm.orderCode"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="业务类型" :value="viewForm.bsnType"></v-detailItem>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="下单时间" :value="viewForm.createTime"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="订单状态" :value="convertStatus(viewForm)"></v-detailItem>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="用户姓名" :value="viewForm.cname"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="用户昵称" :value="viewForm.nickname"></v-detailItem>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="身份证号" :value="viewForm.idNumber"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="用户手机号" :value="viewForm.mobile"></v-detailItem>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="是否已验票" :value="viewForm.hasChecked"></v-detailItem>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <v-detailItem label="预定场次" type='custom'>
          <div v-for="(item,key) in groupByDate(viewForm.itms)" :key="key" class="group-item-detail" :style="'height:'+item.length*40+'px;'">
            <div class="itm-date">{{key}}</div>
            <div class="itm-periods">
              <div v-for="(i,index) in item" :key="index">
                {{i.itmStarttime}} - {{i.itmEndtime}}
              </div>
            </div>
          </div>
        </v-detailItem>
        <v-detailItem label="用途" :value="viewForm.use"></v-detailItem>
        <v-detailItem label="日志" type='custom'>
          <div v-if="viewForm.cancelLog">
            [{{viewForm.cancelLog.type}}][{{viewForm.cancelLog.time}}]{{viewForm.cancelLog.reason}}
          </div>
        </v-detailItem>
      </div>
      <div class="dialog-footer">
        <el-button @click="orderDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import BaseTable from '@/mixins/base-table';
  import Api from '@/api';
  import _ from 'lodash';
  const STATUS_OPTION = [
    { label: '待审核', value: 'created' },
    { label: '审核通过', value: 'success' },
    { label: '取消订单', value: 'cancel' }
  ]
  const CANCEL_TYPE = { 'user': '用户取消', 'manager': '管理员取消' };
  export default {
    mixins: [BaseTable],
    data() {
      return {
        searchForm: { itmDate: '',  mobile: '', status: '',orderCode:'' },
        statusOpts: STATUS_OPTION,
        doNotInit: true,
        orderDialog: false,
        viewForm: { orderCode: '', bsnType: '', createTime: '', status: '', cname: '', nickname: '', idNumber: '', mobile: '', itms: [], hasChecked:'',cancelLog: [] }
      }
    },
    methods: {
      back() {
        this.$router.go(-1);
      },
      callback() {
        this.showTip();
        this.loadData();
      },
      // 加载数据
      loadData() {
        let str = 'roomId:'+this.id;
        // let startTime = this.searchForm.startTime;
        // let endTime = this.searchForm.endTime;
        let itmDate = this.formatDate(this.searchForm.itmDate,'yyyy-MM-dd');
        let orderCode = this.searchForm.orderCode;
        let status = this.searchForm.status;
        let mobile = this.searchForm.mobile;
        if (orderCode !== '') str += ',orderCode:' + orderCode;
        if (status !== '') str += ',status:' + status;
        if (mobile !== '') str += ',mobile:' + mobile;
        if (itmDate != '') str +=',itms.itmDate:'+ itmDate;

        this.showLoading();
        Api.venue.getOrdersForRoom(str, this.page, this.size).then((res) => {
          this.dataList = res.content;
          this.total = res.totalElements;
        }).finally(this.closeLoading);
      },
      convertStatus(row) {
        let status = STATUS_OPTION.find(item => item.value === row.status);
        if (status) {
          return status.label;
        }
      },
      convertCancelType(type) {
        return CANCEL_TYPE[type];
      },
      groupByDate(itms) {
        let tGroup = _.groupBy(itms, 'itmDate');
        return tGroup
      },
      handleDetail(row) {
        this.orderDialog = true;
        Api.venue.getOrderInfo(row.id).then((res) => {
          if(res.hasChecked===null||!res.hasChecked){
            res.hasChecked='否';
          }else {
            res.hasChecked ='是';
          }
          this.viewForm = res;
        });
      },
      handlePass(row) {
        Api.venue.orderPass(row.id).then(this.callback).catch();
      },
      handleReject(row) {
        Api.venue.orderReject(row.id).then(this.callback).catch();
      },
      hasPermission(row) {
        return row.status === 'created';
      }
    },
    mounted() {
      this.id = this.$route.query.id;
      this.loadData();
    },
    destroyed() {
    }
  }
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
  .linkCell {
  .u-link {
    text-decoration: underline;
    color: #333;
    cursor: pointer;
  }
  }

  .roomorders-wrapper {
  .group-item+.group-item {
    margin: 0 -18px;
    border-top: 1px solid #dfe6ec;
  }
  .group-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .group-item-detail {
    display: flex;
    align-items: center;
  .itm-date {
    margin-right: 10px;
  }
  .itm-periods {}
  }
  }
</style>
