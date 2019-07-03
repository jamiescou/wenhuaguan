<template>
  <div class="list-wrapper">
    <v-pageheader :breadcrumbs="breadcrumbs"></v-pageheader>
    <section class="search-wrapper">
      <el-form :inline="true" :model="searchForm" label-width="0">
        <el-form-item>
          <el-input v-model="searchForm.orderCode" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.itms" placeholder="请选择场次" clearable>
            <el-option v-for="item in itms" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </section>
    <!--<section style="margin-bottom:22px;">-->
    <!--<el-row :gutter="20">-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="活动总票数" :value="statForm.total"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="已预约票数" :value="statForm.orderedSum"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="余票数" :value="statForm.reserveSum"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="预订率" :value="statForm.orderedRate"></v-detailItem>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row :gutter="20">-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="已验票数" :value="statForm.checkSum"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="未验票数" :value="statForm.noCheckSum"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="上座率" :value="statForm.sitRate"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="退订票数" :value="statForm.retreatRate"></v-detailItem>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--</section>-->
    <div class="table-container">
      <el-table :data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect">
        <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="订单号" align="center">
          <template scope="scope">
            <div class="u-link" @click="handleDetail(scope.row)">{{scope.row.orderCode}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="itmDate" label="活动日期" align="center"></el-table-column>
        <el-table-column prop="itmStarttime" label="活动场次" align="center" :formatter="formatterItmtime"></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
        <el-table-column prop="reserveSum" label="票数" align="center"></el-table-column>
        <el-table-column prop="createTime" label="预定时间" align="center"></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" align="center" :formatter="formatterOrderStatus"></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template scope="scope">
            <el-button size="small" @click="handleCancel(scope.row)" v-show="scope.row.orderStatus!=='canceled'">取消</el-button>
            <el-button size="small" @click="handleResend(scope.row)" v-show="scope.row.orderStatus!=='canceled'">重发预约短信</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container ">
        <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
      </div>
    </div>
    <!-- 活动详情 -->
    <el-dialog title="订单详情" v-model="orderDialog">
      <div>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="订单号" :value="viewForm.orderCode"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="活动名称" :value="viewForm.activityName"></v-detailItem>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="活动场次" :value="viewForm.itms"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="所属场馆" :value="viewForm.unitName"></v-detailItem>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="订票方式" :value="viewForm.reserveType"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="预约票数" :value="viewForm.reserveSum"></v-detailItem>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="预约用户" :value="viewForm.cname"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="手机号码" :value="viewForm.mobile"></v-detailItem>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="取票码" :value="viewForm.drawnCode"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="座位号" :value="seats" v-show="seatShow"></v-detailItem>
          </el-col>
        </el-row>
        <v-detailItem label="是否取票" :value="viewForm.orderStatus" ></v-detailItem>
      </div>
      <div class="dialog-footer">
        <el-button @click="orderDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import BaseTable from '@/mixins/base-table';
  import Api from '@/api';
  import { PARENT_NAME, orderStatusOpts, ORDER_STATUS, RESERVETYPE } from './activity_status';

  export default {
    mixins: [BaseTable],
    data() {
      return {
        doNotInit: true,
        orderDialog: false,
        id: '',
        searchForm: { orderCode: '', reserveSum: '', orderStatus: '', mobile: '', itms: '' },
        dataList: [],
        itms: [],
        dataForm: {
          fromStatus: '',
          toStatus: '',
          operatorDept: '',
          operatorName: '',
          operateTime: ''
        },
        seats:'',
        seatShow:false,
        options: orderStatusOpts(),
        viewForm: {},
        statForm: {}
      }
    },
    created() {
      let rootPath = PARENT_NAME['3'];
      this.breadcrumbs = [
        { to: rootPath.path, name: rootPath.name },
        { name: '订单管理' }
      ]
    },
    methods: {
      // 返回
      back() {
        this.$router.go(-1);
      },
      loadData() {          
        let search = [];         
        // 订单号
        if (this.searchForm.orderCode) {
          search.push('orderCode:' + this.searchForm.orderCode)
        }
        // 手机号
        if (this.searchForm.mobile) {
          search.push('mobile:' + this.searchForm.mobile)
        }

        // 订单状态
        if (this.searchForm.orderStatus) {
          search.push('orderStatus:' + this.searchForm.orderStatus)
        }
        // 场次
        if (this.searchForm.itms) {
          search.push(this.searchForm.itms)
        }
        search.push('activityId:' + this.id);
        let str = search.join(',');
        str += '&sort=createTime~desc';
        this.showLoading();
        Api.activity.getActivityOrders(str, this.page, this.size).then((res) => {
          this.dataList = res.content;
          this.total = res.totalElements;
        }).finally(this.closeLoading);
      },
      // 取消
      handleCancel(row) {
        this.$confirm('是否确认取消订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          let cancelLog = {type:'manager'};
          Api.activity.activityOrdersCancel(row.id,cancelLog).then((res) => {
            this.showTip();
            this.loadData();
          });
        });
      },
      // 重发预约短信
      handleResend(row){
        this.$confirm('是否确认重发预约短信?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          Api.activity.resendSms(row.id).then((res) => {
            this.showTip();
          });
        });

      },
      // 格式化状态信息
      formatterOrderStatus(row, column, cellValue) {
        return ORDER_STATUS[cellValue];
      },
      // 格式化场次信息
      formatterItmtime(row) {
        let itmStarttime = row.itmStarttime;
        let itmEndtime = row.itmEndtime;
        return itmStarttime + ' - ' + itmEndtime;
      },
      // 活动订单详情
      handleDetail(row) {
        let self = this;
        this.viewForm = JSON.parse(JSON.stringify(row));
        let orderStatus='';
        switch (this.viewForm.orderStatus){
          case 'drawn':
            orderStatus='已出票';
            break;
          default :
            orderStatus='未出票';
            break;
        }
        this.viewForm.orderStatus = orderStatus;
        if (this.viewForm.reserveType!=='none'){
          this.seatShow = true;
          // 拼接座位号
          let result=[];
          if (this.viewForm.seats){
            this.viewForm.seats.forEach((e)=>{
              let str=e.used?e.seatNo+'(已验票)':e.seatNo;
              result.push(str);
            });
          }
          this.seats = result.join('、');
        }else{
          this.seatShow = false;
        }
        this.viewForm.itms = row.itmDate + ' ' + row.itmStarttime + '-' + row.itmEndtime;
        this.viewForm.reserveType = RESERVETYPE[row.reserveType];
        Api.system.getUnitInfo(this.viewForm.unitId).then((res)=>{
          this.viewForm.unitName = res.name;
        });
        this.orderDialog = true;
      }
    },
    mounted() {
      this.id = this.$route.query.id;
      // 获取场次列表
      Api.activity.getActivityOrdersItms(this.id).then((res) => {
        let content = res;
        if (content.length > 0) {
          for (var i = 0; i < content.length; i++) {
            let itm = {
              value: 'itmDate:' + content[i].itmDate + ',' + 'itmStarttime:' + content[i].startTime + ',' + 'itmEndtime:' + content[i].endTime,
              label: content[i].itmDate + ' ' + content[i].startTime + '-' + content[i].endTime
            }
            this.itms.push(itm);
          }
        }
      });
      // 获得统计结果
      /*Api.activity.getActivityOrdersStat(this.id).then((res) => {
       this.statForm.total = res.total;
       this.statForm.reserveSum = res.reserveSum;
       this.statForm.orderedSum = this.statForm.total - this.statForm.reserveSum;
       this.statForm.orderedRate = ((this.statForm.orderedSum / this.statForm.total) * 100).toFixed(2) + '%';
       });*/
      this.loadData();
    }
  }
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
