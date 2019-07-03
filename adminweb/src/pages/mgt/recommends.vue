<template>
  <div class="tag-wrapper">
    <v-pageheader :breadcrumbs="[{ name: '推荐板块管理' }]"></v-pageheader>
    <div class="main-body">
      <div class="center-content table-container">
        <div class="opts">
          <el-button type="primary" size="small" @click="handleAdd({code})" icon="edit">添加</el-button>
        </div>
        <h5 class="tag_title" style="margin: 0;height: 40px;line-height: 40px;background: #eef1f6;padding-left: 15px;">推荐板块内容</h5>
        <el-table :data="recommends" border stripe v-loading.body="loading" tooltip-effect="custom-effect" key="index">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column prop="title" label="标题" align="center"></el-table-column>
          <el-table-column label="内容" align="center" v-if="ifInfo">
            <template scope="scope">
              <div class='ellipsis' :title="scope.row.content"  >{{scope.row.brief}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" align="center" width="100px">
            <template scope="scope">
              <a class="btn-act" @click="delRecommends(scope)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="tag_list">
      <h5 class="tag_title">推荐板块配置</h5>
      <v-scrollbar class="scroll-wrapper" :settings="{useSelectionScroll: true}">
        <ul>
          <li v-for="(item,index) in dataList" class="tag-item" :class="{'current':currentIndex===index}" :key="item.id" @click="selectTag(index,item)">{{item.name}}</li>
        </ul>
      </v-scrollbar>
    </div>
    <el-dialog :title="title" v-model="dialogVisible" key="1" :close-on-click-modal='false' @close="resetForm('dictForm')">
      <div v-if="dialogVisible">
        <section class="search-wrapper">
          <el-form :inline="true" :model="searchForm" label-width="0px">
            <el-form-item>
              <el-input v-model="searchForm.name" placeholder="请输入标题"></el-input>
            </el-form-item>
             <!-- <el-select v-model="searchForm.ColumnNames" placeholder="请选择栏目" v-if="ifInfo" clearable>
              <el-option v-for="item in optionsList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select> -->
            <el-form-item>
              <el-button type="primary" @click="loadData">查询</el-button>
            </el-form-item>
          </el-form>
        </section>
        <el-table :data="infodataList" border stripe tooltip-effect="custom-effect" @selection-change="selectchange">
          <el-table-column type="selection" width="55" :selectable='colSelectable'> </el-table-column>
          <el-table-column label="标题">
            <template scope="scope">
              {{scope.row.title}}
            </template>
          </el-table-column>
          <el-table-column prop="publishTime" label="发布时间"></el-table-column>
          <el-table-column prop="brief" label="简介">
            <template scope="scope">
              <div class='ellipsis' v-html="scope.row.brief"></div>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="作者"></el-table-column>
        </el-table>
          <div class="pagination-container ">
                <v-pagination @pageChange="onCurrentChange" :total="total" :size="10" :isShow="showPagination"></v-pagination>
            </div>
        <div class="dialog-footer">
          <el-button type="primary" @click="selectchangesubmit">提交</el-button>
          <el-button @click="resetForm('dictForm')">取消</el-button>
          <!-- <el-button @click="resetForm('dictForm')">重置</el-button> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from "@/api";
import BaseTable from '@/mixins/base-table';
import vRules from "@/config/validate_rules";
import perfectScrollbar from "@/components/scrollbar/perfect-scrollbar";
import _valid from "@/config/validate_rules";
export default {
   mixins: [BaseTable],
  components: {
    "v-scrollbar": perfectScrollbar
  },
  data() {
    return {
      searchForm: {
        name: "",
        ColumnNames: ""
      },
      optionsList: [],
      loading: false,
      dialogVisible: false,
      title: "",
      flag: "",
      ifInfo: false,
      dataList: [],
      infodataList: [],
      codetype: "",
      code: "",
      coverPic: "",
      currentIndex: -1,
      currentTag: [],
      recommends: [],
      selectids: [],
      size:10,
      rules: {
        title: [vRules.required, vRules.maxLen(40)],
        seqno: [vRules.required],
        coverPic: [vRules.required_Msg("没有选择封面图片或图片上传中")]
      }
    };
  },
  computed: {

  },
  methods: {
    getColumns() {
      Api.information.getColumns('&sort=seqno~asc', 1, -1).then((res) => {
        this.optionsList = res.content;

      });
    },
    convertcontent(row, index, cellvalue) {
      let dd = cellvalue.replace(/<\/?.+?>/g, "");
      let dds = dd.replace(/ /g, "");//dds为得到后的内容
      return '<div class="ellipsis"  >' + dds + '</div>';
    },
    selectchange(selection) {
      let ids = [];
      selection.forEach(element => {
        ids.push(element.id);
      });
      this.selectids = ids;
    },
    selectchangesubmit() {
      let unionSet = [];
      if (this.currentTag.ids != null) {
        unionSet = Array.from(new Set([...this.selectids, ...this.currentTag.ids]));
      } else {
        unionSet = Array.from(new Set([...this.selectids]));
      }
      if (unionSet.length <= this.currentTag.max) {

        this.currentTag.ids = unionSet;

        Api.recommends.modifyRecommendByCode(this.currentTag.code, this.currentTag);
        this.findInfoByType(this.currentTag.ids);
        this.dialogVisible = false;
      } else {
        this.showTip("推荐条数大于最大推荐数");
      }
    },
    delRecommends(scopow) {
      let self = this;
      self.delConfirm("推荐", () => {
        let resultids = this.currentTag.ids.filter(x => x != scopow.row.id);
        this.currentTag.ids = resultids;
        Api.recommends.modifyRecommendByCode(this.currentTag.code, this.currentTag).then(res => {
          this.findInfoByType(this.currentTag.ids);
        });
      });

    },
    showLoading() {
      this.loading = true;
    },
    closeLoading() {
      this.loading = false;
    },
    loadBandData() {
      this.showLoading();
      Api.recommends.getRecommendsList().then(res => {
           this.dataList = res.content;
          if (res.content && res.content.length) {
            // this.currentTag = res.content[0];
            this.selectTag(0, res.content[0]);
          }
        })
        .finally(this.closeLoading);
    },
    loadData() {
      let user = this.$store.getters.user;
      let search = 'searchUnitId';
      switch (this.codetype) {
        case "CulturalHeadlines":
          if (this.searchForm.name) search += ',title~' + this.searchForm.name;
          if (this.searchForm.ColumnNames) search += ',column.id:' + this.searchForm.ColumnNames;
          search += ",isPublish:true&sort=publishTime~desc";
          Api.information.getInformations(search,  this.page, this.size).then(res => {
            this.rescallback(res);
          });
          break;
        case "CityDynamic":
          if (this.searchForm.name) search += ',title~' + this.searchForm.name;
          if (this.searchForm.ColumnNames) search += ',column.id:' + this.searchForm.ColumnNames;
          search += ",isPublish:true&sort=publishTime~desc";
          Api.information.getInformations(search, this.page, this.size).then(res => {
            this.rescallback(res);
          });
          break;
        case "PublicStage":
          if (this.searchForm.name) search += ',name~' + this.searchForm.name;
          if (this.searchForm.ColumnNames) search += ',column.id:' + this.searchForm.ColumnNames;
          search += ",isPublish:true&sort=createTime~desc";
          Api.vod.getDemandList(search,  this.page, this.size).then(res => {
            this.rescallback(res);
          });
          break;
        case "OnlineExhibition":
        if (this.searchForm.name) search += ',name~' + this.searchForm.name;
        if (this.searchForm.ColumnNames) search += ',column.id:' + this.searchForm.ColumnNames;
        search += ",isPublish:true&sort=createTime~desc";
        Api.digital.getDigitalList(search,  this.page, this.size).then(res => {
          this.rescallback(res);
        });
        break;
        case "Notice":
          if (this.searchForm.name) search += ',title~' + this.searchForm.name;
          if (this.searchForm.ColumnNames) search += ',column.id:' + this.searchForm.ColumnNames;
          search += "&sort=publishTime~desc";

          Api.information.getInformations(search, this.page, this.size).then(res => {
            this.rescallback(res);
          });
          break;
        case "Activity":
          console.log("Activity------")
          if (this.searchForm.name) search += ',name~' + this.searchForm.name;
          if (this.searchForm.ColumnNames) search += ',column.id:' + this.searchForm.ColumnNames;
          search += ",onlineStatus:Published&sort=createTime~desc";
          console.log(search)
          Api.activity.getActivityList("search="+search,  this.page, this.size).then(res => {

            this.rescallback(res);
        });
          break;
        case "Train":
          console.log("Train------")
          if (this.searchForm.name) search += ',title~' + this.searchForm.name;
          if (this.searchForm.ColumnNames) search += ',column.id:' + this.searchForm.ColumnNames;
          search += ",onlineStatus:Published&sort=createTime~desc";
          console.log(search)
          Api.train.getTrainList(search,  this.page, this.size).then(res => {
            this.rescallback(res);
        });
          break;
        case "Venue":
          console.log("Venue------",this.searchForm.ColumnNames)
          if (this.searchForm.name) search += ',name~' + this.searchForm.name;
          if (this.searchForm.ColumnNames) search += ',column.id:' + this.searchForm.ColumnNames;
          search += ",isPublish:true&sort=createTime~desc";
          console.log(search)
          Api.venue.getVenueList(search,  this.page, this.size).then(res => {
            this.rescallback(res);
        });
          break;
        case "CultureSupply":
          console.log("CultureSupply------")
          if (this.searchForm.name) search += ',title~' + this.searchForm.name;
          if (this.searchForm.ColumnNames) search += ',column.id:' + this.searchForm.ColumnNames;
          search += ",isPublish:true&sort=createTime~desc";
          Api.supply.getSupplyList(search,  this.page, this.size).then(res => {
            this.rescallback(res);
        });
          break;
        default:
          break;
      }
    },
    rescallback(res) {

      res.content.forEach(element => {
        if (element.name) element.title = element.name;
        if (element.createTime) element.publishTime = element.createTime;
        if (element.streamName) element.author = element.streamName;
        if(!element.brief) element.brief = element.notice;
      });
      let result = [];
      // if (this.currentTag.ids) {
      //   result = res.content.filter(x => !this.currentTag.ids.includes(x.id));
      // } else {
        result = res.content;
      // }
      this.infodataList = result;
      this.total = res.totalElements;
    },

    colSelectable(row){
      if(this.currentTag.ids.includes(row.id)){
        return false
      }else {
        return true;
      }

    },
    // 添加
    handleAdd(id, type) {
      this.title = "添加";
      this.dictForm = {
        title: "",
        coverPic: "",
        url: "",
        seqno: "",
        enable: true
      };

      this.dialogVisible = true;

      this.$nextTick(() => {
        this.searchForm.name = "";
        this.searchForm.ColumnNames = "";
        // this.getColumns();
        this.loadData(type);

      });
    },
    /**
     *  选择触发
     */
    selectTag(index, item) {
      this.currentIndex = index;
      this.code = item.id;
      this.codetype = item.code;
      this.currentTag = item;
      // this.findInfoByType(item.ids);
      this.showLoading();
      Api.recommends.getRecommendsListByCode(this.codetype).then(res => {
        this.currentTag = res;
        this.findInfoByType(res.ids);
      }).finally(this.closeLoading);
    },
    findInfoByType(ids) {
      let self = this;
      this.recommends = [];
      if (ids) {
        switch (this.codetype) {
          case "CulturalHeadlines":
            this.ifInfo = true;
            ids.forEach(element => {
              Api.information.getInformation(element).then(res => {
                this.recommends.push(res);
              });
            });
            break;
          case "CityDynamic":
            this.ifInfo = true;
            ids.forEach(element => {
              Api.information.getInformation(element).then(res => {
                this.recommends.push(res);
              });
            });
            break;
          case "Notice":
            this.ifInfo = true;
            ids.forEach(element => {
              Api.information.getInformation(element).then(res => {
                this.recommends.push(res);
              });
            });
            break;
          case "PublicStage":
            this.ifInfo = false;
            ids.forEach(element => {
              Api.vod.getDemand(element).then(res => {
                if (res.name) res.title = res.name;
                if (res.createTime) res.publishTime = res.createTime;
                if (res.streamName) res.author = res.streamName;
                this.recommends.push(res);
              });
            });
            break;
          case "OnlineExhibition":
            this.ifInfo = false;
            ids.forEach(element => {
              Api.digital.getDigital(element).then(res => {
                this.recommends.push(res);
              });
            });
            break;
          case "Activity":
            this.ifInfo = true;
            ids.forEach(element => {
              Api.activity.getActivity(element).then(res => {
                if(!res) return;
                res.title=res.name;
                this.recommends.push(res);
              });
            });
            break;
          case "Train":
            this.ifInfo = true;
            ids.forEach(element => {
              Api.train.getTrain(element).then(res => {
                /*if(!res) return;
                res.title=res.name;*/
                this.recommends.push(res);
              });
            });
            break;
          case "Venue":
            this.ifInfo = true;
            ids.forEach(element => {
              Api.venue.getVenue(element).then(res => {
                if(!res) return;
                res.title=res.name;
                //scope.row.brief
                this.recommends.push(res);
              });
            });
            break;
          case "CultureSupply":
            console.log("CultureSupply-----2")
            this.ifInfo = false;
            ids.forEach(element => {
              Api.supply.getSupply(element).then(res => {
                res.author = res.notice;
                console.log(res)
                this.recommends.push(res);
              });
            });
            break;
          default:
            break;
        }
      }
    },
    // 重置表单
    resetForm(FormName) {
      this.dialogVisible = false;
      this.page=1;

    },



  },
  mounted() {
    this.getColumns();
    this.loadBandData();
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "../../styles/mixin.scss";
.tag-wrapper {
  position: relative;
  @include clearfix;
  .main-body {
    width: 100%;
    float: left;
    .center-content {
      margin: 0 0 0 210px;
      .opts {
        margin: 10px 0;
      }
    }
  }
  .cover {
    width: 300px;
    height: 200px;
  }
  .tag_list {
    width: 200px;
    float: left;
    padding-bottom: 30px;
    margin-left: -100%;
    background-color: #eaedf1;
    .tag_title {
      margin: 0;
      line-height: 40px;
      background: darken(#eaedf1, 5%);
      padding-left: 15px;
      border-left: 5px solid;
    }
    .scroll-wrapper {
      position: relative;
      max-height: 700px;
      overflow: auto;
    }
    ul,
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .tag-item {
      display: table;
      width: 100%;
      height: 42px;
      font-size: 14px;
      line-height: 42px;
      color: #333;
      text-align: center;
      cursor: pointer;
      &.current {
        background-color: #fff;
      }
    }
  }
}
.ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 20px;
}
</style>
