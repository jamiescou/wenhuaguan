<template>
    <div class="view-wrapper">
        <v-pageheader :breadcrumbs="[{ to:'index',name: '群文学会' },{name:'人员详细信息'}]"></v-pageheader>
        <div style="margin-top:20px;">

            <el-row>
                <el-col :span="12">
                    <v-detailItem label="姓名" :value="viewForm.userInfo.name"></v-detailItem>
                    <v-detailItem label="性别" :value="viewForm.userInfo.sex"></v-detailItem>
                    <v-detailItem label="出生年月" :value="viewForm.userInfo.birthday"></v-detailItem>
                    <v-detailItem label="专业类别" :value="viewForm.professional" type='rich'></v-detailItem>
                    <v-detailItem label="身份证号" :value="viewForm.userInfo.idNumber" type='rich'></v-detailItem>
                    <v-detailItem label="毕业院校" :value="viewForm.school" type='rich'></v-detailItem>
                    <v-detailItem label="党派" :value="viewForm.part" type='rich'></v-detailItem>
                    <v-detailItem label="工作单位" :value="viewForm.workUnit"></v-detailItem>
                    <v-detailItem label="部门" :value="viewForm.depart"></v-detailItem>
                    <v-detailItem label="电话" :value="viewForm.userInfo.mobile"></v-detailItem>
                    <v-detailItem label="QQ" :value="viewForm.qqNumber"></v-detailItem>
                    <v-detailItem label="个人简介与荣誉" :value="viewForm.brief"></v-detailItem>
                    <v-detailItem label="介绍人" :value="viewForm.introducer"></v-detailItem>
                    <v-detailItem label="专委会审批意见" :value="viewForm.suggestion"></v-detailItem>
                </el-col>
                <el-col :span="12">
                  <v-detailItem label="艺名" :value="viewForm.stageName"></v-detailItem>
                  <v-detailItem label="民族" :value="viewForm.nation"></v-detailItem>
                  <v-detailItem label="籍贯" :value="viewForm.birthPlace"></v-detailItem>
                  <v-detailItem label="职称" :value="viewForm.jobTitle"></v-detailItem>
                  <v-detailItem label="文化程度" :value="viewForm.education"></v-detailItem>
                  <v-detailItem label="何时参加工作 " :value="viewForm.workTime"></v-detailItem>
                  <v-detailItem label="在该党职务 " :value="viewForm.partJob"></v-detailItem>
                  <v-detailItem label="单位地址 " :value="viewForm.unitAddress"></v-detailItem>
                  <v-detailItem label="职务 " :value="viewForm.job"></v-detailItem>
                  <v-detailItem label="邮编 " :value="viewForm.code"></v-detailItem>
                  <v-detailItem label="Email " :value="viewForm.userInfo.email"></v-detailItem>
                </el-col>
            </el-row>
            <div class="dialog-footer">
                  <el-button @click="back">关闭</el-button>
              </div>
          </div>
    </div>
</template>
<script>
import Api from '@/api';
export default {
    data() {
        return {
            coverPic: '',
            viewForm: {
              userInfo: {}
            }
        }
    },

    methods: {
        back() {
            this.$router.go(-1);
        },
        getDetail(mid,id) {
          Api.society.getApplyMemberDetail(mid,id).then((res) => {
            if(res){
              res.userInfo.sex = this.formatSex(res.userInfo.sex);
              this.viewForm = res;
            }
          });
        }

    },
    mounted() {
       this.getDetail(this.$route.query.mid, this.$route.query.id);
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">

</style>
