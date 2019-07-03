<template>
  <div class="list-wrapper train-order-wrapper">
    <v-pageheader :breadcrumbs=" [{ to:titleInfo.path,name: titleInfo.name },{name:'报名管理'}]"></v-pageheader>
    <!--<div class="tree-content-panel">-->
    <!--<div class="tree-heading content-heading">-->
    <!--<div class="v-line"></div>-->
    <!--<h5 class="u-title">{{title}} 培训统计信息</h5>-->
    <!--</div>-->
    <!--<el-row :gutter="20">-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="报名人数" :value="viewForm.title"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="报名率" :value="viewForm.title"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="已录取" :value="viewForm.title"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="录取率" :value="viewForm.title"></v-detailItem>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row :gutter="20">-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="还可录取" :value="viewForm.title"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="面试邀请" :value="viewForm.title"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="不通过" :value="viewForm.title"></v-detailItem>-->
    <!--</el-col>-->
    <!--<el-col :span="6">-->
    <!--<v-detailItem label="取消报名" :value="viewForm.title"></v-detailItem>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--</div>-->
    <section class="search-wrapper">
      <!--<div class="tree-heading content-heading">-->
      <!--<div class="v-line"></div>-->
      <!--<h5 class="u-title">{{title}} 培训报名订单</h5>-->
      <!--</div>-->
      <el-form :inline="true" :model="searchForm" label-width="0">
        <el-form-item>
          <el-input v-model="searchForm.orderCode" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

     <el-form-item>
          <el-select v-model="searchForm.isSendMsg" placeholder="面试通知" clearable>
            <el-option  label="已发送" value="2"></el-option>
             <el-option  label="未发送" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="back">返回</el-button>
        </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="exportExcel">导出Excel</el-button>
        </el-form-item>
         <el-button size="small" type="primary" style='display:none' @click="cancelTrainSMS()">补发短信</el-button>
      </el-form>
    </section>

    <div class="table-container">
      <div class="train-operation">
         <el-button size="small" type="primary" @click="handleFase()">面试通知</el-button>
        <el-button size="small" type="primary" @click="handlePass()">报名通过</el-button>
        <el-button size="small" type="primary" @click="handleReject()">报名不通过</el-button>
      </div>
      <el-table :data="dataList" border stripe v-loading.body="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="订单号" align="center" prop="orderCode">
          <template scope="scope">
            <div class="u-link" @click="handleDetail(scope.row)">{{scope.row.orderCode}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="报名用户" align="center"></el-table-column>
        <el-table-column prop="idNumber" label="身份证号码" align="center"></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
        <el-table-column prop="createTime" label="报名时间" align="center"></el-table-column>
         <el-table-column prop="isSendMsg" :formatter="msgFormatter" label="面试通知" align="center"></el-table-column>
        <el-table-column prop="orderStatus" label="报名状态" align="center" :formatter="formatterOrderStatus"></el-table-column>

      </el-table>
      <div class="pagination-container ">
        <v-pagination @pageChange="onCurrentChange" :total="total" :isShow="showPagination"></v-pagination>
      </div>
    </div>
    <el-dialog title="面试通知" :visible.sync="dialogFormVisible">
      <el-form :model="faceForm" :rules="rules" ref="faceForm">
        <el-form-item label="面试时间" :label-width="formLabelWidth" prop="faceTime">
          <el-date-picker v-model="faceForm.faceTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="面试时间" :editable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="面试地点" :label-width="formLabelWidth" prop="addr">
          <el-input v-model="faceForm.addr" required></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="facePass">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 报名详情 -->
    <el-dialog title="报名详情" v-model="orderDialog">
      <div>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="培训名称" :value="orderForm.trainName"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="报名时间" :value="orderForm.createTime"></v-detailItem>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="订单号" :value="orderForm.orderCode"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="真实姓名" :value="orderForm.cname"></v-detailItem>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-detailItem label="手机号码" :value="orderForm.mobile"></v-detailItem>
          </el-col>
          <el-col :span="12">
            <v-detailItem label="身份证号" :value="orderForm.idNumber"></v-detailItem>
          </el-col>
        </el-row>
        <v-detailItem label="培训时间" :value="orderForm.trainStartTime + ' ~ ' + orderForm.trainEndTime"></v-detailItem>
        <v-detailItem label="其他信息" :value="extendNames"></v-detailItem>
        <div class="v-line"></div>
        <h5 class="u-title">成员信息</h5>
        <el-table :data="userList">
          <el-table-column prop="userName" label="用户姓名" align="center"></el-table-column>
          <el-table-column prop="sex" label="性别" align="center" ></el-table-column>
          <el-table-column prop="phoneNo" label="手机号" align="center"></el-table-column>
          <el-table-column prop="idnumber" label="身份证号" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="dialog-footer">
        <el-button @click="orderDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import BaseTable from '@/mixins/base-table';
  import vRules from '@/config/validate_rules';
  import Api from '@/api';
  import { PARENT_NAME } from './modules/status'
  const STATUS_LABEL = {
    'WaitAudit': '等待审核',
    'Success': '报名成功',
    'Rejected': '报名拒绝',
    'Canceled': '已取消'
  }

  const STATUS = {
    'WaitAudit': 'WaitAudit',
    'Success': 'Success',
    'Rejected': 'Rejected',
    'Canceled': 'Canceled'
  }

  function statusOpts() {
    const keys = Object.keys(STATUS_LABEL);
    let opts = [];
    for (const key of keys) {
      opts.push({ label: STATUS_LABEL[key], value: key });
    }
    return opts;
  }

  export default {
    mixins: [BaseTable],
    data() {
      return {
        id: '',
        title: '',
        doNotInit: true,
        orderDialog: false,
        formLabelWidth: '120px',
        dialogFormVisible: false,
        faceForm: { faceTime: '', addr: '' },
        searchForm: { orderCode: '', mobile: '', orderStatus: '',isSendMsg:'' },
        viewForm: { title: '' },
        userList: [],
        extendNames:'',
        dataForm: {
          fromStatus: '',
          toStatus: '',
          operatorDept: '',
          operatorName: '',
          operateTime: ''
        },
        options: statusOpts(),
        selectData: [],
        orderForm: {},
        titleInfo: PARENT_NAME[3],
        rules:{
          faceTime: [vRules.required],
          addr:[vRules.required]
        }
      }
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
          search.push('orderCode:' + this.searchForm.orderCode);
        }
        // 手机号
        if (this.searchForm.mobile) {
          search.push('mobile:' + this.searchForm.mobile);
        }
        // 订单状态
        if (this.searchForm.orderStatus) {
          search.push('orderStatus:' + this.searchForm.orderStatus);
        }
        if (this.searchForm.isSendMsg) {
          search.push('isSendMsg:' + this.searchForm.isSendMsg);
        }
        search.push('trainId:' + this.id);
        search.push('&sort=createTime~desc');
        this.showLoading();
        Api.train.getTrainOrders(search, this.page, this.size).then((res) => {
          this.dataList = res.content;
          this.total = res.totalElements;
        }).finally(this.closeLoading);
      },

msgFormatter(row){
   return row.isSendMsg==2?'已发送':'未发送'
},

      // 格式化状态信息
      formatterOrderStatus(row) {
        let value = row.orderStatus;
        return STATUS_LABEL[value];
      },
      // 格式化性别
      sexFormatter(row) {
        if (row.sex === 'male') return '男';
        if (row.sex === 'female') return '男';
        else return '未知';
      },
      // 选中触发
      handleSelectionChange(val) {
        this.selectData = val;
      },
      // 报名通过
      handlePass() {
        if (this.selectData === null || this.selectData.length < 1) {
          this.$message({
            type: 'error',
            message: '请选择一条数据'
          });
          return;
        }
        this.$confirm('确认报名通过, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          // 过滤  待审核的订单
          let selectOrder = this.selectData.filter(x => x.orderStatus === STATUS.WaitAudit);

          if (!selectOrder.length) {
            this.$message({
              type: 'info',
              message: '请选择待审核订单'
            });
            return;
          }
          // 生成一个Promise对象的数组
          const promises = selectOrder.map(function(order) {
            return Api.train.trainCheckOn(order.id)
          });

          Promise.all(promises).then((res) => {
            let names = selectOrder.map(x => { return (x.cname || x.nickname) });
            this.$message({
              type: 'info',
              message: names.join('、') + ' 报名成功'
            });
            this.loadData();
          });
        });
      },

     // 导出excel
      exportExcel(){
       Api.train.exportTrainOrdersById(this.id).then((res)=>{
         this.downloadFile('培训报名数据.xls', res);
       })
      },
     // 补发取消报名短信
      cancelTrainSMS(){
       Api.train.cancelTrainSMS(this.id,false).then((res)=>{
             console.log(res);
       })
      },


      // 报名不通过
      handleReject() {
        if (this.selectData === null || this.selectData.length < 1) {
          this.$message({
            type: 'error',
            message: '请选择一条数据'
          });
          return;
        }
        this.$confirm('确认报名不通过, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 过滤  待审核的订单
          let selectOrder = this.selectData.filter(x => x.orderStatus === STATUS.WaitAudit);
          if (!selectOrder.length) {
            this.$message({
              type: 'info',
              message: '所选订单已处理，请选择其他订单'
            });
            return;
          }

          // 生成一个Promise对象的数组
          const promises = selectOrder.map(function(order) {
            return Api.train.trainCheckOff(order.id)
          });
          Promise.all(promises).then((res) => {
            let names = selectOrder.map(x => { return (x.cname || x.nickname) });
            this.$message({
              type: 'info',
              message: '拒绝' + names.join('、') + ' 等人的报名'
            });
            this.loadData();
          });
        });
      },
      // 面试通知
      handleFase() {
        this.faceForm = { faceTime: '', addr: '' };
        if (this.selectData == null || this.selectData.length < 1) {
          this.$message({
            type: 'error',
            message: '请选择一条数据'
          });
          return;
        }
        let self = this;
        // 过滤  报名成功的订单
       // let selectOrder = this.selectData.filter(x => x.orderStatus !== STATUS.Success);

         let selectOrder = this.selectData.filter(x => x.orderStatus === STATUS.WaitAudit);
          if (!selectOrder.length) {
            this.$message({
              type: 'info',
              message: '所选订单已处理，请选择其他订单'
            });
            return;
          }

        this.dialogFormVisible = true;
      },
      facePass() {
        this.$refs['faceForm'].validate((valid) => {
          if (!valid) {
            return
          }
          if (this.selectData != null && this.selectData.length > 0) {
            let selectOrder = this.selectData;
            let interview = {};
            interview.time = this.formatDate(this.faceForm.faceTime, 'yyyy-MM-dd HH:mm:ss');//面试时间
            interview.address = this.faceForm.addr;//面试地点
            // 生成一个Promise对象的数组
            const promises = selectOrder.map(function (order) {
              return Api.train.inviteInterview(order.id, interview)
            });
            Promise.all(promises).then((res) => {
              let names = selectOrder.map(x => {
                return (x.cname || x.nickname)
              });
              this.$message({
                type: 'info',
                message: names.join('、') + ' 等人的面试通知已发送'
              });
              // this.loadData();
            })
          } else {
            this.$message({
              type: 'error',
              message: '请选择一条数据'
            });
            return;
          }
          this.dialogFormVisible = false;
        });
      },

      // 培训订单详情
      handleDetail(row) {
        this.orderForm = row;
        if(row.enrolUsers.extendNames){
          this.extendNames  = row.enrolUsers.extendNames.join("、");
        }
        this.orderDialog = true;
        for(let i of row.enrolUsers){
          if (i.idNumber===null) {
            i.sex = "";
          } else {
            let str = i.idnumber.substring(16, 17);
            if (str % 2 === 0) {
              i.sex = '女';
            } else {
              i.sex = "男";
            }
          }
        }
        this.userList = row.enrolUsers;
      }
    },
    mounted() {
      this.id = this.$route.query.id;
      this.title = this.$route.query.title;
      this.loadData();
    }
  }
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
  .train-order-wrapper {
  .train-operation {
    background: #eef1f6;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    border-right: 1px solid #dfe6ec;
    border-top: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
  }
  }
</style>
