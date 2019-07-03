<template>
  <div class="fileldadd-wrapper">
    <el-button @click="AddInputPanel" type="text" icon="plus">添加字段</el-button>
    <v-nodata v-if="!hasFileldadd && !edit" tipMsg='暂无自定义字段'></v-nodata>
    <div class="fileldadd-card" v-show="edit">
      <el-form ref="fileldaddForm" :model="fileldaddForm"  label-position="right" label-width="100px">
        <el-row v-for="(filed, index) in fileldaddForm.fileds" :key="index">
          <el-col :span="18">
            <el-form-item :prop="'fileds.' + index + '.name'" :label="'字段'+ (index+1) + '：'" :rules="{required: true, message: '请输入字段名称', trigger: 'blur'}"  style="margin-bottom:30px;">
              <el-input v-model.trim="filed.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button @click.prevent="delFiled(index)" type="danger" style="margin-left:10px">删除</el-button>
          </el-col>
        </el-row>
        <div class="dialog-footer">
          <el-button @click="resetForm('fileldaddForm')">取消</el-button>
          <el-button @click="AddInputPanel">添加字段</el-button>
          <el-button @click="submitForm" type="primary">保存</el-button>
        </div>
      </el-form>
    </div>
    <div class="fileldadd-card" v-show="exhibition">
        <div class="key-cont">
          <ul v-for="(filed, index) in fileldaddForm.fileds" :key="index">
            <li>
              <span>{{filed.name}}</span>
            </li>
          </ul>
        </div>
    </div>
  </div>
</template>
<script>
  import {groupBy} from 'lodash';
  import vRules from '@/config/validate_rules';
  export default {
    props: {
      /*
       * 关键词
       */
      fileds: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        exhibition: false,
        edit: false,
        fileldaddForm: {
          fileds:[]
        },
      }
    },
    computed: {
      hasFileldadd() {
        return this.fileldaddForm.fileds.length;
      }
    },
    watch: {
      'fileldaddForm.fileds'(val) {
        if(val.length <= 0){
           this.edit = false
        }
        if(this.edit){
          this.exhibition = false;
        }
      }
    },
    methods: {
      AddInputPanel() {
        this.edit = true;
        if(!this.fileldaddForm.fileds){
          this.set(this.fileldaddForm,'fileds',[]);
        }
        let len = this.fileldaddForm.fileds.length;
        this.fileldaddForm.fileds.push({key:len + 1,name:''})
      },
      delFiled(index) {
        this.fileldaddForm.fileds.splice(index, 1);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.fileldaddForm.fileds = [];
        this.edit = false;
      },
      submitForm() {
        this.$refs['fileldaddForm'].validate(valid => {
              if(valid){
                let itemType = this.fileldaddForm.fileds;
                this.$emit('filedsChange', itemType);
                this.edit = false;
                this.exhibition = true;
              }
        })
      }
    }
  }
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
  .scheduled-wrapper {
    .schedule-card {
      position: relative;
      padding: 15px 10px;
      &.edit {
        text-align: center;
      }
      .schedule-actions {
        height: 40px;
        line-height: 40px;
        text-align: right;
      }
      .day-item {
        display: inline-block;
        padding: 15px 15px 0;
        line-height: 36px;
        margin: 5px;
        border: 1px solid #ccc;
        text-align: center;
        vertical-align: top;
        .time-itms {
          border-bottom: 1px solid #f5f5f5;
        }
        .week {
          margin: 0;
          font-weight: normal;
        }
        .start-time,
        .end-time {
          display: inline-block;
          width: 80px;
          border-radius: 6px;
        }
        .u-split {
        }
      }
    }
  }
  .key-cont{
    >ul{
      >li{
        float:left;
        list-style-type: none;
        border:1px #ccc solid;
        padding:0px 10px;
        margin-right:10px;
        color:#999;
        >span{
          color:#333;
        }
      }
    }
  }
</style>
