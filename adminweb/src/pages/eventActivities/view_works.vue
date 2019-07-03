<template>
  <div class="edit-wrapper">
    <v-pageheader :breadcrumbs="[{ to:titleInfo.path,name: titleInfo.name },{name:'作品详情'}]"></v-pageheader>
    <div style="margin-top: 20px;">

      <v-detailItem label="征集活动名称" :value="name"></v-detailItem>
      <v-detailItem label="用户名" :value="userInfo.nickname"></v-detailItem>
      <v-detailItem label="联系方式" :value="userInfo.mobile"></v-detailItem>
      <v-detailItem label="作品标题" :value="activityForm.title"></v-detailItem>
      <v-detailItem label="作品描述" :value="activityForm.brief"></v-detailItem>
      <v-detailItem label="作品文件" type="image" :value="activityForm.files" class="cover"></v-detailItem>

      <div class="dialog-footer">
        <el-button @click="back">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/api'
import _status from './document_status'

export default {
  data() {
    return {
      tag: 1,
      id: '',
      mid: '',
      name: '',
      activityForm: {
        title: '',
        name: '',
        onlineStatus: _status.STATUS.WAITCOMMIT,
        desc: '',
        files: '',
        brief: ''
      },
      userInfo: {
        nickname: '',
        mobile: ''
      }
    };
  },
  computed: {
    titleInfo() {
      return _status.PARENT_NAME[this.tag];
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getDetail() {
      this.mid = this.$route.query.did;
      this.id = this.$route.query.id;
      Api.eventActivities.getDocument(this.id).then((res) => {
        this.name = res.name;
      });
      // 详细信息
      Api.eventActivities.worksInfoDetail(this.mid).then((res) => {
        if (res.files && res.files.length) {
          res.files = Api.system.getFileUrl(res.files[0].filePath);
        }
        this.activityForm = res;
        if (res.user) {
          this.userInfo = res.user;
        }
      });
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.dicts.dictInit('activityForm');
    this.getDetail();
  }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
