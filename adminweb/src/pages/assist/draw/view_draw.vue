 <template>
  <div class="edit-wrapper">
    <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:'抽签'}]"></v-pageheader>
    <div class="form-wrapper">
      <el-form :model="actInfo" label-width="100px">
        <el-form-item label="活动名称：">
          <label>{{actInfo.name}}</label>
        </el-form-item>

        <el-form-item label="抽签说明：">
          <label>{{actInfo.draw.desc}}</label>

        
        </el-form-item>

        <el-form-item label="抽签截止日期：">
          <label>{{actInfo.draw.drawDate}}</label>
        </el-form-item>
        <el-form-item label='抽签结果：'>
          <el-table :data="dataList" border stripe tooltip-effect="custom-effect">
            <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
            <el-table-column prop="name" label="作品名称" align="center"></el-table-column>
            <el-table-column prop="type" label="作品类型" :formatter="formatActType" align="center"></el-table-column>
            <el-table-column label="抽签结果" align="center" width="220px">
              <template scope="scope">
              
                  {{scope.row.ord}}
                 
              </template>

            </el-table-column>

          </el-table>
        </el-form-item>

        <el-form-item>
         

          <el-button @click="routeback">返回</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import Api from '@/api'
import axios from 'axios'
export default {
  data() {
    return {
      titleInfo: {
        name: '抽签管理',
        path: 'activity_draw'
      },
      user: { orgUnit: {} },
      actId: '',
    
      actInfo: {
        draw: {}
      },
      
      dataList: [{
        name: '',
        ord: ''
      }], //作品列表
      
    }
  },
 

  
  created() {
    this.user = this.$store.getters.user;
  },
  mounted() {

    this.loadData();
  },
  methods: {
    loadData() {
      let _this = this;
      this.actId = this.$route.query.actId;
      let draw = Api.assist.getActDraw(this.actId);
      let actInfo = Api.assist.getAct(this.actId);
      let worksInfo = Api.assist.getActWorks(this.actId);
      Promise.all([draw, actInfo, worksInfo]).then(([dw, act, wks]) => {
        this.actInfo = act;
        let drawResultObj = {}
        if (_this.actInfo.draw.isOpen) {   //显示全部,本馆的作品排表格前面
          this.dataList = wks.sort(function(a, b) { return a.unitId.indexOf(_this.user.orgUnit.id) < b.unitId.indexOf(_this.user.orgUnit.id) });
        } else { //显示本馆
          this.dataList = wks.filter(item => _this.user.orgUnit.id == item.unitId)
        }
        if (dw.result) {
          dw.result.forEach(function(item) {
            Object.assign(drawResultObj, item.worksMap);
          })
          wks.forEach(function(item) {
            item.ord = drawResultObj[item.code] || '未抽签';
            item.selOrder = []
          })
        } else {
          wks.forEach(function(item) {
            item.ord = '未抽签';
            item.selOrder = []
          })
        }
      })
    },
        //格式化活动类型
    formatActType(row, column, cellValue) {
      return cellValue=='stageArts'?'舞台剧':'展览'
    },
    routeback() {
      this.$router.push('activity_draw');
    },
  }}
</script>

  <style type="text/css" lang="scss" rel="stylesheet/scss">
.el-checkbox__inner {
  border-radius: 10px;
}
</style>
