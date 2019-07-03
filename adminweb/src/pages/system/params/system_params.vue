<template>
  <div class="uict-maincontent">
    <div class="uict-toppanel">
      <div class="navbar-container">
        <span>系统参数</span>
      </div>
    </div>
    <div class="settingBox" v-if="listGroupBy">
      <div class="setting-item" v-for="item in listGroupBy">
        <h4 class="u-title">{{item.name}}设置</h4>
        <div class="setting-content">
          <div class="arg-item" v-for="arg in item.datas">
            <el-form :ref="arg.name" :rules="rules" :model="arg" label-position="right"
                     label-width="180px">
              <el-form-item :label="arg.remark" prop="value">
                <el-input v-model="arg.value"></el-input>
              </el-form-item>
              <el-form-item label-width="0">
                <el-button type="primary" @click="onSubmit(arg)" class="u-btn">更改
                                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Api from '@/api'
  export default {
      data() {
          return {
              dataList: [],
              rules: {
                  value: [{required: true, message: '请输入参数值', trigger: 'blur'}]
              }
          }
      },
      created() {
          Api.system.getParamList().then((res) => {
              this.dataList = res;
          });
      },
      methods: {
          onSubmit(obj) {
              this.$refs[obj.name][0].validate((valid) => {
                  if (valid) {
                      Api.system.setParamValue(obj.name, obj.value).then((res) => {
                          this.$message({
                              showClose: true,
                              message: '修改成功',
                              type: 'success'
                          });
                      });
                  }
              });
          }
      },
      computed: {
          listGroupBy: function() {
              let groupList = [];// 结构[{name:'',datas:''}……]
              let groupKey = []; // 存储分类key
              var datas = this.dataList;
              for (let i = 0; i < datas.length; i++) {
                  let dataObj = datas[i];
                  let index = groupKey.indexOf(dataObj.type);
                  if (index === -1) {
                      let len = groupKey.push(dataObj.type);
                      groupList.push({name: dataObj.type, datas: []});
                      index = len - 1;
                  }
                  groupList[index].datas.push(dataObj);
              }
              return groupList;
          }
      },
      mounted() {
      }
  }
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
  .settingBox {
    .setting-item {
      $line-h: 24px;
      $btn-h: 30px;
      $color: #2b333b;
      margin: auto;
      padding: 20px 0 0 20px;
      overflow: hidden;
      border-bottom: 1px solid #d9dde1;
      .u-title, .setting-content, .desc {
        font-size: 14px;
        color: $color;
        line-height: $line-h;
      }
      .u-title {
        display: block;
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 700;
        .desc {
          margin-left: 10px;
          color: #93999f;
          font-weight: 400;
        }
      }
      .setting-content {
        display: block;
        .arg-item {
          display: inline-block;
          width: (150px + 160px + 60px);
        }
        .el-input {
          width: 120px;
        }
        .el-form-item {
          margin-right: 0;
          display: inline-block;
          vertical-align: top;
        }
        .el-form-item + .el-form-item {
          margin-left: 5px;
        }
      }
      .u-btn {
        height: $btn-h;
        line-height: $btn-h;
        font-size: 14px;
        padding: 0 15px;
      }
    }
  }
</style>
