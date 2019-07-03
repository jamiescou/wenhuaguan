<template>
  <div class="edit-wrapper">
    <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:'发布抽签'}]"></v-pageheader>
    <div class="form-wrapper">
      <el-form :model="draw" label-width="100px">

        <el-form-item label="活动名称">
          <el-select v-model="actId" placeholder="请选择活动名称">

            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in drawActLst"></el-option>

          </el-select>
        </el-form-item>

        <el-form-item label="抽签说明">
          <el-input type="textarea" :rows="3" v-model="draw.desc" placeholder="请输入抽签说明">
          </el-input>
        </el-form-item>

        <el-form-item label="抽签截止日期">
          <el-date-picker v-model="draw.drawDate" type="date" placeholder="抽签截止日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
          </el-date-picker>

        </el-form-item>

        <el-form-item label="抽签类型">
          <el-radio-group v-model="draw.isUnitDraw">
            <el-radio :label=false>按作品</el-radio>
            <el-radio :label=true>按指导文化馆</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="公开抽签结果">
          <el-radio-group v-model="draw.isOpen">
            <el-radio :label=true>是</el-radio>
            <el-radio :label=false>否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit_draw">确定</el-button>
          <el-button @click="routeback">返回</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import Api from '@/api'
import axios from 'axios'
import moment from 'moment'
export default {
  data() {
    // 时间重叠验证


    return {
      titleInfo: {
        name: '抽签管理',
        path: 'activity_draw'
      },
      actId: "",
      draw: {
        desc: '',
        isUnitDraw: true,
        drawDate: '',
        isOpen: true,
      },
      drawActLst: []

    }

  },
  mounted() {
    let user = this.$store.getters.user;
    let unitid = user.unit.id;
    let str = 'draw:null,unitId:' + unitid
    Api.assist.getActList(str, 1, -1).then((res) => {
      this.drawActLst = res.content;
    }).finally();
  },
  methods: {
    submit_draw() {
      if (!this.actId) {
        this.$message({
          message: '请选择活动名称'
        });
        return;      }
      if (!this.draw.drawDate) {
        this.$message({
          message: '请设置抽签截止时间'
        }); return;
      }
      this.draw.drawDate = new moment(this.draw.drawDate).format('YYYY-MM-DD');

      Api.assist.addActDraw(this.actId, this.draw).then((res) => {
        if (res == '') {
          this.$message({
            message: '抽签提交成功',
            type: 'success'
          });
          this.$router.push('activity_draw');
        } else {
          this.$message({
            message: '提交失败',
            type: 'error'
          });

        }
      });
    },
    routeback() {
      this.$router.push('activity_draw');
    }
  }

}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
</style>
