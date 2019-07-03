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

        <el-form-item v-if='myUnitWorks.length' label="抽签类型：">
          <el-radio-group v-model="drawWithUnit" disabled>
            <el-radio :label=false>按作品</el-radio>
            <el-radio :label=true>按指导文化馆</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='抽签结果：'>
          <el-table :data="dataList" border stripe tooltip-effect="custom-effect">
            <el-table-column label=" " type="index" align="center" width="80px"></el-table-column>
            <el-table-column prop="name" label="作品名称" align="center"></el-table-column>
          
            <el-table-column prop="type" label="作品类型"  v-if='actInfo.type!="exhibition"' :formatter="formatActType" align="center"></el-table-column>
           
            <el-table-column label="抽签结果" align="center" width="220px">
              <template scope="scope">
              
                <div v-if='user.orgUnit.id==scope.row.unitId&&drawWithUnit&&unfinsh'> 
                  <el-checkbox-group v-model="scope.row.selOrder" v-if='isdrawed'>
                    <el-checkbox v-for="(item,index) in order" :key="item" :label="item" @change='ckbChange($event,scope,index)' :disabled="selectTable[scope.$index][index]" :ref="`${scope.row.id}${item}`"></el-checkbox>
                  </el-checkbox-group>
                  <div v-else>未抽签</div>
                </div>
                <div v-else>
                  {{scope.row.ord}}
                </div>
              </template>

            </el-table-column>

          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-if='myUnitWorks.length' @click="submit_draw">{{btnTag}}</el-button>
          <el-button @click="routeback" v-if='!isdrawed'>返回</el-button>
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
      drawWithUnit: false,//当前是否按文化馆抽签
      btnTag: '开始',
      actInfo: {
        draw: {}
      },
      myUnitWorks: [],
      unfinsh: true,
      showSubmit: false, //抽签
      order: [],  //按文化馆抽签 得到的序号
      isdrawed: false, //抽签类型：文化馆or 作品选择
      drawResultObj: {},
      dataList: [], //作品列表
      selectTable: [] //按作品数构建的一个n*n二维数组，用于按文化馆抽签时的选择设置
    }
  },
  watch: {
    drawWithUnit(newValue) {
      // this.order = [2, 5, 6]
    }
  },

  callback() {
    this.showTip();
    this.back();
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
       this.drawWithUnit=act.draw.isUnitDraw;
        if (wks.length == 0) { return; }
        this.myUnitWorks = wks.filter(item => _this.user.orgUnit.id == item.unitId);
        if (this.myUnitWorks.length == 0) { return; }
      
        let drawResultObj = {}

        if (_this.actInfo.draw.isOpen||_this.user.orgUnit.id == act.unitId) {   //显示全部,本馆的作品排表格前面
          this.dataList = wks.sort(function(a, b) { return a.unitId.indexOf(_this.user.orgUnit.id) < b.unitId.indexOf(_this.user.orgUnit.id) });
        } else { //显示本馆
          this.dataList = this.myUnitWorks;
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
    /**
     * 抽签
     */
    submit_draw() {
      let _this = this;
      if (this.btnTag == '结束') return
      if (this.btnTag == '提交') {  //按文化馆抽签后调整顺序
        let drawResult = {
          unitId: this.$store.getters.user.orgUnit.id,
          worksMap: {}
        }
        let myWorks = this.dataList.filter(item => _this.user.orgUnit.id == item.unitId);

        for (let i = 0; i < myWorks.length; i++) {
          let item = myWorks[i];
          if (item.selOrder.length == 0) {
            _this.$message({
              showClose: true,
              message: '请设置节目《' + item.name + '》的顺序',
              type: 'warning'
            });
            return;
          }
          drawResult.worksMap[item.code] = item.selOrder[0];
        }

        Api.assist.uploadActDraw(this.actId, drawResult).then(() => {
          _this.$message({
            showClose: true,
            message: '设置成功',
            type: 'success'
          });
          _this.unfinsh = false;//抽签是否结束
          _this.btnTag = '结束';
          _this.loadData();
        })

      } else { //抽签
        Api.assist.actdraw(this.actId, this.user.orgUnit.id).then((res) => {
          this.isdrawed = true;
          if (this.drawWithUnit) { //按文化馆抽
            this.btnTag = '提交';
            this.dataList.forEach(function(item, idx) {
              if (res.worksMap[item.code]) {
                item.selOrder = [res.worksMap[item.code]];
                _this.order.push(res.worksMap[item.code]);
              }
            })
            let order2 = this.order.slice(0);
            this.order.sort();
            for (let i = 0; i < order2.length; i++) {
              let ary = [];
              let v = order2[i];
              for (let j = 0; j < this.order.length; j++) {
                ary.push(this.order[j] != v)
              }
              this.selectTable.push(ary);
            }
          } else {  //按作品抽
            this.btnTag = '已结束';
            this.dataList.forEach(function(item, idx) {
              if (res.worksMap[item.code]) {
                item.ord = res.worksMap[item.code];
              }
            })
            this.dataList = JSON.parse(JSON.stringify(this.dataList));//vue  
          }
        })
      }

    },

    /**
     * 按文化馆抽签
     */
    submitDrawUnit() {

    },
    routeback() {
      this.$router.push('activity_draw');
    },
    //格式化活动类型
    formatActType(row, column, cellValue) {
      return this.dicts.getValueByCode('artistClass', cellValue);
    },
    getStart(start) {
      return start ? start : '00:00'
    },
    onStart() {

    },
    /**
     * 按指导文化馆抽签设置作品序号
     */
    ckbChange(me, data, idx) {

      let row = data.$index, col = idx;
      let ischeck = me.target.checked;
      let value = me.target.value;
      if (ischeck) { //选中
        if (data.row.selOrder.length > 1) { //将原来选中的序号放开
          let oldSel = data.row.selOrder[0];
          let idx = this.order.indexOf(oldSel);
          for (let j = 0; j < this.selectTable.length; j++) {
            this.selectTable[j][idx] = false;
          }
        }
        data.row.selOrder = [Number.parseInt(value)];
        for (let j = 0; j < this.selectTable.length; j++) {//同列的不能选
          if (j != row) {
            this.selectTable[j][col] = true;
          }
        }
      } else {
        data.row.selOrder = [];
        for (let j = 0; j < this.selectTable.length; j++) { //取消选中 放开
          if (j != row) {
            this.selectTable[j][col] = false;
          }
        }
      }
      this.selectTable = JSON.parse(JSON.stringify(this.selectTable));
    }
  }
}
</script>

  <style type="text/css" lang="scss" rel="stylesheet/scss">
.el-checkbox__inner {
  border-radius: 10px;
}
</style>
