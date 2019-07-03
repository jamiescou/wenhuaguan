<template>
  <section class="home-wrapper">
    <div class="bg"></div>
    <div class="welcom-header">
      <!--<h4 class="heading">欢迎您进入文化馆数字平台管理系统</h4>-->
      <h6 class="sub-heading">您好，{{user.name}}</h6>
    </div>
    <el-row :gutter="15" class="panel-group">
      <el-col :span="18">
        <el-card class="m-card-box">
          <div slot="header" class="card-heading">
            <span>通知公告</span>
            <router-link to="/notice/index" class="more" v-if="notices.totalElements > noticeSize">更多</router-link>
          </div>
          <div class="card-content" v-if="notices.content && notices.content.length">
            <router-link :to="{path:'/notice/noticeview', query: { id: item.id }}" tag="li" class="item" v-for="item in notices.content" :key="item.id">
              <h5 class="u-title">{{item.title}}</h5>
              <span class="u-dt">{{item.createTime}}</span>
            </router-link>
          </div>
          <v-nodata tipMsg="暂无公告" v-else></v-nodata>
        </el-card>
        <el-card class="m-card-box">
          <div slot="header" class="card-heading">待办事项</div>
          <div class="table-container" v-if="todoList.length">
            <el-table :data="todoList" border stripe v-loading.body="loading" @row-click="handleRowClick">
              <el-table-column prop="codeName" label="版块名称" align="center">
                <template scope="scope">
                  <!-- 活动 -->
                  <router-link :to="{path:'activity/activityaudit'}" class="u-link" v-if="scope.row.code==='0302'">
                    {{scope.row.codeName}}
                  </router-link>
                  <!-- 培训 -->
                  <router-link :to="{path:'trains/trainaudit'}" class="u-link" v-if="scope.row.code==='0402'">
                    {{scope.row.codeName}}
                  </router-link>
                  <!-- 场馆(活动室) -->
                  <router-link :to="{path:'venues/activityroom/verify'}" class="u-link" v-if="scope.row.code==='020202'">
                    {{scope.row.codeName}}
                  </router-link>
                  <!-- 非遗项目 -->
                  <router-link :to="{path:'heritage/directory/verify'}" class="u-link" v-if="scope.row.code==='070102'">
                    {{scope.row.codeName}}
                  </router-link>
                  <!-- 传承人 -->
                  <router-link :to="{path:'heritage/successor/verify'}" class="u-link" v-if="scope.row.code==='070202'">
                    {{scope.row.codeName}}
                  </router-link>
                  <!-- 保护区 -->
                  <router-link :to="{path:'heritage/area/verify'}" class="u-link" v-if="scope.row.code==='071002'">
                    {{scope.row.codeName}}
                  </router-link>
                  <!-- 征集活动 -->
                  <router-link :to="{path:'document/documentaudit'}" class="u-link" v-if="scope.row.code==='1202'">
                    {{scope.row.codeName}}
                  </router-link>
                  <!--会员认证 -->
                  <router-link :to="{path:'user/realmanager'}" class="u-link" v-if="scope.row.code==='0502'">
                    {{scope.row.codeName}}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column prop="num" label="待办事项数量" align="center"></el-table-column>
              <el-table-column prop="newTime" label="事项更新时间" align="center"></el-table-column>
            </el-table>
          </div>
          <v-nodata tipMsg="暂无待办事项" v-else></v-nodata>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="m-card-box">
          <div slot="header" class="card-heading"> </div>
          <v-weather></v-weather>
        </el-card>
        <el-card class="m-card-box">
          <div slot="header" class="card-heading"> </div>
          <v-canlendar></v-canlendar>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import Api from '@/api';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  data() {
    return {
      notices: {},
      todoList: [],
      noticeSize: 5
    }
  },
  methods: {
    getDatas() {

      this.loading = true;
      // 通知 TODO: 在周期时间内的通知  'persons.hasRead:false,' +
      let noticeSearch = 'targets.unitId:' + this.user.orgUnit.id + ',&sort=createTime~desc';
      let notices = Api.notice.getNoticeList(noticeSearch, 1, this.noticeSize).then((res) => {
        this.notices = res;
      });
      // 待办事项
      Api.notice.getGtask(this.user.username).then((res) => {
        this.todoList = res;
        this.loading = false;
      });
    },
    handleRowClick(row, event, column) {
      this.$router.push(row.path);
    }
  },
  mounted() {
    this.getDatas();
  }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "src/styles/_variables.scss";
.welcom-header {
  display: block;
  width: 100%;
  z-index: 10;
  position: relative;
  padding-bottom: 10px;
  letter-spacing: 3px;
  .heading,
  .sub-heading {
    margin: 0;
  }
  .heading {
    font-size: 18px;
    font-weight: 400;
    line-height: 30px;
  }
  .sub-heading {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-indent: 20px;
  }
}

.panel-group {
  .m-card-box {
    border-color: #e6e6e6;
    margin-top: 15px;
    opacity: 0.7;
    min-height: 300px;

    .el-card__header {
      padding: 0;
      border: 0;
    }
  }
}
.card-heading {
  $card-h: 50px !default;
  height: $card-h;
  padding: 0 20px;
  line-height: $card-h;
  background: #eee;
  font-weight: 700;
  &:before,
  &:after {
    display: table;
    content: "";
  }
  &:after {
    clear: both;
  }
  .mark {
    margin-top: -4px;
    margin-left: -4px;
  }
  .more {
    line-height: $card-h;
    float: right;
    color: #20a0ff;
    font-size: 12px;
    border: none;
    &:hover,
    &:focus {
      color: #4db3ff;
      text-decoration: underline;
    }
  }
}

.card-content {
  ul {
    list-style: none;
  }
  .item {
    position: relative;
    display: flex;
    padding: 15px 0px;
    cursor: pointer;
    color: #525252;
    font-size: 14px;
    &:after {
      display: block;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px dashed #ddd;
      content: " ";
    }
    .u-title {
      flex: 1;
      padding-right: 20px;
      padding-left: 10px;
      margin: 0;
      font-size: 14px;
      font-weight: 400;
      overflow: hidden;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .u-dt {
      flex: 0 0 140px;
      width: 140px;
      text-align: right;
    }
  }
}
</style>
